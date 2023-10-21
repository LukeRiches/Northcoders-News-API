# Northcoders News API
A Link to the hosted version: https://northcoders-news-api-phe8.onrender.com 

What this project is?
This project is a showcase of my backend development through a forum style site, the database has been built with PSQL making use of pg and pg-format, it is stored online through ElephantSQL and hosted on Render. I have used express for my framework through an MVC build pattern, making use of both PSQL's built in error handling and custom error handlers. To test my framework I made a seperate testing environemnt through dotenv and built my testing suite with Jest and made use of supertest and jest-extended.

Instructions to clone my project and run it locally:
1. To clone, copy the url link from GitHub then it can be cloned locally (e.g through a git clone) 
2. Once cloned, install dependencies through an npm install
3. To setup the environemnts, please follow the instructions below 
4. Seeding the local data base, run the npm scripts: "setup-dbs" to setup the databases, "seed" to seed the databases
5. To run tests, run the npm script "test" for all testing suites, for just the app testing run "test app"

How to create the environment variables:
1. You will need to create two .env files for my project: .env.test and .env.development
2. Into each, add PGDATABASE= : For the test env add nc_news_test it should look like this PGDATABASE=nc_news_test and for the dev env add nc_news it should look like this PGDATABASE=nc_news

NOTE:
Please do not add a semi-colon at the end of the PGDATABASE= lines as this will cause it to not work

Minimum Version requiremnt:
Node.js v20.3.1
postgres (PostgreSQL) 14.8


