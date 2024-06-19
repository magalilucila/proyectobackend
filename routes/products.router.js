import { Router } from "express";
import { productManager } from "../index.js";

const productsRouter = Router();

productsRouter.get("/", async (req, res) =>{
    try {
        const { limit } = req.query;
        const products = await productManager.getProducts();

        if(limit){
            const limitedProducts = products.slice(0, limit);
            return res.json(limitedProducts);
        }

        return res.render("home", { title:"Productos", products });

    } catch(error) {
        console.log(error);
        res.send("ERROR AL INTENTAR RECIBIR LOS PRODUCTOS");
    }
});

productsRouter.get("/:pid", async (req, res) => {
    try {
        const { pid } = req.params;
        const product = await productManager.getProductsById(pid);
        return res.render("home", { title:"Productos", products: product });
    } catch (error) {
        console.log(error);
        res.send(`ERROR AL INTENTAR RECIBIR EL PRODUCTO CON ID ${pid}`);
    }
});

productsRouter.post("/", async (req, res) => {
    try {
        const { title, description, price, thumbnail, code, stock, status = true, category } = req.body;
        const response = await productManager.addProduct({ title, description, price, thumbnail, code, stock, status, category });
        res.render("home", { title:"Productos", products: response });
    } catch (error) {
        console.log(error);
        res.send("ERROR AL INTENTAR AGREGAR EL PRODUCTO");
    }
});

productsRouter.put("/:pid", async (req, res) => {
    const { pid } = req.params;

    try {
        const { title, description, price, thumbnail, code, stock, status = true, category } = req.body;
        const response = await productManager.updateProduct(pid, { title, description, price, thumbnail, code, stock, status, category });
        return res.render("home", { title:"Productos", products: response });
    } catch (error) {
        console.log(error);
        res.send(`ERROR AL INTENTAR EDITAR EL PRODUCTO CON ID ${pid}`);
    }
});

productsRouter.delete("/:pid", async (req, res) => {
    const { pid } = req.params;
    try {
        await productManager.deleteProduct(pid);
        res.send("PRODUCTO ELIMINADO EXITOSAMENTE");
    } catch (error) {
        console.log(error);
        res.send(`ERROR AL INTENTAR ELIMINAR EL PRODUCTO CON ID ${pid}`);
    }
});

export { productsRouter };