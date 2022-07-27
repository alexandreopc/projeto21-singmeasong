import { faker } from "@faker-js/faker";
import supertest from "supertest";

import { prisma } from "../src/database.js";
import app from "../src/app.js";
import postBodyFactory from "./factories/postBodyFactory.js";
import recommendationFactory from "./factories/recommendationFactory.js";

beforeEach(async () => {
  await prisma.$executeRaw`TRUNCATE TABLE recommendations RESTART IDENTITY CASCADE;`;
});

describe("User tests suite", () => {
  it("given data and create recommendation", async () => {
    const body = postBodyFactory();

    const response = await supertest(app).post("/recommendations").send(body);
    expect(response.status).toBe(201);

    const recommendationCreated = await prisma.recommendation.findMany({
      where: { name: body.name },
    });
    expect(recommendationCreated).not.toBeNull();
  });

  it("missing name on recommendation, fail to create", async () => {
    const body = postBodyFactory();
    delete body.name;
    const response = await supertest(app).post("/recommendations").send(body);
    expect(response.status).toBe(422);
  });

  it("missing youtubeLink on recommendation, fail to create", async () => {
    const body = postBodyFactory();
    delete body.youtubeLink;
    const response = await supertest(app).post("/recommendations").send(body);
    expect(response.status).toBe(422);
  });

  it("given wrong youtubeLink, fail to create recommendation", async () => {
    let body = postBodyFactory();
    body.youtubeLink = "https://developer.mozilla.org/pt-BR/";
    const response = await supertest(app).post("/recommendations").send(body);
    expect(response.status).toBe(422);
  });

  it("given a name that already exist, fail to create recommendation", async () => {
    const body = postBodyFactory();
    recommendationFactory(body);

    const response = await supertest(app).post("/recommendations").send(body);
    expect(response.status).toBe(409);
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});
