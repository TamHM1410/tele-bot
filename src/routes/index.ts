import { Router } from "express";
import testRouter from "./test.router";

const router = Router();

router.use("/api", testRouter);

export default router;
