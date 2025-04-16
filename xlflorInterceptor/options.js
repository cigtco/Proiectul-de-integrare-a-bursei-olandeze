const oldOrders = [];
const fleuraOrdersURL = "https://api.xlflor.com/orders?start=&end=&origin=https%3A%2F%2Fshop.xlflor.com%2Forders";
const fleuraOrderURL = "https://api.xlflor.com/order?allowPartialVariants=true&origin=https%3A%2F%2Fshop.xlflor.com%2Forder%2F2706933%3Fclosed%3Dtrue";
const fleuraLoginURL = "https://api.xlflor.com/simple-sign-in?origin=https://shop.xlflor.com/login?redirect=/dashboard";

$(document).ready(function () {
  // Initialize UI with saved settings
  $("#shop-type").val(localStorage["shopType"]);
  $("#order-date").val(localStorage["orderDate"]);
  $("#sync-interval").val(localStorage["syncInterval"]);
  syncOrders();
});

// Event Handlers
$("#syncOrders").click(syncOrders);
$("#syncToGoogle").click(syncToGoogle);
$("#shop-type").change(() => localStorage["shopType"] = $("#shop-type").val());
$("#order-date").change(() => {
  localStorage["orderDate"] = $("#order-date").val();
  syncOrders();
});
$("#sync-interval").change(() => localStorage["syncInterval"] = $("#sync-interval").val());
$("#autoSync").change(toggleAutoSync);

// Function to sync orders
async function syncOrders() {
  $("#data").empty();
  for (const shop of shops) {
    if (shop.type === localStorage["shopType"]) {
      try {
        let response = await fetchOrdersForShop(shop);
        let orders = await response.json();
        let templates = await fetch("templates.htm").then(res => res.text());
        let template = $(templates).filter("#tpl-order").html();

        let myOrders = [...orders.closedOrders, ...orders.openOrders];
        if (validateOrderDate()) {
          myOrders = myOrders.filter(order => order.date.date === localStorage["orderDate"]);
        }

        if (myOrders.length) {
          $("#data").append(`<div class='container'><h4>${shop.title}</h4></div>`);
          $("#data").append(Mustache.render(template, { orders: myOrders, shop: shop.title }));
        }
      } catch (error) {
        console.error(`Error syncing orders for shop ${shop.title}:`, error);
      }
    }
  }
}

// Function to fetch orders for a specific shop
async function fetchOrdersForShop(shop) {
  let response = await fetch(`${fleuraOrdersURL}&shop=${shop.id}`, fetchOptions);
  if (response.status === 439) {
    await login(shop); // Login if not authenticated
    response = await fetch(`${fleuraOrdersURL}&shop=${shop.id}`, fetchOptions);
  }
  return response;
}

// Function to sync orders to Google Drive
function syncToGoogle() {
  $(".sync-chkbx").each(function () {
    if ($(this).prop("checked")) {
      const orderId = $(this).attr("orderId");
      fetch(`${fleuraOrderURL}&order=${orderId}`, fetchOptions)
        .then(resp => resp.json())
        .then(data => makeRequest(data, "order"))
        .catch(error => console.error("Error syncing to Google Drive:", error));
    }
  });
}

// Function to toggle auto-sync
function toggleAutoSync() {
  if (!validateOrderDate()) {
    alert("Select date!");
    return;
  }
  if ($("#autoSync").prop("checked")) {
    sessionStorage["autoSyncOrdersId"] = setInterval(autoSyncOrders, $("#sync-interval").val() * 1000);
  } else {
    clearInterval(sessionStorage["autoSyncOrdersId"]);
  }
}

// Function to auto-sync orders
async function autoSyncOrders() {
  for (const shop of shops) {
    if (shop.type === localStorage["shopType"]) {
      try {
        let response = await fetchOrdersForShop(shop);
        let orders = await response.json();

        let myOrders = [...orders.closedOrders, ...orders.openOrders];
        if (validateOrderDate()) {
          myOrders = myOrders.filter(order => {
            const foundOrder = oldOrders.find(oldOrder => oldOrder.id === order.id);
            return foundOrder
              ? order.date.date === localStorage["orderDate"] &&
                (order.variantCount !== foundOrder.variantCount || order.totalPrice !== foundOrder.totalPrice)
              : order.date.date === localStorage["orderDate"];
          });

          if (myOrders.length) {
            oldOrders.length = 0; // Clear old orders
            for (const order of myOrders) {
              fetch(`${fleuraOrderURL}&order=${order.id}`, fetchOptions)
                .then(resp => resp.json())
                .then(data => {
                  makeRequest(data, "order");
                  oldOrders.push(data.order);
                })
                .catch(error => console.error("Error syncing to Google Drive:", error));
            }
          }
        }
      } catch (error) {
        console.error(`Error auto-syncing orders for shop ${shop.title}:`, error);
      }
    }
  }
}

// Function to validate order date
function validateOrderDate() {
  return localStorage["orderDate"] && localStorage["orderDate"] !== "";
}

// Function to login to a shop
async function login(shop) {
  const options = { ...fetchOptionsLogin, body: JSON.stringify(shop.credentials) };
  await fetch(fleuraLoginURL, options);
}

// Function to make a request to Google Apps Script
function makeRequest(data, requestType) {
  const url = `https://script.google.com/macros/s/AKfycbwgxD39YH50DphH2lBaGVE-dTfndofB_CxR4623URCfJNc89dmgdr5G1aBrTviWceJE/exec?requestType=${requestType}`;
  $.post(url, JSON.stringify(data), response => console.log("Response:", response), "text");
}