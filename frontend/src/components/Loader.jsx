import { Spinner } from "react-bootstrap";

const Loader = () => {
  return (
    <Spinner
      animation="border"
      role="status"
      style={{
        width: "70px",
        height: "70px",
        margin: "50px auto",
        display: "block",
      }}
    />
  );
};

export default Loader;
