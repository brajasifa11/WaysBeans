import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import classes from './index.module.scss';
import { Popup } from '../Popup';

import Logo from '../../static/icons/Logo.png'
import Profile from '../../static/icons/Profile.png';
import Beans from '../../static/icons/Beans.png';
import Logout from '../../static/icons/Logout.png';
import Basket from '../../static/icons/Basket.png';
import Avatar from '../../static/images/Avatar.png';
import { UserContext } from '../../context/userContext';
import { API } from '../../config/api';

export const Navbar = ({ show, setShow, nameModal, setNameModal, role, isLogin }) => {
  const navigate = useNavigate();
  const [state, dispatch] = useContext(UserContext);
  const [cart, setCart] = useState([]);
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);

  const openDropdown = () => {
    setIsOpenDropdown(!isOpenDropdown)
  };

  const toggleModalRegister = () => {
    setShow(!show);
    setNameModal('login');
  };
  const toggleModalLogin = () => {
    setShow(!show);
    setNameModal('register');
  };

  const logout = () => {
    dispatch({
      type: 'LOGOUT',
    });
    navigate('/')
  };
  //==\\
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
      setCart(response.data.data.carts);

      dispatch({
        type: 'GET_CART',
        payload: response.data.data.carts
      });
    } catch (error) {
      console.log(error)
    };
  };

  useEffect(() => {
    getCart();
  }, []);

  const userDropdown = () => {
    return (
      <>
        <div className={classes.overlayX} onClick={openDropdown}>
          <div className={classes.dropdownUserContainer}>
            <div className={classes.outerTriangle}>
              <div className={classes.innerTriangle} />
            </div>
            <div className={classes.dropdownWraper}>
              <div className={classes.profileWraper} onClick={() => navigate('/profile')}>
                <img className={classes.profile} src={Profile} alt='icon-profile' />
                <p>Profile</p>
              </div>
              <div className={classes.border}></div>
              <div className={classes.logoutWraper} onClick={logout}>
                <img className={classes.logout} src={Logout} alt='icon-logout' />
                <p>Logout</p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  const adminDropdown = () => {
    return (
      <>
        <div className={classes.overlayX} onClick={openDropdown}>
          <div className={classes.dropdownAdminContainer}>
            <div className={classes.outerTriangle}>
              <div className={classes.innerTriangle} />
            </div>
            <div className={classes.dropdownWraper}>
              <div className={classes.productWraper} onClick={() => navigate('/add-product')}>
                <img className={classes.product} src={Beans} alt='icon-profile' />
                <p>Add Product</p>
              </div>
              <div className={classes.border}></div>
              <div className={classes.logoutWraper} onClick={logout}>
                <img className={classes.logout} src={Logout} alt='icon-logout' />
                <p>Logout</p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };
  return (
    <div className={classes.container}>
      <div className={classes.logo}>
        <img src={Logo} alt='logo' onClick={() => navigate('/home')} />
      </div>
      {!isLogin ?
        <div className={classes.modal}>
          <div>
            <Popup show={show} nameModal={nameModal} handleClose={setShow} handleChangeModal={setNameModal} setNameModal={setNameModal} />
          </div>
          <button onClick={toggleModalRegister} className={classes.btnLog}>Login</button>
          <button onClick={toggleModalLogin} className={classes.btnReg}>Register</button>
        </div>
        :
        <div className={classes.navigation}>
          {role !== 'Admin' &&
            <div className={classes.subnavigation}>
              <img className={classes.basket} src={Basket} alt='bakset' onClick={() => navigate('/cart')} />
              {cart.length != 0 &&
                <span className={classes.indicator}>{cart.length}</span>
              }
            </div>
          }
          <div className={classes.avatar}>
            <img onClick={openDropdown} src={Avatar} alt='avatar' />
            <div className={classes.dropdownSection}>
              {
                role === 'User' ?
                  (isOpenDropdown && userDropdown())
                  :
                  (isOpenDropdown && adminDropdown())
              }
            </div>
          </div>
        </div>
      }
    </div >
  );
};
