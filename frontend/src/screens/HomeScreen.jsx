import axios from "axios";
import { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";

import Product from "../components/Product";

const HomeScreen = () => {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await axios.get("/api/products");
      console.log(data.products);
      setProducts(data.products);
    };
    fetchProducts();
  }, []);
  return (
    <>
      <h1>Latest Products</h1>
      <Row className="justify-content-center justify-content-lg-start">
        {products.map((product) => (
          <Col xs={10} sm={8} md={6} lg={4} xl={3} key={product._id}>
            <Product product={product} />
          </Col>
        ))}
      </Row>
    </>
  );
};

export default HomeScreen;
