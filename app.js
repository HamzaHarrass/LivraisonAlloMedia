const express = require("express");
require("./config/DBConnection")()
const app = express();
const authRouter = require("./routes/authRouter");
const cors = require('cors');


app.use(express.json());
require('dotenv').config();

app.use(cors({
    origin : "http://localhost:5174"
}))
app.get('/',(req,res)=>{
    res.status(200).json({message:"ALL IS GOOD"})
})
app.use("/auth",authRouter);

app.listen(3000,()=>{
    console.log("IS WORK ");
});