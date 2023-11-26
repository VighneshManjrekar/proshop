import { Button, Col, Row, Table } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { toast } from "react-toastify";
import { FaEdit, FaPlusCircle, FaTrash } from "react-icons/fa";

import {
  useCreateProductMutation,
  useGetProductsQuery,
  useDeleteProductMutation,
} from "../../slices/productApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";

const ProductlistScreen = () => {
  const { data, isLoading, isError, error, refetch } = useGetProductsQuery();

  const [createProduct, { isLoading: isCreateProductLoading }] =
    useCreateProductMutation();

  const [detelProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const handleCreateProduct = async () => {
    if (window.confirm("Add new product?")) {
      try {
        await createProduct().unwrap();
        refetch();
      } catch (err) {
        console.log(err);
        toast.error(err.data?.message);
      }
    }
  };

  const handleDeleteBtn = async (id) => {
    try {
      await detelProduct(id);
      refetch();
    } catch (err) {
      console.log(err);
      toast.error(err.data?.message);
    }
  };

  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className="text-end">
          <Button className="my-3" onClick={handleCreateProduct}>
            <FaPlusCircle style={{ marginBottom: "3px" }} /> Create Product
          </Button>
        </Col>
      </Row>
      {isCreateProductLoading && <Loader />}
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
                <th>Price</th>
                <th>Category</th>
                <th>Brand</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>
              {data.products.map((product, id) => (
                <tr key={id}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>{product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>
                  <td>
                    <LinkContainer to={`/admin/product/${product._id}/edit`}>
                      <Button variant="secondary" className="btn-sm">
                        <FaEdit style={{ color: "white" }} />
                      </Button>
                    </LinkContainer>
                    <Button
                      variant="danger"
                      className="btn-sm ms-2"
                      onClick={() => handleDeleteBtn(product._id)}
                    >
                      <FaTrash style={{ color: "white" }} />
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

export default ProductlistScreen;
