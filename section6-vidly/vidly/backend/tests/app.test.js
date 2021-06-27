const supertest = require("supertest");
const expect = require("expect");
const app = require("../app");
const db = require("../db");
const Movie = require("../models/movie");

const request = supertest(app);
const endpoint = "/api/movies";

describe(endpoint, () => {
  beforeAll(async () => {
    await db.connect();
  });

  afterAll(async () => {
    await db.close();
  });

  describe("GET /", () => {
    it("should return all movies", async () => {
      const titles = ["m1", "m2"];
      const movies = titles.map((title) => ({
        title,
      }));
      await Movie.insertMany(movies);

      const res = await request.get(endpoint);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      titles.forEach((title) =>
        expect(res.body.some((m) => m.title === title))
      );

      await Movie.deleteMany({ title: { $in: titles } });
    });
  });

  describe("POST /", () => {
    it("should return 400 if request is not valid", async () => {
      const res = await request.post(endpoint).send({});

      expect(res.status).toBe(400);
    });

    it("should store the movie and return 201 if request is valid", async () => {
      const movie = { title: "m" };

      const res = await request.post(endpoint).send(movie);

      expect(res.status).toBe(201);
      expect(res.body.title).toBe(movie.title);
      expect(res.body._id).toBeTruthy();

      await Movie.findByIdAndDelete(res.body._id);
    });
  });

  describe("DELETE /:id", () => {
    it("should return 404 if movie was not found", async () => {
      const res = await request.delete(endpoint);

      expect(res.status).toBe(404);
    });

    it("should delete the movie and return 204", async () => {
      const movie = new Movie({ title: "m" });
      await movie.save();

      const res = await request.delete(`${endpoint}/${movie._id}`);

      expect(res.status).toBe(204);

      const movieInDb = await Movie.findById(movie._id);
      expect(movieInDb).toBeFalsy();
    });
  });
});
