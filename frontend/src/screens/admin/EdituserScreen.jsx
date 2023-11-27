import { useEffect, useState } from "react";
import {
  useGetUserQuery,
  useUpdateUserMutation,
} from "../../slices/usersApiSlice";
import { Link, useNavigate, useParams } from "react-router-dom";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { ListGroup, Form, FormGroup, Button } from "react-bootstrap";
import FormContainer from "../../components/FormContainer";
import { toast } from "react-toastify";

const EdituserScreen = () => {
  const { id: userId } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError, error, refetch } = useGetUserQuery(userId);
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (data?.user) {
      setName(data?.user.name);
      setEmail(data?.user.email);
      setIsAdmin(data?.user.isAdmin);
    }
  }, [data?.user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUser({ name, email, isAdmin, userId });
      toast.success("User updated");
      refetch();
      navigate("/admin/users");
    } catch (err) {
      console.log(err);
      toast.error(err.data?.message);
    }
  };

  return (
    <>
      <Link to="/admin/users" className="btn btn-light my-3">
        Go Back
      </Link>
      <FormContainer>
        <h1>Update user</h1>
        {isUpdating && <Loader />}
        {isLoading ? (
          <Loader />
        ) : isError ? (
          <Message variant="danger">{error.data?.message}</Message>
        ) : (
          <Form onSubmit={handleSubmit}>
            <FormGroup controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={name}
                placeholder="Enter name"
                onChange={(e) => setName(e.target.value)}
              />
            </FormGroup>
            <FormGroup controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                placeholder="Enter email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormGroup>
            <Form.Group controlId="isAdmin">
              <Form.Label>Is Admin</Form.Label>
              <Form.Check
                type="switch"
                id="isAdminSwitch"
                label="Toggle Admin"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="my-2">
              Update user
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default EdituserScreen;
