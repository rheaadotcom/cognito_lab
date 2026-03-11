const mongoose = require('mongoose');
const fs = require('fs');
require('dotenv').config();

function log(msg) {
  console.log(msg);
  fs.appendFileSync('atlas_test.log', msg + '\n');
}

fs.writeFileSync('atlas_test.log', 'Starting Atlas connection test...\n');

mongoose.connect(process.env.MONGO_URI, { 
  serverSelectionTimeoutMS: 5000 
})
.then(() => { 
  log('RESULT_SUCCESS: Connected to MongoDB Atlas successfully.'); 
  process.exit(0); 
})
.catch(err => { 
  log('RESULT_FAILURE: Connection failed.');
  log('Error Details: ' + err.message);
  process.exit(1); 
});
