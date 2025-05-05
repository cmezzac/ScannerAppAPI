const dotenv = require("dotenv");
const express = require("express");

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

//Increase body size limit
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));

//Define Routers
const openAiRouter = require("./routes/ShippingRouter");

//Register the endpoints
app.use("/api/shipping", openAiRouter);

app.get("/", (req, res) => {
  res.send("Welcome to the home page!");
});

app.get("/about", (req, res) => {
  res.send("This is the about page.");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
