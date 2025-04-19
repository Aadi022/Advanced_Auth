const mongoose= require("mongoose");

const AdminSchema= new mongoose.Schema({
    FirstName: String,
    LastName: String,
    Email: String,
    Password: String
});

module.exports= AdminSchema;