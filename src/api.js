const http = require("http");
const Handler = require("./routes/handler")

const handler = new Handler()

const App = http.createServer(handler.routes)

App.listen(3000, console.log("Server is running on port 3000"))

module.exports = App;