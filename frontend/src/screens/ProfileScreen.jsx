import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import dateFormat from "dateformat";
import {
  Row,
  Col,
  Form,
  FormGroup,
  FormLabel,
  Button,
  Table,
} from "react-bootstrap";
import { FaTimes, FaEye } from "react-icons/fa";
import { toast } from "react-toastify";

import Loader from "../components/Loader";
import Message from "../components/Message";

import { setCredentials } from "../slices/authSlice";
import { useProfileMutation } from "../slices/usersApiSlice";
import { useGetMyOrderQuery } from "../slices/orderApiSlice";

const ProfileScreen = () => {
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);
  const [updateProfile, { isLoading: isUpdating }] = useProfileMutation();
  const { data, isLoading, isError, error } = useGetMyOrderQuery();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name);
      setEmail(userInfo.email);
    }
  }, [userInfo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password != confirmPassword) {
      return toast.error("Password and Confirm Password don't match");
    } else {
      try {
        const res = await updateProfile({
          name,
          email,
          password,
          _id: userInfo._id,
        }).unwrap();
        dispatch(setCredentials(res.user));
        toast.success("Profile Updated");
      } catch (err) {
        toast.error(err.data?.message || err.error || "Error orccured");
      }
    }
  };

  return (
    <Row>
      <Col md={3}>
        <h2>User Profile</h2>
        <Form onSubmit={handleSubmit}>
          <FormGroup controlId="name" className="my-2">
            <FormLabel>Name</FormLabel>
            <Form.Control
              type="text"
              placeholder="Enter Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </FormGroup>
          <FormGroup controlId="email" className="my-2">
            <FormLabel>Email</FormLabel>
            <Form.Control
              type="text"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormGroup>
          <FormGroup controlId="password" className="my-2">
            <FormLabel>Password</FormLabel>
            <Form.Control
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormGroup>
          <FormGroup controlId="confirmPassword" className="my-2">
            <FormLabel>Confirm Password</FormLabel>
            <Form.Control
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </FormGroup>
          <Button type="submit" variant="primary">
            Update
          </Button>
          {isUpdating && <Loader />}
        </Form>
      </Col>
      <Col md={9}>
        <h2>My Orders</h2>
        {isLoading ? (
          <Loader />
        ) : isError ? (
          <Message variant="danger">{error.data?.message}</Message>
        ) : (
          <Table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Date</th>
                <th>Total</th>
                <th>Paid</th>
                <th>Delivered</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {data.orders ? (
                data.orders.length == 0 ? (
                  <Message>No Orders</Message>
                ) : (
                  data.orders.map((order, id) => (
                    <tr key={id}>
                      <td>{order._id}</td>
                      <td>{dateFormat(order.createdAt, "d/m/yyyy")}</td>
                      <td>₹ {order.totalPrice}</td>
                      <td>
                        {order.isPaid ? (
                          dateFormat(order.paidAt, "d/m/yyyy")
                        ) : (
                          <FaTimes color="red" />
                        )}
                      </td>
                      <td>
                        {order.isDelivered ? (
                          dateFormat(order.deliveredAt, "d/m/yyyy")
                        ) : (
                          <FaTimes color="red" />
                        )}
                      </td>
                      <td>
                        <LinkContainer to={`/order/${order._id}`}>
                          <Button variant="secondary" className="btn-sm">
                            <FaEye style={{ color: "white" }} />
                          </Button>
                        </LinkContainer>
                      </td>
                    </tr>
                  ))
                )
              ) : (
                <Loader />
              )}
            </tbody>
          </Table>
        )}
      </Col>
    </Row>
  );
};

export default ProfileScreen;
