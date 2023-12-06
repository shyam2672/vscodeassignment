const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const PORT = 3000;
require("dotenv").config();
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(cors());
app.use(express.json());

// MongoDB Atlas connection string
const mongoURI =
  "mongodb+srv://shyamprajapati2672:shyam2672002@cluster0.po4pyv7.mongodb.net/VSCODEHELP?retryWrites=true&w=majority";

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connetion Successfull");
  })
  .catch((err) => {
    console.log(err.message);
  });

const routes = require("./routes/routes");
app.use("/api/vscodehelp", routes);

// Routes
// ...

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
