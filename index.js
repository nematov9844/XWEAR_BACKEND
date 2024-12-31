/** @format */

const jsonServer = require("json-server"); // json-server modulini ulash
const server = jsonServer.create(); // Yangi server yaratish
const router = jsonServer.router("db.json"); // db.json faylini ulash
const middlewares = jsonServer.defaults(); // Standart middleware funksiyalarni ulash

server.use(middlewares); // Middleware funksiyalarni serverga ulash

// URL'larni qayta yozish
server.use(
  jsonServer.rewriter({
    "/api/*": "/$1", // /api/* ni /$1 ga o‘zgartirish
  })
);

// Kategoriyalarni olish
server.get("/categories", (req, res) => {
  const db = router.db; // DB obyektini olish
  const categoriesData = db.get("categories").value(); // `categories` ma'lumotlarini olish

  if (categoriesData.length > 0) {
    res.json(categoriesData); // Kategoriyalarni qaytarish
  } else {
    res.status(404).json({ error: "Categories not found" }); // Agar kategoriyalar topilmasa
  }
});

// ID bo'yicha mahsulotlarni olish
server.get("/products/category/:id", (req, res) => {
  const { id } = req.params;
  const db = router.db;

  const categoryProducts = db
    .get("products")
    .filter((product) => product.category.id === parseInt(id))
    .value();

  if (categoryProducts.length > 0) {
    res.json(categoryProducts);
  } else {
    res.status(404).json({ error: "Products not found for this category" }); // Agar kategoriya bo'yicha mahsulotlar topilmasa
  }
});

server.use(router); // Marshrutlarni ulash

server.listen(process.env.PORT || 3000, () => {
  console.log("JSON Server ishlayapti"); // Konsolda xabar chiqarish
});
