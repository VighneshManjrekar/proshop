import { Button, Table } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { FaTimes, FaEye } from "react-icons/fa";
import dateFormat from "dateformat";

import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { useGetAllOrdersQuery } from "../../slices/orderApiSlice";

const OrderlistScreen = () => {
  const { data, isLoading, isError, error } = useGetAllOrdersQuery();
  return (
    <>
      <h1>Orders</h1>
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Message variant="danger">{error.data?.message}</Message>
      ) : (
        <Table striped hover responsive className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Date</th>
              <th>Total</th>
              <th>Paid</th>
              <th>Delivered</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {data.orders.map((order, id) => (
              <tr key={id}>
                <td>{order._id}</td>
                <td>{order.user && order.user.name}</td>
                <td>{dateFormat(order.createdAt, "d/m/yyyy")}</td>
                <td>{order.totalPrice}</td>
                <td>
                  {order.isPaid ? (
                    dateFormat(order.paidAt, "d/m/yyyy")
                  ) : (
                    <FaTimes style={{ color: "red" }} />
                  )}
                </td>
                <td>
                  {order.isDelivered ? (
                    dateFormat(order.deliveredAt, "d/m/yyyy")
                  ) : (
                    <FaTimes style={{ color: "red" }} />
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
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default OrderlistScreen;
