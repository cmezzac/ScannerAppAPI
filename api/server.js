const dotenv = require("dotenv");
const express = require("express");

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

//Define Routers
const openAiRouter = require("./routes/OpenAi");

//Register the endpoints
app.use(express.json());
app.use("/api/openAi", openAiRouter);

app.get("/", (req, res) => {
  res.send("Welcome to the home page!");
});

app.get("/about", (req, res) => {
  res.send("This is the about page.");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
