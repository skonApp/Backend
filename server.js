import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

// cron
import { job } from "./jobs/cronJob.js";
import { dailyEarningsJob } from "./jobs/dailyEarningsJob.js";

// middelware
import { notFoundError, errorHandler } from "./middlewares/error-handler.js";

// routes
import userRoutes from "./routes/user.js";
import subscriptionRoutes from "./routes/subscription.js";
import depositRoutes from "./routes/deposit.js";
import wheelRoutes from "./routes/wheel.js"

const app = express();
const port = process.env.PORT;
const databaseName = process.env.dbName;
const dataBasePort = process.env.dataBasePort;

mongoose.set("debug", true);
mongoose.Promise = global.Promise;

mongoose
  .connect(`mongodb://127.0.0.1:${dataBasePort}/${databaseName}`)
  .then(() => {
    console.log(`Connected to Data base :${databaseName}`);
  })
  .catch((err) => {
    console.log(err);
  });

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/img", express.static("public/images"));

app.use("/user", userRoutes);
app.use("/sub", subscriptionRoutes);
app.use('/deposit', depositRoutes);

app.use("/wheel",wheelRoutes)

app.use(notFoundError);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

