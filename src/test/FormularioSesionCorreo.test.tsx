// @vitest-environment jsdom
import{ test, expect, vi } from "vitest";
import {render, screen, fireEvent } from "@testing-library/react";

import FormularioSesion from "../componentes/organismos/FormularioSesion";

test("muestra una alerta cuando el correo esta vacio", () => {
    const alerta = vi.spyOn(window, "alert").mockImplementation(()=>{});
    render(<FormularioSesion/>);
    fireEvent.click(
        screen.getByRole("button", {name:"Ingresar"})
    );
    expect(alerta).toHaveBeenCalledWith("Debe ingresar su correo");
    alerta.mockRestore();
});