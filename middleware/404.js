const appRootPath = require("app-root-path")
const fs = require('fs');


module.exports = async (req, res, next) => {
  res.download(`${appRootPath}/public/html/404.html`, '404.html', (err) => {
    if (err) {
      res.status(500).send({ message: "Could not download the file. " + err });
    }
  });
}


// module.exports = async (req, res, next) => {
//   const file = fs.readFileSync(`${appRootPath}/public/html/404.html`)
//   // file = buffer
//   res.send(file)
// }


// module.exports = async (req, res, next) => {
//   // res.sendFile(`${appRootPath}/public/html/404.html`)
//  const file = fs.readFileSync(`${appRootPath}/public/html/404.html`)
//  console.log(file);
// res.sendFile(file)
// }



//     fs.readFile("../Pages/app.html", function (error, pgResp) {
//
//           if (error) {
//               resp.writeHead(404);
//               resp.write('Contents you are looking are Not Found');
//           } else {
//               resp.writeHead(200, { 'Content-Type': 'text/html' });
//               resp.write(pgResp);
//           }
//
//           resp.end();
//       });