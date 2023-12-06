var XMLHttpRequest = require('xhr2');
var xhr = new XMLHttpRequest();

const { scrapeBearer } = require('./scrapeBearer')

getActiveCalls = async function (Bearer,run){
    console.log('Getting Calls')
    xhr.open("GET", 'https://cwv.ycdes.org/NewWorld.CadView/api/Call/GetActiveCalls');
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Authorization", `${Bearer}`);

    var calls
    var reloading = false
    xhr.onreadystatechange = async function () {
        if (xhr.status == 401) { 
            if (reloading==true) return
            reloading = true
            return scrapeBearer( {send:function(b){
                getActiveCalls(b,run)
            }})
        }
        if (xhr.readyState != 4) return "NOT READY"

        calls = JSON.parse(xhr.responseText)
        run(calls,Bearer)
     }

     xhr.send()
}


module.exports = { getActiveCalls}