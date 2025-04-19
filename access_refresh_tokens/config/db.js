const mongoose= require("mongoose");
const dbURL= process.env.mongo_connection_string;
const AdminSchema= require("../models/admin.js");

try{
    mongoose.connect(dbURL);
    console.log("Successfully connected to the DB");
}catch{
    console.log("Could not connect to the DB");
}

const Admin= mongoose.model("Admin",AdminSchema);

module.exports={
    Admin: Admin
};