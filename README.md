# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# Developers Guide

## Application Overview
This application is a web-based insurance management system. It consists of:
1. **Frontend**: A React application built with Vite.
2. **Backend**: A Python Flask application using SQLite as the database.

### Features
- **Update Record**: Allows users to submit their details and receive a unique identifier.
- **Search Record**: Allows users to search for insurance premiums using the unique identifier.

## Frontend Development
### Prerequisites
- Node.js installed on your system.

### Setup
1. Navigate to the project directory:
   ```bash
   cd c:/projects/Fairway/coding_agent_poc
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Access the application at the URL provided by Vite (e.g., `http://localhost:5173`).

### Key Files
- `src/App.jsx`: Main React component.
- `src/App.css`: Styling for the application.
- `src/main.jsx`: Entry point for the React application.

## Backend Development
### Prerequisites
- Python 3 installed on your system.
- Flask and Flask-CORS modules installed.

### Setup
1. Navigate to the project directory:
   ```bash
   cd c:/projects/Fairway/coding_agent_poc
   ```
2. Install required Python packages:
   ```bash
   pip install flask flask-cors
   ```
3. Start the backend server:
   ```bash
   python kalyan_logic.py
   ```
4. The server will run at `http://localhost:5000`.

### Key Files
- `kalyan_logic.py`: Main backend logic.
- `insurance.db`: SQLite database file.

## Deployment Guide
### Deploying on AWS EC2
#### Prerequisites
- An AWS account.
- An EC2 instance with a Linux-based OS (e.g., Amazon Linux or Ubuntu).

#### Steps
1. **Setup EC2 Instance**:
   - Launch an EC2 instance.
   - Connect to the instance using SSH.

2. **Install Dependencies**:
   - Update the package manager:
     ```bash
     sudo apt update
     ```
   - Install Node.js:
     ```bash
     sudo apt install -y nodejs npm
     ```
   - Install Python:
     ```bash
     sudo apt install -y python3 python3-pip
     ```

3. **Upload Project Files**:
   - Use SCP or an SFTP client to upload the project files to the EC2 instance.

4. **Setup Frontend**:
   - Navigate to the project directory:
     ```bash
     cd /path/to/project
     ```
   - Install frontend dependencies:
     ```bash
     npm install
     ```
   - Build the frontend for production:
     ```bash
     npm run build
     ```
   - Serve the frontend using a static file server (e.g., `serve`):
     ```bash
     npx serve -s dist
     ```

5. **Setup Backend**:
   - Install Python dependencies:
     ```bash
     pip3 install flask flask-cors
     ```
   - Start the backend server:
     ```bash
     python3 kalyan_logic.py
     ```

6. **Configure Security Groups**:
   - Open ports 80 and 5000 in the EC2 instance's security group to allow HTTP traffic.

7. **Access the Application**:
   - Use the public IP of the EC2 instance to access the application.
   - Frontend: `http://<EC2_PUBLIC_IP>:3000`
   - Backend: `http://<EC2_PUBLIC_IP>:5000`

## Notes
- For production, consider using a process manager like `pm2` for the backend.
- Use a reverse proxy (e.g., Nginx) to serve the frontend and backend on standard ports.
- Secure the application using HTTPS and environment variables for sensitive data.
