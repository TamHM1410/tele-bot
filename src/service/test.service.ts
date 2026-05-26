import { prisma } from "../config/prisma";
import { TestModel } from "../generated/prisma";

interface ResponseRawMsg {
  id: number;
  rawMsg: string | null;
}
export const getAllDrawMsg = async (): Promise<ResponseRawMsg[]> => {
  const returnedLs = await prisma.testModel.findMany();

  return returnedLs.map((item: TestModel) => ({
    id: item.id,
    rawMsg: item.externalRawMsg,
  }));
};
