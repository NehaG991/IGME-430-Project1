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
  const oldBody = [];

  request.on('data', (chunk) => {
    oldBody.push(chunk);
  });

  request.on('end', () => {
    const bodyString = Buffer.concat(oldBody).toString();
    const body = query.parse(bodyString);

    const responseJSON = {
      message: 'Name and Due Date are both required.',
    };

    if (!body.name || !body.duedate) {
      responseJSON.id = 'addTaskMissingParams';
      return respondJSON(request, response, responseJSON, 400);
    }
  });
};

const anythingElse = (request, response) => {
  const responseJSON = {
    message: 'The page you are looking for was not found',
    id: 'notFound',
  };

  return respondJSON(request, response, responseJSON, 404);
};

module.exports = {
  addTask,
  anythingElse,
};
