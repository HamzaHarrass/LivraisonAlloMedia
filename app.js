const express = require("express");
const app = express();
require("./config/DBConnection")()
app.get('/',(req,res)=>{
    res.status(200).json({message:"koulchi mzn"})
})

app.listen(3000,()=>{
    console.log("rak khdam rak 3ajbni");
});