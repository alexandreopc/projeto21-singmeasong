import { prisma } from "../src/database.js";

async function main() {
  await prisma.recommendation.createMany({
    data: [
      {
        name: "teste",
        youtubeLink: "https://www.youtube.com/watch?v=_KOJPOHLKvI",
        score: 1,
      },
      {
        name: "teste2",
        youtubeLink: "https://www.youtube.com/watch?v=xQjqImHruJE",
        score: 2,
      },
      {
        name: "teste3",
        youtubeLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        score: 3,
      },
      {
        name: "teste4",
        youtubeLink: "https://www.youtube.com/watch?v=pV7UC7Z5YF8",
        score: 4,
      },
      {
        name: "teste5",
        youtubeLink: "https://www.youtube.com/watch?v=pNq4K_Mx_u4",
        score: 5,
      },
      {
        name: "teste6",
        youtubeLink: "https://www.youtube.com/watch?v=tdrOoD8UQ7k",
        score: 6,
      },
      {
        name: "teste7",
        youtubeLink: "https://www.youtube.com/watch?v=INwqyPct8qY",
        score: 7,
      },
      {
        name: "teste8",
        youtubeLink: "https://www.youtube.com/watch?v=1r9dC4BqEI4",
        score: 8,
      },
      {
        name: "teste9",
        youtubeLink: "https://www.youtube.com/watch?v=dnlrVnb79OY",
        score: 9,
      },
      {
        name: "teste10",
        youtubeLink: "https://www.youtube.com/watch?v=ZKV4GZTmfGM",
        score: -5,
      },
    ],
  });
}

// select * from recommendations
// ALTER SEQUENCE recommendations_id_seq RESTART WITH 1
// delete from recommendations where id = 10
// insert into recommendations (name, "youtubeLink", score) VALUES ('teste10', 'https://www.youtube.com/watch?v=ZKV4GZTmfGM', -5)
// DELETE FROM recommendations where "youtubeLink" = 'https://www.youtube.com/watch?v=ZKV4GZTmfGM'

main()
  .catch((e) => {
    console.log(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
