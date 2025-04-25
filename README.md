**Project Overview**
Event Horizon - Ticket Booking Management System is a modern web application that allows users to browse events, select seats, and manage bookings with a user-friendly interface. Admins can manage events and view bookings efficiently.

**Setup & Run Instructions**
Local Development
Clone the repository:

bashL:
git clone <repository-url>
cd event-horizon-booking-system
Install dependencies:

bash:
npm install
Run the app:

bash:
npm run dev
Open in browser: Visit http://localhost:8080

**Docker Setup**
Build and start containers:

bash:
docker-compose up -d
Open the app: Visit http://localhost:8080

**Tech Stack Used**

Frontend	DevOps	Styling
React + TypeScript	Docker & Docker Compose	Tailwind CSS
React Router	Jenkins (CI/CD)	Shadcn UI
React Query		

**Docker and Jenkins Usage Notes**
**Docker**
Uses a multi-stage build in Dockerfile to optimize image size.

docker-compose.yml handles service configuration for running the app.

**Jenkins CI/CD Pipeline**
Pulls the latest code from GitHub.

Installs dependencies using npm install.

Runs build and tests (optional).

Builds Docker image.

Deploys using docker-compose up -d.

You can create a Jenkins pipeline using a Jenkinsfile for full automation.

![Screenshot 2025-04-24 235344](https://github.com/user-attachments/assets/9570a791-6714-4fc2-aa4b-26d9f46e03a1)
![Screenshot 2025-04-24 235400](https://github.com/user-attachments/assets/13ee8599-11f3-46cd-b54d-ec1d57ed6b4d)
![Screenshot 2025-04-24 235432](https://github.com/user-attachments/assets/489a7332-7e45-4b8d-b1d2-e6502573c8ca)
![Screenshot 2025-04-24 235454](https://github.com/user-attachments/assets/90426883-aa85-474b-a8d0-a1a062f81116)




