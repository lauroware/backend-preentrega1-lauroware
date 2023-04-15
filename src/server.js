const express = require("express");
const productRoutes = require("./routes/productsRoutes");
const cartRoutes = require("./routes/cartRoutes");
const app = express();
const port = 8080;

app.get("/", (req, res) => {
  res.send("hola mundo! Primera preentrega");
});
app.use(express.json());
app.use("/api/products", productRoutes);
app.use("/api/carts", cartRoutes);

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
