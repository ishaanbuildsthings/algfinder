/* eslint-disable-next-line no-restricted-globals */
self.onmessage = function (e) {
  console.log("Worker: Message received from main script");
  const result = e.data[0] * e.data[1];
  console.log("Worker: Posting message back to main script");
  postMessage(result);
};

// TODO: why linting