"""
URL configuration for assesment_backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin

from rest_framework import permissions
from drf_yasg.views import get_schema_view # using drf_yasg for documentation
from drf_yasg import openapi

from django.urls import path
from backend.views import get_all_companies, get_company_detail, get_company_locations

schema_view = get_schema_view( # Documentation setup
    openapi.Info(
        title="API Documentation",
        default_version='v1',
        description="API documentation for the CSV data endpoints",
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [

    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'), # Swagger Documentation 
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),

    path("admin/", admin.site.urls),
    path("companies/", get_all_companies, name="company-list"), # end-point to fetch all the companies from CSV file 
    path("companies/<int:company_id>/", get_company_detail, name="company-detail"), # end-point to fetch the detail of a specific company with its respective company_id
    path("companies/<int:company_id>/locations/", get_company_locations, name="company-locations") # end-point to fetch the list of all the locations of a specific company based on its id

]
