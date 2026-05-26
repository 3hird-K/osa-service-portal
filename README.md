# OSA Service Portal

## Overview

OSA Service Portal is a web-based platform designed to digitize the process of assigning and managing community service tasks for students and school administrators.

The system replaces traditional paper-based workflows with a centralized platform that can be accessed anytime and anywhere through both web and mobile devices.

---

## Features

- Authentication and authorization using Clerk
- Community service task assignment
- Attendance and completion tracking
- Announcements and notifications
- Mobile responsive interface
- Admin dashboard management
- Real-time updates
- Push notifications
- Role-based access control

---

## Tech Stack

### Frontend

- Next.js
- Tailwind CSS
- Shadcn UI

### Backend

- FastAPI
- SQLAlchemy

### Authentication

- Clerk

### Database

- Neon PostgreSQL

### Deployment

- Vercel
- Render

---

## System Architecture

```text
+---------------------------+
|       CLIENT SIDE         |
|---------------------------|
|  Next.js Web Application  |
|  Mobile Responsive UI     |
|  Tailwind CSS + Shadcn UI |
+-------------+-------------+
              |
              | HTTPS/API Requests
              v
+---------------------------+
|      BACKEND SERVER       |
|---------------------------|
|      FastAPI REST API     |
|                           |
| Handles:                  |
| - Authentication          |
| - Student Management      |
| - Task Assignments        |
| - Attendance Tracking     |
| - Notifications           |
| - Report Generation       |
| - Role Management         |
+-------------+-------------+
              |
              | Database Queries
              v
+---------------------------+
|         DATABASE          |
|---------------------------|
|      Neon PostgreSQL      |
|                           |
| Stores:                   |
| - User Accounts           |
| - Student Information     |
| - Assigned Tasks          |
| - Service Records         |
| - Announcements           |
| - Completion Reports      |
+---------------------------+
```

---

## Installation

### Clone the Repository

```bash
git clone https://github.com/3hird-k/osa-service-portal.git
cd osa-service-portal
```

---

## Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend runs on:

```text
http://localhost:3000
```

---

## Backend Setup

```bash
cd backend

python -m venv venv
```

### Activate Virtual Environment

#### Windows

```bash
venv\Scripts\activate
```

#### macOS/Linux

```bash
source venv/bin/activate
```

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Run FastAPI Server

```bash
uvicorn main:app --reload
```

Backend runs on:

```text
http://localhost:8000
```

---

## Environment Variables

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=https://server-osa-service.onrender.com
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

### Backend (.env)

```env
DATABASE_URL=your_neon_database_url
SECRET_KEY=your_secret_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

---

## Deployment

### Web Application

https://osaserviceportal.vercel.app/

### Backend API

https://server-osa-service.onrender.com/

### API Documentation

https://server-osa-service.onrender.com/docs

APK QR Code is available inside the web application.
https://www.dropbox.com/scl/fi/ygokxccjlipyuyd9kvf4y/ustp-osaapp-may-26-update.apk?rlkey=r6z1ume95uln1lxod99ncdwa8&st=lf1l3t0w&dl=1

---

## Team Members

- Neil Dime — Lead Developer
- Carlo Jay Anoos — QA Specialist
- Daniel James Palle — UI/UX Designer
- Iezhera Edrielle Sajol — Project Manager

---

## Known Limitations

- Requires internet connection
- Performance may depend on server availability and internet speed

---

## License

This project is for academic and educational purposes.
