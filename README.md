# Course Content Upload System

A full-stack web application for uploading, managing, and downloading course content files. Built with Spring Boot (backend) and React (frontend), secured with JWT authentication.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Setup and Installation](#setup-and-installation)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)

## Features

- User registration and login with JWT authentication
- File upload with drag-and-drop support
- Client-side file validation (type and size)
- Real-time upload progress tracking
- File listing with metadata (name, size, type, date)
- File download
- File deletion
- Responsive dashboard UI
- Protected routes requiring authentication

## Tech Stack

### Backend

- Java 17
- Spring Boot 3.5
- Spring Security with JWT (JJWT)
- Spring Data JPA
- PostgreSQL
- Maven

### Frontend

- React 19
- Redux Toolkit (state management)
- React Router DOM (routing)
- Axios (HTTP client)
- Tailwind CSS (styling)
- Vite (build tool)

## Prerequisites

Before running this project, ensure you have the following installed:

- Java 17 or higher
- Node.js 18 or higher
- npm
- PostgreSQL 14 or higher

## Project Structure

```
silverline-test/
├── backend/                     # Spring Boot application
│   ├── src/main/java/com/courseupload/
│   │   ├── config/              # CORS and Security configuration
│   │   ├── controller/          # REST controllers (Auth, File)
│   │   ├── dto/                 # Data Transfer Objects
│   │   ├── exception/           # Custom exceptions and handlers
│   │   ├── model/               # JPA entities (User, FileMetadata)
│   │   ├── repository/          # Spring Data JPA repositories
│   │   ├── security/            # JWT utilities, filters, UserDetails
│   │   └── service/             # Business logic
│   └── src/main/resources/
│       └── application.properties
├── frontend/                    # React application
│   ├── src/
│   │   ├── app/                 # Redux store
│   │   ├── components/          # Layout, Navbar
│   │   ├── features/            # Redux slices (auth, files)
│   │   ├── pages/               # Login, Register, Upload, Files
│   │   └── utils/               # Axios config, file validation
│   └── .env
├── prd.md                       # Product Requirements Document
└── README.md
```

## Setup and Installation

### 1. Database Setup

Create a PostgreSQL database:

```sql
CREATE DATABASE silverlineupload;
```

If your PostgreSQL credentials differ from the defaults, update `backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/silverlineupload
spring.datasource.username=your_username
spring.datasource.password=your_password
```

### 2. Backend Setup

```bash
cd backend
./mvnw clean install -DskipTests
```

### 3. Frontend Setup

```bash
cd frontend
cp .env.example .env    # Then edit .env if needed
npm install
```

## Running the Application

### Start the Backend

```bash
cd backend
./mvnw spring-boot:run
```

The backend server will start on `http://localhost:8080`.

### Start the Frontend

```bash
cd frontend
npm run dev
```

The frontend dev server will start on `http://localhost:5173`.

### Access the Application

Open your browser and navigate to `http://localhost:5173`. You will be redirected to the login page. Create an account using the Register link, then log in to access the dashboard.

## API Endpoints

### Authentication

| Method | Endpoint             | Description         | Auth Required |
| ------ | -------------------- | ------------------- | ------------- |
| POST   | `/api/auth/register` | Register a new user | No            |
| POST   | `/api/auth/login`    | Login and get JWT   | No            |

### File Management

| Method | Endpoint                   | Description             | Auth Required |
| ------ | -------------------------- | ----------------------- | ------------- |
| POST   | `/api/files/upload`        | Upload a file           | Yes           |
| GET    | `/api/files`               | List all files          | Yes           |
| GET    | `/api/files/{id}`          | Get file metadata by ID | Yes           |
| GET    | `/api/files/{id}/download` | Download a file         | Yes           |
| DELETE | `/api/files/{id}`          | Delete a file           | Yes           |

### File Upload Constraints

- Maximum file size: 50MB
- Allowed file types: PDF, MP4, JPEG, PNG

## Environment Variables

### Backend (`application.properties`)

| Variable                     | Description                    | Default                                             |
| ---------------------------- | ------------------------------ | --------------------------------------------------- |
| `spring.datasource.url`      | PostgreSQL connection URL      | `jdbc:postgresql://localhost:5432/silverlineupload` |
| `spring.datasource.username` | Database username              | `postgres`                                          |
| `spring.datasource.password` | Database password              | -                                                   |
| `file.upload-dir`            | Local file storage directory   | `uploads/`                                          |
| `server.port`                | Backend server port            | `8080`                                              |
| `app.jwt.secret`             | JWT signing secret key         | -                                                   |
| `app.jwt.expirationMs`       | JWT expiration in milliseconds | `86400000` (24 hours)                               |

### Frontend (`.env`)

| Variable            | Description          | Default                 |
| ------------------- | -------------------- | ----------------------- |
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:8080` |
