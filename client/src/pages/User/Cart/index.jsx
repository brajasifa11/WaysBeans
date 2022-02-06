import React, { useEffect, useState, useContext } from "react";
import classes from './index.module.scss';
import Bin from '../../../static/icons/Bin.png';
import { useNavigate } from "react-router-dom";
import { API } from "../../../config/api";
import { convertRupiah } from "../../../utils/RupiahFormat";
import { UserContext } from "../../../context/userContext";
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [state, dispatch] = useContext(UserContext);
  const navigate = useNavigate();
  let total = 0;
  cart && cart.map((item, idx) => {
    total += item.productChart.price * item.qty
  });

  const getCart = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Content-type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        },
      };
      const response = await API.get(`/my-cart`, config);
      setCart(response.data.data.carts)

      dispatch({
        type: 'GET_CART',
        payload: response.data.data.carts
      });

    } catch (error) {
      console.log(error)
    };
  };
  const handleupdate = async (e) => {
    try {
      e.preventDefault();
      let data = e.target.dataset;
      let prevQty = parseInt(data.qty);
      let count = parseInt(data.count);
      let id = data.id
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${token}`
        },
      };
      let quantity = { qty: prevQty + count };
      const body = JSON.stringify(quantity);
      const response = await API.patch(`/cart/edit/${id}`, body, config);
      getCart();
    } catch (error) {
      console.log(error)
    };
  };

  const Toastt = Swal.mixin({
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

  const deleteCart = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        },
      };
      await API.delete(`/cart/delete/${id}`, config)
      Toastt.fire({
        icon: 'success',
        title: 'Product Deleted'
      })
      getCart();
    } catch (error) {
      console.log(error)
    };
  };

  useEffect(() => {
    getCart();
  }, []);

  return (
    <div className={classes.container}>
      <div className={classes.wraper}>
        <div className={classes.content}>
          <p className={classes.title}>My Cart</p>
          <p className={classes.reviewOrder}>Review Your Order</p>
          <div className={classes.orders}>
            <div className={classes.orderWraper}>
              {cart &&
                cart.map((item, idx) => {
                  return (
                    <div className={classes.order} key={idx}>
                      <div className={classes.imageWraper}>
                        <img src={item.photo} alt='img' />
                      </div>
                      <div className={classes.items}>
                        <div className={classes.package}>
                          <p className={classes.products}>{item.productChart.name}</p>
                          <p className={classes.price}>{(convertRupiah(item.productChart.price))}</p>
                        </div>
                        <div className={classes.approx}>
                          <div className={classes.amount}>
                            <span onClick={handleupdate}
                              data-id={item.id}
                              data-qty={item.qty}
                              data-count={-1}
                            >-</span>
                            <p>{item.qty}</p>
                            <span onClick={handleupdate}
                              data-id={item.id}
                              data-qty={item.qty}
                              data-count={+1}>+</span>
                          </div>
                          <img className={classes.bin} src={Bin} alt='bin'
                            onClick={() => { deleteCart(item.id) }}
                          />
                        </div>
                      </div>
                    </div>
                  )
                })
              }
            </div>
            <div className={classes.total}>
              <div className={classes.totalWraper}>
                {cart &&
                  cart.map((item, idx) => {
                    return (
                      <div className={classes.subTotal} key={idx}>
                        <div className={classes.description}>
                          <p>{item.productChart.name}</p>
                        </div>
                        <div className={classes.value}>
                          <p>{convertRupiah(item.productChart.price * item.qty)}</p>
                        </div>
                      </div>
                    )
                  })}
              </div>
              <div className={classes.submission}>
                <p>Total</p>
                <p>{convertRupiah(total)}</p>
              </div>
              <button onClick={() => navigate('/checkout')}>Proceed to Checkout</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;