import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './Components/Home'; // Import the default export
import Signup from './Components/Signup';
import Login from './Components/Login';
import NotFound from './Components/NotFound';
import AddProducts from './Components/AddProducts';
import Cart from './Components/Cart'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/addproducts" element={<AddProducts/>}/>
        <Route path="/cart" element={<Cart/>}/>
        <Route path="/notfound" element={<NotFound/>}/>
      </Routes>
    </BrowserRouter>
  );
}

