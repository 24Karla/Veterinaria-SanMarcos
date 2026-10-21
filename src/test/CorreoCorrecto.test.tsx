// @vitest-environment jsdom
import { test, expect, vi} from "vitest";
import "@testing-library/jest-dom/vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import FormularioSesion from "../componentes/organismos/FormularioSesion";

test("muestra una alerta cuando el correo no tiene formato válido", () => {
  const alerta = vi.spyOn(window, "alert").mockImplementation(() => {});

  render(<FormularioSesion />);

  fireEvent.change(screen.getByLabelText(/correo electrónico/i), {
    target: { value: "correo-sin-arroba" },
  });

  fireEvent.click(screen.getByRole("button", { name: /ingresar/i }));

  expect(alerta).toHaveBeenCalledWith("Ingrese un correo válido");
});
