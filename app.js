const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");



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

app.get("/", (req, res) => {
    res.send("HI, I am root");
});

app.get("/testListing", async (req, res) => {
    let sampleListing = new Listing({
       title: "My New Villa",
       description: "By the beach",
       price: 1200,
       location: "calangute, Goa",
       country: "India",
    });

    await sampleListing.save();
    console.log("sample was saved");
    res.send("successful working");
});

app.listen(8080, () => {
    console.log("server is listening to the port 8080");
});