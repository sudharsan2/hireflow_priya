// const { createProxyMiddleware } = require("http-proxy-middleware");

// module.exports = (app) => {
//   app.use(
//     "/hiring/api/",
//     createProxyMiddleware({
//       target: "https://hireflowapi.focusrtech.com:90",
//       changeOrigin: true,
//     })
//   );
// };

const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/hiring/",
    createProxyMiddleware({
      target: "https://hireflowapi.focusrtech.com:90",
      changeOrigin: true,
    })
  );
};
