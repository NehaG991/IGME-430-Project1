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

// For adding tasks to to do list
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
      toDo: toDo,
      inProgress: inProgress,
      done: done,
    };

    // Checks if user inputted a name or a due date
    if (!body.name || !body.duedate) {
      responseJSON.id = 'addTaskMissingParams';
      return respondJSON(request, response, responseJSON, 400);
    }

    let statusCode = 204;

    // Checks if task already exists
    if (!toDo[body.name] && !inProgress[body.name] && !done[body.name])
    {
      statusCode = 201;
      toDo[body.name] = {}; 

      // Add fields to new task
      toDo[body.name].name = body.name;
      toDo[body.name].description = body.description;
      toDo[body.name].duedate = body.duedate;

      // Update Response
      responseJSON.toDo = toDo;
      responseJSON.message = 'Created Successfully';

      return respondJSON(request, response, responseJSON, statusCode);
    }




  });
};

// Invalid url Method
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
