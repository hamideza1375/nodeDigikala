const appRootPath = require("app-root-path")


module.exports = async (req, res, next) => {
  fileDir = `${appRootPath}/public/images/banner1.png`
  newFileNam = 'circle.png'
    res.download(fileDir, newFileNam, (err) => {
      if (err) {
        res.status(500).json({ message: "Could not download the file. " + err });
      }
    });
}
