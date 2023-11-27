import { Link } from "react-router-dom";
import { Carousel, Image } from "react-bootstrap";

import Loader from "./Loader";
import Message from "./Message";

import { useGetTopProductQuery } from "../slices/productApiSlice";

const Productcarousel = () => {
  const { data, isLoading, isError, error } = useGetTopProductQuery();
  return isLoading ? (
    <Loader />
  ) : isError ? (
    <Message variant="danger">{error.data?.message}</Message>
  ) : (
    <Carousel pause="hover" className="bg-primary mb-4">
      {data.products.map((x, id) => (
        <Carousel.Item key={id}>
          <Link to={`/product/${x._id}`}>
            <Image src={x.image} alt={`${x.name} product image`} />
            <Carousel.Caption className="carousel-caption">{`${x.name} ${x.price}`}</Carousel.Caption>
          </Link>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default Productcarousel;
