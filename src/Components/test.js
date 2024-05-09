import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import { auth, db } from './Config/Config';
import { collection, doc, getDoc } from 'firebase/firestore'; // Import the necessary Firestore functions

function Cart() {
  const [cartProducts, setCartProducts] = useState([]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          // Reference to the user's cart document
          const cartRef = doc(db, 'Cart_3qSszMhHujg6wITEwC4DU55WZs52', '0XZnhoR06I5rS1vg0dML');

          // Get the cart document
          const cartDoc = await getDoc(cartRef);

          if (cartDoc.exists()) {
            const cartData = cartDoc.data();
            // Assuming the 'products' field in the cart document is an array
            const products = cartData.products || [];
            setCartProducts(products);
          } else {
            console.log('Cart document does not exist.');
          }
        } catch (error) {
          console.error('Error fetching cart products:', error);
        }
      } else {
        console.log('User is not signed in to retrieve the cart.');
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      <Navbar />
      <br></br>
      {cartProducts.length > 0 && (
        <div className='container-fluid'>
          <h1 className='text-center'>Cart</h1>
          <div className='product-box'>
            {cartProducts.map((product) => (
              // Display each product in your CartProducts component
              <div key={product.ID}>
                <p>Product ID: {product.ID}</p>
                <p>Title: {product.title}</p>
                <p>Description: {product.description}</p>
                <p>Price: {product.price}</p>
                <p>Quantity: {product.qty}</p>
                <p>Total Product Price: {product.TotalProductPrice}</p>
                <img src={product.imageUrl} alt={product.title} />
              </div>
            ))}
          </div>
        </div>
      )}
      {cartProducts.length < 1 && (
        <div className='container-fluid'>
          <h1 className='text-center'>Cart</h1>
          <span>No products in the cart</span>
        </div>
      )}
    </>
  );
}

export default Cart;
