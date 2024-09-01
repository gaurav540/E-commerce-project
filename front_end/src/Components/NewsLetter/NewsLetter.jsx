import React from 'react'
import './NewsLetter.css'
export const NewsLetter = () => {
  return (
    <div className='newsletter'>
        <h1>Get exclusive offer on your email</h1>
        <p>Subscribe to our NewsLetter and stay updated</p>
        <div>
            <input type="email" placeholder='your email id' />
            <button>Subscribe</button>
        </div>
    </div>
  )
}
