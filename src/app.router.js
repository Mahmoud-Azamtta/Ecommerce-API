import databaseConnection from "../DB/connection.js";
import productsRouter from "./modules/products/products.router.js";
import categoriesRouter from "./modules/categories/categories.router.js";

const initApp = (app, express) => {
  databaseConnection();
  app.use(express.json());

  app.get("/api", (_, res) => {
    return res.status(200).json({ message: "Hello world" });
  });

  app.use("/api/categories", categoriesRouter);
  app.use("/api/products", productsRouter);

  app.use("*", (_, res) => {
    return res.status(404).json({ message: "Page not found" });
  });
};

export default initApp;
