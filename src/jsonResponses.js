const query = require('querystring');

// variables to hold tasks
const toDo = {};
const inProgress = {};
const done = {};

const respondJSON = (request, response, object, statusCode) => {
  response.writeHead(statusCode, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify(object));
  response.end();
};

const respondJSONMeta = (request, response, status) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end();
};

const addTask = (request, response) => {

};

module.exports = {
  addTask,
};
