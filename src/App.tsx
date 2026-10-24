
import { useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import Footer from './componentes/organismos/Footer';
import Navbar from './componentes/organismos/Navbar';

import PerfilProtegido, {
  rutasPerfil,
  type SesionUsuario,
} from './componentes/organismos/PerfilProtegido';

import {
  CitasAdministrador,
  UsuariosAdministrador,
  VentasAdministrador,
} from './paginas/GestionAdministrador';

import {
  AgendaVeterinario,
  HistorialVeterinario,
  RecetasVeterinario,
} from './paginas/GestionVeterinario';

import HistorialCliente from './paginas/HistorialCliente';
import HistorialCompras from './paginas/HistorialCompras';
import Inicio from './paginas/Inicio';
import Login from './paginas/Login';
import MisCitas from './paginas/MisCitas';
import PerfilAdministrador from './paginas/PerfilAdministrador';
import PerfilCliente from './paginas/PerfilCliente';
import PerfilVeterinario from './paginas/PerfilVeterinario';
import ProductosInventario from './paginas/ProductosInventario';
import Tienda from './paginas/Tienda';

function App() {
    const [sesion, setSesion] = useState<SesionUsuario | null>(() => {
        try {
            const guardada = localStorage.getItem('sesion-veterinaria');

            return guardada
                ? JSON.parse(guardada)
                : null;
        } catch {
            return null;
        }
    });

    function iniciarSesion(nuevaSesion: SesionUsuario) {
        setSesion(nuevaSesion);

        localStorage.setItem(
            'sesion-veterinaria',
            JSON.stringify(nuevaSesion)
        );
    }

    function cerrarSesion() {
        setSesion(null);

        localStorage.removeItem('sesion-veterinaria');
    }

    return (
        <div
            className="d-flex flex-column"
            style={{
                minHeight: '100vh',
                backgroundColor: '#f5f0e8',
            }}
        >
            <Navbar
                sesion={sesion}
                onCerrarSesion={cerrarSesion}
            />

            <div className="flex-grow-1">
                <Routes>

                    {/* Rutas principales */}

                    <Route
                        path="/"
                        element={<Inicio />}
                    />

                    <Route
                        path="/login"
                        element={
                            sesion ? (
                                <Navigate
                                    to={rutasPerfil[sesion.rol]}
                                    replace
                                />
                            ) : (
                                <Login onLogin={iniciarSesion} />
                            )
                        }
                    />

                    <Route
                        path="/tienda/*"
                        element={<Tienda />}
                    />

                    {/* Rutas del cliente */}

                    <Route
                        path="/perfil/cliente"
                        element={
                            <PerfilProtegido
                                sesion={sesion}
                                rol="cliente"
                            >
                                {(usuario) => (
                                    <PerfilCliente sesion={usuario} />
                                )}
                            </PerfilProtegido>
                        }
                    />

                    <Route
                        path="/perfil/cliente/citas"
                        element={
                            <PerfilProtegido
                                sesion={sesion}
                                rol="cliente"
                            >
                                {() => <MisCitas />}
                            </PerfilProtegido>
                        }
                    />

                    <Route
                        path="/perfil/cliente/historial"
                        element={
                            <PerfilProtegido
                                sesion={sesion}
                                rol="cliente"
                            >
                                {() => <HistorialCliente />}
                            </PerfilProtegido>
                        }
                    />

                    <Route
                        path="/perfil/cliente/compras"
                        element={
                            <PerfilProtegido
                                sesion={sesion}
                                rol="cliente"
                            >
                                {() => <HistorialCompras />}
                            </PerfilProtegido>
                        }
                    />

                    {/* Rutas del veterinario */}

                    <Route
                        path="/perfil/veterinario"
                        element={
                            <PerfilProtegido
                                sesion={sesion}
                                rol="veterinario"
                            >
                                {(usuario) => (
                                    <PerfilVeterinario sesion={usuario} />
                                )}
                            </PerfilProtegido>
                        }
                    />

                    <Route
                        path="/perfil/veterinario/agenda"
                        element={
                            <PerfilProtegido
                                sesion={sesion}
                                rol="veterinario"
                            >
                                {() => <AgendaVeterinario />}
                            </PerfilProtegido>
                        }
                    />

                    <Route
                        path="/perfil/veterinario/recetas"
                        element={
                            <PerfilProtegido
                                sesion={sesion}
                                rol="veterinario"
                            >
                                {() => <RecetasVeterinario />}
                            </PerfilProtegido>
                        }
                    />

                    <Route
                        path="/perfil/veterinario/historial"
                        element={
                            <PerfilProtegido
                                sesion={sesion}
                                rol="veterinario"
                            >
                                {() => <HistorialVeterinario />}
                            </PerfilProtegido>
                        }
                    />

                    {/* Rutas del administrador */}

                    <Route
                        path="/perfil/administrador"
                        element={
                            <PerfilProtegido
                                sesion={sesion}
                                rol="administrador"
                            >
                                {(usuario) => (
                                    <PerfilAdministrador sesion={usuario} />
                                )}
                            </PerfilProtegido>
                        }
                    />

                    <Route
                        path="/perfil/administrador/productos"
                        element={
                            <PerfilProtegido
                                sesion={sesion}
                                rol="administrador"
                            >
                                {() => <ProductosInventario />}
                            </PerfilProtegido>
                        }
                    />

                    <Route
                        path="/perfil/administrador/citas"
                        element={
                            <PerfilProtegido
                                sesion={sesion}
                                rol="administrador"
                            >
                                {() => <CitasAdministrador />}
                            </PerfilProtegido>
                        }
                    />

                    <Route
                        path="/perfil/administrador/ventas"
                        element={
                            <PerfilProtegido
                                sesion={sesion}
                                rol="administrador"
                            >
                                {() => <VentasAdministrador />}
                            </PerfilProtegido>
                        }
                    />

                    <Route
                        path="/perfil/administrador/usuarios"
                        element={
                            <PerfilProtegido
                                sesion={sesion}
                                rol="administrador"
                            >
                                {() => <UsuariosAdministrador />}
                            </PerfilProtegido>
                        }
                    />

                </Routes>
            </div>

            <Footer />
        </div>
    );
}

export default App;
