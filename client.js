var WebSocketClient = require('websocket').client;

var client = new WebSocketClient();

var WebSocketConeection = require('websocket').connection;
client.on('connectFailed', function(error) {
    console.log('Connect Error: ' + error.toString());
    console.log('waiting for server to connect.....');
});
 
client.on('connect', function(connection) {
    console.log('WebSocket Client Connected');
    connection.on('error', function(error) {
        console.log("Connection Error: " + error.toString());
    });
    connection.on('close', function() {
        console.log('Connection closed due to', connection.closeDescription);
        console.log('echo-protocol Connection Closed');
        connect();
    });
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log("Received: '" + message.utf8Data + "'");
        }
    });
    connection.on('pong', function(data){
        console.log('Pong called with data:'+ data);
    });
    
    function sendNumber() {
        if (connection.connected) {
            var number = Math.round(Math.random() * 0xFFFFFF);
            connection.sendUTF(number.toString());
            setTimeout(sendNumber, 1000);
        }
    }
    //sendNumber();
    function ping() {
        if (connection.connected) {
            connection.ping('pingpong');
            console.log('Pinging...'+new Date()+ 'with data : pingpong');
            setTimeout(ping, 20000);
        }
    }
    ping();
});
 
function connect() {
    client.connect('ws://localhost:8080/', 'echo-protocol');
}
setTimeout(connect(),20000);
