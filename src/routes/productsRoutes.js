// Configura las rutas para manejar los productos
const express = require("express");
const fs = require("fs");
const { Router } = require("express");
const router = Router();
router.use(express.json());

// 1.- Ruta Raiz GET trae todos los productos cargados en el archivo json, tengo una base de  10 productos ficticios ya cargados
router.get("/", (req, res) => {
  fs.readFile("src/products.json", "utf-8", (err, data) => {
    if (err) {
      console.log("Error al leer el archivo de productos: ", err);
      return res.status(500).send("Error al leer el archivo de productos");
    }
    const products = JSON.parse(data);
    const limit = req.query.limit;
    if (limit) {
      res.send({ products: products.slice(0, limit) });
    } else {
      res.send({ products });
    }
  });
});

// Ruta GET / ID trae el producto con el id seleccionado
router.get("/:id", (req, res) => {
  const productId = parseInt(req.params.id);
  fs.readFile("src/products.json", "utf-8", (err, data) => {
    if (err) {
      console.log("Error al leer el archivo de productos: ", err);
      return res.status(500).send("Error al leer el archivo de productos");
    }
    const products = JSON.parse(data);
    const product = products.find((p) => p.id === productId);
    if (product) {
      res.send({ product });
    } else {
      res
        .status(404)
        .send({ error: `El ID ${productId} no se encuentra registrado` });
    }
  });
});

// Ruta raiz post agrega un producto.
router.post("/", (req, res) => {
  const products = JSON.parse(fs.readFileSync("src/products.json"));
  const newProduct = {
    id: products.length + 1,
    title: req.body.title,
    price: req.body.price,
    description: req.body.description,
    thumbnail: req.body.thumbnail,
    stock: req.body.stock,
    code: req.body.code,
    category: req.body.category,
  };
  products.push(newProduct);
  fs.writeFileSync("src/products.json", JSON.stringify(products));
  res.json(newProduct);
});

// Ruta put modifica un producto debo escribir los datos a actualizar y también escribir los datos del producto que no modifico (sino se borran)
router.put("/:pid", (req, res) => {
  const products = JSON.parse(fs.readFileSync("src/products.json"));
  const productId = req.params.pid;
  const productToUpdate = products.find((product) => product.id == productId);
  if (!productToUpdate) {
    return res.status(404).send("Producto no encontrado");
  }
  productToUpdate.title = req.body.title;
  productToUpdate.price = req.body.price;
  productToUpdate.description = req.body.description;
  productToUpdate.code = req.body.code;
  productToUpdate.status = req.body.status;
  productToUpdate.category = req.body.category;
  productToUpdate.thumbnails = req.body.thumbnails;
  productToUpdate.stock = req.body.stock;
  fs.writeFileSync("src/products.json", JSON.stringify(products));
  res.json(productToUpdate);
});

// ruta delete /id elimina el producto con el id seleccionado
router.delete("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const products = JSON.parse(fs.readFileSync("src/products.json"));
  const index = products.findIndex((product) => product.id === id);
  if (index === -1) {
    return res.status(404).send(`Producto con ID ${id} no encontrado`);
  }
  products.splice(index, 1);
  fs.writeFileSync("src/products.json", JSON.stringify(products));
  res.send(`Producto con ID ${id} eliminado correctamente`);
});

module.exports = router;
