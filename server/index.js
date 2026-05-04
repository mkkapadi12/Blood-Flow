require("dotenv").config({ quiet: true });
const express = require("express");
const http = require("http");
const app = express();
const cors = require("cors");
const connectDB = require("./config/db");
const { initSocket } = require("./socket/socket");

//routes
const requesterRoutes = require("./routes/requester.routes");
const dispatcherRoutes = require("./routes/dispatcher.routes");
const requestRoutes = require("./routes/request.routes");
const hospitalRoutes = require("./routes/hospital.routes");
const inventoryRoutes = require("./routes/inventory.routes");

const errorMiddleware = require("./middlewares/error.middleware");

// Connect to MongoDB
connectDB();

const port = process.env.PORT || 3001;
// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//cors
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  }),
);

app.get("/", (req, res) => res.send("Hello World!"));

app.get("/api", (req, res) => res.send("API is running..."));

app.use("/api/requester", requesterRoutes);
app.use("/api/dispatcher", dispatcherRoutes);
app.use("/api/requests", requestRoutes);

app.use("/api/hospital", hospitalRoutes);
app.use("/api/inventory", inventoryRoutes);

//error middleware
app.use(errorMiddleware);

const server = http.createServer(app);
initSocket(server);

server.listen(port, () => console.log(`Server started on port ${port}!`));
