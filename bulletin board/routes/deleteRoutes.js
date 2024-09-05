const { ObjectId } = require("mongodb");

module.exports = (app, adsCollection, authenticate) => {
  app.delete("/ads/:_id", authenticate, async (req, res) => {
    try {
      const id = req.params._id;
      const ad = await adsCollection.findOne({ _id: new ObjectId(id) });

      if (!ad) {
        return res.status(404).send({ message: "Ad not found" });
      }

      if (ad.username !== req.user.username) {
        return res
          .status(403)
          .send({ message: "Forbidden: You can only delete your own ads" });
      }

      const result = await adsCollection.deleteOne({ _id: new ObjectId(id) });
      res.status(200).send({ message: "Ad deleted successfully" });
    } catch (error) {
      console.error("Error deleting ad:", error);
      res
        .status(500)
        .send({ message: "Failed to delete ad", error: error.message });
    }
  });
};
