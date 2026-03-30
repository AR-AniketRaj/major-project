const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

require("dotenv").config({ path: "../.env" });

const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");


const geocoder = mbxGeocoding({ accessToken: process.env.MAP_TOKEN });

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
.then(() => {
    console.log("connection successful");
    initDB();
})
.catch(err => {
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    await Listing.deleteMany({});

    let updatedData = [];

    for (let obj of initData.data) {
        let response = await geocoder.forwardGeocode({
            query: obj.location,
            limit: 1,
        }).send();

        // ❗ safety check
        if (!response.body.features.length) {
            console.log("Skipping invalid location:", obj.location);
            continue;
        }

        let geometry = {
            type: "Point",
            coordinates: response.body.features[0].geometry.coordinates
        };

        updatedData.push({
            ...obj,
            owner: "69be2b96ddb64dd7c0840281",
            geometry
        });
    }

    await Listing.insertMany(updatedData);
    console.log("data was initialized with coordinates");
};