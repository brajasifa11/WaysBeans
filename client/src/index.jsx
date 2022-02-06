import React from 'react';
import ReactDOM from 'react-dom';
import './index.module.scss';
import App from './App';
import { UserContextProvider } from './context/userContext';

ReactDOM.render(
  <React.StrictMode>
    <UserContextProvider>
      <App />
    </UserContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
