import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import CompanyDetails from "./CompanyDetails";

// Create a mock instance of axios
const mock = new MockAdapter(axios);

// Mock data
const companyData = {
  name: "Test Company",
  address: "123 Test St",
};

const locationsData = [
  {
    location_id: 1,
    name: "Location 1",
    address: "123 Test St",
    latitude: 12.34,
    longitude: 56.78,
  },
  {
    location_id: 2,
    name: "Location 2",
    address: "456 Test Ave",
    latitude: 23.45,
    longitude: 67.89,
  },
];

// Set up the mock for the API calls
beforeEach(() => {
  mock.reset();
  mock.onGet("http://127.0.0.1:8000/companies/1/").reply(200, companyData);
  mock
    .onGet("http://127.0.0.1:8000/companies/1/locations/")
    .reply(200, locationsData);
});

// Test suite
describe("CompanyDetails Component", () => {
  test("renders loading spinner initially", () => {
    render(
      <BrowserRouter>
        <CompanyDetails />
      </BrowserRouter>
    );
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  test("renders company details and locations", async () => {
    render(
      <BrowserRouter>
        <CompanyDetails />
      </BrowserRouter>
    );

    // Wait for the API calls to resolve and the component to re-render
    await waitFor(() =>
      expect(screen.getByText("Test Company")).toBeInTheDocument()
    );
    expect(screen.getByText("123 Test St")).toBeInTheDocument();
    expect(screen.getByText("Distance Between Locations")).toBeInTheDocument();
    expect(screen.getByText("Location 1")).toBeInTheDocument();
    expect(screen.getByText("Location 2")).toBeInTheDocument();
  });

  test("renders error message on API failure", async () => {
    // Mock error response
    mock.onGet("http://127.0.0.1:8000/companies/1/").reply(500);

    render(
      <BrowserRouter>
        <CompanyDetails />
      </BrowserRouter>
    );

    // Wait for the API call to fail and the component to re-render
    await waitFor(() => expect(screen.getByText(/Error/)).toBeInTheDocument());
  });
});
