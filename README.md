# Thinking Canvas

Thinking Canvas is a real-time digital whiteboard where multiple people can draw, write and brainstorm together

## Description

Built using express websocket, postgresql and reactjs a web-app where you can create draw rooms, secure them with password and invite other people as collaborators or just as viewers. It supports multi-user synchronization, links ready to be copied and shared.

## Screenshots

![Thinking Canvas - drawing room](/assets/1.png)

![Thinking Canvas - dashboard](/assets/2.png)

## Dependencies

### Frontend:

```
react==18.3.1
react-dom==18.3.1
react-router-dom==7.18.4
@excalidraw/excalidraw==0.18.1
vite==8.3.0
```

### Backend:

```
express==5.2.1
ws==8.22.0
pg==8.23.1
jsonwebtoken==9.0.3
bcryptjs==3.0.3
cookie-parser==1.4.7
dotenv==18.0.5
crypto==1.0.1
```

## Installing

1. Clone the repository : [https://github.com/rishabhkr2307/test.git](https://github.com/rishabhkr2307/test.git)

2. Install the dependencies in both frontend and backend files

3. create a .env file in the backend folder like this

```env
PORT=8080

JWT_SECRET=your_jwt_secret_key_here

DATABASE_URL= your remote database url

DB_USER=postgres

DB_PASSWORD=your_password

DB_HOST=localhost

DB_PORT=5432

DB_NAME=thinking_canvas
```

## Executing Program

In terminal 1:

```bash
cd backend

node server.js
```

In terminal 2:

```bash
cd frontend

npm run dev  OR npm.cmd run dev
```

## Help

1. Ensure that the port 8080 is open andis free from local firewall restrictions

2. Verify the env parameters and confirm PostgreSQL services running on port  5432

3. Ensure the browser cookies are enabled for authentication session management

## AI Usage

AI was primarily used as a reference assistant and syntax checker and boiler plate maker

The AI was used to review SQL queries, cookie configurations and hooks to catch bugs. It helped in making the things formal instead of writing just anything. It also helped in accessing some custom Excalidraw CSS overrides.
