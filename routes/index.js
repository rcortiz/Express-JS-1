const express = require("express");
const router = express.Router();
const userRoutes = require("./userRoutes");
const grabExpressRoutes = require("./grabExpressRoutes");

// Home route
router.get("/", (req, res, next) => {
  res.render("index", { title: "Express" });
});

// Prefix user routes with /user
router.use("/user", userRoutes);

// Prefix grab-express routes with /grab-express
router.use("/grab-express", grabExpressRoutes);

module.exports = router;
