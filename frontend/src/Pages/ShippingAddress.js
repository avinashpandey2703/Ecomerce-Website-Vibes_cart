import React, { useState, useContext, useEffect } from 'react'
import Button from 'react-bootstrap/esm/Button';
import { Helmet } from 'react-helmet-async';
import Form from 'react-bootstrap/Form';
import { Store } from '../Redux/Store.js';
import {  useNavigate } from 'react-router-dom';
import Checkout from '../Components/Checkout.js';


function ShippingAddress() {
    const { state, dispatch: ctxDispatch } = useContext(Store)

    const {
        userInfo,
        cart: { shippingAddress } } = state;


    const Navigate = useNavigate();
    const [fullname, setFullName] = useState(shippingAddress.fullname || '');
    const [Address, setAddress] = useState(shippingAddress.Address || '');
    const [City, setCity] = useState(shippingAddress.City || '');
    const [postal, setPostal] = useState(shippingAddress.postal || '');
    const [country, setCountry] = useState(shippingAddress.country || '');

   useEffect(()=>{
    if(!userInfo){
        Navigate('/signin?redirect=/shipping');
    }
   },[userInfo,Navigate])
    const submitHandler = (e) => {

        e.preventDefault();
        ctxDispatch({
            type: 'SAVE_SHIPPING_ADDRESS',
            payload: {
                fullname,
                Address,
                City,
                postal,
                country,
            },
        });
        localStorage.setItem(
            'shippingAddress',
            JSON.stringify({
                fullname,
                Address,
                City,
                postal,
                country,

            })
        );
        Navigate('/payment');
    };

    return (
        <div >
            <Helmet>
                <title>Shipping Address</title>
            </Helmet>

            <Checkout step1 step2></Checkout>

            <div className='container small-container' style={{ maxWidth: "600px" }} >
                <h1 className='my-3'>Shipping Address</h1>
                <Form onSubmit={submitHandler}>
                    <Form.Group className='mb-3' controlId='fullname'>
                        <Form.Label> Full Name</Form.Label>
                        <Form.Control value={fullname} onChange={(e) => setFullName(e.target.value)} required></Form.Control>

                    </Form.Group>
                    <Form.Group className='mb-3' controlId='Address'>
                        <Form.Label> Address</Form.Label>
                        <Form.Control value={Address} onChange={(e) => setAddress(e.target.value)} required></Form.Control>

                    </Form.Group>
                    <Form.Group className='mb-3' controlId='City'>
                        <Form.Label> City</Form.Label>
                        <Form.Control value={City} onChange={(e) => setCity(e.target.value)} required></Form.Control>

                    </Form.Group>
                    <Form.Group className='mb-3' controlId='postal'>
                        <Form.Label> Postal </Form.Label>
                        <Form.Control value={postal} onChange={(e) => setPostal(e.target.value)} required></Form.Control>

                    </Form.Group>
                    <Form.Group className='mb-3' controlId='country'>
                        <Form.Label> Country </Form.Label>
                        <Form.Control value={country} onChange={(e) => setCountry(e.target.value)} required></Form.Control>

                    </Form.Group>
                    <div className='mb-3'>
                        <Button variant='primary' type='submit'>Continue
                        </Button>
                    </div>
                </Form>
            </div>


        </div>
    )
}

export default ShippingAddress
