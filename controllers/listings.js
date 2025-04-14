const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new");
};

module.exports.createListing = async (req, res, next) => {
    const { title, description, price, location, country } = req.body.listing;

    if (!req.file) {
        throw new Error("Image upload failed");
    }

    const image = {
        url: req.file.path,
        filename: req.file.filename,
    };

    const listing = new Listing({
        title,
        description,
        price,
        location,
        country,
        image,
        owner: req.user._id,
    });

    await listing.save();
    req.flash("success", "Listing created successfully!");
    // res.redirect(`/listings/${listing._id}`);
    res.redirect("/listings");
};

module.exports.showListing = async (req, res) => {
    const listing = await Listing.findById(req.params.id)
        .populate({ path: "reviews", populate: { path: "author" } })
        .populate("owner");

    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }

    res.render("listings/show", { listing });
};

module.exports.renderEditForm = async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/,w_250");

    res.render("listings/edit", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
    const { id } = req.params;
    const updatedData = { ...req.body.listing };

    if (req.file) {
        updatedData.image = {
            url: req.file.path,
            filename: req.file.filename,
        };
    }

    const listing = await Listing.findByIdAndUpdate(id, updatedData, { new: true });
    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }

    req.flash("success", "Listing updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
    const listing = await Listing.findByIdAndDelete(req.params.id);
    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }

    req.flash("success", "Listing deleted!");
    res.redirect("/listings");
};

module.exports.searchListings = async (req, res) => {
    const { location } = req.query;

    const listings = await Listing.find({
        location: { $regex: location, $options: "i" },
    });

    res.render("listings/searchResults", { listings, location });
};
