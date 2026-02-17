const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
    },
    description: String,
    image: {
        filename: {
           type: String,
           default: 
            "https://unsplash.com/photos/palm-trees-silhouetted-against-a-vibrant-sunset-over-the-ocean-wyL7JqCVY1Q",
        },
        url: {
            type: String,
            default: "https://unsplash.com/photos/palm-trees-silhouetted-against-a-vibrant-sunset-over-the-ocean-wyL7JqCVY1Q"
        },
    },    
    price: Number,
    location: String,
    country: String,
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;