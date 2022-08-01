/// <reference types = "cypress" />

import { faker } from "@faker-js/faker";

beforeEach(() => {
  cy.request("POST", "http://localhost:5000/recommendations/reset");
});

describe("testing app", () => {
  const recommendation = {
    name: faker.internet.userName(),
    youtubeLink: "https://www.youtube.com/watch?v=nNhMjV76OQo",
  };
  it("should create a recommendation", async () => {
    cy.visit("http://localhost:3000/");
    cy.get("#name").type(recommendation.name);
    cy.get("#link").type(recommendation.youtubeLink);
    cy.intercept("POST", "/recommendations").as("getRecommendations");
    cy.get("#button").click();
    cy.wait("@getRecommendations");
  });

  it("shouldnt create a duplicated recommendation", () => {
    const recommendation = {
      name: faker.internet.userName(),
      youtubeLink: "https://www.youtube.com/watch?v=nNhMjV76OQo",
    };
    cy.createLink(recommendation);

    cy.visit("http://localhost:3000/");
    cy.get("#name").type(recommendation.name);
    cy.get("#link").type(recommendation.youtubeLink);
    cy.intercept("POST", "/recommendations").as("getRecommendations");
    cy.get("#button").click();
    cy.wait("@getRecommendations").then(({ response }) => {
      expect(response.statusCode).to.equal(409);
    });
  });

  it("shouldnt create a recommendation with no name", () => {
    const recommendation = {
      name: faker.internet.userName(),
      youtubeLink: "https://www.youtube.com/watch?v=nNhMjV76OQo",
    };

    cy.visit("http://localhost:3000/");
    cy.get("#link").type(recommendation.youtubeLink);
    cy.intercept("POST", "/recommendations").as("getRecommendations");
    cy.get("#button").click();
    cy.wait("@getRecommendations").then(({ response }) => {
      expect(response.statusCode).to.equal(422);
    });
  });

  it("shouldnt create a recommendation with no link", () => {
    const recommendation = {
      name: faker.internet.userName(),
      youtubeLink: "https://www.youtube.com/watch?v=nNhMjV76OQo",
    };

    cy.visit("http://localhost:3000/");
    cy.get("#name").type(recommendation.name);
    cy.intercept("POST", "/recommendations").as("getRecommendations");
    cy.get("#button").click();
    cy.wait("@getRecommendations").then(({ response }) => {
      expect(response.statusCode).to.equal(422);
    });
  });

  it("shouldnt create a recommendation with wrong link", () => {
    const recommendation = {
      name: faker.internet.userName(),
      youtubeLink:
        "https://www.prisma.io/docs/concepts/components/prisma-client/crud#create",
    };

    cy.visit("http://localhost:3000/");
    cy.get("#name").type(recommendation.name);
    cy.intercept("POST", "/recommendations").as("getRecommendations");
    cy.get("#button").click();
    cy.wait("@getRecommendations").then(({ response }) => {
      expect(response.statusCode).to.equal(422);
    });
  });

  it("should up vote", () => {
    const recommendation = {
      name: faker.internet.userName(),
      youtubeLink: "https://www.youtube.com/watch?v=nNhMjV76OQo",
    };

    cy.createLink(recommendation);

    cy.visit("http://localhost:3000");
    cy.intercept("GET", "/recommendations").as("firstGet");
    cy.wait("@firstGet");

    cy.intercept("GET", "/recommendations").as("secondGet");
    cy.get("#upVote").click();
    cy.wait("@secondGet");
  });

  it("should down vote", () => {
    const recommendation = {
      name: faker.internet.userName(),
      youtubeLink: "https://www.youtube.com/watch?v=nNhMjV76OQo",
    };

    cy.createLink(recommendation);

    cy.visit("http://localhost:3000");
    cy.intercept("GET", "/recommendations").as("firstGet");
    cy.wait("@firstGet");

    cy.intercept("GET", "/recommendations").as("secondGet");
    cy.get("#downVote").click();
    cy.wait("@secondGet");
  });

  it("should down vote 6x and exclude recommendation", () => {
    const recommendation = {
      name: faker.internet.userName(),
      youtubeLink: "https://www.youtube.com/watch?v=nNhMjV76OQo",
    };

    cy.createLink(recommendation);

    cy.visit("http://localhost:3000");
    cy.intercept("GET", "/recommendations").as("firstGet");
    cy.wait("@firstGet");

    cy.get("#downVote").click();
    cy.get("#downVote").click();
    cy.get("#downVote").click();
    cy.get("#downVote").click();
    cy.get("#downVote").click();
    cy.intercept("GET", "/recommendations").as("lastGet");
    cy.get("#downVote").click();
    cy.wait("@lastGet");
  });

  it("should load random recommendations", () => {
    cy.intercept("GET", "/recommendations/random").as(
      "getRandomRecommendations"
    );
    cy.visit("http://localhost:3000/random");
    cy.wait("@getRandomRecommendations");
  });
});
