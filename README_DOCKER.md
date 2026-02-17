# Docker Deployment Guide for Aurispower

This guide explains how to run the Aurispower application on any device using Docker.

## Prerequisites

- **Docker**: [Install Docker](https://docs.docker.com/get-docker/)
- **Docker Compose**: Included with Docker Desktop or installed separately.

## Quick Start

1.  **Navigate to the project directory**:
    ```bash
    cd /path/to/project
    ```

2.  **Start the application**:
    ```bash
    docker-compose up -d --build
    ```
    This command builds the images and starts the containers in the background.

3.  **Access the application**:
    - **Frontend**: Open your browser and go to `http://localhost:5174` (or `http://<your-device-ip>:5174` from another device).
    - **Backend API**: Accessible at `http://localhost:8000`.
    - **API Docs**: `http://localhost:8000/docs`

## Login Credentials

Use the following default credentials to log in:

- **Username**: `admin`
- **Password**: `admin123`

## Troubleshooting

- **Ports in use**: If port `8000` or `5174` is already in use, edit `docker-compose.yml` and change the mapping (e.g., `"5175:80"`).
- **Backend connection failed**: Ensure the backend container is running (`docker-compose ps`). The frontend attempts to connect to the backend on port `8000` relative to your browser's address.

## Stopping the Application

To stop the containers:
```bash
docker-compose down
```
