var currentTab;
var version = "1.0";
var orders = [];

function onAttach(tabId) {

    chrome.debugger.sendCommand({
        tabId: tabId
    }, "Fetch.enable",{
        patterns: [{
            urlPattern: "https://mobile.fleurametz.com/*",
            requestStage: "Response"
        }]
    });

    chrome.debugger.onEvent.addListener(allEventHandler);

}

function allEventHandler(debuggeeId, message, params) {

    if (currentTab.id != debuggeeId.tabId) {
        return;
    }

    var debParams = new Object({
        tabId: debuggeeId.tabId
    });
    var reqParams = new Object({
                    "requestId": params.requestId
                });

    if (message == "Fetch.requestPaused") 
        try{

            if(params.request.url.indexOf("https://mobile.fleurametz.com/update-variant") >= 0)
                chrome.debugger.sendCommand(debParams, "Fetch.getResponseBody", reqParams, 
                    (response) => {
                        try{
                            let body = new Object();

                            if(response.base64Encoded)
                                body = JSON.parse(atob(response.body));
                            else
                                body = JSON.parse(response.body); 

                            makeRequest(body,"update-variant");
                        }
                        catch(e){console.log("Error: " + e)}
                    })

             if(params.request.url.indexOf("https://mobile.fleurametz.com/order?allowPartialVariants=false") >= 0)
                chrome.debugger.sendCommand(debParams, "Fetch.getResponseBody", reqParams, 
                    (response) => {
                        try{
                            let body = new Object();

                            if(response.base64Encoded)
                                body = JSON.parse(atob(response.body));
                            else
                                body = JSON.parse(response.body); 

                            orders.push(body);
                        }
                        catch(e){console.log("Error: " + e)}
                    })

            if(params.request.url.indexOf("https://mobile.fleurametz.com/dates?") >= 0)
                chrome.debugger.sendCommand(debParams, "Fetch.getResponseBody", reqParams, 
                    (response) => {
                        try{
                            let body = new Object();

                            if(response.base64Encoded)
                                body = JSON.parse(atob(response.body));
                            else
                                body = JSON.parse(response.body); 

                            localStorage["shopType"] = shops.find(getType,{title:body.shop.title}).type;
                        }
                        catch(e){console.log("Error: " + e)}
                    })

            chrome.debugger.sendCommand(debParams, "Fetch.continueRequest", reqParams);
        }catch(e){
            console.log("Error: " + e)
            chrome.debugger.sendCommand(debParams, "Fetch.continueRequest", reqParams);;
        };
}

function getType(element){
    return element.title == this.title;
}

function makeRequest(data,requestType) {
    var url = "https://script.google.com/macros/s/AKfycbwgxD39YH50DphH2lBaGVE-dTfndofB_CxR4623URCfJNc89dmgdr5G1aBrTviWceJE/exec";
    //requestType = "2"
    //console.log("--makeRequest:");
    //console.log("Data:" + JSON.stringify(data));
    //console.log("requestType:" + requestType)
    url = url +"requestType=" + requestType;
    /*fetch(url,{
        method: "POST",
        headers: {
          'Content-Type': 'text/plain'
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer',
        body: JSON.stringify(new Object({name: "Gabor Botond", Age: 29}))
    })
    .then((resp) => console.log("Fetch succeded: " + JSON.stringify(resp)))
    .catch((error) => console.log("Error while fecth: " + error));*/
    var request = jQuery.post(url, JSON.stringify(data),
        (data) => {
            console.log("Response: " + data);
        },
        "text");
}

chrome.tabs.query( //get current Tab
    {
        url: 'https://web.fleurametz.com/*'
    },
    function(tabArray) {
        currentTab = tabArray[0];
        chrome.debugger.attach({ //debug at current tab
            tabId: currentTab.id
        }, version, onAttach.bind(null, currentTab.id));
    }
)