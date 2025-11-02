# Gerimedica Frontend Assignment

This project is built with [Angular CLI](https://github.com/angular/angular-cli) version 19.2.0. You need to have the latest versions of Node.js and npm installed on your machine.

<h3> Need improvements in this application</h3>
<p>Go to client tab and perform below actions</p>
<ol>
        <li>Edit the clients</li>
        <li>Delete the clients</li>
        <li>Search the client list using search box</li>
        <li>Filter the clients by isActive checkbox</li>
        <li>Add validations and unit tests</li>
        <li>Beautify the client list</li>
        <li>Improve wherever you can :) </li>
      </ol>

## 🚀 Getting Started

### Install Dependencies

Before running the project, make sure to install the necessary packages:

P.S: You need to have the latest versions of Node.js and npm installed on your machine.

```bash
npm install
```

### Start the Development Server

To run the application locally, use the following command:

```bash
npm start
```

This will launch the app at [http://localhost:4200](http://localhost:4200). The development server supports hot-reloading, so any changes to the source files will automatically refresh the browser.

The mock API server is also available at [http://localhost:3000](http://localhost:3000), with endpoints powered by `db.json` file.

## 🧪 Running Tests

To execute unit tests using Jest test runner, run:

```bash
npm test
```

## 📡 API Routes

The mock API routes (powered by `db.json`) include the following:

### Client Routes

```http
GET     /clients
GET     /clients/:id
POST    /clients
PUT     /clients/:id
DELETE  /clients/:id
```

## 📚 Additional Resources

- Usefull example about [JSON-Server](https://jsonplaceholder.typicode.com/)
