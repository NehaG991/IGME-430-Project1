const query = require('querystring');

// variable to hold tasks
const tasks = {};

const respondJSON = (request, response, object, statusCode) => {
  response.writeHead(statusCode, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify(object));
  response.end();
};

const respondJSONMeta = (request, response, status) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end();
};

// For adding/editing tasks - POST
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
      tasks,
    };

    // Checks if user inputted a name or a due date
    if (!body.name || !body.duedate) {
      responseJSON.id = 'addTaskMissingParams';
      return respondJSON(request, response, responseJSON, 400);
    }

    let statusCode = 204;

    // Checks if task already exists
    if (!tasks[body.name]) {
      statusCode = 201;
      tasks[body.name] = {};

      // Add fields to new task
      tasks[body.name].name = body.name;
      tasks[body.name].description = body.description;
      tasks[body.name].duedate = body.duedate;
      tasks[body.name].column = 'toDo';

      // Update Response
      responseJSON.tasks = tasks;
      responseJSON.message = 'Created Successfully';

      return respondJSON(request, response, responseJSON, statusCode);
    }

    // Updates description and due date field
    // Only updates description field if it's not empty
    if (body.description !== '') {
      tasks[body.name].description = body.description;
    }

    tasks[body.name].duedate = body.duedate;

    return respondJSONMeta(request, response, statusCode);
  });
};

// Invalid url Method - GET
const anythingElse = (request, response) => {
  const responseJSON = {
    message: 'The page you are looking for was not found',
    id: 'notFound',
  };

  if (request.method === 'GET') {
    return respondJSON(request, response, responseJSON, 404);
  }

  return respondJSONMeta(request, response, 404);
};

// Moves data to specified column - POST
const moveTask = (request, response) => {
  const oldBody = [];

  request.on('data', (chunk) => {
    oldBody.push(chunk);
  });

  request.on('end', () => {
    const bodyString = Buffer.concat(oldBody).toString();
    const body = query.parse(bodyString);

    const responseJSON = {
      message: 'Message',
      tasks,
    };

    const statusCode = 201;

    // Move to toDo
    if (body.newColumn === 'toDo') {
      // Changing task column
      tasks[body.name].column = 'toDo';

      responseJSON.message = `Moved Task: ${body.name} to To Do Column`;
      responseJSON.tasks = tasks;

      return respondJSON(request, response, responseJSON, statusCode);
    }

    if (body.newColumn === 'progress') {
      tasks[body.name].column = 'progress';

      responseJSON.message = `Moved Task: ${body.name} to In Progress Column`;
      responseJSON.tasks = tasks;

      return respondJSON(request, response, responseJSON, statusCode);
    }

    if (body.newColumn === 'done') {
      tasks[body.name].column = 'done';

      responseJSON.message = `Moved Task: ${body.name} to Done Column`;
      responseJSON.tasks = tasks;

      return respondJSON(request, response, responseJSON, statusCode);
    }

    return respondJSONMeta(request, response, statusCode);
  });
};

// Returns Task Data - GET
const getTasks = (request, response) => {
  const responseJSON = {
    tasks,
  };

  if (request.method === 'GET') {
    return respondJSON(request, response, responseJSON, 200);
  }
  return respondJSONMeta(request, response, 200);
};

module.exports = {
  addTask,
  anythingElse,
  moveTask,
  getTasks,
};
