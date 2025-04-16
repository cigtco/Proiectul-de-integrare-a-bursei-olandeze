const shops = [
  {
    id: 35080,
    title: "CITY-R",
    type: "R",
    credentials: { password: "evamaria25", rememberMe: true, user: "CITY" }
  },
  {
    id: 53200,
    title: "CITY-D",
    type: "R",
    credentials: { password: "evamaria25", rememberMe: true, user: "CITY" }
  },
  {
    id: 81083,
    title: "X=CITY",
    type: "R",
    credentials: { password: "evamaria25", rememberMe: true, user: "CITY" }
  },
  {
    id: 53296,
    title: "CITY-P",
    type: "R",
    credentials: { password: "evamaria25", rememberMe: true, user: "CITY" }
  },
  {
    id: 145258,
    title: "CITY-DU",
    type: "R",
    credentials: { password: "evamaria25", rememberMe: true, user: "CITY" }
  },
  {
    id: 141803,
    title: "CITY-KOA",
    type: "R",
    credentials: { password: "evamaria25", rememberMe: true, user: "CITY" }
  },
  {
    id: 141804,
    title: "CITY-KOP",
    type: "R",
    credentials: { password: "evamaria25", rememberMe: true, user: "CITY" }
  }
];

const RShops = shops.map(shop => shop.title); // Dynamically generate RShops list

// API URLs
const API_URLS = {
  orders: "https://api.xlflor.com/orders?start=&end=&origin=https%3A%2F%2Fshop.xlflor.com%2Forders",
  orderDetails: "https://api.xlflor.com/order?allowPartialVariants=true&origin=https%3A%2F%2Fshop.xlflor.com%2Forder%2F2706933%3Fclosed%3Dtrue",
  login: "https://api.xlflor.com/simple-sign-in?origin=https://shop.xlflor.com/login?redirect=/dashboard"
};

// Fetch options
const fetchOptions = {
  headers: {
    accept: "application/json",
    "accept-language": "en-US,en;q=0.9",
    "sec-ch-ua": "\"Opera\";v=\"77\", \"Chromium\";v=\"91\", \";Not A Brand\";v=\"99\"",
    "sec-ch-ua-mobile": "?0",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-site"
  },
  referrer: "https://shop.xlflor.com/",
  referrerPolicy: "strict-origin-when-cross-origin",
  method: "GET",
  mode: "cors",
  credentials: "include"
};

const fetchOptionsLogin = {
  headers: {
    accept: "*/*",
    "accept-language": "en-US,en;q=0.9",
    "content-type": "application/json",
    "sec-ch-ua": "\"Chromium\";v=\"92\", \" Not A;Brand\";v=\"99\", \"Google Chrome\";v=\"92\"",
    "sec-ch-ua-mobile": "?0",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-site"
  },
  referrer: "https://shop.xlflor.com/",
  referrerPolicy: "strict-origin-when-cross-origin",
  method: "POST",
  mode: "cors",
  credentials: "include"
};

// Function to login to a shop
async function loginToShop(shop) {
  const body = JSON.stringify(shop.credentials);
  const options = { ...fetchOptionsLogin, body };

  try {
    const response = await fetch(API_URLS.login, options);
    if (!response.ok) throw new Error(`Login failed for shop: ${shop.title}`);
    console.log(`Logged in to shop: ${shop.title}`);
  } catch (error) {
    console.error(error);
  }
}

// Function to fetch orders
async function fetchOrders() {
  try {
    const response = await fetch(API_URLS.orders, fetchOptions);
    if (!response.ok) throw new Error("Failed to fetch orders");
    const orders = await response.json();
    console.log("Orders fetched:", orders);
    return orders;
  } catch (error) {
    console.error(error);
  }
}

// Function to fetch order details
async function fetchOrderDetails(orderId) {
  const url = `${API_URLS.orderDetails}&orderId=${orderId}`;
  try {
    const response = await fetch(url, fetchOptions);
    if (!response.ok) throw new Error(`Failed to fetch details for order ID: ${orderId}`);
    const orderDetails = await response.json();
    console.log(`Order details for ID ${orderId}:`, orderDetails);
    return orderDetails;
  } catch (error) {
    console.error(error);
  }
}

// Example usage
(async () => {
  // Login to all shops
  for (const shop of shops) {
    await loginToShop(shop);
  }

  // Fetch orders
  const orders = await fetchOrders();

  // Fetch details for the first order (if available)
  if (orders && orders.length > 0) {
    await fetchOrderDetails(orders[0].id);
  }
})();