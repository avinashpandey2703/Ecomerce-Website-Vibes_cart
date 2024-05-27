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

function Signup() {
    const navigate = useNavigate();

    const { search } = useLocation();
    const redirectInUrl = new URLSearchParams(search).get('redirect');
    const redirect = redirectInUrl ? redirectInUrl : '/';

    const [name, setName] = useState('');

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmpassword, setConfirmPassword] = useState('');


    const { state, dispatch: ctxDispatch } = useContext(Store)
    const { userInfo } = state;

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const body = {name, email, password,confirmpassword }
            const { data } = await axios.post(API_URL + '/users/signup', body);
            ctxDispatch({ type: 'USER_SIGNIN', payload: data })
            localStorage.setItem('userInfo', JSON.stringify(data));
            navigate(redirect || '/');
            // redirect to redirect URL if it does not exist then go to the home page
        } catch (err) {
            toast.error(getError(err));

        }

    }
    useEffect(() => {
        if (userInfo) {
            navigate(redirect);
        }
    }, [navigate, redirect, userInfo])

    return (

        <Container className='small-container '>
            <Helmet>
                <title>Sign Up</title>
            </Helmet>
            <h1 className='my-3'>Sign Up</h1>
            <Form onSubmit={submitHandler}>

            <Form.Group className='mb-3' controlId="name">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="name" required onChange={(e) => setName(e.target.value)} />

                </Form.Group>

                <Form.Group className='mb-3' controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" required onChange={(e) => setEmail(e.target.value)} />

                </Form.Group>
                <Form.Group className='mb-3' controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" required onChange={(e) => setPassword(e.target.value)} />

                </Form.Group>
                <Form.Group className='mb-3' controlId="confirmpassword">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control type="password" required onChange={(e) => setConfirmPassword(e.target.value)} />

                </Form.Group>
                <div className='mb-3'>
                    <Button type="submit">Sign Up</Button>
                </div>
                <div className="mb-3">
                   Already Have an account?{' '}
                    <Link to={`/signin?redirect=${redirect}`}>Sign-In</Link>
                </div>
            </Form>

        </Container>
    )
}

export default Signup
