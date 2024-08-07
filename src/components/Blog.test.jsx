import { render, screen, fireEvent } from "@testing-library/react";
import Blog from "./Blog";
import { beforeEach, describe, expect } from "vitest";
import userEvent from "@testing-library/user-event";
import blogs from "../services/blogs";
import blogService from "../services/blogs";
import { vi } from "vitest";

describe("tests", () => {
  beforeEach(() => {
    const blog = {
      title: "titulo",
      author: "authorbyalex",
      url: "alex.com",
      user: { name: "Test User", token: "123", id: "1" },
      likes: 0,
    };

    render(
      <Blog blog={blog} user={blog.user} blogs={[]} setBlogs={() => {}} />,
    );
  });

  test("5.13 muestre el título y el autor del blog", () => {
    const titulo = screen.getByTestId("blog-view");
    expect(titulo).toHaveTextContent("titulo");
    expect(titulo).toHaveTextContent("authorbyalex");
    expect(titulo).not.toHaveTextContent("alex.com");
    expect(titulo).not.toHaveTextContent("0");
  });

  test("5.14 URL y likes se muestran cuando se hace clic en el botón", async () => {
    const user = userEvent.setup();
    const bloque = screen.getByTestId("view-button");
    await user.click(bloque);
    const url = screen.getByText("alex.com");
    expect(url).toBeDefined();
    const likes = screen.getByText("0");
    expect(likes).toBeDefined();
  });
});
