import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Row,
  Col,
  Image,
  ListGroup,
  Card,
  Button,
  Form,
} from "react-bootstrap";
import { useDispatch } from "react-redux";

import { useGetProductQuery } from "../slices/productApiSlice";
import { addToCart } from "../slices/cartSlice";

import Rating from "../components/Rating";
import Loader from "../components/Loader";
import Message from "../components/Message";

const ProductScreen = () => {
  const { id: productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { data, error, isError, isLoading } = useGetProductQuery(productId);

  const [qty, setQty] = useState(1);
  const addToCartHandler = () => {
    dispatch(
      addToCart({
        ...data.product,
        qty,
      })
    );
    navigate("/cart");
  };

  return (
    <>
      <Link className="btn btn-light my-3" to="/">
        Go Back
      </Link>
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Message>{error.data?.message || error.error}</Message>
      ) : (
        <>
          {data.product?.name ? (
            <Row>
              <Col xl lg={6} className="mb-3">
                <Image
                  src={data.product.image}
                  alt={`${data.product.name} image`}
                  fluid
                />
              </Col>
              <Col xl lg={6}>
                <Row>
                  <Col lg={10} md={12}>
                    <ListGroup.Item>
                      <h3>{data.product.name}</h3>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <Rating
                        value={data.product.rating}
                        text={`${data.product.numReviews} reviews.`}
                      />
                    </ListGroup.Item>
                    <ListGroup.Item>{data.product.description}</ListGroup.Item>
                    {/* <ListGroup.Item>Price: ₹ {data.product.price}</ListGroup.Item> */}
                  </Col>
                  <Col className="my-3" md={7} lg={10}>
                    <Card>
                      <ListGroup variant="flush">
                        <ListGroup.Item>
                          <Row>
                            <Col>Price:</Col>
                            <Col>
                              <strong>₹ {data.product.price}</strong>
                            </Col>
                          </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                          <Row>
                            <Col>Status:</Col>
                            <Col>
                              <strong>
                                {data.product.countInStock > 0
                                  ? "In Stock"
                                  : "Out of Stock"}
                              </strong>
                            </Col>
                          </Row>
                        </ListGroup.Item>
                        {data.product.countInStock > 0 ? (
                          <ListGroup.Item>
                            <Row>
                              <Col>Qty</Col>
                              <Col>
                                <Form.Control
                                  as="select"
                                  value={qty}
                                  onChange={(e) =>
                                    setQty(Number(e.target.value))
                                  }
                                >
                                  {Array.from({
                                    length: data.product.countInStock,
                                  }).map((_, x) => (
                                    <option key={x + 1} value={x + 1}>
                                      {x + 1}
                                    </option>
                                  ))}
                                </Form.Control>
                              </Col>
                            </Row>
                          </ListGroup.Item>
                        ) : (
                          <></>
                        )}
                        <ListGroup.Item>
                          <Button
                            className="btn-value"
                            type="button"
                            onClick={addToCartHandler}
                            disabled={data.product.countInStock === 0}
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
      )}
    </>
  );
};

export default ProductScreen;
