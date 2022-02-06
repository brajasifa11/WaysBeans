import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/userContext';
import classes from './index.module.scss';
import { API } from '../../config/api';
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';

export const Popup = ({ show, nameModal, handleClose, handleChangeModal, setNameModal }) => {
  const navigate = useNavigate();
  const [state, dispatch] = useContext(UserContext);
  const [formRegister, setFormRegister] = useState({
    email: '',
    password: '',
    fullname: ''
  });
  const [formLogin, setFormLogin] = useState({
    email: '',
    password: '',
  });

  const register = (e) => {
    setFormRegister({
      ...formRegister,
      [e.target.name]: e.target.value,
    });
  };
  const login = (e) => {
    setFormLogin({
      ...formLogin,
      [e.target.name]: e.target.value,
    });
  };

  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })
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

  const handleRegister = async (e) => {
    try {
      e.preventDefault();
      const config = {
        headers: {
          'Content-type': 'application/json',
        },
      };
      const body = JSON.stringify(formRegister);
      const response = await API.post('/register', body, config);
      if (response.status === 201) {
        Toast.fire({
          icon: 'success',
          title: 'Register Successfully'
        })
        setFormRegister({
          email: '',
          password: '',
          fullname: ''
        })
        setNameModal('login');
      }
    } catch (error) {
      if (error.response.status === 400) {
        if (error.response.data.message === 'Email already Registered') {
          Toast.fire({
            icon: 'error',
            title: 'Email already Registered'
          });
        } else if (error.response.data.message.includes('password')) {
          Toast.fire({
            icon: 'error',
            title: 'Password Cannot be Empty'
          });
        } else if (error.response.data.message.includes('email')) {
          Toast.fire({
            icon: 'error',
            title: 'Email Cannot be Empty'
          });
        } else if (error.response.data.message.includes('fullname')) {
          Toast.fire({
            icon: 'error',
            title: 'Fullname Cannot be Empty'
          });
        };
      } else {
        Toast.fire({
          icon: 'warning',
          title: 'Something Went Wrong Please Try Again'
        });
      };
    };
  };
  const handleLogin = async (e) => {
    try {
      e.preventDefault();
      const config = {
        headers: {
          'Content-type': 'application/json',
        },
      };
      const body = JSON.stringify(formLogin);
      const response = await API.post('/login', body, config);
      console.log(response);
      if (response?.status === 200) {
        localStorage.setItem('token', response.data.data.user.token);
        localStorage.setItem('role', response.data.data.user.role);
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: response.data.data.user,
        });
        Toastt.fire({
          icon: 'success',
          title: 'Login Successfully'
        });
        if (response.data.data.user.role) {
          navigate('/home');
        };
      };
    } catch (error) {
      if (error.response.status === 403) {
        Toast.fire({
          icon: 'error',
          title: 'Invalid Email or Password'
        });
      } else if (error.response.data.message.includes('email')) {
        Toast.fire({
          icon: 'error',
          title: 'Email Cannot be Empty'
        });
      } else if (error.response.data.message.includes('password')) {
        Toast.fire({
          icon: 'error',
          title: 'Password Cannot be Empty'
        });
      } else {
        Toast.fire({
          icon: 'warning',
          title: 'Something Went Wrong Please Try Again'
        });
      };
    };
  };

  const handleChangeLogin = (e) => handleChangeModal('login');
  const handleChangeRegister = (e) => handleChangeModal('register');

  const handleXRegister = () => {
    handleClose(false)
    handleChangeModal('')
  };
  const handleXLogin = () => {
    handleClose(false);
    handleChangeModal('')
  };

  const modalRegister = () => {
    return (
      <>
        <div className={classes.overlayX} onClick={handleXRegister}></div>
        <div className={classes.popupRegister}>
          <p>Register</p>
          <div className={classes.body}>
            <form className={classes.formRegister} onSubmit={handleRegister}>
              <input type='text'
                placeholder='Email' name='email'
                value={formRegister.email} onChange={register}
              />
              <input type='password'
                placeholder='Password' name='password'
                value={formRegister.password} onChange={register}
              />
              <input type='text'
                placeholder='Fullname' name='fullname'
                value={formRegister.fullname} onChange={register}
              />
              <div className={classes.btn}>
                <button className={classes.btnRegister} type="submit">Register</button>
              </div>
            </form>
          </div>
          <div>
            <span>Already have an account ? <strong onClick={handleChangeLogin}>Click Here</strong></span>
          </div>
        </div>
      </>
    );
  };

  const modalLogin = () => {
    return (
      <>
        <div className={classes.overlayX} onClick={handleXLogin}></div>
        <div className={classes.popupLogin}>
          <p>Login</p>
          <div className={classes.body}>
            <form className={classes.formLogin} onSubmit={handleLogin}>
              <input type='text'
                placeholder='Email' name='email'
                value={formLogin.email} onChange={login}
              />
              <input type='password'
                placeholder='Password' name='password'
                value={formLogin.password} onChange={login}
              />
              <div className={classes.btn}>
                <button className={classes.btnRegister} type="submit">Login</button>
              </div>
            </form>
          </div>
          <div>
            <span>Don't have an account ? <strong onClick={handleChangeRegister}>Click Here</strong></span>
          </div>
        </div>
      </>
    );
  };
  return !show ? '' : (nameModal === 'register' ? modalRegister() : modalLogin());
};
