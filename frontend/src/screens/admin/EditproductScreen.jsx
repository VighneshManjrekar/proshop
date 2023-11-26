import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Form, FormGroup, Button } from "react-bootstrap";

import {
  useGetProductQuery,
  useUpdateProductMutation,
} from "../../slices/productApiSlice";
import FormContainer from "../../components/FormContainer";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { toast } from "react-toastify";

const EditproductScreen = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [countInStock, setCountInStock] = useState("");
  const [description, setDescription] = useState("");

  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const { data, isLoading, isError, error, refetch } =
    useGetProductQuery(productId);

  useEffect(() => {
    if (data?.product) {
      setName(data?.product.name);
      setPrice(data?.product.price);
      setImage(data?.product.image);
      setBrand(data?.product.brand);
      setCategory(data?.product.category);
      setCountInStock(data?.product.countInStock);
      setDescription(data?.product.description);
    }
  }, [data?.product]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await updateProduct({
        name,
        price,
        image,
        brand,
        category,
        countInStock,
        description,
        productId,
      }).unwrap();
      if (!res.success) {
        toast.error(res.data.message);
      }
      toast.success("Product Updated");
      navigate("/admin/products");
    } catch (err) {
      console.log(err);
      toast.error(err.data.message)
    }
  };

  return (
    <>
      <Link to="/admin/products" className="btn btn-light my-3">
        Go Back
      </Link>
      <FormContainer>
        <h1>Edit Product</h1>
        {isUpdating && <Loader />}
        {isLoading ? (
          <Loader />
        ) : isError ? (
          <Message variant="danger">{error.data?.message}</Message>
        ) : (
          <Form onSubmit={handleSubmit}>
            <FormGroup controlId="name" className="my-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={name}
                placeholder="Product name"
                onChange={(e) => setName(e.target.value)}
              />
            </FormGroup>
            <FormGroup controlId="price" className="my-3">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                value={price}
                placeholder="Product price"
                onChange={(e) => setPrice(e.target.value)}
              />
            </FormGroup>
            {/* Image input placeholder */}
            <FormGroup controlId="brand" className="my-3">
              <Form.Label>Brand</Form.Label>
              <Form.Control
                type="text"
                value={brand}
                placeholder="Product brand"
                onChange={(e) => setBrand(e.target.value)}
              />
            </FormGroup>
            <FormGroup controlId="countInStock" className="my-3">
              <Form.Label>Count In Stock</Form.Label>
              <Form.Control
                type="number"
                value={countInStock}
                placeholder="Count In Stock"
                onChange={(e) => setCountInStock(e.target.value)}
              />
            </FormGroup>
            <FormGroup controlId="description" className="my-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                value={description}
                placeholder="Product description"
                onChange={(e) => setDescription(e.target.value)}
              />
            </FormGroup>
            <Button type="submit" variant="primary" className="my-2">
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default EditproductScreen;
