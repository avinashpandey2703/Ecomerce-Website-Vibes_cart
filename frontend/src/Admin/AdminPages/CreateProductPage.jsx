import React, { useContext, useReducer, useState } from 'react'
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../../Components/LodingBox';
import MessageBox from '../../Components/MessageBox';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import { Store } from '../../Redux/Store';
import { API_URL } from '../../config';
import { toast } from 'react-toastify';
import { getError } from '../../Components/utils';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_SUCCESS':
            return { ...state, loading: false };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };
          case 'ADD_REQUEST':
            return { ...state, loadingUpdate: true };
          case 'ADD_SUCCESS':
            return { ...state, loadingUpdate: false };
          case 'ADD_FAIL':
            return { ...state, loadingUpdate: false };

        default:
            return state;
    }
};

function CreateProductPage() {
    const navigate = useNavigate();
    const { state } = useContext(Store);
    const { userInfo } = state;
    const [{ loading, error, loadingUpdate }, dispatch] =
        useReducer(reducer, {
            loading: false,
            error: '',
        });
    const [name, setProduct_name] = useState('');
    const [slug, setSlug] = useState('');
    const [price, setProduct_Price] = useState('');
    const [image, setProduct_image] = useState('');
    const [category, setCategory] = useState('');
    const [countInStock, setCount_InStock] = useState('');
    const [brand, setBrand] = useState('');
    const [description, setDescription] = useState('');
    
    const submitHandler = async (e) => {
        e.preventDefault();
        try {
          dispatch({ type: 'ADD_REQUEST' });
          await axios.post(
            `${API_URL}/admin/addproduct`,
            {
              name,
              slug,
              price,
              image,
              category,
              brand,
              countInStock,
              description,
            },
            {
              headers: { Authorization: `Bearer ${userInfo.token}` },
            }
          );
          dispatch({
            type: 'ADD_SUCCESS',
          });
          toast.success('Product added successfully');
          navigate('/admin/products');
        } catch (err) {
          toast.error(getError(err));
          dispatch({ type: 'ADD_FAIL' });
        }
      };

    return (
        <div>
            <Container className="small-container">
                <Helmet>
                    <title>Add Product</title>
                </Helmet>
                <h1>Add New Product</h1>

                {loading ? (
                    <LoadingBox></LoadingBox>
                ) : error ? (
                    <MessageBox variant="danger">{error}</MessageBox>
                ) : (
                    <Form onSubmit={submitHandler}>
                        <Form.Group className="mb-3" controlId="name">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                value={name}
                                onChange={(e) => setProduct_name(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="slug">
                            <Form.Label>Slug</Form.Label>
                            <Form.Control
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="price">
                            <Form.Label>price</Form.Label>
                            <Form.Control
                                value={price}
                                onChange={(e) => setProduct_Price(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="image">
                            <Form.Label>Image File</Form.Label>
                            <Form.Control
                                value={image}
                                onChange={(e) => setProduct_image(e.target.value)}
                                required
                            />
                        </Form.Group>
                       

                        <Form.Group className="mb-3" controlId="category">
                            <Form.Label>Category</Form.Label>
                            <Form.Control
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="brand">
                            <Form.Label>Brand</Form.Label>
                            <Form.Control
                                value={brand}
                                onChange={(e) => setBrand(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="countInStock">
                            <Form.Label>Count In Stock</Form.Label>
                            <Form.Control
                                value={countInStock}
                                onChange={(e) => setCount_InStock(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId=" description">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <div className="mb-3">
                            <Button disabled={loadingUpdate} type="submit">
                                Add Product
                            </Button>
                            {loadingUpdate && <LoadingBox></LoadingBox>}
                        </div>
                    </Form>
                )}
            </Container>
        </div>
    )
}

export default CreateProductPage