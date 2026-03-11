const net = require('net');
const client = new net.Socket();
const host = 'cluster0-shard-00-00.n9gmmkh.mongodb.net'; // Shard host often better for ping
const port = 27017;

console.log(`Connecting to ${host}:${port}...`);

client.setTimeout(5000);

client.connect(port, host, function() {
    console.log('SUCCESS: TCP connection established.');
    client.destroy();
    process.exit(0);
});

client.on('error', function(err) {
    console.log('ERROR: TCP connection failed.');
    console.log('Message:', err.message);
    process.exit(1);
});

client.on('timeout', function() {
    console.log('ERROR: TCP connection timed out after 5s.');
    client.destroy();
    process.exit(1);
});
