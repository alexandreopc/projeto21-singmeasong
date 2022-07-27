import { faker } from "@faker-js/faker";
import supertest from "supertest";

import { prisma } from "../src/database.js";
import app from "../src/app.js";
import postBodyFactory from "./factories/postBodyFactory.js";
import recommendationFactory from "./factories/recommendationFactory.js";

beforeEach(async () => {
  await prisma.$executeRaw`TRUNCATE TABLE recommendations;`;
});

describe("User tests suite", () => {
  it("given data and create recommendation", async () => {
    const body = postBodyFactory();
    // const result = recommendationFactory(body);
    const response = await supertest(app).post("/recommendations").send(body);
    expect(response.status).toBe(201);

    const recommendationCreated = await prisma.recommendation.findMany({
      where: { youtubeLink: body.youtubeLink },
    });
    expect(recommendationCreated).not.toBeNull();
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});
