from django.shortcuts import render
import csv
import os
import logging
from rest_framework.decorators import api_view # decorator for API_VIEW
from rest_framework.response import Response 
from rest_framework import status
from django.conf import settings

from .serializers import CompanySerializer, LocationSerializer

logger = logging.getLogger(__name__) # Logger Setup, saves all the logs to debug.log

def readCSV(file_name): # Method to read CSV file with filename, returns the data
    csv_path = os.path.join(settings.BASE_DIR, "data" ,file_name)
    # print("CSV :", csv_path)
    if not os.path.exists(csv_path):
        logger.error(f"CSV file not found: {csv_path}")
        return None
    try:
        with open(csv_path, 'r') as f:
            reader = csv.DictReader(f)
            data = [row for row in reader]
            if not data:
                logger.warning(f"CSV file is empty: {csv_path}")
                return []
            return data
    except Exception as e:
        # print(e)
        logger.error(f"Error reading CSV file: {csv_path} - {e}")
        return None

@api_view(['GET'])
def get_all_companies(request): # Method to fetch details of all the companies
    companies_data = readCSV("companies.csv")
    if companies_data is None:
        return Response({"error":"Error reading the data from the given path"}, status = status.HTTP_500_INTERNAL_SERVER_ERROR)
    if not companies_data:
        return Response({"error": "No companies found"}, status=status.HTTP_404_NOT_FOUND)
    serializer = CompanySerializer(companies_data, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK) 

@api_view(['GET'])
def get_company_detail(request, company_id): # Method to fetch details of specific company based on its company_id
    
    companies_data = readCSV("companies.csv")
    if companies_data is None:
        return Response({"error":"Error reading the data from the given path"}, status = status.HTTP_500_INTERNAL_SERVER_ERRORx)
    if not companies_data:
        return Response({"error": "No companies found"}, status=status.HTTP_404_NOT_FOUND)

    company = next((c for c in companies_data if int(c['company_id']) == company_id), None)
    if company is None:
        return Response({"error": "Company not found"}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = CompanySerializer(company)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_company_locations(request, company_id): # Method to fetch all locations of a company based on its company_id
    locations_data = readCSV("locations.csv")
    if locations_data is None:
        return Response({"error":"Error reading the data from the given path"}, status = status.HTTP_500_INTERNAL_SERVER_ERROR)
    if not locations_data:
        return Response({"error": "No locations found"}, status=status.HTTP_404_NOT_FOUND)
    
    company_locations = [loc for loc in locations_data if int(loc['company_id']) == company_id]
    # print("company locations :", company_locations)

    if not company_locations:
        return Response({"error": "No locations found for this company"}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = LocationSerializer(company_locations, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)
