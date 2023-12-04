require("dotenv").config();
const express = require("express");
const db = require("./models/db");
const bodyParser = require("body-parser"); // Import body-parser
const cors = require("cors");
const verifyToken = require("./middleware/authenticateToken");

const http = require("http");
const socketIo = require("socket.io");

const app = express();
app.use(express.json());

const jwt = require("jsonwebtoken");
const jwtOptions = {
  expiresIn: "7d", // Set the expiration time as needed
};

app.use(cors()); // This enables CORS for all routes
app.use(bodyParser.json()); // Enable JSON request body parsing

const bcrypt = require("bcrypt");
const { authenticate } = require("passport");

const user_router = require("./routes/user_routes");
const articles_router = require("./routes/articles_routes");
const trainer_router = require("./routes/trainer_routes");
const plans_router = require("./routes/plans_routes");
const review_routes = require("./routes/review_routes");
const cartRoutes = require("./routes/cartRoutes");
const exerciseRoutes = require("./routes/exerciseImagesRoutes");
const faqroutes = require("./routes/faqroutes");
const nutritionroutes = require("./routes/nutritionRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const subscribersRoutes = require("./routes/subscribers_routes");
const verifyRole = require("./routes/verifyRole_routes");
const { log } = require("console");

const server = http.createServer(app);
const io = socketIo(server);

app.use(user_router);
app.use(articles_router);
app.use(trainer_router);
app.use(plans_router);
app.use(review_routes);
app.use("/api", cartRoutes);
app.use(exerciseRoutes);
app.use(faqroutes);
app.use(nutritionroutes);
app.use(paymentRoutes);
app.use(subscribersRoutes);
app.use(verifyRole);

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

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
// app.post(
//   "/payment",
//   verifyToken.authenticateToken,
//   cors(),
//   async (req, res) => {
//     let { amount, id, plan_id, months, trainer_id } = req.body; // Change endDate to months
//     const user_id = req.user.user.Id;

//     try {
//       // Create a payment intent
//       const payment = await stripe.paymentIntents.create({
//         amount,
//         currency: "USD",
//         description: "Spatula company",
//         payment_method: id,
//         confirm: true,
//         return_url: "http://localhost:3000/",
//       });

//       // If payment is successful, add the user to the subscribers table
//       if (payment.status === "succeeded") {
//         // Calculate the end date based on the current date and provided number of months
//         const subscribed_at = new Date(); // Current date and time
//         const end_at = new Date();
//         end_at.setMonth(end_at.getMonth() + months);

//         // Assuming you have a database connection in your code, add the user to the subscribers table
//         const addSubscriberQuery = `
//         INSERT INTO subscribers (user_id, plan_id, subscribed_at, end_at, trainer_id)
//         VALUES ($1, $2, $3, $4, $5)
//         RETURNING *`;

//         const addSubscriberValues = [
//           user_id,
//           plan_id,
//           subscribed_at,
//           end_at,
//           trainer_id,
//         ];

//         const addedSubscriber = await db.query(
//           addSubscriberQuery,
//           addSubscriberValues
//         );

//         console.log(
//           "User added to subscribers table:",
//           addedSubscriber.rows[0]
//         );

//         res.json({
//           message: "Payment successful",
//           success: true,
//         });
//       } else {
//         // Payment failed
//         console.log("Payment failed");
//         res.json({
//           message: "Payment failed",
//           success: false,
//         });
//       }
//     } catch (error) {
//       // Handle other errors
//       console.error("Error", error);
//       res.json({
//         message: "Payment failed",
//         success: false,
//       });
//     }
//   }
// );

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
