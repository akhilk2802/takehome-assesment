import React, { useState, useEffect } from "react";
import "../styles/css/CompanyDetails.css";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { Card, Button, ListGroup, Container } from "react-bootstrap";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const CompanyDetails = () => {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [locations, setLocations] = useState([]);

  console.log("id:", id);

  // const fetchData = () => {
  //   axios
  //     .get(`http://127.0.0.1:8000/companies/${id}/`)
  //     .then((response) => {
  //       setCompany(response.data);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching data from API 1:", error);
  //     });

  //   axios
  //     .get(`http://127.0.0.1:8000/companies/${id}/locations/`)
  //     .then((response) => {
  //       setLocations(response.data);
  //       console.log(locations);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching data from API 2:", error);
  //     });
  // };

  useEffect(() => {
    let isMounted = true;
    axios
      .get(`http://127.0.0.1:8000/companies/${id}/`)
      .then((response) => {
        if (isMounted) {
          console.log("company detail: ", response.data);
          setCompany(response.data);
        }
      })
      .catch((error) => {
        if (isMounted) {
          console.error(
            "There was an error fetching the company details!",
            error
          );
        }
      });

    axios
      .get(`http://127.0.0.1:8000/companies/${id}/locations/`)
      .then((response) => {
        if (isMounted) {
          setLocations(response.data);
          console.log("locations :", locations);
        }
        // console.log("locations: ", response.data);
      })
      .catch((error) => {
        if (isMounted) {
          console.error(
            "There was an error fetching the company locations!",
            error
          );
        }
      });
  }, [id]);

  useEffect(() => {
    console.log("locations updated: ", locations);
  }, [locations]);

  return (
    <>
      <Container>
        <Container className="company-details-heading">
          <h1>Company Details</h1>
        </Container>
        <Container className="company-details-body">
          <Button
            as={Link}
            to="/companyList"
            variant="secondary"
            className="mb-3"
          >
            Back to List
          </Button>
          {company && (
            <Card>
              <Card.Body>
                <Card.Title>{company.name}</Card.Title>
                <Card.Text>{company.address}</Card.Text>
              </Card.Body>
            </Card>
          )}
          {locations.length > 0 && (
            <>
              <h2>Locations</h2>
              <MapContainer
                center={[locations[0].latitude, locations[0].longitude]}
                zoom={13}
                style={{ height: "400px", width: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {locations.map((location) => (
                  <Marker
                    key={location.location_id}
                    position={[location.latitude, location.longitude]}
                  >
                    <Popup>
                      {location.name} <br /> {location.address}
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
              <ListGroup className="mt-3">
                {locations.map((location) => (
                  <ListGroup.Item key={location.id}>
                    <strong>{location.name}</strong>
                    <br />
                    {location.address}
                    <br />
                    Latitude: {location.latitude}, Longitude:{" "}
                    {location.longitude}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </>
          )}
        </Container>
      </Container>
    </>
  );
};
export default CompanyDetails;
