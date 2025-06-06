# University Full Stack Website Project
## Description
This is a project I did at University of Klagenfurt as a part of Web Technology course. The project was made in 2024-2025 in span of two months in a team of 3 developers.
This repository holds an updated version with refactored cleaner project structure for easier understanding and distribution.

The website is a simplified version of a virtual marketplace service like Willhaben or Amazon.

Users can:
- Sell items in categories like retail, vehicles (cars and motorcycles), as well as rental of real estate
- Create an account and log in to browse and post listings
- Upload images for listings
- Request listed items, which the listing owner can view and respond to

All users, listings, and complementary data are then stored in a SQLite database, while pictures are stored on disk in a Backend directory

---

## Project Structure
The project consists of two main parts: Backend and Frontend

### Backend
Backend is a server REST API written in JavaScript as a node.js application using express and sequelize. 
The API is responsible for processing the requests to the database, storage of user uploaded pictures, as well as authentication of users.

Note: Originally the project relied on a PostgreSQL database server to store data, but for the sake of easier local setup, the database was migrated to inbuilt SQLite file

### Frontend
Frontend is a typescript project using Angular framework. 

Frontend is responsible for the website layout and all the user interactions, as well as sending the HTTP requests to the api.

---

## Installing/Executing
Make sure you have Node.js and npm installed

In the project root directory WebTech_Website you can run predefined commands for easier use

* npm run install:all - Installs all necessary dependencies for Backend and Frontend
* npm run start:all - Concurrently runs both Frontend and Backend
* npm run start:frontend - Starts Frontend only
* npm run start:backend - Starts Backend only

After starting the Frontend is available at http://localhost:4200/

---

## My contributions
* Implemented all functionality related to vehicle section (Frontend-Backend)
* Developed picture uploading functionality (Frontend-Backend)
* Built authentication functionality (Frontend-Backend)
* Migrated the project databse to SQLite from PostgreSQL
* Refactored and reorganized the entire project structure for clarity and maintainability

---

## Future Improvements
Due to some original codebase issues not all functionality has been re-implemented and doesn't work properly. This is currently being worked on.
All functionality considering vehicle section is operational
