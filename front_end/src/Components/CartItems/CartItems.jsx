import React, { useContext } from 'react';
import './CartItems.css';
import { ShopContext } from '../../Context/ShopContext';
import remove_icon from '../Assets/cart_cross_icon.png';

export const CartItems = () => {
  const { getTotalCartAmount, all_product, cartItems, removeFromCart } = useContext(ShopContext);

  const renderedCartItems = all_product
    .filter((product) => cartItems[product.id] > 0)
    .map((product) => (
      <div key={product.id}>
        <div className="cartiems-format cartitems-format-main">
          <img src={product.image} alt="" className="carticon-product-icon" />
          <p>{product.name}</p>
          <p>₹{product.new_price}</p>
          <button className="cartitems-quantity">{cartItems[product.id]}</button>
          <p>₹{(product.new_price * cartItems[product.id]).toFixed(2)}</p>
          <img
            className="carticons-remove-icon"
            src={remove_icon}
            onClick={() => removeFromCart(product.id)}
            alt=""
          />
        </div>
        <hr />
      </div>
    ));

  return (
    <div className="cartitems">
      <div className="cartitems-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Price</p>
        <p>Quantity</p>
        <p>Total</p>
        <p>Remove</p>
      </div>
      <hr />
      {renderedCartItems.length > 0 ? (
        renderedCartItems
      ) : (
        <p className="cartitems-empty-message">Your cart is currently empty.</p>
      )}
      <div className="cartitems-down">
        <div className="cartitems-total">
          <h1>Cart Totals</h1>
          <div>
            <div className="cartitems-total-item">
              <p>Subtotal</p>
              <p>₹{getTotalCartAmount().toFixed(2)}</p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <p>Shipping Fee</p>
              <p>Free</p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <h3>Total</h3>
              <h3>₹{getTotalCartAmount().toFixed(2)}</h3>
            </div>
          </div>
          <button>Proceed to Checkout</button>
        </div>
        <div className="cartitems-promocard">
          <p>If you have a promo code, enter it here.</p>
          <div className="cartitems-promobox">
            <input type="text" placeholder="Promo code" />
            <button>Submit</button>
          </div>
        </div>
      </div>
    </div>
  );
};
