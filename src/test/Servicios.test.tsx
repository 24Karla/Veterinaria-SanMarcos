// @vitest-environment jsdom
import { test, expect} from "vitest";
import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import Inicio from "../paginas/Inicio";
import { MemoryRouter } from "react-router-dom";

test("muestra las seis categorías de servicios", () => {
  render(
    <MemoryRouter>
      <Inicio />
    </MemoryRouter>
  );

  ["Consultas", "Vacunación", "Cirugía", "Desparasitación", "Exámenes", "Otros"].forEach(
    (nombre) => {
      expect(screen.getByRole("link", { name: nombre })).toBeInTheDocument();
    }
  );
});
