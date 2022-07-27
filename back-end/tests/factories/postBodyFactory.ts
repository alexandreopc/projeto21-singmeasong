import { faker } from "@faker-js/faker";
import { CreateRecommendationData } from "../../src/services/recommendationsService";

export default function postBodyFactory(): CreateRecommendationData {
  return {
    name: faker.internet.userName(),
    youtubeLink: "https://www.youtube.com/watch?v=dGMB7oeIbqw",
  };
}
