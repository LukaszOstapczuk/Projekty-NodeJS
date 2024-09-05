const { body, validationResult } = require("express-validator");
const authenticate = require("../auth");

module.exports = (app, adsCollection) => {
  app.post(
    "/ads",
    authenticate,
    [
      body("title").notEmpty().withMessage("Title is required"),
      body("description").notEmpty().withMessage("Description is required"),
      body("author").notEmpty().withMessage("Author is required"),
      body("category").notEmpty().withMessage("Category is required"),
      body("tags")
        .isArray({ min: 1 })
        .withMessage("At least one tag is required"),
      body("price")
        .isFloat({ min: 0 })
        .withMessage("Price must be a positive number"),
      body("country").notEmpty().withMessage("Country of shipping is required"),
      body("deliveryTime")
        .isInt({ min: 1 })
        .withMessage("Delivery time must be at least 1 day"),
      body("extendedInsurance")
        .isIn(["yes", "no"])
        .withMessage('Extended insurance must be either "yes" or "no"'),
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      try {
        const ad = req.body;
        ad.username = req.user.username;
        const result = await adsCollection.insertOne(ad);
        res.status(201).send(result);
      } catch (error) {
        console.error("Error adding ad:", error);
        res
          .status(500)
          .send({ message: "Failed to add ad", error: error.message });
      }
    }
  );
};
