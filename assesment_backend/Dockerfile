# The first instruction is what image we want to base our container on
# We Use an official Python runtime as a parent image
FROM python:latest

# The enviroment variable ensures that the python output is set straight
# to the terminal with out buffering it first
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# create root directory for our project in the container
RUN mkdir /backend_service

# Set the working directory to /backend_service
WORKDIR /backend_service

# Copy the current directory contents into the container at /backend_service
ADD . /backend_service/

# Install any needed packages specified in requirements.txt
RUN pip install -r requirements.txt

# Expose port 8000
EXPOSE 8000

# Command to run the application
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]