import relevantTriples from "./exampeTriples";
import {
  createDB,
  matchPattern,
  query,
  querySingle,
  queryWhere,
} from "./index2";

const db = createDB(relevantTriples);

test("matchPattern", () => {
  expect(
    matchPattern(
      ["?movieId", "movie/director", "?directorId"],
      [200, "movie/director", 100],
      { "?movieId": 200 }
    )
  ).toEqual({ "?movieId": 200, "?directorId": 100 });
  expect(
    matchPattern(
      ["?movieId", "movie/director", "?directorId"],
      [200, "movie/director", 100],
      { "?movieId": 202 }
    )
  ).toEqual(null);
});

test("querySingle", () => {
  expect(querySingle(["?movieId", "movie/year", 1987], db, {})).toEqual([
    { "?movieId": 202 },
    { "?movieId": 203 },
    { "?movieId": 204 },
  ]);
});

test("queryWhere", () => {
  expect(
    queryWhere(
      [
        ["?movieId", "movie/title", "The Terminator"],
        ["?movieId", "movie/director", "?directorId"],
        ["?directorId", "person/name", "?directorName"],
      ],
      db,
      {}
    )
  ).toEqual([
    { "?movieId": 200, "?directorId": 100, "?directorName": "James Cameron" },
  ]);
});

test("query", () => {
  expect(
    query(
      {
        find: ["?directorName"],
        where: [
          ["?movieId", "movie/title", "The Terminator"],
          ["?movieId", "movie/director", "?directorId"],
          ["?directorId", "person/name", "?directorName"],
        ],
      },
      db
    )
  ).toEqual([["James Cameron"]]);
});

test("play", () => {
  expect(
    query(
      {
        find: ["?year"],
        where: [
          ["?id", "movie/title", "Alien"],
          ["?id", "movie/year", "?year"],
        ],
      },
      db
    )
  ).toEqual([[1979]]);
  expect(
    query(
      {
        find: ["?directorName"],
        where: [
          ["?movieId", "movie/title", "RoboCop"],
          ["?movieId", "movie/director", "?directorId"],
          ["?directorId", "person/name", "?directorName"],
        ],
      },
      db
    )
  ).toEqual([["Paul Verhoeven"]]);
  expect(
    new Set(
      query(
        {
          find: ["?attr", "?value"],
          where: [[200, "?attr", "?value"]],
        },
        db
      )
    )
  ).toEqual(
    new Set([
      ["movie/title", "The Terminator"],
      ["movie/year", 1984],
      ["movie/director", 100],
      ["movie/cast", 101],
      ["movie/cast", 102],
      ["movie/cast", 103],
      ["movie/sequel", 207],
    ])
  );
  expect(
    new Set(
      query(
        {
          find: ["?directorName", "?movieTitle"],
          where: [
            ["?arnoldId", "person/name", "Arnold Schwarzenegger"],
            ["?movieId", "movie/cast", "?arnoldId"],
            ["?movieId", "movie/title", "?movieTitle"],
            ["?movieId", "movie/director", "?directorId"],
            ["?directorId", "person/name", "?directorName"],
          ],
        },
        db
      )
    )
  ).toEqual(
    new Set([
      ["James Cameron", "The Terminator"],
      ["John McTiernan", "Predator"],
      ["Mark L. Lester", "Commando"],
      ["James Cameron", "Terminator 2: Judgment Day"],
      ["Jonathan Mostow", "Terminator 3: Rise of the Machines"],
    ])
  );
});
