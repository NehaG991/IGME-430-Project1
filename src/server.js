const http = require('http');
const url = require('url');

const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
  '/': htmlHandler.getIndex,
  '/style.css': htmlHandler.getCSS,
  '/addTask': jsonHandler.addTask,
  anythingElse: htmlHandler.getIndex,
};

const onRequest = (request, response) => {
  const parsedURL = url.parse(request.url);

  if (urlStruct[parsedURL.pathname]) {
    urlStruct[parsedURL.pathname](request, response);
  } else {
    urlStruct.anythingElse(request, response);
  }
};

http.createServer(onRequest).listen(port, () => {
  console.log(`Listening on 127.0.0.1: ${port}`);
});
