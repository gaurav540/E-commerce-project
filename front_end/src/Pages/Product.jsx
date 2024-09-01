import React, { useContext } from 'react'
import { useParams } from 'react-router-dom';
import { BreadCrum } from '../Components/BreadCrum/BreadCrum';
import { ShopContext } from '../Context/ShopContext';
import { ProductDisplay } from '../Components/ProductDisplay/ProductDisplay';
import { DescriptionBox } from '../Components/DescriptionBox/DescriptionBox';
import { RelatedProduct } from '../Components/RelatedProduct/RelatedProduct';

export const Product = () => {
  const {all_product} = useContext(ShopContext);
  const {productId} = useParams();
  const product = all_product.find((e) => e.id === Number(productId));
  return (
    <div>
      <BreadCrum product={product}/>
      <ProductDisplay product={product}/>
      <DescriptionBox />
      <RelatedProduct />
    </div>
  )
}
