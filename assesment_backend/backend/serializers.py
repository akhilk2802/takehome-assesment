from rest_framework import serializers 

class CompanySerializer(serializers.Serializer):
    company_id = serializers.IntegerField()
    name = serializers.CharField(max_length=100)
    address = serializers.CharField(max_length=255)
    latitude = serializers.FloatField()
    longitude = serializers.FloatField()

class LocationSerializer(serializers.Serializer):
    location_id = serializers.IntegerField()
    company_id = serializers.IntegerField()
    name = serializers.CharField(max_length=100)
    address = serializers.CharField(max_length=255)
    latitude = serializers.FloatField()
    longitude = serializers.FloatField()