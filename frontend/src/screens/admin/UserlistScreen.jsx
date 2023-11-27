import {
  useGetUsersQuery,
  useDeleteUserMutation,
} from "../../slices/usersApiSlice";
import { Table, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { FaTimes, FaTrash, FaEdit, FaCheck } from "react-icons/fa";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { toast } from "react-toastify";

const UserlistScreen = () => {
  const { data, isLoading, isError, error, refetch } = useGetUsersQuery();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure?")) {
      try {
        const res = await deleteUser(userId);
        refetch();
        res.error
          ? toast.error(res.error.data.message)
          : toast.success("User Deleted");
      } catch (err) {
        console.log(err);
        toast.error(err);
      }
    }
  };

  return (
    <>
      <h1>Users</h1>
      {isDeleting && <Loader />}
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Message variant="danger">{error.data?.message}</Message>
      ) : (
        <>
          <Table striped hover responsive className="table-sm">
            <thead>
              <tr>
                <th>Id</th>
                <th>Name</th>
                <th>Email</th>
                <th>isAdmin</th>
                <th>Modify</th>
              </tr>
            </thead>
            <tbody>
              {data.users.map((user, id) => (
                <tr key={id}>
                  <td>{user._id}</td>
                  <td>{user.name}</td>
                  <td>
                    <Link to={`mailto:${user.email}`}>{user.email}</Link>
                  </td>
                  <td>
                    {user.isAdmin ? (
                      <FaCheck color="green" />
                    ) : (
                      <FaTimes color="red" />
                    )}
                  </td>
                  <td>
                    <LinkContainer to={`/admin/user/${user._id}/edit`}>
                      <Button variant="secondary" className="btn-sm">
                        <FaEdit color="white" />
                      </Button>
                    </LinkContainer>
                    <Button
                      variant="danger"
                      className="btn-sm ms-2"
                      onClick={() => handleDelete(user._id)}
                    >
                      <FaTrash color="white" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </>
  );
};

export default UserlistScreen;
