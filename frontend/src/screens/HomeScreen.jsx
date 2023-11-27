import { Row, Col } from "react-bootstrap";
import { useParams } from "react-router-dom";

import { useGetProductsQuery } from "../slices/productApiSlice";
import Product from "../components/Product";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Paginate from "../components/Paginate";

const HomeScreen = () => {
  const { pageNumber } = useParams();
  const { data, isLoading, isError, error } = useGetProductsQuery({
    pageNumber,
  });
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <h1>Latest Products</h1>
          <Row className="justify-content-center justify-content-lg-start">
            {data.products.map((product) => (
              <Col xs={10} sm={8} md={6} lg={4} xl={3} key={product._id}>
                <Product product={product} />
              </Col>
            ))}
            <Paginate
              pages={data.pages.total}
              currentPage={data.pages.current}
            />
          </Row>
        </>
      )}
    </>
  );
};

export default HomeScreen;
