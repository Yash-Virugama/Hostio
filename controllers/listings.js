const Listing = require("../models/listing.js");
const User = require("../models/user.js");

module.exports.index = async (req, res) => {
    // ✅ UPDATED: Destructure 'owner' directly out of the URL query strings
    const { category, search, owner } = req.query;
    let filter = {};

    // If a specific category was clicked, filter the Mongoose query
    if (category) {
        filter.category = category;
    }

    // ✅ NEW: Handle Explicit Host/Owner Direct Click Filtration Route
    if (owner) {
        filter.owner = owner;
    }

    // Handle Search Query Form Text Submissions
    if (search) {
        // 1. Query matching user account reference IDs first
        const matchingUsers = await User.find({
            username: { $regex: search, $options: "i" }
        });
        const userIds = matchingUsers.map(user => user._id);

        // 2. Build complete $or condition schema matrix lookup
        filter.$or = [
            { title: { $regex: search, $options: "i" } },
            { location: { $regex: search, $options: "i" } },
            { country: { $regex: search, $options: "i" } },
            { category: { $regex: search, $options: "i" } }, 
            { owner: { $in: userIds } }                       
        ];
    }

    // Find either ALL listings or ONLY the filtered ones
    const allListings = await Listing.find(filter).populate("owner");

    // Pass options safely back down to your index rendering context engine
    res.render("listings/index.ejs", { 
        allListings, 
        currentPath: "/listings", 
        selectedCategory: category || "", 
        searchQuery: search || "" 
    });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
}

module.exports.createListing = async (req, res) => {
    let url = req.file.path;
    let filename = req.file.filename;

    const newListing = new Listing(req.body.listing);

    newListing.owner = req.user._id;
    newListing.image = { url, filename };

    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
}

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({ 
            path: "reviews", 
            populate: { path: "author" },
            options: { sort: { createdAt: -1 } } // ⏱️ Newest reviews will now always appear at the top!
        })
        .populate("owner");

    if (!listing) {
        req.flash("error", "Listing You Requested For Does Not Exist!");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
}

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing You Requested For Does Not Exist!");
        return res.redirect("/listings");
    }

    let realImageUrl = listing.image.url;
    let descaledImageUrl = realImageUrl.replace("/upload", "/upload/w_150");

    res.render("listings/edit.ejs", { listing, descaledImageUrl });
}

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
}

module.exports.suggestions = async (req, res) => {
    const { q } = req.query;
    if (!q) return res.json([]);

    try {
        const queryStr = q.trim();
        const regex = new RegExp(queryStr, "i");
        let suggestions = [];

        // ==========================================================================
        // 1. ALWAYS SHOW MATCHING CATEGORIES (EVEN WITH ZERO LISTINGS)
        // ==========================================================================
        const allCategories = [
            "Rooms", "Iconic Cities", "Mountains", "Castles", 
            "Amazing Pools", "Camping", "Farms", "Arctic", "Others"
        ];
        
        const matchedCategories = allCategories.filter(cat => regex.test(cat));
        matchedCategories.forEach(cat => {
            suggestions.push({
                id: cat, // Uses category name as ID for frontend filtering route
                text: `Category: ${cat}`
            });
        });

        // ==========================================================================
        // 2. ALWAYS SHOW MATCHING HOSTS (EVEN IF THEY HAVE ZERO LISTINGS)
        // ==========================================================================
        const matchingUsers = await User.find({
            username: { $regex: queryStr, $options: "i" }
        }).limit(3);

        matchingUsers.forEach(user => {
            suggestions.push({
                id: user._id, // Sends User ID so frontend can filter ?owner=ID
                text: `Host: ${user.username}`
            });
        });

        // Collect user IDs to use in listing lookups if needed
        const userIds = matchingUsers.map(user => user._id);

        // ==========================================================================
        // 3. FETCH MATCHING LISTINGS (BY TITLE, LOCATION, COUNTRY, ETC.)
        // ==========================================================================
        const matches = await Listing.find({
            $or: [
                { title: { $regex: queryStr, $options: "i" } },
                { location: { $regex: queryStr, $options: "i" } },
                { country: { $regex: queryStr, $options: "i" } },
                { owner: { $in: userIds } }
            ]
        }).populate("owner").limit(6);

        // Formats listing matches cleanly (omits category/host prefixes here since handled above)
        matches.forEach(item => {
            suggestions.push({
                id: item._id,
                text: `${item.title}, ${item.location}`
            });
        });

        // ==========================================================================
        // 4. FILTER OUT DUPLICATES SAFELY
        // ==========================================================================
        const uniqueSuggestions = [];
        const seenTexts = new Set();
        for (const item of suggestions) {
            if (!seenTexts.has(item.text)) {
                seenTexts.add(item.text);
                uniqueSuggestions.push(item);
            }
        }

        res.json(uniqueSuggestions);

    } catch (err) {
        console.error("--> Suggestions Backend Error:", err);
        res.json([]);
    }
};