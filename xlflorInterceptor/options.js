var oldOrders = [];

$(document).ready(function(){
  $("#shop-type").prop("value",localStorage["shopType"]);
  $('#order-date').prop("value",localStorage["orderDate"]);
  $('#sync-interval').prop("value",localStorage["syncInterval"]);
  syncOrders();
});

//Event handlers
$("#syncOrders").click(syncOrders);
$("#syncToGoogle").click(function(){
  $(".sync-chkbx").each(function(index){
    if($(this).prop("checked")){
      fetch(fleuraOrderURL + "&order=" + $(this).attr("orderId"),fetchOptions)
        .then(resp => resp.json())
        .then(data => makeRequest(data,"order"))
        .catch((error) => {
          console.log("Error while syncing to google drive: " + error);
        });
    }
  });
})
$("#shop-type").change(function(){
  localStorage["shopType"] = $("#shop-type").prop("value");
});
$('#order-date').change(function(){
  localStorage["orderDate"] = $('#order-date').prop("value");
  syncOrders();
});
$('#sync-interval').change(function(){
  localStorage["syncInterval"] = $('#sync-interval').prop("value");
});
$('#autoSync').change(function() {

  if(!validateOrderDate()){
    alert("Select date!");
    return;
  }
  if($(this).prop('checked'))
    sessionStorage["autoSyncOrdersId"] = setInterval(autoSyncOrders,$('#sync-interval').prop("value")*1000);
  else
    clearInterval(sessionStorage["autoSyncOrdersId"]);
})

function makeRequest(data,requestType) {
    //var url = "https://script.google.com/macros/s/AKfycbwgxD39YH50DphH2lBaGVE-dTfndofB_CxR4623URCfJNc89dmgdr5G1aBrTviWceJE/exec?";
    var url = "https://";
    url = url +"requestType=" + requestType;
    var request = jQuery.post(url, JSON.stringify(data),
        (data) => {
            console.log("Response: " + data);
        },
        "text");
}

function syncOrders(){
  $("#data").empty();
  shops.forEach(async function(shop){
    if(shop.type == localStorage["shopType"]){
      let response = await fetch(fleuraOrdersURL + "&shop=" + shop.id,fetchOptions).catch();

      //if not logged in, status is 439
      if(response.status == 439){
        await login(shop);
        response = await fetch(fleuraOrdersURL + "&shop=" + shop.id,fetchOptions);
      }
      let orders = await response.json();
      let resTemplates = await fetch("templates.htm");
      let templates = await resTemplates.text();
      template = $(templates).filter('#tpl-order').html();
      myOrders = orders.closedOrders.concat(orders.openOrders);
      if(validateOrderDate())
        myOrders = myOrders.filter(function(order){
          return order.date.date == localStorage["orderDate"];
        });
      if(Array.isArray(myOrders) && myOrders.length){
        $("#data").append("<div class='container'>");
        $("#data").append("<h4>" + shop.title + "</h4>");
        $('#data').append(Mustache.render(template,{orders:myOrders,shop:shop.title}));
        $("#data").append("</div>");
      }
    }
  })
}

function autoSyncOrders(){
  shops.forEach(async function(shop){
    if(shop.type == localStorage["shopType"]){
      let response = await fetch(fleuraOrdersURL + "&shop=" + shop.id,fetchOptions);
      
      //if not logged in, status is 439
      if(response.status == 439){
        await login(shop);
        response = await fetch(fleuraOrdersURL + "&shop=" + shop.id,fetchOptions);
      }

      let orders = await response.json();

      myOrders = orders.closedOrders.concat(orders.openOrders);

      if(validateOrderDate()){
        myOrders = myOrders.filter(function(order){
          var foundOrder = oldOrders.find(function(oldOrder){
            return oldOrder.id == this;
          },order.id)

          if(foundOrder != undefined)
            return order.date.date == localStorage["orderDate"] &&
                   (order.variantCount != foundOrder.variantCount || 
                    order.totalPrice != foundOrder.totalPrice);
          else
            return order.date.date == localStorage["orderDate"];  
        });

        if(myOrders.length){
          oldOrders = [];

          myOrders.forEach(async function(order){
            fetch(fleuraOrderURL + "&order=" + order.id,fetchOptions)
            .then(resp => resp.json())
            .then(data => {
              makeRequest(data,"order");
              oldOrders.push(data.order);
            })
            .catch((error) => {
              console.log("Error while syncing to google drive: " + error);
            });
          });
        }
      }
    }
  })
}

function validateOrderDate(){
  return localStorage["orderDate"] != undefined && localStorage["orderDate"] != "";
}

async function login(shop){
  //load empty fetchOptionsLogin then set credentials for specific shop
  fOptions = fetchOptionsLogin;
  fOptions.body = shop.credentials;

  //login
  await fetch(fleuraLoginURL,fOptions);
}

