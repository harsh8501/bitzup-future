import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import bodyParser from "body-parser"; 
import route from "./routes/api-routes.js";
//import { ipFilterMiddleware } from "./middleware/middleware.js";

dotenv.config();

const PORT = process.env.PORT || 7070;

const app = express();

const corsOptions = {
  origin: "*",
  methods: "GET,POST",
  optionsSuccessStatus: 200,
};

//app.use(ipFilterMiddleware)
app.use(cors(corsOptions));
app.use(helmet())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
  
//Routes
app.use("/api", route);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});