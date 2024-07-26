import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <>
      <h1>Take Home assesment - Supply Trace</h1>
      <div>
        <h2>click for companyList</h2>
        <Link to="/companyList">
          <Button variant="primary">Click</Button>
        </Link>
      </div>
      <div>
        <h2>click for companyDetails</h2>
        <Link to="/companyDetails">
          <Button variant="primary">Click</Button>
        </Link>
      </div>
    </>
  );
};
export default Home;
