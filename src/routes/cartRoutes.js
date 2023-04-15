const express = require("express");
const { Router } = require("express");
const fs = require("fs");
const router = Router();

let carts = JSON.parse(fs.readFileSync("src/carrito.json")); // Declaramos la variable carts antes de usarla
if (!Array.isArray(carts)) {
  carts = [];
}

router.use(express.json());

const newCart = {
  id: carts.length + 1,
  products: [],
};

// Ruta raiz para crear un nuevo carrito
router.post("/", (req, res) => {
  const newCart = {
    id: carts.length + 1,
    products: [],
  };
  carts.push(newCart);
  fs.writeFileSync("src/carrito.json", JSON.stringify(carts));
  res.json(newCart);
});

// Ruta para ver el carrito por id
router.get("/:cid", (req, res) => {
  const cartId = parseInt(req.params.cid);
  fs.readFile("src/carrito.json", "utf-8", (err, data) => {
    if (err) {
      console.log("Error al leer el archivo de carritos: ", err);
      return res.status(500).send("Error al leer el archivo de carritos");
    }
    carts = JSON.parse(data);
    const cart = carts.find((c) => c.id === cartId);
    if (cart) {
      res.send({ cart });
    } else {
      res.status(404).send({
        error: `El carrito con ID ${cartId} no se encuentra registrado`,
      });
    }
  });
});

//Ruta para agregar un producta, toma el id desde products.json si el carrito no se encuentra registrado no se agrega.
router.post("/:cid/product/:pid", (req, res) => {
  const productId = parseInt(req.params.pid);
  const cartId = parseInt(req.params.cid);
  const carts = JSON.parse(fs.readFileSync("src/carrito.json"));
  const products = JSON.parse(fs.readFileSync("src/products.json"));

  const cartIndex = carts.findIndex((cart) => cart.id === cartId);
  if (cartIndex === -1) {
    return res
      .status(404)
      .send(`El carrito con ID ${cartId} no se encuentra registrado`);
  }

  const productToAdd = products.find((product) => product.id === productId);
  if (!productToAdd) {
    return res
      .status(404)
      .send(`El producto con ID ${productId} no se encuentra registrado`);
  }

  const productIndex = carts[cartIndex].products.findIndex(
    (p) => p.product === productId
  );
  if (productIndex === -1) {
    carts[cartIndex].products.push({ product: productId, quantity: 1 });
  } else {
    carts[cartIndex].products[productIndex].quantity++;
  }

  // Actualización archivo carrito:
  fs.writeFileSync("src/carrito.json", JSON.stringify(carts));
  res.json(carts[cartIndex]);
});

module.exports = router;
