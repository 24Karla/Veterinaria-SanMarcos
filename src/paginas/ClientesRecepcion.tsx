import { useState } from 'react';
import { Link } from 'react-router-dom';
import EstadoApi from '../componentes/moleculas/EstadoApi';
import {
    api, estadosCita,
    type CitaApi, type CompraClinicaApi, type PedidoApi, type UsuarioApi,
} from '../servicios/api';
import { rutasPerfil } from '../servicios/rutas';
import { useClientesInscritos, useRegistros } from '../servicios/useRegistros';

const formatoPrecio = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' });

function correoNormalizado(correo: string) {
    return correo.trim().toLowerCase();
}

function HistorialCliente({ cliente }: { cliente: UsuarioApi }) {
    const agenda = useRegistros<CitaApi>(`${api.agenda}/api/citas`);
    const compras = useRegistros<CompraClinicaApi>(`${api.compras}/api/compras/dueno/${cliente.id}`);
    const pedidos = useRegistros<PedidoApi>(`${api.pedidos}/api/pedidos`);
    const correo = correoNormalizado(cliente.email);
    const citasCliente = agenda.registros.filter((cita) => correoNormalizado(cita.correo) === correo);
    const pedidosCliente = pedidos.registros.filter((pedido) => correoNormalizado(pedido.correo) === correo);

    return (
        <section aria-labelledby="nombre-cliente-recepcion">
            <header className="perfil-encabezado mt-4">
                <h2 id="nombre-cliente-recepcion" className="h4 fw-bold text-break">{cliente.nombre}</h2>
                <p className="text-break">{cliente.email}</p>
            </header>
            <article className="perfil-tarjeta agenda-formulario mb-3">
                <h2>Citas del cliente</h2>
                <EstadoApi cargando={agenda.cargando} error={agenda.error} />
                {!agenda.cargando && !agenda.error && citasCliente.length === 0 && <p>No hay citas registradas.</p>}
                {citasCliente.length > 0 && (
                    <div className="perfil-lista mb-0">
                        {citasCliente.map((cita) => (
                            <div key={cita.id}>
                                <strong>{cita.mascota} · {cita.servicio}</strong>
                                <span>{cita.fecha} · {cita.hora.slice(0, 5)} hrs · {cita.veterinario}</span>
                                <span>{estadosCita[cita.estado] ?? cita.estado}</span>
                            </div>
                        ))}
                    </div>
                )}
            </article>
            <div className="perfil-grid">
                <article className="perfil-tarjeta agenda-formulario">
                    <h2>Compras en clínica</h2>
                    <EstadoApi cargando={compras.cargando} error={compras.error} />
                    {!compras.cargando && !compras.error && compras.registros.length === 0 && (
                        <p>No hay compras en clínica.</p>
                    )}
                    {compras.registros.length > 0 && (
                        <div className="perfil-lista mb-0">
                            {compras.registros.map((compra) => (
                                <div key={compra.id}>
                                    <strong>Compra #{compra.id} · {formatoPrecio.format(compra.totalClp)}</strong>
                                    <span>{compra.fechaCompra.slice(0, 10)} · {compra.estado}</span>
                                    <span>{compra.detalles.map((detalle) => `${detalle.nombreComercial} × ${detalle.cantidad}`).join(', ')}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </article>
                <article className="perfil-tarjeta agenda-formulario">
                    <h2>Pedidos de la tienda</h2>
                    <EstadoApi cargando={pedidos.cargando} error={pedidos.error} />
                    {!pedidos.cargando && !pedidos.error && pedidosCliente.length === 0 && <p>No hay pedidos de la tienda.</p>}
                    {pedidosCliente.length > 0 && (
                        <div className="perfil-lista mb-0">
                            {pedidosCliente.map((pedido) => (
                                <div key={pedido.id}>
                                    <strong>Pedido #{pedido.id} · {formatoPrecio.format(pedido.total)}</strong>
                                    <span>{pedido.fecha.slice(0, 10)} · {pedido.estado}</span>
                                    <span>{pedido.productos.map((producto) => `${producto.nombre} × ${producto.cantidad}`).join(', ')}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </article>
            </div>
        </section>
    );
}

export default function ClientesRecepcion() {
    const usuarios = useClientesInscritos();
    const [clienteId, setClienteId] = useState('');
    const seleccion = usuarios.clientes.find(({ id }) => id === Number(clienteId));

    return (
        <main className="container panel-perfil">
            <Link to={rutasPerfil.recepcionista} className="btn btn-volver-tienda mb-4">
                ← Volver a mi perfil
            </Link>
            <header className="perfil-encabezado">
                <span className="perfil-etiqueta">RECEPCIÓN</span>
                <h1>Buscar clientes</h1>
                <p>Consulta las citas y el historial de compras de un cliente.</p>
            </header>
            <section className="perfil-tarjeta agenda-formulario" aria-label="Búsqueda de clientes">
                <div>
                    <label className="form-label" htmlFor="seleccionar-cliente-recepcion">Clientes inscritos</label>
                    <select
                        className="form-select"
                        id="seleccionar-cliente-recepcion"
                        value={clienteId}
                        disabled={usuarios.clientes.length === 0}
                        onChange={(event) => setClienteId(event.target.value)}
                    >
                        <option value="">Selecciona un cliente</option>
                        {usuarios.clientes.map(({ id, nombre, email }) => (
                            <option key={id} value={id}>{nombre} · {email}</option>
                        ))}
                    </select>
                </div>
                <EstadoApi cargando={usuarios.cargando} error={usuarios.error} />
                {!usuarios.cargando && !usuarios.error && usuarios.clientes.length === 0 && (
                    <p role="status">Todavía no hay clientes inscritos.</p>
                )}
            </section>
            {seleccion && <HistorialCliente key={seleccion.id} cliente={seleccion} />}
        </main>
    );
}
