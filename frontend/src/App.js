import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css';
import Container from 'react-bootstrap/Container';
import Homepage from './Pages/Homepage';
import Productdetails from './Pages/Productdetails'
import Cart from './Pages/Cart'
// import Navbars from './Components/Navbar';
import Signin from './Pages/Signin';
import Signup from './Pages/Signup';
import ShippingAddress from './Pages/ShippingAddress';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Paymentmethodpage from './Pages/Paymentmethodpage';
import Placeorder from './Pages/Placeorder';
import Orderpage from './Pages/Orderpage';
import OrderHistory from './Pages/OrderHistory';
import Profile from './Pages/Profile';
import React, { useEffect, useState } from 'react'
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'
import Badge from 'react-bootstrap/Badge';
import Nav from 'react-bootstrap/Nav';
import { LinkContainer } from 'react-router-bootstrap';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/esm/Button'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Store } from './Redux/Store';
import { API_URL } from './config';
import { getError } from './Components/utils';
import SearchBox from './Components/SearchBox';
import SearchPage from './Pages/SearchPage';
import ProtectedRoute from './Components/ProtectedRoute';
import Dashboard from './Admin/AdminComponents/Dashboard';
import AdminRoute from './Admin/AdminComponents/AdminRoute';
import ProductListPage from './Admin/AdminPages/ProductListPage';
import EditproductPage from './Admin/AdminPages/EditproductPage';
import CreateProductPage from './Admin/AdminPages/CreateProductPage';
import OrderList from './Admin/AdminComponents/OrderList';
import UserList from './Admin/AdminPages/UserList';
import EditUser from './Admin/AdminPages/EditUser';






function App() {
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
        const { data } = await axios.get(API_URL + "/products/categories");
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
    <BrowserRouter>
      <div className={sidebarIsOpen ? 'd-flex flex-column site-container active-cont' : 'd-flex flex-column site-container'}>
        <ToastContainer position="top-right" limit={1}></ToastContainer>
        <header>
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
                <SearchBox />
                <Nav className="me-auto w-100 justify-content-end">
                  <Link to="/cart" className="nav-link">
                    Cart
                    {cart.cartItems.length > 0 && (
                      <Badge pill bg="danger">
                        {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                      </Badge>
                    )}
                  </Link>
                  {
                    userInfo ? (
                      <NavDropdown title={userInfo.username} id="basic-nav-bropdown">
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


                  {userInfo && userInfo.isAdmin && (
                    <NavDropdown title="Admin" id="admin-nav-dropdown">
                      <LinkContainer to="/admin/dashboard">
                        <NavDropdown.Item>Dashboard</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/products">
                        <NavDropdown.Item>Products</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/orders">
                        <NavDropdown.Item>Orders</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/users">
                        <NavDropdown.Item>Users</NavDropdown.Item>
                      </LinkContainer>
                    </NavDropdown>
                  )}

                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </header>

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

              categories.map((category) => {
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

        <main>
          <Container className='p-lg-5'>
            <Routes>
              <Route path="/product/:slug" element={<Productdetails />}></Route>
              <Route path="/" element={<Homepage />}></Route>
              <Route path="/cart" element={<Cart />}></Route>
              <Route path="/search" element={<SearchPage />}></Route>
              <Route path="/Signin" element={<Signin />}></Route>
              <Route path="/Signup" element={<Signup />}></Route>
              <Route path="/admin/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>}></Route>
              <Route path="/admin/products" element={<AdminRoute><ProductListPage /></AdminRoute>}></Route>
              <Route path="/admin/addproduct" element={<AdminRoute><CreateProductPage /></AdminRoute>}></Route>
              <Route path="/admin/orders" element={<AdminRoute><OrderList /></AdminRoute>}></Route>
              <Route path="/admin/users" element={<AdminRoute><UserList /></AdminRoute>}></Route>
              <Route path="/admin/user/:id" element={<AdminRoute><EditUser /></AdminRoute>}></Route>

              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>}></Route>
              <Route path="/shipping" element={<ShippingAddress />}></Route>
              <Route path="/payment" element={<Paymentmethodpage />}></Route>
              <Route path="/placeholder" element={<Placeorder />}></Route>
              <Route path="/orders/:id" element={<ProtectedRoute><Orderpage /></ProtectedRoute>}></Route>
              <Route path="/orderhistory" element={<ProtectedRoute><OrderHistory /></ProtectedRoute>}></Route>
              <Route path="/admin/product/:id" element={<AdminRoute><EditproductPage /></AdminRoute>}></Route>
            </Routes>
          </Container>
        </main>
        {/* Footer */}
        <div className="Footer">
          <div className="container">
            <div className="row">
              <div className="col-md-6 col-lg-5 col-12 ft-1">
                <h3 className='text-white'><span >VIBES</span>CART</h3>
                <p className='text-white'>100% ORIGINAL guarantee for all products at vibescart.com Return within 14days of receiving your order</p>
                <div className="footer-icons">
                  <a href='https://www.facebook.com/'> <i class="fa-brands fa-facebook"></i></a>
                  <a href='https://twitter.com/?lang=en-in' ><i class="fa-brands fa-twitter"></i></a>
                  <a href='https://www.instagram.com/?hl=en' > <i class="fa-brands fa-instagram"></i></a>
                  <a href='https://www.linkedin.com/feed/'> <i class="fa-brands fa-linkedin-in"></i></a>
                </div>
              </div>
              <div className="col-md-6 col-lg-3 col-12 ft-2">
                <h5>Get to Know Us</h5>
                <ul>
                  <li className="nav-item">
                    <a className="text-white" href="/">About us </a>
                  </li>
                  <li className="nav-item">
                    <a className="text-white" href="/">Careers</a>
                  </li>
                  <li className="nav-item">
                    <a className="text-white" href="/">Press Release</a>
                  </li>
                  <li className="nav-item">
                    <a className="text-white" href="/">Policies</a>
                  </li>
                  <li className="nav-item">
                    <a className="text-white" href="/">Investor</a>
                  </li>
                </ul>
              </div>
              <div className="col-md-6 col-lg-4 col-12 ft-3">
                <h5>Help Us</h5>
                <p className="text-white"><i class="fa-solid fa-phone-volume"></i> Help Center</p>
                <p className="text-white"><i class="fa-solid fa-envelope"></i> Mail us</p>
                <p className="text-white"><i class="fa-solid fa-paper-plane"></i> Contact Us</p>
              </div>
            </div>
          </div>
        </div>
        <div className='Last-footer'>
          <p>Design By Avinash</p>
        </div>

        






      </div>



    </BrowserRouter>
  );
}

export default App;