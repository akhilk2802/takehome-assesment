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
} from "react-bootstrap";

const CompanyList = () => {
  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/companies/")
      .then((response) => {
        setCompanies(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error Fetching data ", error);
      });
  }, []);

  const filteredCompanies = companies.filter((company) =>
    company.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Container className="comapny-list">
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
        <Row>
          {filteredCompanies.map((company) => (
            <Col
              sm={12}
              md={6}
              lg={4}
              key={company.company_id}
              className="mb-3"
            >
              <Card>
                <Card.Body>
                  <Card.Title>{company.name}</Card.Title>
                  <Card.Text>{company.description}</Card.Text>
                  <Button
                    as={Link}
                    to={`/companyDetails/${company.company_id}`}
                    variant="primary"
                  >
                    View Details
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </Container>
  );
};
export default CompanyList;
