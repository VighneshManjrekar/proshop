import axios from "axios";
import { useEffect, useState } from "react";
import { useParams,Link } from "react-router-dom";
import { Row, Col, Image, ListGroup, Card, Button } from "react-bootstrap";

import Rating from "../components/Rating";

const ProductScreen = () => {
  const { id: productId } = useParams();
  const [product, setProduct] = useState({});
  
  useEffect(() => {
    const fetchProduct = async () => {
      const { data } = await axios.get(`/api/products/${productId}`);
      setProduct(data.product);
    };
    fetchProduct();
  }, [productId]);
  
  return (
    <>
      <Link className="btn btn-light my-3" to="/">
        Go Back
      </Link>
      {product?.name ? (
        <Row>
          <Col xl lg={6} className="mb-3">
            <Image src={product.image} alt={`${product.name} image`} fluid />
          </Col>
          <Col xl lg={6}>
            <Row>
              <Col lg={10} md={12}>
                <ListGroup.Item>
                  <h3>{product.name}</h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Rating
                    value={product.rating}
                    text={`${product.numReviews} reviews.`}
                  />
                </ListGroup.Item>
                <ListGroup.Item>{product.description}</ListGroup.Item>
                {/* <ListGroup.Item>Price: ₹ {product.price}</ListGroup.Item> */}
              </Col>
              <Col className="my-3" md={7} lg={10}>
                <Card>
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      <Row>
                        <Col>Price:</Col>
                        <Col>
                          <strong>₹ {product.price}</strong>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <Row>
                        <Col>Status:</Col>
                        <Col>
                          <strong>
                            {product.countInStock > 0
                              ? "In Stock"
                              : "Out of Stock"}
                          </strong>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <Button
                        className="btn-value"
                        type="button"
                        disabled={product.countInStock === 0}
                      >
                        Add to Cart
                      </Button>
                    </ListGroup.Item>
                  </ListGroup>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      ) : (
        <div>Invalid Product id</div>
      )}
    </>
  );
};

export default ProductScreen;
