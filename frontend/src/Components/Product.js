import React, { useContext } from 'react'
import { Link } from 'react-router-dom';
// React-bootstrap components
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Rating from './Rating';
import axios from 'axios';
import { API_URL } from '../config.js';
import { useNavigate } from 'react-router-dom'
import { Store } from '../Redux/Store.js';

function Product(props) {
    const { product } = props;
    const { state, dispatch: ctxDispatch } = useContext(Store);
    const { cart: { cartItems }, } = state;

    const addToCartHandler=async(item)=>{
        const Itemfound = cartItems.find(item => item._id === product._id);
        const quantity = Itemfound ? Itemfound.quantity + 1 : 1;
  
        const {data} = await axios.get(API_URL + "/products/" + item._id);
        if (data.countInStock < quantity) {
            window.alert("Sorry!  Product is out of Stock")
            return;
        }
        ctxDispatch({ type: 'CART_ADD_ITEM', payload: { ...item, quantity } })
        
     }

    return (
        <Card className='product'>
            <Link to={`/product/${product.slug}`}>
                <img className='card-img-top' src={product.image} alt={product.name} />
            </Link>
            <Card.Body>
                <Link to={`/product/${product.slug}`}>
                    <Card.Title><p>{product.name}</p></Card.Title>
                </Link>
                {/* rendering Rating Component */}
                <Rating rating={product.rating} numReviews={product.numReviews}/>
                <Card.Text><p><i class="fa-solid fa-indian-rupee-sign"></i> {product.price}</p></Card.Text>
                {product.countInStock===0 ? <Button variant='light' disabled>Out of Stock</Button>:
                
                <Button className='btn-primary text-dark' style={{backgroundColor:"goldenrod"}} onClick={()=>addToCartHandler(product)} >Add cart</Button>
                }
            </Card.Body>
        </Card>
    )
}

export default Product