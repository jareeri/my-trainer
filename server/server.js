require("dotenv").config();
const express = require("express");
const db = require("./models/db");
const bodyParser = require("body-parser"); // Import body-parser
const cors = require("cors");

const http = require('http');
const socketIo = require('socket.io');

const app = express();
app.use(express.json());

const jwt = require("jsonwebtoken");
// const jwtSecret = 'your-secret-key'; // Replace with a strong secret key
const jwtOptions = {
  expiresIn: "7d", // Set the expiration time as needed
};

// app.use(cors()); // This enables CORS for all routes
// app.use(bodyParser.json()); // Enable JSON request body parsing

const bcrypt = require("bcrypt");
const { authenticate } = require("passport");

const user_router = require("./routes/user_routes");
const articles_router = require("./routes/articles_routes");
const trainer_router = require("./routes/trainer_routes");
const plans_router = require("./routes/plans_routes");
const review_routes = require("./routes/review_routes")
const cartRoutes = require('./routes/cartRoutes');
const exerciseRoutes = require('./routes/exerciseImagesRoutes');
const faqroutes = require("./routes/faqroutes")
const nutritionroutes = require("./routes/nutritionRoutes")

const server = http.createServer(app);
const io = socketIo(server);

app.use(user_router);
app.use(articles_router);
app.use(trainer_router);
app.use(plans_router);
app.use(review_routes);
app.use('/api', cartRoutes);
app.use(exerciseRoutes);
app.use(faqroutes);
app.use(nutritionroutes);
app.get("/", async (req, res) => {
  try {
    // await db.query(
    //   `INSERT INTO users VALUES(3, 'abdullah', 'jareeri3@gm.com', 'fwqfwq')`
    // );
    const result = await db.query(
      // "SELECT * FROM users INNER JOIN blogs on users.id = blogs.author_id "
      "SELECT * FROM users"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});

