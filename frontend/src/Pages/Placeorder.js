import React, { useContext, useEffect, useReducer } from 'react'
import { Helmet } from 'react-helmet-async'
import ChekoutSteps from '../Components/Checkout';
import { Link, useNavigate } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { Store } from '../Redux/Store.js';
import ListGroup from 'react-bootstrap/ListGroup';
import './Placeorder.css'
import { toast } from 'react-toastify';
import { getError } from '../Components/utils.js';
import { API_URL } from '../config.js';
import axios from 'axios'
import LoadingBox from '../Components/LodingBox.jsx';

const reduce = (state, action) => {
    switch (action.type) {
        case 'CREATE_REQUEST':
            return { ...state, loading: true };
        case 'CREATE_SUCCESS':
            return { ...state, loading: false };
        case 'CREATE_FAIL':
            return { ...state, loading: false };
        default:
            return state;
    }
}

function Placeorder() {
    const Navigate = useNavigate();

    const [{ loading }, dispatch] = useReducer(reduce, {
        loading: false,
        
    });

    const { state, dispatch: ctxDispatch } = useContext(Store);
    const { cart, userInfo } = state;

    const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;
    cart.itemprice = round2(
        cart.cartItems.reduce((sum, c) => sum + c.quantity * c.price, 0)
    );
    cart.shippingprice = cart.itemprice > 100 ? round2(0) : round2(10);
    cart.taxprice = round2(0.15 * cart.itemprice);
    cart.totalprice = cart.itemprice + cart.shippingprice + cart.taxprice;

    const placeorderHandler = async () => {
        try {
            dispatch({ type: 'CREATE_REQUEST' });
            const { data } = await axios.post(API_URL + '/orders', {
                orderItems: cart.cartItems,
                shippingAddress: cart.shippingAddress,
                paymentMethod: cart.paymentMethod,
                itemprice: cart.itemprice,
                shippingprice: cart.shippingprice,
                totalprice: cart.totalprice,
                taxprice:cart.taxprice,
            },
                {
                    headers: {
                        authorization: `Bearer ${userInfo.token}`
                    },
                }
            );
            ctxDispatch({type:'CART_CLEAR'});
            dispatch({type:'CREATE_SUCCESS'});
            localStorage.removeItem('cartItems');
            Navigate(`/orders/${data.order._id}`);

        }
        catch (err) {
            dispatch({ type: 'CREATE_FAIL' });
            toast.error(getError(err));
        }

    }
    useEffect(() => {
        if (!cart.paymentMethod) {
            Navigate('/payment');
        }
    })


    return (
        <div>
            <ChekoutSteps step1 step2 step3 step4></ChekoutSteps>
            <Helmet>
                <title>Preview Order</title>
            </Helmet>
            <h1 className='my-3'>Preview Order</h1>
            <Row>
                <Col md={8}>
                    <Card className='mb-3'>

                        <Card.Body>
                            <Card.Title>Shipping</Card.Title>
                            <Card.Text>
                                <b>Name:</b>{cart.shippingAddress.fullname}<br />
                                <b>Address:</b>{cart.shippingAddress.Address},
                                {cart.shippingAddress.City},
                                {cart.shippingAddress.postal},
                                {cart.shippingAddress.country}


                            </Card.Text>
                            <Link to='/shipping'>Edit</Link>

                        </Card.Body>


                    </Card>
                    <Card className='mb-3'>
                        <Card.Body>
                            <Card.Title>Payment</Card.Title>
                            <Card.Text>
                                <b>Method:</b>{cart.paymentMethod}
                            </Card.Text>
                            <Link to='/payment'>Edit</Link>

                        </Card.Body>
                    </Card>
                    <Card className='mb-3'>
                        <Card.Body>
                            <Card.Title>Items</Card.Title>
                            <ListGroup variant="flush">
                                {cart.cartItems.map((item) => {
                                    return (
                                        <ListGroup.Item key={item._id}>
                                            <Row className='align-item-center'>
                                                <Col md={6}>
                                                    <img src={item.image} alt={item.name}
                                                        className='img-fluid rounded img-thumbnails'
                                                    ></img>{' '}
                                                    <Link to={`/product/${item.slug}`}>{item.name}</Link>
                                                </Col>
                                                <Col md={3}><span>{item.quantity}</span></Col>
                                                <Col md={3}>${item.price}</Col>
                                            </Row>
                                        </ListGroup.Item>

                                    )
                                })}
                            </ListGroup>
                            <Link to="/cart">Edit</Link>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card>
                        <Card.Body>
                            <Card.Title>Order Summary</Card.Title>
                            <ListGroup variant='flush'>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Items</Col>
                                        <Col>${cart.itemprice.toFixed(2)}</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Shipping</Col>
                                        <Col>${cart.shippingprice.toFixed(2)}</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Tax</Col>
                                        <Col>${cart.taxprice.toFixed(2)}</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>
                                            <b>Order Total</b>
                                        </Col>
                                        <Col>
                                            <b>${cart.totalprice.toFixed(2)}</b>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <div className='d-grid'>
                                        <Button type='button' onClick={placeorderHandler} disabled={cart.cartItems.length === 0}>Place Order</Button>
                                    </div>
                                    {loading && <LoadingBox></LoadingBox>}
                                </ListGroup.Item>
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>


            </Row>
        </div>
    )
}

export default Placeorder
