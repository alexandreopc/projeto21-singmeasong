import supertest from "supertest";

import { prisma } from "../../src/database.js";
import app from "../../src/app.js";
import postBodyFactory from "./../factories/postBodyFactory.js";
import recommendationFactory from "./../factories/recommendationFactory.js";

beforeEach(async () => {
  // await prisma.$executeRaw`TRUNCATE TABLE recommendations RESTART IDENTITY CASCADE;`;
  await prisma.$executeRaw`DELETE FROM recommendations WHERE "youtubeLink" = 'https://www.youtube.com/watch?v=dGMB7oeIbqw'`;
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

  it("upvote a recommendation one time", async () => {
    const response = await supertest(app).post(`/recommendations/${10}/upvote`);
    const findRecommendationAfterUpvote =
      await prisma.recommendation.findUnique({
        where: {
          name: "teste10",
        },
      });

    expect(findRecommendationAfterUpvote.score).toBe(-4);
    expect(response.statusCode).toBe(200);
  });

  it("fail to vote a recommendation that doesnt exist", async () => {
    const response = await supertest(app).post(`/recommendations/99/upvote`);
    expect(response.statusCode).toBe(404);
    const response2 = await supertest(app).post(`/recommendations/99/downvote`);
    expect(response2.statusCode).toBe(404);
  });

  it("downvote a recommendation one time", async () => {
    const response = await supertest(app).post(
      `/recommendations/${10}/downvote`
    );
    const findRecommendationAfterUpvote =
      await prisma.recommendation.findUnique({
        where: {
          name: "teste10",
        },
      });

    expect(findRecommendationAfterUpvote.score).toBe(-5);
    expect(response.statusCode).toBe(200);
  });

  it("downvote a recommendation one time and exclude because score is < -5", async () => {
    const response = await supertest(app).post(
      `/recommendations/${10}/downvote`
    );
    const findRecommendationAfterUpvote =
      await prisma.recommendation.findUnique({
        where: {
          name: "teste10",
        },
      });

    expect(findRecommendationAfterUpvote).toBeNull;
    expect(response.statusCode).toBe(200);
  });

  it("get recommendation by id", async () => {
    const body = postBodyFactory();
    const recommendations = await recommendationFactory(body);

    const response = await supertest(app).get(
      `/recommendations/${recommendations.id}`
    );

    expect(response.body).toStrictEqual(recommendations);
    expect(response.statusCode).toBe(200);
  });

  it("get top recommendations by amount", async () => {
    const amount = Math.floor(Math.random() * 9);
    const response = await supertest(app).get(`/recommendations/top/${amount}`);

    expect(response.body.length).toBe(amount);
    expect(response.statusCode).toBe(200);
  });

  it("get random recommendation", async () => {
    const response = await supertest(app).get(`/recommendations/random`);

    expect(response.statusCode).toBe(200);
  });
});

afterAll(async () => {
  await prisma.$executeRaw`DELETE FROM recommendations WHERE "youtubeLink" = 'https://www.youtube.com/watch?v=dGMB7oeIbqw'`;
  await prisma.$executeRaw`ALTER SEQUENCE recommendations_id_seq RESTART WITH 10`;
  await prisma.recommendation.create({
    data: {
      name: "teste10",
      youtubeLink: "https://www.youtube.com/watch?v=ZKV4GZTmfGM",
      score: -5,
    },
  });

  await prisma.$disconnect();
});
