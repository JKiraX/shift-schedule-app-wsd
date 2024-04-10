// server.js
// define routes and middleware for your Express server here

//NB: Run the command node server.js to run the server


const express = require('express');
const app = express();
const port = process.env.PORT || 3000; // Use the specified port or default to 3000

// Define routes and middleware here...

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
