import { useParams, Link } from "react-router-dom";
import { Row, Col, Image, ListGroup, Card, Button } from "react-bootstrap";

import { useGetProductQuery } from "../slices/productApiSlice";
import Rating from "../components/Rating";
import Loader from "../components/Loader";
import Message from "../components/Message";

const ProductScreen = () => {
  const { id: productId } = useParams();
  const { data, error, isError, isLoading } = useGetProductQuery(productId);
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
                        <ListGroup.Item>
                          <Button
                            className="btn-value"
                            type="button"
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
