import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import {HelmetProvider} from 'react-helmet-async'
import 'bootstrap/dist/css/bootstrap.min.css';
import reportWebVitals from './reportWebVitals';
import { StoreProvider } from './Redux/Store';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
  
  <StoreProvider>
  <HelmetProvider>
  <PayPalScriptProvider deferLoading={true}>
  <App />
  </PayPalScriptProvider>
  </HelmetProvider>
  </StoreProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();