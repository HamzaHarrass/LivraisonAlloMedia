const express = require("express");
require("./config/DBConnection")()
const app = express();
const authRouter = require("./routes/authRouter");
app.use(express.json());


app.get('/',(req,res)=>{
    res.status(200).json({message:"koulchi mzn"})
})

app.use("/auth",authRouter);

app.listen(3000,()=>{
    console.log("rak khdam rak 3ajbni");
});