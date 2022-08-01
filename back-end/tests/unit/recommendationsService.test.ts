import { jest } from "@jest/globals";

import {
  recommendationService,
  CreateRecommendationData,
} from "./../../src/services/recommendationsService.js";
import { recommendationRepository } from "./../../src/repositories/recommendationRepository.js";

jest.mock("./../../src/repositories/recommendationRepository.js");

const positiveScoreRecommendation = () => {
  return {
    id: 1,
    name: "string",
    youtubeLink: "string",
    score: 10,
  };
};
const negativeScoreRecommendation = () => {
  return {
    id: 1,
    name: "string",
    youtubeLink: "string",
    score: -10,
  };
};
const voucher: CreateRecommendationData = {
  name: "nomeAleatorio",
  youtubeLink: "https://www.youtube.com/",
}; //TODO: colocar em factory

describe("recommendationsService test suite", () => {
  it("should create recommendation", async () => {
    jest
      .spyOn(recommendationRepository, "findByName")
      .mockImplementationOnce((): any => {});
    jest
      .spyOn(recommendationRepository, "create")
      .mockImplementationOnce((): any => {});

    await recommendationService.insert({
      name: "nomeAleatorio",
      youtubeLink: "https://www.youtube.com/",
    });
    expect(recommendationRepository.findByName).toBeCalled();
    expect(recommendationRepository.create).toBeCalled();
  });

  it("should not create duplicated recommendation", async () => {
    jest
      .spyOn(recommendationRepository, "findByName")
      .mockImplementationOnce((): any => {
        return voucher;
      });

    const promise = recommendationService.insert(voucher);
    expect(promise).rejects.toEqual({
      type: "conflict",
      message: "Recommendations names must be unique",
    });
  });

  it("should up vote recommendation", async () => {
    jest
      .spyOn(recommendationRepository, "find")
      .mockImplementationOnce((): any => {
        return voucher;
      });
    jest
      .spyOn(recommendationRepository, "updateScore")
      .mockImplementationOnce((): any => {});

    await recommendationService.upvote(1);
    expect(recommendationRepository.find).toBeCalled();
    expect(recommendationRepository.updateScore).toBeCalled();
  });

  it("should fail to up vote recommendation", async () => {
    jest
      .spyOn(recommendationRepository, "find")
      .mockImplementationOnce((): any => {
        return false;
      });

    const promise = recommendationService.upvote(1);
    expect(promise).rejects.toEqual({
      message: "",
      type: "not_found",
    });
    expect(recommendationRepository.find).toBeCalled();
  });

  it("should down vote recommendation", async () => {
    jest
      .spyOn(recommendationRepository, "find")
      .mockImplementationOnce((): any => {
        return voucher;
      });
    jest
      .spyOn(recommendationRepository, "updateScore")
      .mockImplementationOnce((): any => {
        return positiveScoreRecommendation;
      });

    recommendationService.downvote(1);
    expect(recommendationRepository.find).toBeCalled();
    expect(recommendationRepository.updateScore).toBeCalled();
  });

  it("should down vote recommendation and remove by low score", async () => {
    jest
      .spyOn(recommendationRepository, "find")
      .mockImplementationOnce((): any => {
        return voucher;
      });
    jest
      .spyOn(recommendationRepository, "updateScore")
      .mockImplementationOnce((): any => {
        return negativeScoreRecommendation;
      });
    jest
      .spyOn(recommendationRepository, "remove")
      .mockImplementationOnce((): any => {});

    recommendationService.downvote(1);
    expect(recommendationRepository.find).toBeCalled();
    expect(recommendationRepository.updateScore).toBeCalled();
    expect(recommendationRepository.remove).toBeCalled;
  });

  it("should get random recommendation", async () => {
    jest
      .spyOn(recommendationRepository, "findAll")
      .mockImplementationOnce((): any => {
        return [
          { teste: "alalalala" },
          { teste: "alalalala" },
          { teste: "alalalala" },
        ];
      });

    recommendationService.getRandom();
    expect(recommendationRepository.findAll).toBeCalled();
  });

  it("should get random recommendation, fail", async () => {
    jest
      .spyOn(recommendationRepository, "findAll")
      .mockImplementationOnce((): any => {
        return [];
      });

    const promise = recommendationService.getRandom();
    expect(recommendationRepository.findAll).toBeCalled();
    expect(promise).rejects.toEqual({
      type: "not_found",
      message: "",
    });
  });

  it("should get recommendation", async () => {
    jest
      .spyOn(recommendationRepository, "findAll")
      .mockImplementationOnce((): any => {});

    recommendationService.get();
    expect(recommendationRepository.findAll).toBeCalled();
  });

  it("should get top recommendation", async () => {
    jest
      .spyOn(recommendationRepository, "getAmountByScore")
      .mockImplementationOnce((): any => {});

    recommendationService.getTop(1);
    expect(recommendationRepository.getAmountByScore).toBeCalled();
  });

  it("should get by id recommendation", async () => {
    jest
      .spyOn(recommendationRepository, "find")
      .mockImplementationOnce((): any => true);

    recommendationService.getById(1);
    expect(recommendationRepository.find).toBeCalled();
  });

  it("should get by id recommendation, fail", async () => {
    jest
      .spyOn(recommendationRepository, "find")
      .mockImplementationOnce((): any => {});

    const promise = recommendationService.getById(1);
    expect(recommendationRepository.find).toBeCalled();
    expect(promise).rejects.toEqual({
      type: "not_found",
      message: "",
    });
  });
});
