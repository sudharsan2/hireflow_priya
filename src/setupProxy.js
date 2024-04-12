// const { createProxyMiddleware } = require("http-proxy-middleware");

// module.exports = (app) => {
//   app.use(
//     "/hiring/api/",
//     createProxyMiddleware({
//       target: "http://172.235.10.116:7000",
//       changeOrigin: true,
//     })
//   );
// };

const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/hiring/",
    createProxyMiddleware({
      target: "http://172.235.10.116:7000",
      changeOrigin: true,
    })
  );
};
