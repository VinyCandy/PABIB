const express = require("express");
const { scrapeLogic } = require("./scrapeLogic");
const app = express()

const PORT = process.env.PORT || 4000;

app.get("/scrape",(req,res)=>{
    scrapeLogic(res);
})
app.get("/version",(req,res)=>{
    res.send("Version 4")
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
                    if (c.fireCallType=="CONTROL BURN"){
                        messages[c.callId]='CONTROL BURN'
                    }else{
                        try {
                            messages[c.callId] = sendMessage(`<b>! box ${c.district||""} ${c.fireCallType||c.emsCallType||c.policeCallType||"Pending"}</b>\n${c.location||""}\n${c.natureOfCall||""}\n${c.createDateTime||""}`,c.callId)
                        } catch (error) {
                            console.log('Send Error')
                        }
                    }
                   
                    
                
                }else{
                    var dif = diff(calls[c.callId],res[a])
                    calls[c.callId]=c
                    if (dif['fireCallType']){
                        console.log(`[LOG] *UPDATED CALL** ${c.district} ${c.fireCallType||c.emsCallType||c.policeCallType}`)
                        try {
                            bot.sendMessage(-1001260432630,"UPDATE: "+dif['fireCallType'],{parse_mode: 'HTML',reply_to_message_id:messages[c.callId]})
                        } catch (error) {
                            console.log('Response Error')
                        }
                       
                    }
                }
            }
          getActiveCalls(Bearer)
       }
    };
    xhr.send();
}
getActiveCalls()
  


const TelegramBot = require('node-telegram-bot-api');
  const token = process.env.BOT_TOKEN
  const bot = new TelegramBot(token, {polling: true});
  
  bot.sendMessage(-1001260432630,"Starting Up",{disable_notification: true,parse_mode: 'HTML'})
  
  async function sendMessage(msg,newcall){
      var msg = await bot.sendMessage(-1001260432630,msg,{parse_mode: 'HTML'})
      messages[newcall] = msg.message_id
  }
  

  bot.on('message', (msg) => {
      const chatId = msg.chat.id;
      bot.sendMessage(chatId, 'Received your message');
  });