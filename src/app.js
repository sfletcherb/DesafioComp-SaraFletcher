const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");
const socket = require("socket.io");
const productsRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/carts.router.js");
const viewsRouter = require("./routes/views.router.js");
require("./database.js");
const ProductModel = require("./models/products.model.js");
const MessageModel = require("./models/message.model.js");
const { addProduct, deleteProduct } = require("./utils/get.products.js");

const app = express();
const PUERTO = 8080;

//Set up Express Handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

//Middleware:
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

//Routes:
/* app.get("/", (req, res) => {
  res.render("index");
}); */
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

//Listen:
const httpServer = app.listen(PUERTO, () => {
  console.log(`listening on port ${PUERTO}`);
});

//Socket.io: (set up socket)
const io = new socket.Server(httpServer);

io.on("connection", async (socket) => {
  console.log("A client has connected");

  socket.on("greeting", (data) => {
    console.log(data);
  });

  socket.on("message", async (data) => {
    await MessageModel.create(data);
    const messages = await MessageModel.find();
    io.sockets.emit("message", messages);
  });

  try {
    const data = await ProductModel.find();
    io.sockets.emit("updateProductList", data);
  } catch (error) {
    console.log("could not read ", error);
    throw error;
  }

  socket.on("addProduct", async (data) => {
    const newData = data;
    try {
      await addProduct(newData);
      const data = await ProductModel.find();
      io.sockets.emit("updateProductList", data);
    } catch (error) {
      console.log("could not update ", error);
      throw error;
    }
  });

  socket.on("deleteProduct", async (productId) => {
    try {
      await deleteProduct(productId);
      const data = await ProductModel.find();
      io.sockets.emit("updateProductList", data);
    } catch (error) {
      console.log("could not delete ", error);
      throw error;
    }
  });
});
