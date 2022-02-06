import React, { useState, useEffect } from 'react';
import './App.scss';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { setAuthToken } from './config/api';
import PrivateRoute from './routes/PrivateRoute';
import {
  Landing,
  Home,
  Product,
  Cart,
  Checkout,
  Profile,
  //==\\
  Dashboard,
  AddProduct,
} from './pages';

if (localStorage.token) {
  setAuthToken(localStorage.token);
};
function App() {
  const [role, setRole] = useState(localStorage.getItem('role'));
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (token && role) {
      setAuthToken(token)
      setRole(role)
    };
  }, []);

  return (
    <div className='App'>
      <Router>
        <Routes>
          <Route path='/' element={<Landing />} />
          {
            role &&
            role === 'User' &&
            <Route element={<PrivateRoute />}>
              <Route path='/home' element={<Home />} />
              <Route path='/product/:product' element={<Product />} />
              <Route path='/cart' element={<Cart />} />
              <Route path='/checkout' element={<Checkout />} />
              <Route path='/profile' element={<Profile />} />
              <Route path='/*' element={<Home />} />
            </Route>
          }
          <Route path='/*' element={<Landing />} />
          {role &&
            role === 'Admin' &&
            <Route Route element={<PrivateRoute />}>
              <Route path='/home' element={<Dashboard />} />
              <Route path='/add-product' element={<AddProduct />} />
              <Route path='/*' element={<Dashboard />} />
            </Route>
          }
        </Routes>
      </Router>
    </div >
  );
};

export default App;
