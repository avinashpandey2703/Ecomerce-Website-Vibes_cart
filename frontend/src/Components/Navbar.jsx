import React, { useEffect, useState } from 'react'
import './Navbar.css'
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'
import Container from 'react-bootstrap/Container'

import Badge from 'react-bootstrap/Badge';
import Nav from 'react-bootstrap/Nav';

import { LinkContainer } from 'react-router-bootstrap';
import { useContext } from 'react';
import { Store } from '../Redux/Store';
import { Link, Navigate, redirect } from 'react-router-dom';
import Button from 'react-bootstrap/esm/Button'
import { API_URL } from '../config'
import axios from 'axios'
import { getError } from './utils'
import { toast } from 'react-toastify'


function Navbars() {



  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const signoutHandler = () => {
    ctxDispatch({ type: 'USER_SIGNOUT' })
    localStorage.removeItem('userInfo');
    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('paymentMethod')
    window.location.href = '/Signin'
  };


  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(API_URL+"/products/categories");
        if (Array.isArray(data)) {
          setCategories(data);
        } else {
          // Handle unexpected data structure
          console.error("Unexpected data structure for categories:", data);
        }
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchCategories();
  }, []);
  

  return (
    <div className={sidebarIsOpen ? 'd-flex flex-column site-container active-cont' : 'd-flex flex-column site-container'}>

      <Navbar bg="dark" variant="dark" expand='lg'>
        <Container>
          <Button
            variant="dark"
            onClick={() => setSidebarIsOpen(!sidebarIsOpen)}
          >
            <i className="fas fa-bars"></i>
          </Button>
          <LinkContainer to="/">
            <Navbar.Brand>Vibes Cart</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav className="me-auto w-100 justify-content-end">
              <Link to="/cart" className="nav-link">
                cart
                {cart.cartItems.length > 0 && (
                  <Badge pill bg="danger">
                    {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                  </Badge>
                )}
              </Link>
              {
                userInfo ? (
                  <NavDropdown title={userInfo.name} id="basic-nav-bropdown">
                    <LinkContainer to="/profile">
                      <NavDropdown.Item>User Profile</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/orderhistory">
                      <NavDropdown.Item>Order History</NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Divider />
                    <Link className='dropdown-item' to='#signout' onClick={signoutHandler}>
                      Sign out
                    </Link>
                  </NavDropdown>
                ) : (
                  <Link className='nav-link' to="/signin">Sign In</Link>
                )
              }
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>


      <div
          className={
            sidebarIsOpen
              ? 'active-nav side-navbar d-flex justify-content-between flex-wrap flex-column'
              : 'side-navbar d-flex justify-content-between flex-wrap flex-column'
          }
        >
          <Nav className="flex-column text-white w-100 p-2">
            <Nav.Item>
              <strong>Categories</strong>
            </Nav.Item>
            {

              categories.map((category) =>{
                return (
                  <Nav.Item key={category}>
                  <LinkContainer
                    to={{ pathname: '/search', search: category = `${category}` }}
                    onClick={() => setSidebarIsOpen(false)}
                  >
                    <Nav.Link>{category}</Nav.Link>
                  </LinkContainer>
                </Nav.Item>
                )
              })

              }
          </Nav>
        </div>



    </div>
  )
}

export default Navbars
