import { rutasPerfil } from './servicios/rutas';
import ContenidoAdministrador from './paginas/ContenidoAdministrador';
import ClinicaAdministrador from './paginas/ClinicaAdministrador';
import { obtenerSesion } from './servicios/api';

import { useEffect, useState, type FormEvent } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import Footer from './componentes/organismos/Footer';
import Navbar from './componentes/organismos/Navbar';

import PerfilProtegido, {
    type SesionUsuario,
} from './componentes/organismos/PerfilProtegido';

import {
    CitasAdministrador,
    MensajesAdministrador,
    UsuariosAdministrador,
    VentasAdministrador,
} from './paginas/GestionAdministrador';

import {
    AgendaVeterinario,
    DetalleConsulta,
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
import PerfilRecepcionista from './paginas/PerfilRecepcionista';
import ClientesRecepcion from './paginas/ClientesRecepcion';
import ReservarCita from './paginas/ReservarCita';
import PerfilVeterinario from './paginas/PerfilVeterinario';
import ProductosInventario from './paginas/ProductosInventario';
import Tienda from './paginas/Tienda';

import Servicios from './paginas/Servicios';
import Contacto from './paginas/Contacto';
import Blog from './paginas/Blog';
import Equipo from './paginas/Equipo';

function App() {
    const ubicacion = useLocation();
    const navegar = useNavigate();
    const regreso = ubicacion.state?.volverA;
    const volverAlFormulario =
        typeof regreso === 'string' &&
        (regreso === '/tienda?pagina=pago' ||
            regreso === '/tienda?pagina=cita' ||
            regreso.startsWith('/tienda?pagina=cita&'))
            ? regreso
            : null;
    const [sesion, setSesion] = useState<SesionUsuario | null>(() => {
        return obtenerSesion();
    });

    useEffect(() => {
        function actualizarSesion() {
            setSesion(obtenerSesion());
        }
        window.addEventListener('sesion-actualizada', actualizarSesion);
        window.addEventListener('storage', actualizarSesion);
        return () => {
            window.removeEventListener('sesion-actualizada', actualizarSesion);
            window.removeEventListener('storage', actualizarSesion);
        };
    }, []);

    function mostrarValidacion(event: FormEvent<HTMLDivElement>) {
        event.preventDefault();
        const campo = event.target as
            | HTMLInputElement
            | HTMLSelectElement
            | HTMLTextAreaElement;
        if (!campo.form) return;
        const invalidos = Array.from(
            campo.form.querySelectorAll<
                HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
            >('input, select, textarea'),
        ).filter((elemento) => !elemento.validity.valid);
        if (campo !== invalidos[0]) return;
        const mensajes = invalidos.map((elemento) => {
            const etiqueta =
                elemento.labels?.[0]?.textContent?.trim() ||
                elemento.getAttribute('aria-label') ||
                elemento.id;
            return `${etiqueta}: ${elemento.validationMessage}`;
        });
        alert(
            'Revisa los siguientes datos:\n\n' +
                mensajes.map((mensaje) => '• ' + mensaje).join('\n'),
        );
        campo.focus();
    }

    function iniciarSesion(nuevaSesion: SesionUsuario) {
        setSesion(nuevaSesion);

        localStorage.setItem('sesion-veterinaria', JSON.stringify(nuevaSesion));
    }

    function cerrarSesion() {
        setSesion(null);

        localStorage.removeItem('sesion-veterinaria');
    }

    return (
        <div
            className="d-flex flex-column"
            onInvalidCapture={mostrarValidacion}
            style={{
                minHeight: '100vh',
                backgroundColor: '#f5f0e8',
            }}
        >
            <Navbar sesion={sesion} onCerrarSesion={cerrarSesion} />

            <div className="flex-grow-1">
                <Routes>
                    <Route
                        path="/perfil/administrador/mensajes"
                        element={
                            <PerfilProtegido sesion={sesion} rol="administrador">
                                {() => <MensajesAdministrador />}
                            </PerfilProtegido>
                        }
                    />
                    <Route
                        path="/perfil/administrador/contenido"
                        element={
                            <PerfilProtegido sesion={sesion} rol="administrador">
                                {() => <ContenidoAdministrador />}
                            </PerfilProtegido>
                        }
                    />
                    <Route
                        path="/perfil/administrador/clinica"
                        element={
                            <PerfilProtegido sesion={sesion} rol="administrador">
                                {() => <ClinicaAdministrador />}
                            </PerfilProtegido>
                        }
                    />
                    <Route
                        path="/perfil/veterinario/consultas/:id"
                        element={
                            <PerfilProtegido sesion={sesion} rol="veterinario">
                                {() => <DetalleConsulta />}
                            </PerfilProtegido>
                        }
                    />

                    {/* Rutas principales */}

                    <Route path="/" element={<Inicio />} />

                    <Route
                        path="/login"
                        element={
                            sesion ? (
                                <Navigate
                                    to={
                                        sesion.rol === 'recepcionista'
                                            ? rutasPerfil.recepcionista
                                            : volverAlFormulario || rutasPerfil[sesion.rol]
                                    }
                                    replace
                                />
                            ) : (
                                <Login onLogin={iniciarSesion} />
                            )
                        }
                    />

                    <Route path="/tienda/*" element={<Tienda />} />

                    {/* Rutas del cliente */}

                    <Route
                        path="/perfil/cliente"
                        element={
                            <PerfilProtegido sesion={sesion} rol="cliente">
                                {(usuario) => <PerfilCliente sesion={usuario} />}
                            </PerfilProtegido>
                        }
                    />

                    <Route
                        path="/perfil/cliente/citas"
                        element={
                            <PerfilProtegido sesion={sesion} rol="cliente">
                                {() => <MisCitas />}
                            </PerfilProtegido>
                        }
                    />

                    <Route
                        path="/perfil/cliente/historial"
                        element={
                            <PerfilProtegido sesion={sesion} rol="cliente">
                                {() => <HistorialCliente />}
                            </PerfilProtegido>
                        }
                    />

                    <Route
                        path="/perfil/cliente/compras"
                        element={
                            <PerfilProtegido sesion={sesion} rol="cliente">
                                {() => <HistorialCompras />}
                            </PerfilProtegido>
                        }
                    />

                    {/* Rutas del veterinario */}

                    <Route
                        path="/perfil/veterinario"
                        element={
                            <PerfilProtegido sesion={sesion} rol="veterinario">
                                {(usuario) => <PerfilVeterinario sesion={usuario} />}
                            </PerfilProtegido>
                        }
                    />

                    <Route
                        path="/perfil/veterinario/agenda"
                        element={
                            <PerfilProtegido sesion={sesion} rol="veterinario">
                                {() => <AgendaVeterinario />}
                            </PerfilProtegido>
                        }
                    />

                    <Route
                        path="/perfil/veterinario/recetas"
                        element={
                            <PerfilProtegido sesion={sesion} rol="veterinario">
                                {() => <RecetasVeterinario />}
                            </PerfilProtegido>
                        }
                    />

                    <Route
                        path="/perfil/veterinario/historial"
                        element={
                            <PerfilProtegido sesion={sesion} rol="veterinario">
                                {() => <HistorialVeterinario />}
                            </PerfilProtegido>
                        }
                    />

                    {/* Rutas del administrador */}

                    <Route
                        path="/perfil/administrador"
                        element={
                            <PerfilProtegido sesion={sesion} rol="administrador">
                                {(usuario) => <PerfilAdministrador sesion={usuario} />}
                            </PerfilProtegido>
                        }
                    />

                    <Route
                        path="/perfil/administrador/productos"
                        element={
                            <PerfilProtegido sesion={sesion} rol="administrador">
                                {() => <ProductosInventario />}
                            </PerfilProtegido>
                        }
                    />

                    <Route
                        path="/perfil/administrador/citas"
                        element={
                            <PerfilProtegido sesion={sesion} rol="administrador">
                                {() => <CitasAdministrador />}
                            </PerfilProtegido>
                        }
                    />

                    <Route
                        path="/perfil/administrador/ventas"
                        element={
                            <PerfilProtegido sesion={sesion} rol="administrador">
                                {() => <VentasAdministrador />}
                            </PerfilProtegido>
                        }
                    />

                    <Route
                        path="/perfil/administrador/usuarios"
                        element={
                            <PerfilProtegido sesion={sesion} rol="administrador">
                                {() => <UsuariosAdministrador />}
                            </PerfilProtegido>
                        }
                    />
                    <Route
                        path={rutasPerfil.recepcionista}
                        element={
                            <PerfilProtegido sesion={sesion} rol="recepcionista">
                                {(usuario) => <PerfilRecepcionista sesion={usuario} />}
                            </PerfilProtegido>
                        }
                    />
                    <Route
                        path={`${rutasPerfil.recepcionista}/reservar`}
                        element={
                            <PerfilProtegido sesion={sesion} rol="recepcionista">
                                {() => (
                                    <ReservarCita
                                        paraCliente
                                        textoVolver="Volver a mi perfil"
                                        onVolver={() => navegar(rutasPerfil.recepcionista)}
                                    />
                                )}
                            </PerfilProtegido>
                        }
                    />
                    <Route
                        path={`${rutasPerfil.recepcionista}/clientes`}
                        element={
                            <PerfilProtegido sesion={sesion} rol="recepcionista">
                                {() => <ClientesRecepcion />}
                            </PerfilProtegido>
                        }
                    />
                    <Route
                        path={`${rutasPerfil.recepcionista}/compras`}
                        element={
                            <PerfilProtegido sesion={sesion} rol="recepcionista">
                                {() => <ClinicaAdministrador soloCompras />}
                            </PerfilProtegido>
                        }
                    />
                    <Route path="/servicios" element={<Servicios />} />
                    <Route path="/contacto" element={<Contacto />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/equipo" element={<Equipo />} />
                </Routes>
            </div>

            <Footer />
        </div>
    );
}

export default App;
