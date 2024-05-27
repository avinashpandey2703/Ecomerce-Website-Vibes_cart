import React, { useContext, useEffect, useState } from 'react'
import { Store } from '../Redux/Store.js';
import axios from 'axios'
import './Signin.css'
import { API_URL } from '../config.js';
import Container from 'react-bootstrap/esm/Container'
import { Helmet } from 'react-helmet-async';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getError } from '../Components/utils.js';


function Signin() {

    const navigate=useNavigate();

    const { search } = useLocation();
    const redirectInUrl = new URLSearchParams(search).get('redirect');
    const redirect = redirectInUrl ? redirectInUrl : '/';


    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    const { state,dispatch:ctxDispatch}=useContext(Store)
    const {userInfo}=state;

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const body = { email, password }
            const { data } = await axios.post(API_URL + '/users/signin', body);
            ctxDispatch({type:'USER_SIGNIN',payload:data})
            localStorage.setItem('userInfo',JSON.stringify(data));
            navigate(redirect || '/');
            // redirect to redirect URL if it does not exist then go to the home page
        } catch (err) {
            toast.error(getError(err));

        }

    }
    useEffect(()=>{
        if(userInfo){
            navigate(redirect);
        }
      },[navigate,redirect,userInfo])

    return (

        <Container className='small-container '>
            <Helmet>
                <title>Sign In</title>
            </Helmet>
            <h1 className='my-3'>Sign In</h1>
            <Form onSubmit={submitHandler}>
                <Form.Group className='mb-3' controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" required  onChange={(e)=>setEmail(e.target.value)}/>

                </Form.Group>
                <Form.Group className='mb-3' controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" required onChange={(e)=>setPassword(e.target.value)} />

                </Form.Group>
                <div className='mb-3'>
                    <Button type="submit">Sign In</Button>
                </div>
                <div className="mb-3">
                    New customer?{' '}
                    <Link to={`/signup?redirect=${redirect}`}>Create your account</Link>
                </div>
            </Form>

        </Container>
    )
}

export default Signin
