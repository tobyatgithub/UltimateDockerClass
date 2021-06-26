import {
  fireEvent,
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { rest } from "msw";
import { setupServer } from "msw/node";
import App from "./App";

const movies = [
  { _id: 1, title: "Movie 1" },
  { _id: 2, title: "Movie 2" },
  { _id: 3, title: "Movie 3" },
];

const newMovie = { _id: 4, title: "New Movie" };

const apiEndpoint = "http://localhost:3001/api/movies";

const server = setupServer(
  rest.get(apiEndpoint, (req, res, ctx) => res(ctx.json(movies))),
  rest.post(apiEndpoint, (req, res, ctx) => res(ctx.json(newMovie))),
  rest.delete(apiEndpoint + "/" + movies[0]._id, (req, res, ctx) =>
    res(ctx.status(204))
  )
);

beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

describe("App component", () => {
  test("renders all the movies fetched from the server", async () => {
    render(<App />);

    const listItems = await screen.findAllByRole("listitem");

    expect(listItems.length).toEqual(movies.length);
  });

  test("displays an error if the call to the server fails", async () => {
    server.use(rest.get(apiEndpoint, (req, res, ctx) => res(ctx.status(500))));

    render(<App />);

    await screen.findByRole("alert");
  });

  describe("When a new movie is added", () => {
    test("the input field gets cleared", async () => {
      await renderApp();

      addMovie();
      await screen.findByText(newMovie.title);

      const inputField = screen.getByLabelText("New Movie");
      expect(inputField).toHaveValue("");
    });

    test("it is added to the list", async () => {
      await renderApp();

      addMovie();

      await screen.findByText(newMovie.title);
    });

    test("it is removed from the list if the call to the server fails", async () => {
      server.use(
        rest.post(apiEndpoint, (req, res, ctx) => res(ctx.status(500)))
      );

      await renderApp();

      addMovie();

      await waitForElementToBeRemoved(() => screen.queryByText(newMovie.title));
    });

    test("An error is displayed if the call to the server fails", async () => {
      server.use(
        rest.post(apiEndpoint, (req, res, ctx) => res(ctx.status(500)))
      );

      await renderApp();

      addMovie();

      const error = await screen.findByRole("alert");
      expect(error).toHaveTextContent(/save/i);
    });
  });

  describe("When a movie is deleted", () => {
    test("it is removed from the list", async () => {
      await renderApp();

      deleteMovie();

      expect(screen.queryByText(movies[0].title)).not.toBeInTheDocument();
    });

    test("it is inserted back in the list if the call to the server fails", async () => {
      server.use(
        rest.delete(apiEndpoint + "/" + movies[0]._id, (req, res, ctx) =>
          res(ctx.status(500))
        )
      );

      await renderApp();

      deleteMovie();

      await screen.findByText(movies[0].title);
    });

    test("an error is displayed if the call to the server fails", async () => {
      server.use(
        rest.delete(apiEndpoint + "/" + movies[0]._id, (req, res, ctx) =>
          res(ctx.status(500))
        )
      );

      await renderApp();

      deleteMovie();

      const error = await screen.findByRole("alert");
      expect(error).toHaveTextContent(/delete/i);
    });
  });
});

// Helper functions
const renderApp = async () => {
  render(<App />);
  await screen.findAllByRole("listitem");
};

const addMovie = () => {
  const inputField = screen.getByLabelText("New Movie");
  fireEvent.change(inputField, {
    target: { value: newMovie.title },
  });
  fireEvent.submit(inputField);
};

const deleteMovie = () => fireEvent.click(screen.getAllByRole("button")[0]);
