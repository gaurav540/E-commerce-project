import React, { useContext, useRef, useState } from 'react'
import './Navbar.css'
import logo from '../Assets/shopper (1).png'
import { Link } from "react-router-dom";
import cart_icon from '../Assets/cart_icon.png'
import { ShopContext } from '../../Context/ShopContext';
import dropdown_icon from '../Assets/chevron.png'
export const Navbar = () => {
  const [menu,setmenu]=useState("shop");
  const {getTotalCartItem} =useContext(ShopContext);
  const menuRef = useRef();
  const dropdown_toggle =(e)=>{
    menuRef.current.classList.toggle('nav-menu-visible')
    e.target.classList.toggle('open')
  }
  return (
    <div className='navbar'>
        <div className='nav_logo'>
            <img src={logo} alt="Shopper logo" />
            <p>SHOPPER</p>
        </div>
        <img className='nav-dropdown' onClick={dropdown_toggle} src={dropdown_icon} alt="" />
        <ul  ref={menuRef} className="nav-menu"> 
          {/* ul.nav-menu */}
            <li onClick={()=>{setmenu("shop")}}><Link style={{textDecoration:'none'}} to='/'>Shop</Link>{menu==="shop"?<hr />:<></>}</li>
            <li onClick={()=>{setmenu("men")}}><Link style={{textDecoration:'none'}} to="/mens">Men</Link>{menu==="men"?<hr />:<></>}</li>
            <li onClick={()=>{setmenu("women")}}><Link style={{textDecoration:'none'}} to="/womens">Women</Link>{menu==="women"?<hr />:<></>}</li>
            <li onClick={()=>{setmenu("kids")}}><Link style={{textDecoration:"none"}} to="/kids">Kids</Link>{menu==="kids"?<hr />:<></>}</li>
        </ul>
        <div className="nav-login-cart">
          {
            localStorage.getItem('auth-token')?<button onClick={()=>{localStorage.removeItem('auth-token');window.location.replace('/')}}>Logout</button>
          :<Link to="/login"><button>Login</button></Link>
          }
          <Link to="/cart"><img src={cart_icon} alt="Cart logo" /></Link>
          <div className="nav-cart-count">{getTotalCartItem()}</div>
        </div>
    </div>
  )
}
