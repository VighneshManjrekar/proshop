import { Row, Col } from "react-bootstrap";
import { useParams, Link } from "react-router-dom";

import { useGetProductsQuery } from "../slices/productApiSlice";
import Product from "../components/Product";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Paginate from "../components/Paginate";
import Productcarousel from "../components/ProductCarousel";
import Meta from "../components/Meta";

const HomeScreen = () => {
  const { pageNumber, keyword } = useParams();
  const { data, isLoading, isError, error } = useGetProductsQuery({
    pageNumber,
    keyword,
  });
  return (
    <>
      {!keyword ? (
        <Productcarousel />
      ) : (
        <Link to="/" className="btn btn-light mb-4">
          Go Back
        </Link>
      )}
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Meta title="Proshop | Home" />
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
              keyword={keyword}
            />
          </Row>
        </>
      )}
    </>
  );
};

export default HomeScreen;
