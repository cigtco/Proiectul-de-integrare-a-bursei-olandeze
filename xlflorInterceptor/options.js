const shops = [
  {
    id: 35080,
    title: "CITY-R",
    type: "R",
    credentials: {
      password: "evamaria25",
      rememberMe: true,
      user: "CITY"
    }
  },
  {
    id: 53200,
    title: "CITY-D",
    type: "R",
    credentials: {
      password: "evamaria25",
      rememberMe: true,
      user: "CITY"
    }
  },
  {
    id: 81083,
    title: "X=CITY",
    type: "R",
    credentials: {
      password: "evamaria25",
      rememberMe: true,
      user: "CITY"
    }
  },
  {
    id: 53296,
    title: "CITY-P",
    type: "R",
    credentials: {
      password: "evamaria25",
      rememberMe: true,
      user: "CITY"
    }
  },
  {
    id: 145258,
    title: "CITY-DU",
    type: "R",
    credentials: {
      password: "evamaria25",
      rememberMe: true,
      user: "CITY"
    }
  },
  {
    id: 141803,
    title: "CITY-KOA",
    type: "R",
    credentials: {
      password: "evamaria25",
      rememberMe: true,
      user: "CITY"
    }
  },
  {
    id: 141804,
    title: "CITY-KOP",
    type: "R",
    credentials: {
      password: "evamaria25",
      rememberMe: true,
      user: "CITY"
    }
  }
];

const RShops = ["CITY-R", "X=CITY", "CITY-D", "CITY-P", "CITY-DU", "CITY-KOA", "CITY-KOP"];

const fetchOptions = {
  headers: {
    accept: "application/json",
    "accept-language": "en-US,en;q=0.9",
    "sec-ch-ua": '"Opera";v="77", "Chromium";v="91", ";Not A Brand";v="99"',
    "sec-ch-ua-mobile": "?0",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-site"
  },
  referrer: "https://shop.xlflor.com/",
  referrerPolicy: "strict-origin-when-cross-origin",
  body: null,
  method: "GET",
  mode: "cors",
  credentials: "include"
};

const fetchOptionsLogin = {
  headers: {
    accept: "*/*",
    "accept-language": "en-US,en;q=0.9,hu-HU;q=0.8,hu;q=0.7,ro-RO;q=0.6,ro;q=0.5",
    "content-type": "application/json",
    "sec-ch-ua": '"Chromium";v="92", "Not A;Brand";v="99", "Google Chrome";v="92"',
    "sec-ch-ua-mobile": "?0",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-site"
  },
  referrer: "https://shop.xlflor.com/",
  referrerPolicy: "strict-origin-when-cross-origin",
  body: null,
  method: "POST",
  mode: "cors",
  credentials: "include"
};

const fleuraOrdersURL = "https://api.xlflor.com/orders?start=&end=&origin=https%3A%2F%2Fshop.xlflor.com%2Forders";
const fleuraOrderURL = "https://api.xlflor.com/order?allowPartialVariants=true&origin=https%3A%2F%2Fshop.xlflor.com%2Forder%2F2706933%3Fclosed%3Dtrue";
const fleuraLoginURL = "https://api.xlflor.com/simple-sign-in?origin=https://shop.xlflor.com/login?redirect=/dashboard";
