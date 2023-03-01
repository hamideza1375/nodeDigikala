const appRootPath = require("app-root-path")

module.exports = async (req, res, next) => {
  res.sendFile(`${appRootPath}/public/html/404.html`)
}