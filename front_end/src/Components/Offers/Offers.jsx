import React from 'react'
import './Offers.css'
import exclusive_image from '../Assets/exclusive_image.png'
export const Offers = () => {
  return (
    <div className='offers'>
        <div className="offers-left">
            <h1>EXCUSIVE OFFERS FOR YOU</h1>
            <p>ONLY ON BEST SELLER PRODUCT</p>
            <button>Check now</button>
        </div>
        <div className="offers-right">
            <img src={exclusive_image} alt="" />
        </div>
    </div>
  )
}
