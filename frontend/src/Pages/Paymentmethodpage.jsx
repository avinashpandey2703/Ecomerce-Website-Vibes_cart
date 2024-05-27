import React, { useContext, useEffect, useState } from 'react'
import ChekoutSteps from '../Components/Checkout';
import { Helmet } from 'react-helmet-async';
import { Store } from '../Redux/Store.js';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/esm/Button';
import { useNavigate } from 'react-router-dom';
//import ShippingAddress from './ShippingAddress.js';
function Paymentmethodpage() {


    const Navigate=useNavigate();
    const {state, dispatch:ctxDispatch}=useContext(Store);
    const {cart:{shippingAddress,paymentMethod}}=state;

    const [paymentMethodName,setPaymentMethod]=useState(paymentMethod ||'paypal')
    const submitHandler=(e)=>{
        e.preventDefault();
        ctxDispatch({type:'SAVE_PAYMENT_METHOD',payload:paymentMethodName})
        localStorage.setItem('paymentMethod',paymentMethodName);
        Navigate('/placeholder')
    }
    useEffect(()=>{
        if(!shippingAddress.Address){
            Navigate('/shipping')
        }
    },[shippingAddress,Navigate]);
 
    return (
        <div>
             <Helmet>
                <title>payment</title>
            </Helmet>
            <ChekoutSteps step1 step2 step3></ChekoutSteps>
            <div className='container small-container'>
            <h1 className='my-3'>Payment Method</h1>
            <Form onSubmit={submitHandler}>
                <div className='mb-3'>
                    <Form.Check 
                        type='radio'
                        id="paypal"
                        label="Paypal"
                        value="Paypal"
                        checked={paymentMethodName === 'Paypal'}
                        onChange={(e)=>setPaymentMethod(e.target.value)}
                    />
                    <Form.Check 
                        type='radio'
                        id="Paytm"
                        label="Paytm"
                        value="Paytm"
                        checked={paymentMethodName === 'Paytm'}
                        onChange={(e)=>setPaymentMethod(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <Button type="submit">Continue</Button>
                </div>
            </Form>
            </div>
        </div>
      )
  
}

export default Paymentmethodpage
