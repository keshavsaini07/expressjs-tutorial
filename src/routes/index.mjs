import { Router } from "express";

import usersRouter from "./user-routes.mjs";
import productsRouter from "./product-routes.mjs";

const router = Router();

router.use(usersRouter);
router.use(productsRouter);

export default router;
