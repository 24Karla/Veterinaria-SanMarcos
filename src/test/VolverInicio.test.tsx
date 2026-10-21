// @vitest-environment jsdom
import { test, expect } from "vitest";
import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Navbar from "../componentes/organismos/Navbar";

test("el link de navbar lleva a la pantalla de inicio", () => {
  render(
    <MemoryRouter>
      <Navbar />
    </MemoryRouter>
  );

  const linkInicio = screen.getByRole("link", {
    name: /veterinaria san marcos/i,
  });

    expect(linkInicio.getAttribute("href")).toBe("/");
});
