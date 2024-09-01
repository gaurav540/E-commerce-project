import React, { useContext } from 'react'
import './CSS/ShopCatogery.css'
import { ShopContext } from '../Context/ShopContext'
import dropdown_icon from '../Components/Assets/dropdown_icon.png'
import { Item } from '../Components/Items/Item'
export const ShopCatogery = (props) => {
  const {all_product} = useContext(ShopContext);
  return (
    <div className='ShopCatogery'>
        <img  className ='shopcatogery-banner' src={props.banner} alt="" />
        <div className="shopcatogery-indexSort">
          <p>
            <span>Showing 1-12</span> out of 36 product
          </p>
          <div className="shopcatogery-sort">
            Sort by <img src={dropdown_icon} alt="" />
          </div>
        </div>
        <div className="shopcatogery-product">
          {
            all_product.map((item ,i)=>{
              if(props.category===item.category)//note here catogery u used and in databse catogery
                {
                  return <Item key={i} id={item.id} name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price}/>
                }
                else{
                  return null;
                }
            })
          }
        </div>
        <div className="shopcatogery-loadmore">
          Explore more
        </div>
    </div>
  )
}
export default ShopCatogery;