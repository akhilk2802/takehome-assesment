from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
import os
import csv
from django.conf import settings

class CompanyLocationAPITests(TestCase):
    
    def setUp(self):
        self.client = APIClient()
        self.companies_url = "/companies/"
        self.company_detail_url = "/companies/{}/"
        self.company_locations_url = "/companies/{}/locations/"
        
        self.data_dir = os.path.join(settings.BASE_DIR, "data")
        self.companies_file = os.path.join(self.data_dir, "companies.csv")
        self.locations_file = os.path.join(self.data_dir, "locations.csv")
        
        # Create data directory if it does not exist
        if not os.path.exists(self.data_dir):
            os.makedirs(self.data_dir)
        
        # Write sample data to companies.csv
        with open(self.companies_file, 'w', newline='') as file:
            writer = csv.DictWriter(file, fieldnames=["company_id", "name", "address", "latitude", "longitude"])
            writer.writeheader()
            writer.writerow({"company_id": 1, "name": "Company A", "address": "Address A", "latitude": 12.34, "longitude": 56.78})
            writer.writerow({"company_id": 2, "name": "Company B", "address": "Address B", "latitude": 23.45, "longitude": 67.89})
        
        # Write sample data to locations.csv
        with open(self.locations_file, 'w', newline='') as file:
            writer = csv.DictWriter(file, fieldnames=["location_id", "company_id", "name", "address", "latitude", "longitude"])
            writer.writeheader()
            writer.writerow({"location_id": 1, "company_id": 1, "name": "Location A1", "address": "Address A1", "latitude": 12.34, "longitude": 56.78})
            writer.writerow({"location_id": 2, "company_id": 1, "name": "Location A2", "address": "Address A2", "latitude": 12.34, "longitude": 56.78})

    def tearDown(self):
        # Remove files if they exist
        if os.path.exists(self.companies_file):
            os.remove(self.companies_file)
        if os.path.exists(self.locations_file):
            os.remove(self.locations_file)

    def test_get_all_companies_success(self):
        response = self.client.get(self.companies_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_get_all_companies_no_data(self):
        if os.path.exists(self.companies_file):
            os.remove(self.companies_file)
        response = self.client.get(self.companies_url)
        self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)

    def test_get_company_detail_success(self):
        response = self.client.get(self.company_detail_url.format(1))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['company_id'], 1)
        self.assertEqual(response.data['name'], "Company A")

    def test_get_company_detail_not_found(self):
        response = self.client.get(self.company_detail_url.format(3))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data['error'], "Company not found")

    def test_get_company_locations_success(self):
        response = self.client.get(self.company_locations_url.format(1))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_get_company_locations_not_found(self):
        response = self.client.get(self.company_locations_url.format(2))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data['error'], "No locations found for this company")

    def test_readCSV_file_not_found(self):
        if os.path.exists(self.companies_file):
            os.remove(self.companies_file)
        response = self.client.get(self.companies_url)
        self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)
        self.assertEqual(response.data['error'], "Error reading the data from the given path")
