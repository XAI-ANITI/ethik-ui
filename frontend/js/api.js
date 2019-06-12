import axios from "axios";

const API = axios.create({
  baseURL: "/api/",
  // For Django CSRF protection
  xsrfCookieName: "csrftoken",
  xsrfHeaderName: "X-CSRFToken",
});

export default API;
