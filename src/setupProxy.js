// const { createProxyMiddleware } = require("http-proxy-middleware");

// module.exports = (app) => {
//   app.use(
//     "/hiring/api/",
//     createProxyMiddleware({
//       target: "http://172.235.10.116:9090",
//       changeOrigin: true,
//     })
//   );
// };


const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/hiring/api/",
    createProxyMiddleware({
      target: "http://172.235.10.116:9090",
      changeOrigin: true,
    })
  );
};