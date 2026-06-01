const mongoose = require("mongoose");
const initData = require("./data.js"); 
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/hostio";

async function main() {
    try {
        await mongoose.connect(MONGO_URL);
        console.log("DB connected");
        await initDB();
    } catch (err) {
        console.log(err);
    }
}

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data= initData.data.map((obj) => ({...obj, owner: "6a0c2734544c5221eefa35fd"}));
    await Listing.insertMany(initData.data); 
    
    console.log("Data was initialized");
};

main();