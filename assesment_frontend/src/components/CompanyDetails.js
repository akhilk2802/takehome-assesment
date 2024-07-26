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
} from "react-bootstrap"; // react-bootstrap
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"; // leaflet
import "leaflet/dist/leaflet.css";

const CompanyDetails = () => {
  const { id } = useParams(); // company id parameter, to fetch the right data, using React router's useParams
  const [company, setCompany] = useState(null); // stores the details of a company
  const [locations, setLocations] = useState([]); // stores the locations of a company
  const [loading, setLoading] = useState(true); // State to handle the loading state of the main data fetch
  const [tabLoading, setTabLoading] = useState(false); // State to handle the loading state for tab changes or additional data fetches
  const [error, setError] = useState(null); // Stores the error message

  const companiesURL = `http://127.0.0.1:8000/companies/${id}/`; // // API Endpoint to fetch the details of a specific company by its ID
  const locationsURL = `http://127.0.0.1:8000/companies/${id}/locations/`; // API Endpoint to fetch the list of locations for a specific company by its ID

  // Using useEffect Hook to make API Calls since i am using a dependency, which is the id of a company
  useEffect(() => {
    const abortController = new AbortController(); // AbortController to cancel the request if the component is not mounted
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
          // Validating companyData and locationData before setting the Company and Location states, else set error with error message
          companyData &&
          typeof companyData.name === "string" &&
          typeof companyData.address === "string"
        ) {
          setCompany(companyData);
        } else {
          setError("Invalid company data received");
        }
        // Validate and store locations, else set error with error message
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
        // Handle errors from the axios request
        if (axios.isCancel(err)) {
          // If the request was canceled, log a message to the console
          console.log("Request canceled", err.message);
        } else if (err.response) {
          // If the server responded with a status code outside the 2xx range,
          // set an error message with the status code and response data
          setError(`Error: ${err.response.status} - ${err.response.data}`);
        } else if (err.request) {
          // If the request was made but no response was received, likely a network error
          setError("Error: Network error. Please try again later.");
        } else {
          // For any other errors (e.g., issues with the request setup)
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
    // If there is delay in fetching data from companies endpoint, if renders a different page or content
    return (
      <Container>
        <Spinner animation="border" role="status" />
      </Container>
    );
  }

  if (error) {
    // If there is error in fetching data from companies endpoint, if renders a error message
    return <Container>Error: {error}</Container>;
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
        {/* Only render if there is a company selected  */}
        {company && (
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>{company.name}</Card.Title>
              <Card.Text>{company.address}</Card.Text>
            </Card.Body>
          </Card>
        )}
        {/* Only Render if there are other locations */}
        {locations.length > 0 && (
          // using a tab UI
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
