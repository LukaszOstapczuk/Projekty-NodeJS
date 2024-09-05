const { body, validationResult } = require("express-validator");
const { ObjectId } = require("mongodb");

module.exports = (app, adsCollection, authenticate) => {
  const updateValidationRules = [
    body("title").optional().notEmpty().withMessage("Title cannot be empty"),
    body("description")
      .optional()
      .notEmpty()
      .withMessage("Description cannot be empty"),
    body("author").optional().notEmpty().withMessage("Author cannot be empty"),
    body("category")
      .optional()
      .notEmpty()
      .withMessage("Category cannot be empty"),
    body("tags")
      .optional()
      .isArray({ min: 1 })
      .withMessage("At least one tag is required"),
    body("price")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("Price must be a positive number"),
    body("country")
      .optional()
      .notEmpty()
      .withMessage("Country of shipping is required"),
    body("deliveryTime")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Delivery time must be at least 1 day"),
    body("extendedInsurance")
      .optional()
      .isIn(["yes", "no"])
      .withMessage('Extended insurance must be either "yes" or "no"'),
  ];

  app.patch(
    "/ads/:_id",
    authenticate,
    updateValidationRules,
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      try {
        const id = req.params._id;
        const updateData = req.body;

        const ad = await adsCollection.findOne({ _id: new ObjectId(id) });
        if (!ad) {
          return res.status(404).send({ message: "Ad not found" });
        }

        if (ad.username !== req.user.username) {
          return res
            .status(403)
            .send({ message: "Forbidden: You can only update your own ads" });
        }

        const result = await adsCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: updateData }
        );
        if (result.modifiedCount === 0) {
          return res.status(200).send({ message: "No changes made to the ad" });
        }

        res.status(200).send({ message: "Ad updated successfully" });
      } catch (error) {
        console.error("Error updating ad:", error);
        res
          .status(500)
          .send({ message: "Failed to update ad", error: error.message });
      }
    }
  );
};
