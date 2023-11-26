import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Form, FormGroup, Button } from "react-bootstrap";

import {
  useGetProductQuery,
  useUpdateProductMutation,
  useUploadProductImageMutation,
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
  const [uploadProductImage, { isLoading: isUploadingImage }] =
    useUploadProductImageMutation();
  const { data, isLoading, isError, error, refetch } =
    useGetProductQuery(productId);

  let product = undefined;
  if (!isLoading) product = data.product;

  useEffect(() => {
    if (product) {
      setName(product.name);
      setPrice(product.price);
      setImage(product.image);
      setBrand(product.brand);
      setCategory(product.category);
      setCountInStock(product.countInStock);
      setDescription(product.description);
    }
  }, [product]);

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
      refetch();
      navigate("/admin/products");
    } catch (err) {
      console.log(err);
      toast.error(err.data.message);
    }
  };

  const handleFileUpload = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success("Image uploaded successfully");
      setImage(res.image);
    } catch (err) {
      console.log(err);
      toast.error(err.data?.message || err.error);
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
            <FormGroup controlId="image">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter image url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
              />
              <Form.Control
                type="file"
                label="Choose file"
                onChange={handleFileUpload}
              />
            </FormGroup>
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
