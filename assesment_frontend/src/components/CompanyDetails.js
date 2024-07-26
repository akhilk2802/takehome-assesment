import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "../styles/css/CompanyDetails.css";
import {
  Container,
  Card,
  Button,
  Tabs,
  Tab,
  Alert,
  Spinner,
} from "react-bootstrap";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const CompanyDetails = () => {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabLoading, setTabLoading] = useState(false);
  const [error, setError] = useState(null);

  const companiesURL = `http://127.0.0.1:8000/companies/${id}/`;
  const locationsURL = `http://127.0.0.1:8000/companies/${id}/locations/`;

  useEffect(() => {
    const abortController = new AbortController();

    const fetchData = async () => {
      try {
        setLoading(true);
        const [companyResponse, locationsResponse] = await Promise.all([
          axios.get(companiesURL, {
            signal: abortController.signal,
          }),
          axios.get(locationsURL, {
            signal: abortController.signal,
          }),
        ]);

        const companyData = companyResponse.data;
        const locationsData = locationsResponse.data;

        if (
          companyData &&
          typeof companyData.name === "string" &&
          typeof companyData.address === "string"
        ) {
          setCompany(companyData);
        } else {
          setError("Invalid company data received");
        }

        if (
          Array.isArray(locationsData) &&
          locationsData.every(
            (location) =>
              typeof location.name === "string" &&
              typeof location.address === "string" &&
              typeof location.latitude === "number" &&
              typeof location.longitude === "number"
          )
        ) {
          setLocations(locationsData);
        } else {
          setError("Invalid locations data received");
        }
      } catch (err) {
        if (axios.isCancel(err)) {
          console.log("Request canceled", err.message);
        } else if (err.response) {
          setError(`Error: ${err.response.status} - ${err.response.data}`);
        } else if (err.request) {
          setError("Error: Network error. Please try again later.");
        } else {
          setError(`Error: ${err.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      abortController.abort(); // Cancel the request on component unmount
    };
  }, [id]);

  const handleSelect = async (key) => {
    setTabLoading(true);
    // Simulate fetching data for the selected tab
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setTabLoading(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Container className="company-details">
      <Container className="company-details-heading">
        <h1>Company Details</h1>
      </Container>
      <Container className="company-details-body">
        <Button as={Link} to="/" variant="secondary" className="mb-3">
          Back to List
        </Button>
        {company && (
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>{company.name}</Card.Title>
              <Card.Text>{company.address}</Card.Text>
            </Card.Body>
          </Card>
        )}
        {locations.length > 0 && (
          <Tabs
            defaultActiveKey={locations[0].location_id}
            id="location-tabs"
            onSelect={handleSelect}
          >
            {locations.map((location) => (
              <Tab
                eventKey={location.location_id}
                title={location.name}
                key={location.location_id}
              >
                {tabLoading ? (
                  <div className="d-flex justify-content-center my-3">
                    <Spinner animation="border" role="status" />
                  </div>
                ) : (
                  <Card className="mb-3">
                    <Card.Body>
                      <Card.Title>{location.name}</Card.Title>
                      <Card.Text>
                        <strong>Address:</strong> {location.address}
                        <br />
                        <strong>Latitude:</strong> {location.latitude}
                        <br />
                        <strong>Longitude:</strong> {location.longitude}
                      </Card.Text>
                      <MapContainer
                        center={[location.latitude, location.longitude]}
                        zoom={13}
                        style={{ height: "400px", width: "100%" }}
                      >
                        <TileLayer
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        <Marker
                          position={[location.latitude, location.longitude]}
                        >
                          <Popup>
                            {location.name} <br /> {location.address}
                          </Popup>
                        </Marker>
                      </MapContainer>
                    </Card.Body>
                  </Card>
                )}
              </Tab>
            ))}
          </Tabs>
        )}
      </Container>
    </Container>
  );
};

export default CompanyDetails;
