import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import CompanyList from "./CompanyList";

const mock = new MockAdapter(axios);

const companies = [
  { company_id: 1, name: "Company A", address: "Address A" },
  { company_id: 2, name: "Company B", address: "Address B" },
];

describe("CompanyList", () => {
  beforeEach(() => {
    mock.reset();
  });

  test("renders company list", async () => {
    mock.onGet("http://127.0.0.1:8000/companies/").reply(200, companies);

    render(<CompanyList />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();

    const companyA = await screen.findByText("Company A");
    const companyB = await screen.findByText("Company B");

    expect(companyA).toBeInTheDocument();
    expect(companyB).toBeInTheDocument();
  });

  test("filters company list based on search input", async () => {
    mock.onGet("http://127.0.0.1:8000/companies/").reply(200, companies);

    render(<CompanyList />);

    const searchInput = screen.getByPlaceholderText("Search Companies");
    fireEvent.change(searchInput, { target: { value: "Company B" } });

    const companyB = await screen.findByText("Company B");
    expect(companyB).toBeInTheDocument();
    expect(screen.queryByText("Company A")).not.toBeInTheDocument();
  });

  test("handles error fetching companies", async () => {
    mock.onGet("http://127.0.0.1:8000/companies/").reply(500);

    render(<CompanyList />);

    const errorAlert = await screen.findByText(
      "Failed to fetch companies. Please try again later."
    );
    expect(errorAlert).toBeInTheDocument();
  });
});
