import React, { useState } from "react";
import classes from './index.module.scss';
import thumbnail from '../../../static/icons/thumbnail.png';
import { API } from "../../../config/api";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';

const AddProduct = () => {
  const navigate = useNavigate();
  const [preview, setPreview] = useState(null);
  const [formProduct, setFormProduct] = useState({
    name: '',
    stock: '',
    price: '',
    description: '',
    image: '',
  });

  const addProduct = (e) => {
    setFormProduct({
      ...formProduct,
      [e.target.name]:
        e.target.type === 'file' ? e.target.files : e.target.value,
    });

    if (e.target.type === 'file') {
      let url = URL.createObjectURL(e.target.files[0]);
      setPreview(url);
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
    },
  });

  const handleProduct = async (e) => {
    try {
      e.preventDefault();
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Content-type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        },
      };

      const formData = new FormData();
      formData.set('name', formProduct.name);
      formData.set('stock', formProduct.stock);
      formData.set('price', formProduct.price);
      formData.set('description', formProduct.description);
      formData.set('photo', formProduct.image[0], formProduct.image[0].name);

      const response = await API.post('/product', formData, config);
      Toast.fire({
        icon: 'success',
        title: 'Success Add Product'
      });

      navigate('/home');
    } catch (error) {
      Toast.fire({
        icon: 'warning',
        title: 'Something Went Wrong Please Try Again'
      });
    };
  };

  return (
    <div className={classes.container}>
      <div className={classes.wraper}>
        <p className={classes.title}>Add Product</p>
        <div className={classes.content}>
          <div className={classes.leftSection}>
            <form className={classes.formWraper} onSubmit={handleProduct}>
              <input className={classes.input} placeholder='Name' name='name'
                value={formProduct.name} onChange={addProduct} />
              <input className={classes.input} placeholder='Stock' name='stock'
                value={formProduct.stock} onChange={addProduct} />
              <input className={classes.input} placeholder='Price' name='price'
                value={formProduct.price} onChange={addProduct} />
              <textarea className={classes.inputDescription} placeholder='Description Product' name='description'
                value={formProduct.description} onChange={addProduct} />
              <label className={classes.photoInput} htmlFor="image">
                Photo Product
                <img src={thumbnail} />
              </label>
              <input id="image" name='image' type='file'
                onChange={addProduct} hidden />
              <div className={classes.btn}>
                <button type='submit'>
                  Add Product
                </button>
              </div>
            </form>
          </div>

          <div className={classes.rightSection}>
            <img src={preview} />
          </div>

        </div>
      </div>
    </div>
  );
};

export default AddProduct;