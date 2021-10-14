const express = require("express");
const path = require("path");
const { rootRouter } = require("./src/routers/root.routers");
const app = express();

// static file
const publicPathDirectory = path.join(__dirname, "./public");
app.use("/public", express.static(publicPathDirectory));
/**
 * truy cập hình spiderman : http://localhost:9000/public/images/spiderman.jpg
 *  + http://localhost:9000/public <==> public
 */
// setup json
app.use(express.json());

// http://localhost:9000/
app.get("/", (req, res) => {
  res.send("Xin Chào Các Bạn");
});

// http://localhost:9000/api/v1
app.use("/api/v1", rootRouter);

// http://localhost:9000
app.listen(9000, () => {
  console.log("connect success on port 9000");
});
