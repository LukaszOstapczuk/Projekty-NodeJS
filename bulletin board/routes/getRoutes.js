const { ObjectId } = require("mongodb");

module.exports = (app, adsCollection) => {
  app.get("/heartbeat", (req, res) => {
    res.send({ datetime: new Date().toISOString() });
  });

  app.get("/ads/:_id", async (req, res) => {
    try {
      const id = req.params._id;
      const ad = await adsCollection.findOne({
        _id: new ObjectId(id),
      });

      if (!ad) {
        res.status(404).send("Ad not found");
        return;
      }

      res.format({
        "text/plain": function () {
          res.send(
            `Title: ${ad.title}\n` +
              `Description: ${ad.description}\n` +
              `Author: ${ad.author}\n` +
              `Category: ${ad.category}\n` +
              `Tags: ${ad.tags.join(", ")}\n` +
              `Price: ${ad.price}\n` +
              `Country of Shipping: ${ad.country}\n` +
              `Delivery Time: ${ad.deliveryTime} days\n` +
              `Extended Insurance: ${ad.extendedInsurance}`
          );
        },
        "text/html": function () {
          res.send(
            `<html><body>` +
              `<h1>${ad.title}</h1>` +
              `<p><strong>Description:</strong> ${ad.description}</p>` +
              `<p><strong>Author:</strong> ${ad.author}</p>` +
              `<p><strong>Category:</strong> ${ad.category}</p>` +
              `<p><strong>Tags:</strong> ${ad.tags.join(", ")}</p>` +
              `<p><strong>Price:</strong> ${ad.price}</p>` +
              `<p><strong>Country of Shipping:</strong> ${ad.country}</p>` +
              `<p><strong>Delivery Time:</strong> ${ad.deliveryTime} days</p>` +
              `<p><strong>Extended Insurance:</strong> ${ad.extendedInsurance}</p>` +
              `</body></html>`
          );
        },

        "application/json": function () {
          res.json(ad);
        },

        default: function () {
          res.status(406).send("Not Acceptable");
        },
      });
    } catch (error) {
      console.error("Error fetching ad:", error);
      res
        .status(500)
        .send({ message: "Failed to fetch ad", error: error.message });
    }
  });

  app.get("/ads", async (req, res) => {
    try {
      const ads = await adsCollection.find({}).toArray();
      res.send(ads);
    } catch (error) {
      console.error("Error fetching ads:", error);
      res
        .status(500)
        .send({ message: "Failed to fetch ads", error: error.message });
    }
  });

  app.get("/search", async (req, res) => {
    try {
      let query = {};

      if (req.query.title) {
        query.title = { $regex: req.query.title, $options: "i" };
      }
      if (req.query.tags) {
        query.tags = { $all: req.query.tags.split(",") };
      }
      if (req.query.country) {
        query.country = { $regex: req.query.country, $options: "i" };
      }
      if (req.query.category) {
        query.category = { $regex: req.query.category, $options: "i" };
      }
      if (req.query.minPrice || req.query.maxPrice) {
        query.price = {};
        if (req.query.minPrice) {
          query.price.$gte = parseFloat(req.query.minPrice);
        }
        if (req.query.maxPrice) {
          query.price.$lte = parseFloat(req.query.maxPrice);
        }
      }

      const ads = await adsCollection.find(query).toArray();
      res.status(200).json(ads);
    } catch (error) {
      console.error("Error during search:", error);
      res
        .status(500)
        .send({ message: "Error while searching ads", error: error.message });
    }
  });
};
