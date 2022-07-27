import { prisma } from "../../src/database.js";
import { CreateRecommendationData } from "../../src/services/recommendationsService";

export default async function recommendationFactory(
  data: CreateRecommendationData
) {
  return prisma.recommendation.create({
    data,
  });
}
