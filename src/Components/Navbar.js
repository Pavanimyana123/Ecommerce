import React, { useState, useEffect } from 'react';
import logo from '../images/logo.png';
import { Link } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth'; // Import functions from 'firebase/auth'
import { auth } from './Config/Config';
import Icon from 'react-icons-kit';
import { shoppingCart } from 'react-icons-kit/feather/shoppingCart';

 import { useNavigate } from 'react-router-dom';


function Navbar({  totalProducts }) {
  const navigate = useNavigate(); 
  const [user, setUser] = useState(null);
  const [cartProducts, setCartProducts] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        // console.log("user details = ", authUser); 
        setUser(authUser);
      } else {
        setUser(null);
      }
    });
  
    return () => {
      unsubscribe();
    };
  }, []);
  
  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        setUser(null);
        setCartProducts([]); // Clear the cart immediately when the user signs out
      })
      .catch((error) => {
        console.error(error);
      });
  };
  
  return (
    <div className='navbar'>
      <div className='leftside'>
        <div className='logo'>
        <Link to="/" onClick={() => navigate('/')}>
            <img src={logo} alt="logo" />
          </Link>

        </div>
      </div>
      <div className='rightside'>
        {!user && (
          <>
            <div><Link className='navlink' to="Signup">SIGN UP</Link></div>
            <div><Link className='navlink' to="Login">LOGIN</Link></div>
          </>
        )}
        {user && (
          <>
            <div><span className='navlink'>{user.displayName}</span></div> {/* Use displayName instead of fullName */}
            <div className='cart-menu-btn'>
              <Link className='navlink' to="cart">
                <Icon icon={shoppingCart} size={20} />
              </Link>
              <span className='cart-indicator'>{totalProducts}</span>
            </div>
            <div className='btn btn-danger btn-md' onClick={handleSignOut}>SIGN OUT</div>
          </>
        )}
      </div>
    </div>
  );
}

export default Navbar;
