import React from 'react';
import IndividualCartProduct from './IndividualCartProduct';

function CartProducts({ cartProducts, cartProductIncrease,
  cartProductDecrease, cartProductDelete }) {
  return cartProducts.map((cartProduct)=>(
    <IndividualCartProduct
      key={cartProduct.ID}
      cartProduct={cartProduct}
      cartProductIncrease={cartProductIncrease}
      cartProductDecrease={cartProductDecrease}
      cartProductDelete={cartProductDelete}
    />

))
}

export default CartProducts;
