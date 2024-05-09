import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Products from './Products';
import { auth, db } from './Config/Config';
import { collection, doc, setDoc, getDoc, getDocs, onSnapshot } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  // Getting current user uid
  const GetUserUid = () => {
    const [uid, setUid] = useState(null);
    useEffect(() => {
      auth.onAuthStateChanged(user => {
        if (user) {
          setUid(user.uid);
          console.log("Home page user uid=", user.uid)
        }
      });
    }, []);
    return uid;
  };

  const uid = GetUserUid();

  // Getting current user's full name
  function GetCurrentUser() {
    const [user, setUser] = useState(null);
    useEffect(() => {
      auth.onAuthStateChanged(user => {
        if (user) {
          const userRef = doc(collection(db, 'users'), user.uid);
          getDoc(userRef)
            .then(docSnap => {
              if (docSnap.exists()) {
                setUser(docSnap.data().fullName);
              } else {
                setUser(null);
              }
            })
            .catch(error => {
              console.error('Error fetching user data:', error);
              setUser(null);
            });
        } else {
          setUser(null);
          // Redirect to the home page when the user is not signed in
          navigate('/');
        }
      });
    }, [navigate]);
    return user;
  }

  const userFullName = GetCurrentUser();
  // console.log("user Full Name = ",userFullName);
  const [products, setProducts] = useState([]);

  // Getting products function
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsSnapshot = await getDocs(collection(db, 'Products'));
        const productsArray = [];

        productsSnapshot.forEach(doc => {
          const data = doc.data();
          const ID = doc.id;
          productsArray.push({ ...data, ID });
        });

        setProducts(productsArray);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  //state of TotalProducts
  const [totalProducts, setTotalProducts] = useState(0);
  useEffect(() => {
    auth.onAuthStateChanged(user => {
      if (user) {
        onSnapshot(collection(db, 'Cart_' + user.uid), snapshot => {
          const qty = snapshot.size;
          setTotalProducts(qty);
        });
      }
    });
  }, []);

  // Adding a product to the cart
  const addToCart = (product) => {
    if (!uid) {
      navigate('/login'); // Redirect to the login page if the user is not logged in
      return;
    }
  
    product.qty = 1;
    product.TotalProductPrice = product.qty * product.price;
  
    // Use db to access Firestore collections
    const cartCollectionRef = collection(db, 'Cart_' + uid);
    const productDocRef = doc(cartCollectionRef, product.ID);
  
    setDoc(productDocRef, product)
      .then(() => {
      
        console.log('Successfully added to cart');
        window.alert('Product added to the cart successfully');
      })
      .catch((error) => {
        console.error('Error adding to cart:', error);
      });
  };

  return (
    <>
      <Navbar user={userFullName}  totalProducts={totalProducts}/>
      <br></br>
      {userFullName ? (
        <>
          {products.length > 0 && (
            <div className='container-fluid'>
              <h1 className='text-center'>Products</h1>
              <div className='products-box'>
                <Products products={products} addToCart={addToCart} />
              </div>
            </div>
          )}
          {products.length < 1 && <div className='container-fluid'>Please wait.....</div>}
        </>
      ) : (null) }
    </>
  );
};

export default Home;
