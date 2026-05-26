# Project Title
Osa-Service-Portal Web and App

## Project Description
This Project aims for convenience for both students and school admin from paper trail of assigning community service task to digital, that can be view anytime-anywhere.

## Technology Stack
Nextjs + FastAPI + Shadcn/Tweakcn UI + Tailwindcss 

## System Architecture
+--------------------------------------------------+
|                  CLIENT SIDE                     |
|--------------------------------------------------|
|  Web App / Mobile Responsive App                 |
|  Built with: Next.js + Tailwind + Shadcn UI      |
+-------------------------+------------------------+
                          |
                          | HTTPS/API Requests
                          v
+--------------------------------------------------+
|                 BACKEND SERVER                   |
|--------------------------------------------------|
|                 FastAPI REST API                 |
|                                                  |
|  Handles:                                        |
|  - Authentication & Authorization                |
|  - Student Management                            |
|  - Community Service Assignment                  |
|  - Attendance / Completion Tracking              |
|  - Notifications                                 |
|  - Report Generation                             |
+-------------------------+------------------------+
                          |
                          | ORM / Database Queries
                          v
+--------------------------------------------------+
|                    DATABASE                      |
|--------------------------------------------------|
|  MySQL / PostgreSQL                              |
|                                                  |
|  Stores:                                         |
|  - User Accounts                                 |
|  - Student Information                           |
|  - Assigned Tasks                                |
|  - Service Records                               |
|  - Announcements                                 |
|  - Completion Reports                            |
+--------------------------------------------------+

## Installation & Setup
-Install the required software:
-Node.js
-Python
-Git
-PostgreSQL or MySQL
-Setup the frontend using Next.js:
-Create the project with create-next-app
-Install TailwindCSS and Shadcn UI
-Run the frontend server using npm run dev
-Setup the backend using FastAPI:
-Create a virtual environment
-Install FastAPI and required dependencies
-Create the main API file
-Run the backend using uvicorn
-Configure the database:
-Create the database in PostgreSQL/MySQL
-Connect the backend using SQLAlchemy
-Add environment variables:
-Frontend API URL
-Backend database URL and secret keys
-Run both frontend and backend servers to access the -system locally through:
-Frontend: localhost:3000
-Backend API: localhost:8000

## Deployment Link
https://osaserviceportal.vercel.app/ - Web
The apk's QR is found in the Web.

## Test Account

## Team Members and Roles
Anoos, Carlo Jay -QA Specialist
Dime, Neil -Lead Developer
Palle, Daniel James - UI/UX Designer
Sajol, Iezhera Edrielle - Project Manager

## Known Limitations

## Screenshots