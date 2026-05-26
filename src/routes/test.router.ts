import { Router } from "express";
import { prisma } from "../config/prisma";
import { getAllDrawMsg } from "../service/test.service";

const testRouter = Router();

testRouter.get("/test", async (req, res) => {
  let list = await getAllDrawMsg();
  res.json({
    data: list,
    status: 200,
    message: "Ok",
  });
});

export default testRouter;
