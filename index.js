const express = require("express");
const { scrapeLogic } = require("./scrapeLogic");
const app = express()

const PORT = process.env.PORT || 4000;

app.get("/scrape",(req,res)=>{
    scrapeLogic(res);
})
app.get("/version",(req,res)=>{
    res.send("Version 5")
})

app.get('/',(req,res)=>{
    res.send("Render Puppeteer server is up and running")
})


app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})

var XMLHttpRequest = require('xhr2');
var xhr = new XMLHttpRequest();

var calls = new Object();
var messages = new Object();

function diff(obj1, obj2) {
    const result = {};
    if (Object.is(obj1, obj2)) {
        return undefined;
    }
    if (!obj2 || typeof obj2 !== 'object') {
        return obj2;
    }
    Object.keys(obj1 || {}).concat(Object.keys(obj2 || {})).forEach(key => {
        if(obj2[key] !== obj1[key] && !Object.is(obj1[key], obj2[key])) {
            result[key] = obj2[key];
        }
        if(typeof obj2[key] === 'object' && typeof obj1[key] === 'object') {
            const value = diff(obj1[key], obj2[key]);
            if (value !== undefined) {
                result[key] = value;
            }
        }
    });
    return result;
}
async function getActiveCalls(b){
  var Bearer = b
  if (Bearer==null){
    await scrapeLogic({send:function(res){
        Bearer = res
    }})
  }
    xhr.open("GET", 'https://cwv.ycdes.org/NewWorld.CadView/api/Call/GetActiveCalls');
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Authorization", `${Bearer}`);
    xhr.onreadystatechange = async function () {
        if (xhr.status == 401){
            Bearer = await scrapeLogic({send:function(res){
                Bearer = res
            }})
            getActiveCalls(Bearer)
            return
        }
        if (xhr.readyState === 4) {
            var res = JSON.parse(xhr.responseText)
            for (const a in res) {
                var c = res[a]
                if (!calls[c.callId]){
                    calls[c.callId]=c
                    console.log(`[LOG] *NEW CALL** ${c.district||""} ${c.fireCallType||c.emsCallType||c.policeCallType||"Pending"}`)
                
                }else{
                    var dif = diff(calls[c.callId],res[a])
                    calls[c.callId]=c
                    if (dif['fireCallType']){
                        console.log(`[LOG] *UPDATED CALL** ${c.district} ${c.fireCallType||c.emsCallType||c.policeCallType}`)                       
                    }
                }
            }
          getActiveCalls(Bearer)
       }
    };
    xhr.send();
}
  

  getActiveCalls()
