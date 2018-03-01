const PROXY_CONFIG = [
  {
      context: [
          "/api/data/coinlist/",
      ],
      target: "https://www.cryptocompare.com",
      secure: true, 
      changeOrigin: true
  },
  {
    context: [
        "/oauth/token",
    ],
    target: "http://localhost:9090",
    secure: false, 
    changeOrigin: true
}
]

module.exports = PROXY_CONFIG;