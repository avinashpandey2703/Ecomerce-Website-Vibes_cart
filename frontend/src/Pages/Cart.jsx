import React, { useContext } from 'react'
import { Store } from '../Redux/Store.js';
import { Helmet } from 'react-helmet-async';
import MessageBox from '../Components/MessageBox.jsx';
// React-bootstrap components
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config.js';
import { useNavigate } from 'react-router-dom'



const Cart = () => {
    const { state, dispatch: ctxDispatch } = useContext(Store);
    const { cart: { cartItems } } = state;
    //const { userInfo: { userInfo } } = state;

 const updateCartHandler=async(item,quantity)=>{
  
    const {data} = await axios.get(API_URL + "/products/" + item._id);
    if (data.countInStock < quantity) {
        window.alert("Sorry!  Product is out of Stock")
        return;
    }
    ctxDispatch({ type: 'CART_ADD_ITEM', payload: { ...item, quantity } })
    
 }


 const removeItemhandler = (item) => {
    console.log('Removing item:', item);
    ctxDispatch({ type: 'CART_REMOVE_ITEM', payload: item });
};

const navigate = useNavigate();
const checkoutHandler=()=>{
   
    navigate('/signin?redirect=/shipping');

}



    return (
        <div>
            <Helmet>
                <title>Shopping cart</title>
            </Helmet>
            <h1>Shopping Cart</h1>
            <Row>
                <Col md={7}>
                    {
                        cartItems.length === 0 ? (
                            <MessageBox>
                               Cart is empty <Link to='/'>Go Shopping</Link>
                           </MessageBox>
                       ):
                       (
                        <ListGroup> 
                            {
                                cartItems.map((item)=>{
                                    return(
                                        <ListGroup.Item key={item._id}>
                                            <Row className="align-item-center">
                                            <Col md={4}>
                                            <img src={item.image} alt={item.name} className='img-fluid rounded img-thumbnail' style={{height:"100px"}}/>
                                            <Link to={`/product/${item.slug}`}>{item.name}</Link>
                                            </Col>
                                            <Col md={3}>
                                                <Button variant="light" disabled={item.quantity ===1} onClick={()=>updateCartHandler(item,item.quantity-1)}>
                                                <i className='fas fa-minus-circle'></i>
                                                </Button>
                                                <span>{item.quantity}</span>
                                                <Button variant="light" disabled={item.quantity ===item.countInStock} onClick={()=>updateCartHandler(item,item.quantity+1)}>
                                                <i className='fas fa-plus-circle'></i>
                                                </Button>
                                            </Col>
                                            <Col md={3}>{item.price}</Col>
                                            <Col md={2}>
                                            <Button variant="light"  onClick={()=>removeItemhandler(item)}>
                                                <i className='fas fa-trash'></i>
                                                </Button>
                                            </Col>
                                            </Row>
                                        </ListGroup.Item>
                                    )
                                })
                            }
                        </ListGroup>
                       )
                    }
                </Col>
                <Col md={5}>
                    <Card>
                        <Card.Body>
                            <ListGroup variant='flush'>
                            <ListGroup.Item>
                                <h3>
                                    Subtotal ({cartItems.reduce((itemcount,c)=>itemcount+c.quantity,0)}{' '}
                                   items): ₹
                                   {cartItems.reduce((itemcount,c)=>itemcount+c.price*c.quantity,0)}
                                </h3>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <div className='d-grid'>
                                    <Button className='text-dark' type='button' variant='primary' style={{backgroundColor:"goldenrod"}} disabled={cartItems.length===0} onClick={checkoutHandler}>
                                        Proceed to checkout
                                    </Button>
                                </div>
                            </ListGroup.Item>
                            </ListGroup>
                            

                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default Cart