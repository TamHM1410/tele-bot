import { PrismaClient } from "../../generated/prisma/client";

import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const adapter = new PrismaMariaDb({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "aS3cr3tP@ssw0rd",
  database: "test_db",
});

export const prisma = new PrismaClient({
  adapter,
});
