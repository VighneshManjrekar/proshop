import { Form, Link, useParams } from "react-router-dom";
import {
  Button,
  Card,
  Col,
  ListGroup,
  ListGroupItem,
  Row,
  Image,
} from "react-bootstrap";

import Message from "../components/Message";
import Loader from "../components/Loader";

import { useGetOrderDetailsQuery } from "../slices/orderApiSlice";

const OrderScreen = () => {
  const { id: orderId } = useParams();

  const { data, isLoading, isError, refetch, error } =
    useGetOrderDetailsQuery(orderId);

  return isLoading ? (
    <Loader />
  ) : isError ? (
    <Message variant="danger">{error.data?.message}</Message>
  ) : (
    <>
      <h1>Order {data.order._id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroupItem>
              <h2>Shipping</h2>
              <p>
                <strong>Name: {data.order.user.name}</strong>
              </p>
              <p>
                <strong>Email: {data.order.user.email}</strong>
              </p>
              <p>
                <strong>
                  Address:
                  {` ${data.order.shippingAddress.address}, ${data.order.shippingAddress.city},
                ${data.order.shippingAddress.country}
                ${data.order.shippingAddress.postalCode}`}
                </strong>
              </p>
              {data.order.isDelivered ? (
                <Message variant="success">
                  Delivered on {data.order.deliveredAt}
                </Message>
              ) : (
                <Message variant="danger">Not Delivered</Message>
              )}
            </ListGroupItem>
            <ListGroupItem>
              <h2>Payment Method</h2>
              <p>
                <strong>Method {data.order.paymentMethod}</strong>
              </p>
              {data.order.isPaid ? (
                <Message variant="success">Paid on {data.order.paidAt}</Message>
              ) : (
                <Message variant="danger">Not Paid</Message>
              )}
            </ListGroupItem>
            <ListGroupItem>
              <h2>Order Items</h2>
              {data.order.orderItems.map((item, index) => (
                <ListGroupItem key={index}>
                  <Row>
                    <Col md={1}>
                      <Image
                        src={item.image}
                        alt={`${item.name} image`}
                        fluid
                        rounded
                      />
                    </Col>
                    <Col>
                      <Link to={`/product/${item._id}`}>{item.name}</Link>
                    </Col>
                    <Col md={4}>
                      {item.qty} x ₹{item.price.toFixed(2)} = ₹
                      {(item.qty * item.price).toFixed(2)}
                    </Col>
                  </Row>
                </ListGroupItem>
              ))}
            </ListGroupItem>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroupItem>
                <h2>Order Summary</h2>
              </ListGroupItem>
              <ListGroupItem>
                <Row>
                  <Col>Items: </Col>
                  <Col>₹ {data.order.itemsPrice}</Col>
                </Row>
              </ListGroupItem>
              <ListGroupItem>
                <Row>
                  <Col>Shipping: </Col>
                  <Col>₹ {data.order.shippingPrice}</Col>
                </Row>
              </ListGroupItem>
              <ListGroupItem>
                <Row>
                  <Col>Tax: </Col>
                  <Col>₹ {data.order.taxPrice}</Col>
                </Row>
              </ListGroupItem>
              <ListGroupItem>
                <Row>
                  <Col>Total: </Col>
                  <Col>₹ {data.order.totalPrice}</Col>
                </Row>
              </ListGroupItem>
              {error && (
                <ListGroupItem>
                  <Message variant="danger">{error}</Message>
                </ListGroupItem>
              )}
              {/* Pay order placeorder */}
              {/* Mark as delivered placeholder */}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default OrderScreen;
