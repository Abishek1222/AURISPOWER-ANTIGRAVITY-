# Aurispower

Aurispower is a comprehensive monitoring and sustainability system designed to simulate and analyze electrical data, detect anomalies, and provide actionable insights for industrial environments.

## Features

- **Multi-Zone Monitoring**: Real-time tracking of electrical parameters across multiple zones.
- **Anomaly Detection**: ML-based detection of irregularities in power consumption.
- **Sustainability Analysis**: Eco-impact metrics and sustainability scoring.
- **Fault Injection**: Simulation of various electrical faults for testing and training.
- **Responsive Dashboard**: Modern UI for visualizing data and managing alerts.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) (Recommended)
- [Node.js](https://nodejs.org/) (v18+ for local development)
- [Python](https://www.python.org/) (v3.9+ for local development)

## Quick Start (Docker)

The easiest way to run the application is using Docker Compose.

1.  **Clone the repository** (if you haven't already):
    ```bash
    git clone <repository-url>
    cd AURISPOWER(ANTIGRAVITY)
    ```

2.  **Start the application**:
    ```bash
    docker-compose up -d --build
    ```
    This command builds the images and starts the backend and frontend containers.

3.  **Access the application**:
    - **Frontend**: [http://localhost:5174](http://localhost:5174)
    - **Backend API**: [http://localhost:8000](http://localhost:8000)
    - **API Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)

4.  **Stop the application**:
    ```bash
    docker-compose down
    ```

## Running Locally

If you prefer to run the backend and frontend separately without Docker:

### Backend

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```

2.  Create and activate a virtual environment:
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```

3.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```

4.  Start the backend server:
    ```bash
    uvicorn main:app --reload --host 0.0.0.0 --port 8000
    ```
    The API will be available at `http://localhost:8000`.

### Frontend

1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Start the development server:
    ```bash
    npm run dev
    ```
    The frontend will be available at `http://localhost:5173` (or the port shown in the terminal).

## Usage

- **Login**: Use default credentials (if enabled) or access the dashboard directly.
- **Dashboard**: View live data from different zones.
- **Fault Simulation**: Use the API or UI controls to inject faults and observe system behavior.

## Technologies Used

- **Backend**: FastAPI, WebSocket, Scikit-learn, Pandas
- **Frontend**: React, Vite, Tailwind CSS, Chart.js
- **Containerization**: Docker, Docker Compose
