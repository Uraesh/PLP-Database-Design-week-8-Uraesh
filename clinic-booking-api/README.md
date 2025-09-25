# Clinic Booking API

This is the API for a clinic booking application.

## Prerequisites

* Node.js (v14 or later)
* npm

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```bash
   cd clinic-booking-api
   ```
3. Install the dependencies:
   ```bash
   npm install
   ```

## Running the Project

To start the server, run the following command:

```bash
npm start
```

The server will start on the default port (usually 3000). To run the server in development mode with auto-reloading, use:

```bash
npm run dev
```

## API Endpoints

The base URL for all API endpoints is `/api`.

### Doctors

| Method | Description | Endpoint |
| --- | --- | --- |
| `GET` | Get all doctors | `/doctors` |
| `GET` | Get a single doctor by ID | `/doctors/:id` |
| `POST` | Create a new doctor | `/doctors` |
| `PUT` | Update a doctor | `/doctors/:id` |
| `DELETE` | Delete a doctor | `/doctors/:id` |
| `GET` | Get doctors by specialization | `/doctors/specialization/:specializationId` |

### Patients

| Method | Description | Endpoint |
| --- | --- | --- |
| `GET` | Get all patients | `/patients` |
| `GET` | Get a single patient by ID | `/patients/:id` |
| `POST` | Create a new patient | `/patients` |
| `PUT` | Update a patient | `/patients/:id` |
| `DELETE` | Delete a patient | `/patients/:id` |

### Appointments

| Method | Description | Endpoint |
| --- | --- | --- |
| `GET` | Get all appointments | `/appointments` |
| `GET` | Get a single appointment by ID | `/appointments/:id` |
| `POST` | Create a new appointment | `/appointments` |
| `PUT` | Update an appointment | `/appointments/:id` |
| `DELETE` | Delete an appointment | `/appointments/:id` |
| `GET` | Get all appointments for a patient | `/appointments/patient/:patientId` |
| `GET` | Get all appointments for a doctor | `/appointments/doctor/:doctorId` |