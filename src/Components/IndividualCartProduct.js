import React from 'react';
import { Icon } from 'react-icons-kit';
import { plus } from 'react-icons-kit/feather/plus';
import { minus } from 'react-icons-kit/feather/minus';
import {auth, db} from './Config/Config';
import { deleteDoc, doc } from 'firebase/firestore';

function IndividualCartProduct({ cartProduct, cartProductIncrease, cartProductDecrease, cartProductDelete }) {

  const handleCartProductIncrease=()=>{
    cartProductIncrease(cartProduct);
}

const handleCartProductDecrease=()=>{
    cartProductDecrease(cartProduct);
}

const handleCartProductDelete=()=>{
  cartProductDelete(cartProduct);
}

  return (
    <div className='product'>
        <div className='product-img'>
            <img src={cartProduct.imageUrl} alt="product-img"/>
        </div>
        <div className='product-text title'>{cartProduct.title}</div>
        <div className='product-text description'>{cartProduct.description}</div>
        <div className='product-text price'>$ {cartProduct.price}</div>
        <span>Quantity</span>
        <div className='product-text quantity-box'>
            <div className='action-btns minus' onClick={handleCartProductDecrease} >
                <Icon icon={minus} size={20}/>
            </div>                
            <div>{cartProduct.qty}</div>               
            <div className='action-btns plus' onClick={handleCartProductIncrease}>
              <Icon icon={plus} size={20} />
            </div>

        </div>
        <div className='product-text cart-price'>$ {cartProduct.TotalProductPrice}</div>
        <div className='btn btn-danger btn-md cart-btn' onClick={handleCartProductDelete}>DELETE</div>            
    </div>
)
}

export default IndividualCartProduct;
