import React, { useState, useEffect } from "react";
import "../styles/css/CompanyList.css";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Card,
  InputGroup,
  FormControl,
  Button,
  Row,
  Col,
  OverlayTrigger,
  Tooltip,
  Alert,
  Spinner,
} from "react-bootstrap";

const CompanyList = () => {
  const [companies, setCompanies] = useState([]); // State to store the list of companies
  const [search, setSearch] = useState(""); // State to store the search input
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [error, setError] = useState(null); // Stores error messages

  const companiesURL = "http://127.0.0.1:8000/companies/"; // API Endpoint to fetch the list of companies

  // useEffect hook to fetch companies data when the component mounts
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        // Fetch companies data from the API
        const response = await axios.get(companiesURL);
        const data = response.data;

        // Check if the data is an array and set it to state
        if (Array.isArray(data)) {
          setCompanies(data);
        } else {
          throw new Error("Invalid data format");
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
        // Set error message in case of a failure
        setError("Failed to fetch companies. Please try again.");
      } finally {
        // Set loading state to false after the data is fetched or an error occurs
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  // Filter companies based on the search input
  const filteredCompanies = companies.filter((company) =>
    company.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Container className="company-list">
      <Container className="company-list-heading">
        <h1>Company List</h1>
      </Container>

      <Container className="company-list-body">
        <InputGroup className="mb-3">
          <FormControl
            placeholder="Search Companies"
            aria-label="Search"
            onChange={(e) => setSearch(e.target.value)}
          />
        </InputGroup>
        <hr className="section-divider" />
        {loading ? (
          <div className="d-flex justify-content-center my-3">
            <Spinner animation="border" role="status">
              <span className="sr-only">Loading...</span>
            </Spinner>
          </div>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : filteredCompanies.length > 0 ? (
          <Row>
            {filteredCompanies.map((company) => (
              <Col
                sm={12}
                md={6}
                lg={4}
                key={company.company_id}
                className="mb-3"
              >
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip>Click to view details</Tooltip>}
                >
                  <Link
                    to={`/companyDetails/${company.company_id}`}
                    className="card-link"
                  >
                    <Card className="company-card">
                      <Card.Body>
                        <Card.Title>{company.name}</Card.Title>
                        <Card.Text>{company.address}</Card.Text>
                      </Card.Body>
                    </Card>
                  </Link>
                </OverlayTrigger>
              </Col>
            ))}
          </Row>
        ) : (
          <Alert variant="info">No such companies found. try other name</Alert>
        )}
      </Container>
    </Container>
  );
};

export default CompanyList;
