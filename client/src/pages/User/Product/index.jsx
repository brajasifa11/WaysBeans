import React, { useState, useEffect } from 'react';
import classes from './index.module.scss';
import { convertRupiah } from '../../../utils/RupiahFormat';
import { useLocation } from "react-router-dom";
import { API } from '../../../config/api';
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';

const Product = () => {
  const [product, setProduct] = useState({});
  const location = useLocation();
  const { productId } = location.state;

  const getProduct = async () => {
    try {
      const response = await API.get(`/product/${productId}`);
      setProduct(response.data.data.product)

    } catch (error) {
      console.log(error)
    };
  };

  const Toast = Swal.mixin({
    toast: true,
    position: 'top',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })

  const addCart = async () => {
    try {
      let body = {
        productId: product.id,
        qty: 1,
      };
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${token}`
        },
      };
      body = JSON.stringify(body);
      const response = await API.post(`/cart`, body, config);
      Toast.fire({
        icon: 'success',
        title: `${product.name} Add to Chart`
      })
    } catch (error) {
      console.log(error)
    };
  };
  useEffect(() => {
    getProduct();
  }, [])

  return (
    <div className={classes.container}>
      <div className={classes.wraper}>
        <div className={classes.content}>
          <div className={classes.product}>
            <img src={product.photo} alt='product' />
          </div>
          <div className={classes.description}>
            <div className={classes.title}>
              <p>{product.name}</p>
              <p className={classes.stock}>Stock : {product.stock}</p>
            </div>
            <div className={classes.subdescription}>
              <p>
                {product.description}
              </p>
            </div>
            <p>
              <strong className={classes.price}>
                {(convertRupiah(product.price))}
              </strong>
            </p>
            <div className={classes.response}>
              <button onClick={addCart}>Add Chart</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;