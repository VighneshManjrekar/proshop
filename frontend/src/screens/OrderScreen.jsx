import { useSelector } from "react-redux";
import { Form, Link, useParams } from "react-router-dom";
import dateFormat from "dateformat";
import {
  Button,
  Card,
  Col,
  ListGroup,
  ListGroupItem,
  Row,
  Image,
} from "react-bootstrap";
import { toast } from "react-toastify";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";

import Message from "../components/Message";
import Loader from "../components/Loader";

import {
  useGetOrderDetailsQuery,
  useDeliveredOrderMutation,
  useGetPayPalClientIdQuery,
  usePayOrderMutation,
} from "../slices/orderApiSlice";
import { useEffect, useState } from "react";

const OrderScreen = () => {
  const { id: orderId } = useParams();
  const { userInfo } = useSelector((state) => state.auth);
  const [order, setOrder] = useState({});

  const { data, isLoading, isError, refetch, error } =
    useGetOrderDetailsQuery(orderId);
  const [deliveredOrder, { isLoading: deliverLoading }] =
    useDeliveredOrderMutation();
  const [payOrder, { isLoading: isPaying }] = usePayOrderMutation();

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
  const {
    data: paypalData,
    isLoading: isPaypalLoading,
    isError: isPaypalError,
    error: paypalError,
  } = useGetPayPalClientIdQuery();

  useEffect(() => {
    if (data) {
      setOrder(data.order);
    }
    if (!paypalError && !isPaypalLoading && paypalData.clientId) {
      const loadPayPalScript = async () => {
        paypalDispatch({
          type: "resetOptions",
          value: {
            clientId: paypalData.clientId,
            currency: "USD",
          },
        });
        paypalDispatch({ type: "setLoadingStatus", value: "pending" });
      };
      if (order && !order.isPaid) {
        if (!window.paypal) {
          loadPayPalScript();
        }
      }
    }
  }, [data, order, paypalData, paypalDispatch, isPaypalLoading, paypalError]);

  const handleDelivered = async () => {
    try {
      await deliveredOrder(orderId);
      refetch();
      toast.success("Order Delivered");
    } catch (err) {
      console.log(err);
      toast.error(err.data?.message || err.error);
    }
  };

  const onApproveTest = async () => {
    await payOrder({ orderId, details: { payer: {} } });
    refetch();
    toast.success("Payment Successful");
  };

  const onApprove = (data, actions) => {
    return actions.order.capture().then(async function (details) {
      try {
        await payOrder({ orderId, details }).unwrap();
        refetch();
        toast.success("Payment Successful");
      } catch (err) {
        toast.error(err.data?.message || err.message || err.error);
      }
    });
  };
  const onError = (err) => {
    toast.error(err.message);
  };
  const createOrder = (data, actions) => {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: order.totalPrice },
          },
        ],
      })
      .then((orderId) => {
        return orderId;
      });
  };

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
                  Delivered on{" "}
                  {dateFormat(
                    data.order.deliveredAt,
                    "dddd, mmmm dS, yyyy, h:MM:ss TT"
                  )}
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
                <Message variant="success">
                  Paid on{" "}
                  {dateFormat(
                    data.order.paidAt,
                    "dddd, mmmm dS, yyyy, h:MM:ss TT"
                  )}
                </Message>
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
                      <Link to={`/product/${item.product}`}>{item.name}</Link>
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
              {!data.order.isPaid && (
                <ListGroupItem>
                  {isPaypalLoading && order._id && <Loader />}
                  {isPending && order._id ? (
                    <Loader />
                  ) : (
                    <div>
                      {/* <Button
                        onClick={onApproveTest}
                        style={{ marginBottom: "10px" }}
                      >
                        Test Pay Order
                      </Button> */}
                      <div>
                        {order._id && (
                          <PayPalButtons
                            createOrder={createOrder}
                            onApprove={onApprove}
                            onError={onError}
                          />
                        )}
                      </div>
                    </div>
                  )}
                </ListGroupItem>
              )}
              {deliverLoading && <Loader />}
              {userInfo &&
                userInfo.isAdmin &&
                data.order.isPaid &&
                !data.order.isDelivered && (
                  <ListGroupItem>
                    <Button variant="primary" onClick={handleDelivered}>
                      Mark as Delivered
                    </Button>
                  </ListGroupItem>
                )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default OrderScreen;
