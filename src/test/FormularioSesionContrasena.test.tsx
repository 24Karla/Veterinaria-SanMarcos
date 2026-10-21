// @vitest-environment jsdom
import { test, expect, vi, afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import FormularioSesion from "../componentes/organismos/FormularioSesion";

afterEach(() => {
  vi.restoreAllMocks();
});
test("muestra una alerta cuando la contraseña está vacía", () => {
  const alerta = vi.spyOn(window, "alert").mockImplementation(() => {});
  render(<FormularioSesion />);
  // Correo válido para pasar las dos primeras validaciones
  fireEvent.change(screen.getByLabelText(/correo electrónico/i), {
    target: { value: "prueba@correo.cl" },
  });
  // Contraseña vacía: no tocamos ese campo
  fireEvent.click(screen.getByRole("button", { name: /ingresar/i }));
  expect(alerta).toHaveBeenCalledWith("Debe ingresar una contraseña");
});
