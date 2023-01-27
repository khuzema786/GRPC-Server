var fs = require("fs")

var PROTO_PATH = __dirname + '/chat.proto';

var grpc = require('@grpc/grpc-js');
var protoLoader = require('@grpc/proto-loader');
var packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    });
var chat = grpc.loadPackageDefinition(packageDefinition).chat;

const observers = [];

const sendMsg = (call, callback) => {
    const chatObj = call.request;
    observers.forEach((observer) => {
      console.log(`Sending message to: ${observer.call.request.user.name} => ${observer.call.request.active}`)
      observer.call.write(chatObj);
    });
    callback(null, {});
  };

const recieveMsg = (call, callback) => {
  console.log(`Sending message to: ${observer.call.request.user.name} => ${observer.call.request.active ? "ONLINE" : "OFFLINE"}`)
  observers.push({
    call,
  });
};

function getServer() {
  var server = new grpc.Server();
  server.addService(chat.Chat.service, {
    sendMsg: sendMsg,
    recieveMsg: recieveMsg
  });
  return server;
}

const port = "3000"

const credentials = grpc.ServerCredentials.createSsl(
  fs.readFileSync('./certs/ca.crt'), [{
  cert_chain: fs.readFileSync('./certs/server.crt'),
  private_key: fs.readFileSync('./certs/server.key')
}], true);

if (require.main === module) {
  var routeServer = getServer();
  routeServer.bindAsync(`0.0.0.0:${port}`, credentials, () => {
    routeServer.start();
    console.log(`Server started on port : ${port}`)
  })
}

exports.getServer = getServer;
