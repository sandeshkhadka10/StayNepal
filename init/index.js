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
    initData.data = initData.data.map((obj)=>({
        ...obj,
        owner : '6826bfdf9b71db836d33e082'
    }));
    await listing.insertMany(initData.data);
    console.log("Data was initalized");
}
initDB();
