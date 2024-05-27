import React, { useContext, useEffect, useReducer } from 'react'
import LoadingBox from '../Components/LodingBox'
import MessageBox from '../Components/MessageBox';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Store } from '../Redux/Store';
import axios from 'axios';
import { API_URL } from '../config.js';
import { Helmet } from 'react-helmet-async';
import Row from 'react-bootstrap/esm/Row.js';
import { getError } from '../Components/utils.js';
import Col from 'react-bootstrap/esm/Col';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import { toast } from 'react-toastify';


const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true, error: '' };
        case 'FETCH_SUCCESS':
            return { ...state, order: action.payload, loading: false, error: '' };
        case 'FETCH_ERROR':
            return { ...state, error: action.payload, loading: false };
        case 'PAY_REQUEST':
            return {...state,loadingPay:true};
        case 'PAY_SUCCESS':
            return {...state,loadingPay:false,successPay:true};
        case 'PAY_FAIL':
            return {...state,loadingPay:false};
        case 'PAY_RESET':
            return {...state,loadingPay:false,successPay:false};
        default:
            return state;
    }

}


function Orderpage() {
    const Navigate = useNavigate();
    const { state } = useContext(Store);
    const { userInfo } = state;

    const params = useParams();
    const { id: orderId } = params;


    const [{ loading, error, order , successPay , loadingPay }, dispatch] = useReducer(reducer, {
        loading: true,
        order: {},
        error: '',
        successPay:false,
        loadingPay:false,
    });
    const [{isPending},paypalDispatch]=usePayPalScriptReducer();

    function createOrder(data,actions){
        return actions.order.create({
            purchase_units:[
                {
                    amount:{value:order.totalprice},
                },
            ],
        }).then((orderId)=>{
            return orderId;
        });
   }


    function onApprove( data ,action){
        return action.order.capture().then(async function(details){
            try{
                dispatch({type:'PAY_REQUEST'});
                const { data }=await axios.put(`api/orders/${order._id}/pay`,
                details,
                {
                    headers: {
                        authorization: `Bearer ${userInfo.token}`
                    },

                }
                );
                dispatch({type:'PAY_SUCCESS',payload:data});
                toast.success('Order is paid');

            }catch(err){
                dispatch({type:'PAY_FAIL',payload:getError(err)});
                toast.error(getError(err));
            }
        })
    }
    function onError(err){
        toast.error(getError(err));
    }

    useEffect(() => {

        const fetchOrder = async () => {
            try {
                dispatch({ type: 'FETCH_REQUEST' });
                const { data } = await axios.get(API_URL + '/orders/' + orderId, {
                    headers: {
                        authorization: `Bearer ${userInfo.token}`
                    },
                });
                console.log("Data......", data);
                dispatch({ type: 'FETCH_SUCCESS', payload: data });
            }
            catch (err) {
                dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
            }

        }
        if (!userInfo) {
            return Navigate('/login');
        }
        if ( !order._id ||successPay|| (order._id && order._id !== orderId) ) {
            fetchOrder();
            if(successPay){
                dispatch({type: 'PAY_RESET'});
            }
        } 
        else {

            const loadPayPalScript = async () => {
                try {
                    const { data: clientId } = await axios.get(API_URL+'/keys/paypal', {
                        headers: {
                            authorization: `Bearer ${userInfo.token}`
                        },
                    });
                    paypalDispatch({
                        type: 'resetOptions',
                        value: {
                            clientId: clientId,
                            currency: 'USD',
                        },
                    });
                    paypalDispatch({
                        type: 'setLoadingStatus',
                        value: 'pending' 
                    });
                } catch (error) {
                    console.error('Error loading PayPal script:', error);
                    // Handle error gracefully
                }
            }
            
            
            

            loadPayPalScript();
        }
    }, [order, orderId, userInfo, Navigate,paypalDispatch,successPay])

    return (

        loading ? (
            (<LoadingBox></LoadingBox>)
        ) : error ? (
            <MessageBox variant='danger'>{error}</MessageBox>
        ) : (
            <div>
                <Helmet>
                    <title>Order {orderId}</title>
                </Helmet>
                <h1 className='my-3'> Order {orderId}</h1>
                <Row>
                    <Col md={8}>
                        <Card className='mb-3'>

                            <Card.Body>
                                <Card.Title>Shipping</Card.Title>
                                <Card.Text>
                                   
                                    <b>Name:</b>{order.shippingAddress && order.shippingAddress.fullname}<br />
                                    <b>Address:</b>{order.shippingAddress && order.shippingAddress.Address},
                                    {order.shippingAddress && order.shippingAddress.City},
                                    {order.shippingAddress && order.shippingAddress.postal},
                                    {order.shippingAddress && order.shippingAddress.country}



                                </Card.Text>
                                {order.isDelivered ? (<MessageBox variant='success'>Delivered at {order.deliveredAt}</MessageBox>) :
                                    (<MessageBox variant='danger'>not Delivered</MessageBox>)}
                                <Link to='/shipping'>Edit</Link>

                            </Card.Body>


                        </Card>

                        <Card className='mb-3'>
                            <Card.Body>
                                <Card.Title>Payment</Card.Title>
                                <Card.Text>
                                    <b>Method:</b>{order.paymentMethod}
                                </Card.Text>

                                {
                                    order.ispaid ? (
                                        <MessageBox variant='success'>
                                            paid at {order.paidAt}
                                        </MessageBox>
                                    ) : (
                                        <MessageBox variant='danger'>Not Paid</MessageBox>
                                    )
                                }

                            </Card.Body>
                        </Card>
                        <Card className='mb-3'>
                            <Card.Body>
                                <Card.Title>Items</Card.Title>
                                <ListGroup.Item variant='flush'>
                                    {
                                        order.orderItems.map((item) => {
                                            return (
                                                <ListGroup.Item key={item._id}>
                                                    <Row className='align-items-center'>
                                                        <Col md={6}>
                                                            <img src={item.image} alt={item.name}
                                                                className='img-fluid rounded img-thumbnails'
                                                            ></img>{' '}
                                                            <Link to={`/product/${item.slug}`}>{item.name}</Link>
                                                        </Col>
                                                        <Col md={3}>
                                                            <span>{item.quantity}</span>
                                                        </Col>
                                                        <Col md={3}>${item.price}</Col>
                                                    </Row>
                                                </ListGroup.Item>
                                            )
                                        }


                                        )
                                    }
                                </ListGroup.Item>
                            </Card.Body>
                        </Card>

                    </Col>
                    <Col md={4}>
                        <Card className='mb-3'>
                            <Card.Body>
                                <Card.Title>Order Summary</Card.Title>
                                <ListGroup variant='flush'>
                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Items</Col>
                                            <Col>${order.itemprice.toFixed(2)}</Col>
                                        </Row>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Shipping</Col>
                                            <Col>${order.shippingprice.toFixed(2)}</Col>
                                        </Row>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Tax</Col>
                                            <Col>${order.taxprice.toFixed(2)}</Col>
                                        </Row>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <Row>
                                            <Col>
                                                <b>Order Total</b>
                                            </Col>
                                            <Col>
                                                <b>${order.totalprice.toFixed(2)}</b>
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                    {
                                            !order.isPaid && (
                                                <ListGroup.Item>
                                                    {isPending ? (<LoadingBox />) :
                                                    (<div>
                                                        <PayPalButtons createOrder={createOrder}
                                                        onApprove={onApprove}
                                                        onError={onError}></PayPalButtons>
                                                    </div>)
                                                    }
                                                    {loadingPay && <LoadingBox></LoadingBox>}
                                                </ListGroup.Item>
                                            )
                                        }
                                  
                                </ListGroup>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </div>
        )


    )
}

export default Orderpage
