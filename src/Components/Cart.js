import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import { auth, db } from './Config/Config';
import { collection, getDocs, doc, getDoc, deleteDoc, updateDoc,onSnapshot } from 'firebase/firestore';
import CartProducts from './CartProducts';
import { useNavigate } from 'react-router-dom';
import StripeCheckout from 'react-stripe-checkout';

function Cart() {
  function GetCurrentUser() {
    const [user, setUser] = useState(null);
    useEffect(() => {
      auth.onAuthStateChanged(user => {
        if (user) {
          getDoc(doc(db, 'users', user.uid)).then(snapshot => {
            setUser(snapshot.data().FullName);
          });
        } else {
          setUser(null);
        }
      });
    }, []);
    return user;
  }

  const user = GetCurrentUser();
  const [cartProducts, setCartProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    auth.onAuthStateChanged(user => {
      if (user) {
        getDocs(collection(db, 'Cart_' + user.uid)).then(snapshot => {
          const newCartProduct = snapshot.docs.map(doc => ({
            ID: doc.id,
            ...doc.data(),
          }));
          setCartProducts(newCartProduct);
        });
      } else {
        console.log('User is not signed in to retrieve cart');
      }
    });
  }, []);

  // console.log(cartProducts);

  //getting the qty from cartProducts in a separate array
  const qty=cartProducts.map(cartProduct=>{
    return cartProduct.qty;
  })
 //reducing the qty in a single value
  const reducerOfQty = (accumulator, currentValue) => accumulator + currentValue;
  const totalQty = qty.reduce(reducerOfQty, 0);
  console.log(totalQty);

  //getting the TotalProductPrice from cartProducts in a separate array
  const price = cartProducts.map(cartProduct=>{
    return cartProduct.TotalProductPrice;
  })
  const reducerOfPrice = (accumulator, currentValue) => accumulator + currentValue;
  const totalPrice = price.reduce(reducerOfPrice, 0);



  // cart product increase function
  const cartProductIncrease = (cartProduct) => {
    // Clone the cartProduct to avoid modifying the original object directly
    const updatedProduct = { ...cartProduct };
    updatedProduct.qty = updatedProduct.qty + 1;
    updatedProduct.TotalProductPrice = updatedProduct.qty * updatedProduct.price;
  
    auth.onAuthStateChanged((user) => {
      if (user) {
        // Reference to the Firestore document
        const cartDocRef = doc(db, 'Cart_' + user.uid, cartProduct.ID);
  
        // Update the Firestore document with the updated product
        updateDoc(cartDocRef, updatedProduct)
          .then(() => {
            console.log('Increment added');
  
            // Update the local state with the updated product
            setCartProducts((prevCartProducts) =>
              prevCartProducts.map((product) =>
                product.ID === cartProduct.ID ? updatedProduct : product
              )
            );
          })
          .catch((error) => {
            console.error('Error updating document: ', error);
          });
      } else {
        console.log('User is not logged in to increment');
      }
    });
  };
  
// cart product decrease functionality
const cartProductDecrease = (cartProduct) => {
  // Clone the cartProduct to avoid modifying the original object directly
  const updatedProduct = { ...cartProduct };

  if (updatedProduct.qty > 1) {
    updatedProduct.qty = updatedProduct.qty - 1;
    updatedProduct.TotalProductPrice = updatedProduct.qty * updatedProduct.price;

    auth.onAuthStateChanged((user) => {
      if (user) {
        // Reference to the Firestore document
        const cartDocRef = doc(db, 'Cart_' + user.uid, cartProduct.ID);

        // Update the Firestore document with the updated product
        updateDoc(cartDocRef, updatedProduct)
          .then(() => {
            console.log('Decrement added');
            
            // Update the local state with the decreased quantity
            setCartProducts((prevProducts) =>
              prevProducts.map((product) => {
                if (product.ID === cartProduct.ID) {
                  return updatedProduct;
                }
                return product;
              })
            );
          })
          .catch((error) => {
            console.error('Error updating document: ', error);
          });
      } else {
        console.log('User is not logged in to decrement');
      }
    });
  }
};



const cartProductDelete = (cartProduct) => {
  auth.onAuthStateChanged((user) => {
    if (user) {
      const cartDocRef = doc(db, 'Cart_' + user.uid, cartProduct.ID);
      deleteDoc(cartDocRef)
        .then(() => {
          console.log('Successfully deleted from Firestore');
          // Remove the deleted item from the local state
          setCartProducts((prevProducts) =>
            prevProducts.filter((product) => product.ID !== cartProduct.ID)
          );
          
        })
        .catch((error) => {
          console.error('Error deleting document: ', error);
        });
    }
  });
};

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

  return (
    <>
      <Navbar user={user} totalProducts={totalProducts} />
      <br />
      {cartProducts.length > 0 && (
        <div className='container-fluid'>
          <h1 className='text-center'>Cart</h1>
          <div className='products-box'>
          <CartProducts
            cartProducts={cartProducts}
            cartProductIncrease={cartProductIncrease}
            cartProductDecrease={cartProductDecrease}
            cartProductDelete={cartProductDelete}
          />
        </div>
        <div className='summary-box'>
          <h5>Cart Summary</h5>
          <br></br>
          <div>
          Total No of Products: <span>{totalQty}</span>
          </div>
          <div>
            Total Price to Pay: <span>$ {totalPrice}</span> 
          </div>
          <br></br>
          <StripeCheckout
          
          ></StripeCheckout>
        </div>
        </div>
      )}
      {cartProducts.length < 1 && (
        <div className='container-fluid'>No products to show</div>
      )}
    </>
  );
}

export default Cart;
