const mongoose = require("mongoose");

const initData = require("./data.js");
const listing = require("../models/listing.js");

main()
    .then(() => {
        console.log("Connected Successfully");
    })
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/bookmenow');
}

// database ma paila dekhi nai data cha bhane teslai completely clean garne ani naya data halne
const initDB = async ()=>{
    await listing.deleteMany({});
    await listing.insertMany(initData.data);
    console.log("Data was initalized");
}
initDB();
