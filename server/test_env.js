require('dotenv').config();
console.log('Testing MONGO_URI loading:');
const uri = process.env.MONGO_URI;
if (!uri) {
  console.log('FAIL: MONGO_URI is missing');
} else if (uri.includes('<')) {
  console.log('FAIL: MONGO_URI still contains brackets');
} else {
  console.log('SUCCESS: MONGO_URI found and looks sanitized');
  // Just show a masked version for security
  console.log('URI Prefix:', uri.substring(0, 15) + '...');
}
process.exit(0);
