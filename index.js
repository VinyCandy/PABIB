const express = require("express");
const { scrapeBearer } = require("./scrapeBearer");
const { getActiveCalls } = require("./cadApi");

const app = express()

const PORT = process.env.PORT || 4000;
var BearerToken = "erghegrirgeiu"

app.get("/getbearer",(req,res)=>{
    scrapeBearer(res);
})

app.get("/getActiveCalls",async(req,res)=>{
    if (BearerToken==null) {await scrapeBearer({send:function(BT){BearerToken=BT}})}
    await getActiveCalls(BearerToken,function(calls,b){
        BearerToken = b
        res.send(calls)
    })

})

app.get('/',(req,res)=>{
    res.send("Render Puppeteer server is up and running")
})


app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})
