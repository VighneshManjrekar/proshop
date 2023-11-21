import { Row, Col } from "react-bootstrap";

import Product from "../components/Product";
import { useGetProductsQuery } from "../slices/productApiSlice";

const HomeScreen = () => {
  const { data, isLoading, isError, error } = useGetProductsQuery();
  return (
    <>
      {isLoading ? (
        <h2>Loading...</h2>
      ) : isError ? (
        <div>{error}</div>
      ) : (
        <>
          <h1>Latest Products</h1>
          <Row className="justify-content-center justify-content-lg-start">
            {data.products.map((product) => (
              <Col xs={10} sm={8} md={6} lg={4} xl={3} key={product._id}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
        </>
      )}
    </>
  );
};

export default HomeScreen;
