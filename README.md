# Task-it

Task-it is an intuitive task management web-facing application with a variety of powerful features for creating, tracking, sorting and prioritizing tasks simply and efficiently. 

This repository holds the back-end which is a Node.js application utilizing the express framework.\
The [front-end](https://github.com/yuval2313/taskit_react) is powered by React and is dependent on this application.

## Features: 
* Create and edit descriptive tasks;
* Track task status;
* Prioritize your tasks;
* Quick and easy sorting and filtering;
* Group different types of tasks using labels;
* Integrated Google authentication and authorization;
* Google login integration; 
* Easily add tasks as Google Calendar events;

## Technologies:
* Server side: Node.js environment utilizing the Express framework as a back-end service, and MongoDB as an external database for storing data.
 * [Client side](https://github.com/yuval2313/taskit_react): React front-end application implemented using Redux for state management and communicating with the server side.
* Deployment: Hosted on an AWS EC2 Instance at [taskit.in](https://taskit.in).\
References and access to Task-it can be provided upon request. 

## Installation

This app runs on node version 16.13.1.\
Make sure you also have NPM version 8.1.2.

### Install dependencies 

In the project directory run:

```bash
npm install
```


### Setting up a Database

Task-it utilizes a [MongoDB](https://www.mongodb.com/) no-SQL database to store document based data.\
In order for the application to function you must set up a database and configure its credentials for either development or production environments as described in the following section.

For use with transactions a cloud based database must be set up utilizing [MongoDB Atlas](https://www.mongodb.com/atlas) for use with replica sets.\
This allows the application to perform all operations and run correctly, otherwise some functionality will misbehave.

For more information please visit the [MongoDB Documentation ](https://www.mongodb.com/docs/).

## Usage

On the back-end, this application is dependent on multiple environment variables in order to function properly.

### Setting the environment:

```bash
NODE_ENV=
# Can be set to either "development" or "production".
## NOTE: Leaving this unset is equivalent to "development".
```

### Environment variables:

```bash
# Port which server should be listening on.
## NOTE: Should not be set to same port as front-end (usually 3000).
PORT=

# A priavte key for JSON Web Tokens
JWTKEY=

# Client ID for OAuth 2.0 client
OAUTH_CLIENT_ID=

# Client secret for OAuth 2.0 client
OAUTH_CLIENT_SECRET=

# Redirect URL for front-end application
## NOTE: Must be registered in OAuth 2.0 credentials page as an authorized redirect URI.
OAUTH_REDIRECT_URI=
```
### Development environment variables:

This variable must be set for a development environment exclusively.

```bash
# A database connection string to MongoDB database
DB_URL=
```

### Production environment variables:

In a production environment these variables must be set instead.

```bash
## NOTE: In production, instead of a single connection URI 
## database credentials shoud be set on three different variables.

# MongoDB host where database is running 
DB_HOST=

# MongoDB username
DB_USERNAME=

# MongoDB password
DB_PASSWORD=
```

## Running the App

#### Available scripts

In the project directory you can run:

#### `npm start`

Runs the app on whatever port you've set up.\
Set up http://localhost:`<YOUR_PORT>` as the base URL of your client side's server requests in development.\
In production expose your configured port on whatever domain you've set up and set the base URL to that.

#### `npm run dev`

This application utilizes nodemon as a development dependency.\
You may run this script in development to run the app and it will automatically restart when you make any changes to the code.
