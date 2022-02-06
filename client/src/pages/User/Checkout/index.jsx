import React, { useEffect, useState, useContext } from "react";
import classes from './index.module.scss';
import { convertRupiah } from '../../../utils/RupiahFormat';
import { UserContext } from "../../../context/userContext";
import thumbnail from '../../../static/icons/thumbnail.png';
import Logo from '../../../static/icons/Logo.png';
import Guetemala from '../../../static/images/Guetemala.png';
import { API } from "../../../config/api";

const Checkout = () => {
  const [state, dispatch] = useContext(UserContext);
  const [formTransaction, setFormTransaction] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    image: '',
  });

  const addTransaction = (e) => {
    setFormTransaction({
      ...formTransaction,
      [e.target.name]:
        e.target.type === 'file' ? e.target.files : e.target.value,
    });
  };

  const handleTransaction = async (e) => {
    try {
      e.preventDefault();
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Content-type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        },
      };

      let idCartList = [];
      let orderData = [];
      state.cartList.map((item, idx) => {
        idCartList.push(item.id)
        orderData.push({
          productId: item.productId,
          qty: item.qty,
        });
      });

      const formData = new FormData();
      formData.set('name', formTransaction.name);
      formData.set('email', formTransaction.email);
      formData.set('phone', formTransaction.phone);
      formData.set('address', formTransaction.address);
      formData.set('attachment', formTransaction.image[0], formTransaction.image[0].name);
      formData.set('cartList', JSON.stringify(idCartList));
      formData.set('orderData', JSON.stringify(orderData));

      const response = await API.post('/transaction', formData, config);

    } catch (error) {
      console.log(error)
    };
  };

  return (
    <div className={classes.container}>
      <div className={classes.wraper}>
        <p className={classes.title}>Shipping</p>
        <div className={classes.content}>
          <div className={classes.leftSection}>
            <form className={classes.formWraper} onSubmit={handleTransaction}>
              <input className={classes.input}
                type='text' name='name'
                placeholder='Name' onChange={addTransaction} />
              <input className={classes.input}
                type='email' name='email'
                placeholder='Email' onChange={addTransaction} />
              <input className={classes.input}
                type='text' name='phone'
                placeholder='Phone' onChange={addTransaction} />
              <input className={classes.input}
                placeholder='Post Code' onChange={addTransaction} />
              <textarea className={classes.inputAddress}
                placeholder='Address' name='address'
                onChange={addTransaction} />
              <label className={classes.btn} htmlFor="image">
                Attachment File
                <img src={thumbnail} />
              </label>
              <input id="image" name='image' type='file'
                onChange={addTransaction} hidden />
            </form>
          </div>

          <div className={classes.rightSection}>
            {state?.cartList &&
              state?.cartList.map((item, idx) => {
                return (
                  <div className={classes.historyContainer} key={idx}>
                    <div className={classes.history}>
                      <img src={item.photo} />
                      <div className={classes.detailed}>
                        <p className={classes.productName}>{item.productChart.name}</p>
                        <p className={classes.date}>{item.date}</p>
                        <p className={classes.subdetailed}>Price : {(convertRupiah(item.productChart.price))}</p>
                        <p className={classes.subdetailed}>Qty : {item.qty}</p>
                        <p className={classes.subtotal}>Sub Total : {convertRupiah(item.productChart.price * item.qty)}</p>
                      </div>
                    </div>
                    <div className={classes.statusWraper}>
                      <img src={Logo} alt='icon' />
                    </div>
                  </div>
                );
              })
            }
            <div className={classes.btn}>
              <button onClick={handleTransaction}>
                Pay
              </button>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
};

export default Checkout;