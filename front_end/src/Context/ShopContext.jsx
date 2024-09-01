import React, { createContext, useEffect, useState} from "react";

export const ShopContext = createContext(null);

const getDefaultCart = (productCount) => {
    let cart = {};
    for (let index = 0; index < productCount; index++) {
        cart[index] = 0;
    }
    return cart;
}


const ShopContextProvider = (props) => {
    const [all_product,setAll_Product] = useState([]);
    const [cartItems, setCartItems] = useState(() => getDefaultCart(all_product.length));
    useEffect(() => {
        fetch('http://localhost:4000/allproducts')
          .then((response) => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then((data) => setAll_Product(data))
          .catch((error) => console.error('There was a problem with the fetch operation:', error));
          if(localStorage.getItem('auth-token')){
            fetch('http://localhost:4000/getcart',{
              method:'POST',
              headers:{
                Accept:'application/form-data',
                'auth-token':`${localStorage.getItem('auth-token')}`,
                'Content-type':'application/json',
              },
              body:"",
            }).then((response)=>response.json())
            .then((data)=>setCartItems(data));
          }
      }, []);
      

      const addToCart = (itemId) => {
        setCartItems((prev) => ({
          ...prev,
          [itemId]: (prev[itemId] || 0) + 1, // Handle case where itemId may not exist yet
        }));
      
        if (localStorage.getItem('auth-token')) {
          fetch('http://localhost:4000/addtocart', {
            method: 'POST',
            headers: {
              Accept: 'application/json', // Corrected typo here
              'auth-token': `${localStorage.getItem('auth-token')}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ itemId }),
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error('Failed to add item to cart');
              }
              return response.json();
            })
            .then((data) => {
              console.log('Server response:', data); // Log server response for debugging
            })
            .catch((error) => {
              console.error('Error adding item to cart:', error); // Improved error handling
            });
        }
      };
      

    const removeFromCart = (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
        if(localStorage.getItem('auth-token'))
        {
            fetch('http://localhost:4000/removefromcart', {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'auth-token': `${localStorage.getItem('auth-token')}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ itemId }),
            })
              .then((response) => {
                if (!response.ok) {
                  throw new Error('Failed to add item to cart');
                }
                return response.json();
              })
              .then((data) => {
                console.log('Server response:', data); // Log server response for debugging
              })
              .catch((error) => {
                console.error('Error adding item to cart:', error); // Improved error handling
              });
        }
    }
    const getTotalCartAmount = () =>{
        let totalAmount=0;
        for(const item in cartItems){
            if(cartItems[item]>0)
                {
                    let itemInfo = all_product.find((product)=> product.id===Number(item));
                    totalAmount +=(itemInfo.new_price)*cartItems[item];
                }
        }
        return totalAmount;
    }
    const getTotalCartItem =() =>{
        let totalItem=0;
        for(const item in cartItems)
            {
                if(cartItems[item]>0)
                {
                    totalItem += cartItems[item];
                }
            }
            return totalItem;
    }

    const contextValue = { getTotalCartItem ,getTotalCartAmount,all_product, cartItems, addToCart, removeFromCart };

    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    );
}

export default ShopContextProvider;