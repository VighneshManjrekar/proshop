import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Row,
  Col,
  Image,
  ListGroup,
  Card,
  Button,
  Form,
  ListGroupItem,
  FormGroup,
  FormSelect,
} from "react-bootstrap";
import { toast } from "react-toastify";
import dateFormat from "dateformat";

import {
  useGetProductQuery,
  useCreateReviewMutation,
} from "../slices/productApiSlice";
import { addToCart } from "../slices/cartSlice";

import Rating from "../components/Rating";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Meta from "../components/Meta";

const ProductScreen = () => {
  const { id: productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { data, error, isError, isLoading, refetch } =
    useGetProductQuery(productId);
  const [postReview, { isLoading: isPosting }] = useCreateReviewMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isReviewed, setIsReviewed] = useState(false);

  useEffect(() => {
    setIsReviewed(
      data?.product.reviews.find(
        (r) => r.user.toString() == userInfo._id.toString()
      )
    );
  }, [data?.product, userInfo]);

  const addToCartHandler = () => {
    dispatch(
      addToCart({
        ...data.product,
        qty,
      })
    );
    navigate("/cart");
  };

  const handlePostReview = async (e) => {
    e.preventDefault();
    try {
      await postReview({ rating, comment, productId });
      refetch();
      toast.success("Review Posted");
    } catch (err) {
      console.log(err);
      toast.error(err.data?.message || "Error occured");
    }
  };

  return (
    <>
      <Link className="btn btn-light my-3" to="/">
        Go Back
      </Link>
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Message variant="danger">{error.data?.message || error.error}</Message>
      ) : (
        <>
          <Meta
            title={data.product.name}
            description={data.product.description}
          />
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
          <Row className="review">
            <Col md={6}>
              <h2>Reviews</h2>
              {data.product?.numReviews.length == 0 && (
                <Message>No Reviews</Message>
              )}
              <ListGroup variant="flush">
                {data.product.reviews.map((r, id) => (
                  <ListGroupItem key={id}>
                    <strong>{r.name}</strong>
                    <Rating value={r.rating} />
                    <p>{dateFormat(r.createdAt, "fullDate")}</p>
                    <p>{r.comment}</p>
                  </ListGroupItem>
                ))}
                <ListGroupItem>
                  <h2>Wrtie a Review</h2>
                  {isPosting && <Loader />}
                  {!userInfo ? (
                    <Message>
                      Please <Link to="/login">login</Link> to write a review.
                    </Message>
                  ) : isReviewed ? (
                    <Message>Already Reviewed</Message>
                  ) : (
                    <Form onSubmit={handlePostReview}>
                      <FormGroup controlId="rating" className="my-2">
                        <FormSelect
                          value={rating}
                          onChange={(e) => setRating(Number(e.target.value))}
                        >
                          <option value="0" disabled>
                            Select...
                          </option>
                          <option value="1">1 - Poor</option>
                          <option value="2">2 - Fair</option>
                          <option value="3">3 - Good</option>
                          <option value="4">4 - Very Good</option>
                          <option value="5">5 - Excellent</option>
                        </FormSelect>
                      </FormGroup>
                      <FormGroup controlId="comment">
                        <Form.Control
                          as="textarea"
                          row="3"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        />
                      </FormGroup>
                      <Button
                        disabled={isPosting}
                        type="submit"
                        value="primary"
                      >
                        Post Review
                      </Button>
                    </Form>
                  )}
                </ListGroupItem>
              </ListGroup>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default ProductScreen;
