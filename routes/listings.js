const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn, isOwner, validateListing } = require("../middleware");
const listings = require("../controllers/listings");
const multer = require("multer");
const { storage } = require("../cloudConfig");
const upload = multer({ storage });

// Show all listings + Create listing
router.route("/")
  .get(wrapAsync(listings.index))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listings.createListing)
  );

// ✅ Search route should be ABOVE the dynamic :id route
router.get("/search", wrapAsync(listings.searchListings));

// Render new listing form
router.get("/new", isLoggedIn, listings.renderNewForm);

// Render edit form
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listings.renderEditForm));

// Show, Update, Delete specific listing
router.route("/:id")
  .get(wrapAsync(listings.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("image"),
    validateListing,
    wrapAsync(listings.updateListing)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listings.deleteListing));

module.exports = router;
