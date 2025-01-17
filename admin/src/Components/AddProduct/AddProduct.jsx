import React, { useState } from 'react';
import './AddProduct.css';
import upload_area from '../../assets/upload_area.svg';

const AddProduct = () => {
  const [image,setImage] =useState(false);
  const [productDeatails,setProductDetails] = useState({
    name:"",
    image:"",
    category:"women",
    new_price:"",
    old_price:"",
  })
  const imageHandler = (e)=>{
    setImage(e.target.files[0]);
  }
  const chageHandler = (e) =>{
    setProductDetails({...productDeatails,[e.target.name]:e.target.value})
  }
  const Add_Product = async ()=>{
    console.log(productDeatails);
    let responseData;
    let product = productDeatails;
    let formData = new FormData();
    formData.append('product',image);
    await fetch('http://localhost:4000/upload',{
      method:'POST',
      headers:{
        Accept:'application/json',
      },
      body:formData,
    }).then((resp)=>resp.json()).then((data)=>{
      responseData=data
    });
    if(responseData.success)
    {
      product.image = responseData.image_url;
      console.log(product);
      await fetch('http://localhost:4000/addproduct',{
        method:'POST',
        headers:{
          Accept:'application/json',
          'Content-Type':'application/json',
        },
        body:JSON.stringify(product),
      }).then((resp)=>resp.json()).then((data)=>{
        data.success?alert(("Product Added")):alert("Failed")
      })
    }
  }
  return (
    <div className='add-product'>
      <div className="addproduct-itemfield">
        <p>Product title</p>
        <input  value={productDeatails.name} onChange={chageHandler}  type="text" name='name' placeholder='Type here' aria-label='Product Title'/>
      </div>
      <div className="addproduct-price">
        <div className="addproduct-itemfield">
          <p>Price</p>
          <input value={productDeatails.old_price} onChange={chageHandler} type="text" name="old_price" placeholder='Type here' aria-label='Old Price'/>
        </div>
        <div className="addproduct-itemfield">
          <p>Offer Price</p>
          <input value={productDeatails.new_price} onChange={chageHandler} type="text" name="new_price" placeholder='Type here' aria-label='New Price'/>
        </div>
      </div>
        <div className="addproduct-itemfield">
          <p>Product Category</p>
          <select value={productDeatails.category} onChange={chageHandler} name="category" className='add-product-selector' aria-label='Product category'>
            <option value="women">Women</option>
            <option value="men">Men</option>
            <option value="kid">Kid</option>
          </select>
        </div>
        <div className="addproduct-itemfield">
          <label htmlFor="file-input">
            <img src={image?URL.createObjectURL(image):upload_area} className='addproduct-thumbnail-img' alt="Upload Area" />
          </label>
          <input onChange={imageHandler} type="file" name='image' id='file-input' hidden />
        </div>
        <button onClick ={()=>{Add_Product()}} className='addproduct-btn'>ADD</button>
      </div>
  );
};

export default AddProduct;
