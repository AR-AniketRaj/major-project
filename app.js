const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const{ listingSchema } = require("./schema.js");
const Review = require("./models/review.js");



const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main ()
.then(() => {
    console.log("connection successful");
})
.catch(err => {
    console.log(err);
})

async function main() {
    await mongoose.connect(MONGO_URL);
}


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


app.get("/", (req, res) => {
    res.send("HI, I am root");
});


const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);

    if(error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next ();
    }
};

//index Route
app.get("/listings", wrapAsync(async (req, res, next) => {
   const allListings = await Listing.find({});
   res.render("listings/index.ejs", { allListings });
}));


//New Route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
});

//Show Route
app.get("/listings/:id", wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findById( id );
    res.render("listings/show.ejs", { listing });
}));

//Create Route
app.post("/listings", validateListing, wrapAsync(async(req, res, next) => {
    // let { title, description, image, price, country, location } = req.body;
    // let listing = req.body.listing;
    //or
   
    console.log(req.body);
    const newListing =  new Listing(req.body.listing);
    await newListing.save();
    console.log(newListing);
    res.redirect("/listings");
}));

//Edit Route
app.get("/listings/:id/edit", wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
}));

//Update Route
app.put("/listings/:id", validateListing, wrapAsync(async (req, res, next) => {

    let { id } = req.params;
    let updatedData = await Listing.findByIdAndUpdate(id, {...req.body.Listing});
    updatedData.image = {
        filename: "listingimage",
        url: req.body.Listing.image
    };
    res.redirect(`/listings/${id}`);
}));

//Delete Route
app.delete("/listings/:id", wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}));

//Reviews
//post route
app.post("/listings/:id/reviews", async(req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    res.redirect(`/listings/${listing._id}`);
});



// app.get("/testListing", async (req, res) => {
//     let sampleListing = new Listing({
//        title: "My New Villa",
//        description: "By the beach",
//        price: 1200,
//        location: "calangute, Goa",
//        country: "India",
//     });

//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successful working");
// });

app.use((req, res, next) => {
   next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "something went wrong" } = err;
    res.status(statusCode).render("error.ejs", { message });
    // res.status(statusCode).send(message);
});    

app.listen(8080, () => {
    console.log("server is listening to the port 8080");
});