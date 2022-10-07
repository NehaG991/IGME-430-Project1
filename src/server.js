const http = require('http');
const url = require('url');
const query = require('querystring');

const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
  '/': htmlHandler.getIndex,
  '/style.css': htmlHandler.getCSS,
  '/addTask': jsonHandler.addTask,
  '/moveTask': jsonHandler.moveTask,
  '/getTasks': jsonHandler.getTasks,
  anythingElse: htmlHandler.getError,
};

const onRequest = (request, response) => {
  const parsedURL = url.parse(request.url);
  const params = query.parse(parsedURL.query);

  if (urlStruct[parsedURL.pathname]) {
    urlStruct[parsedURL.pathname](request, response, params);
  } else {
    urlStruct.anythingElse(request, response);
  }
};

http.createServer(onRequest).listen(port, () => {
  console.log(`Listening on 127.0.0.1: ${port}`);
});
