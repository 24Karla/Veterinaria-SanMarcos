import { useEffect, useState, type FormEvent } from 'react';
import { Link, useLocation } from 'react-router-dom';
import BotonVolver from '../componentes/atomos/BotonVolver';
import EstadoApi from '../componentes/moleculas/EstadoApi';
import OpcionesIngreso from '../componentes/moleculas/OpcionesIngreso';
import {
    api,
    mostrarErrorFormulario,
    pedirDatos,
    obtenerSesion,
    mensajeError,
    type HorarioApi,
    type CitaApi,
    type MascotaApi,
} from '../servicios/api';
import { useClientesInscritos, useRegistros } from '../servicios/useRegistros';

interface Props {
    onVolver: () => void;
    textoVolver?: string;
    servicioSeleccionado?: string;
    paraCliente?: boolean;
}

export default function ReservarCita({
    onVolver,
    textoVolver = 'Volver a productos',
    servicioSeleccionado,
    paraCliente = false,
}: Props) {
    const sesion = obtenerSesion();
    const [continuarInvitado, setContinuarInvitado] = useState(false);
    const ubicacion = useLocation();
    const [datos, setDatos] = useState(() => {
        let guardados = {
            dueno: '',
            correo: '',
            mascota: '',
            especie: '',
            fecha: '',
            horarioId: '',
            motivo: '',
        };
        if (paraCliente) return guardados;
        try {
            const borrador = sessionStorage.getItem('reserva-veterinaria');
            if (borrador) guardados = { ...guardados, ...JSON.parse(borrador) };
        } catch {
            /* Un borrador inválido no impide completar el formulario. */
        }
        return {
            ...guardados,
            dueno: sesion?.nombre || guardados.dueno,
            correo: sesion?.correo || guardados.correo,
        };
    });
    const [horarios, setHorarios] = useState<HorarioApi[]>([]);
    const [cargando, setCargando] = useState(true);
    const [enviando, setEnviando] = useState(false);
    const [error, setError] = useState('');
    const [reservada, setReservada] = useState<CitaApi | null>(null);
    const [clienteSeleccionado, setClienteSeleccionado] = useState('');
    const [mascotaSeleccionada, setMascotaSeleccionada] = useState('');
    const inscritos = useClientesInscritos(paraCliente);
    const cliente = inscritos.clientes.find(({ id }) => id === Number(clienteSeleccionado));
    const duenoId = paraCliente ? cliente?.id : sesion?.rol === 'cliente' ? sesion.id : undefined;
    const mascotas = useRegistros<MascotaApi>(
        duenoId ? `${api.mascotas}/api/mascotas?clienteId=${duenoId}` : null,
    );
    const mascotasInscritas = mascotas.registros.filter((mascota) => mascota.clienteId === duenoId && mascota.activo);
    const mascota = mascotasInscritas.find(({ id }) => id === Number(mascotaSeleccionada));
    const mostrarDatosCliente = !paraCliente || Boolean(cliente) || clienteSeleccionado === 'sin-cuenta';
    const mascotaManual = !mascotas.cargando && (!mascotasInscritas.length || mascotaSeleccionada === 'otra');
    const nombreDueno = cliente?.nombre ?? datos.dueno;
    const correoDueno = cliente?.email ?? datos.correo;
    const nombreMascota = mascotaManual ? datos.mascota : mascota?.nombre ?? '';
    const especieMascota = mascotaManual ? datos.especie : mascota?.especie ?? '';

    useEffect(() => {
        pedirDatos<HorarioApi[]>(`${api.agenda}/api/horarios`)
            .then(setHorarios)
            .catch((error) => setError(mensajeError(error)))
            .finally(() => setCargando(false));
    }, []);

    function cambiar(campo: keyof typeof datos, valor: string) {
        setDatos((actuales) => ({ ...actuales, [campo]: valor }));
    }

    function cambiarCliente(id: string) {
        setClienteSeleccionado(id);
        setMascotaSeleccionada('');
        setDatos((actuales) => ({ ...actuales, dueno: '', correo: '', mascota: '', especie: '' }));
    }

    async function reservar(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (enviando || !mostrarDatosCliente || mascotas.cargando) return;
        setError('');
        const errores: string[] = [];
        if (!nombreDueno.trim()) errores.push('Nombre del dueño: ingresa tu nombre.');
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correoDueno.trim()))
            errores.push('Correo electrónico: ingresa un correo válido.');
        if (!nombreMascota.trim()) {
            errores.push(mascotaManual ? 'Nombre de la mascota: completa este campo.' : 'Mascota: selecciona una opción.');
        }
        if (mascotaManual && !especieMascota) errores.push('Especie: selecciona una opción.');
        if (!datos.fecha) errores.push('Fecha: elige un día futuro.');
        if (!datos.horarioId) errores.push('Hora: selecciona un horario disponible.');
        if (!datos.motivo.trim())
            errores.push('Motivo de consulta: completa este campo.');
        if (errores.length > 0) {
            alert(
                'Revisa los siguientes datos:\n\n' +
                    errores.map((error) => '• ' + error).join('\n'),
            );
            return;
        }
        setEnviando(true);
        setError('');
        try {
            const cita = await pedirDatos<CitaApi>(`${api.agenda}/api/citas`, {
                method: 'POST',
                body: JSON.stringify({
                    horarioId: Number(datos.horarioId),
                    dueno: nombreDueno.trim(),
                    correo: correoDueno.trim(),
                    mascota: nombreMascota.trim(),
                    especie: especieMascota,
                    servicio: servicioSeleccionado || 'Consulta general',
                    motivo: datos.motivo.trim(),
                }),
            });
            if (!paraCliente) sessionStorage.removeItem('reserva-veterinaria');
            setReservada(cita);
        } catch (error) {
            mostrarErrorFormulario(error, setError);
            pedirDatos<HorarioApi[]>(`${api.agenda}/api/horarios`)
                .then(setHorarios)
                .catch(() => {});
            cambiar('horarioId', '');
        } finally {
            setEnviando(false);
        }
    }

    if (reservada) {
        return (
            <main className="container pagina-cita">
                <section className="cita-confirmada">
                    <span>✓</span>
                    <h1>¡Cita reservada!</h1>
                    <p>
                        <strong>{reservada.mascota}</strong> tiene una cita el{' '}
                        {reservada.fecha} a las {reservada.hora.slice(0, 5)} con{' '}
                        {reservada.veterinario}.
                    </p>
                    <p>Número de reserva: {reservada.id}.</p>
                    <button type="button" className="btn btn-tienda" onClick={onVolver}>
                        {textoVolver}
                    </button>
                </section>
            </main>
        );
    }

    if (!paraCliente && !sesion && !continuarInvitado) {
        return (
            <main className="container pagina-cita">
                <BotonVolver onClick={onVolver} texto={`← ${textoVolver}`} />
                <h1>Reservar cita</h1>
                <OpcionesIngreso
                    volverA={
                        ubicacion.pathname === '/tienda'
                            ? ubicacion.pathname + ubicacion.search
                            : '/tienda?pagina=cita'
                    }
                    onContinuarInvitado={() => setContinuarInvitado(true)}
                    onGuardarBorrador={() =>
                        sessionStorage.setItem(
                            'reserva-veterinaria',
                            JSON.stringify(datos),
                        )
                    }
                />
            </main>
        );
    }

    return (
        <main className={`container ${paraCliente ? 'panel-perfil' : 'pagina-cita'}`}>
            <div className={paraCliente ? 'mb-4' : undefined}>
                <BotonVolver onClick={onVolver} texto={`← ${textoVolver}`} />
            </div>
            {paraCliente ? (
                <header className="perfil-encabezado">
                    <span className="perfil-etiqueta">RECEPCIÓN</span>
                    <h1>Reservar cita</h1>
                    <p>Agenda una atención con los datos del cliente.</p>
                </header>
            ) : (
                <>
                    <h1>Reservar cita</h1>
                    <p className="cita-subtitulo">Agenda una atención para tu mascota.</p>
                </>
            )}
            {!paraCliente && !sesion && (
                <p className="mb-4">
                    Puedes reservar como invitado.{' '}
                    <Link
                        className="enlace-sesion-opcional"
                        to="/login"
                        state={{
                            volverA:
                                ubicacion.pathname === '/tienda'
                                    ? ubicacion.pathname + ubicacion.search
                                    : '/tienda?pagina=cita',
                        }}
                        onClick={() =>
                            sessionStorage.setItem(
                                'reserva-veterinaria',
                                JSON.stringify(datos),
                            )
                        }
                    >
                        Iniciar sesión (opcional)
                    </Link>
                </p>
            )}
            {servicioSeleccionado && (
                <p className="mb-4 fw-bold texto-marca">
                    Servicio seleccionado: {servicioSeleccionado}
                </p>
            )}
            <EstadoApi cargando={cargando} error={error} />
            <form className="formulario-cita" noValidate onSubmit={reservar}>
                <h2>Datos de la atención</h2>
                <div className="row g-3">
                    {paraCliente && (
                        <div className="col-12">
                            <label htmlFor="cliente-cita">Clientes inscritos</label>
                            <select
                                id="cliente-cita"
                                className="form-select"
                                disabled={inscritos.cargando || enviando}
                                value={clienteSeleccionado}
                                onChange={(event) => cambiarCliente(event.target.value)}
                            >
                                <option value="">Selecciona un cliente</option>
                                {inscritos.clientes.map(({ id, nombre, email }) => (
                                    <option key={id} value={id}>{nombre} · {email}</option>
                                ))}
                                <option value="sin-cuenta">Cliente sin cuenta</option>
                            </select>
                            <EstadoApi cargando={inscritos.cargando} error={inscritos.error} />
                        </div>
                    )}
                    {mostrarDatosCliente && (
                        <>
                            <div className="col-md-6">
                                <label htmlFor="dueno">Nombre del dueño</label>
                                <input
                                    id="dueno"
                                    className="form-control"
                                    maxLength={150}
                                    readOnly={Boolean(cliente)}
                                    value={nombreDueno}
                                    onChange={(event) => cambiar('dueno', event.target.value)}
                                />
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="correo">Correo electrónico</label>
                                <input
                                    id="correo"
                                    type="email"
                                    className="form-control"
                                    maxLength={150}
                                    readOnly={Boolean(cliente)}
                                    value={correoDueno}
                                    onChange={(event) => cambiar('correo', event.target.value)}
                                />
                            </div>
                            {duenoId && (
                                <div className="col-12">
                                    <EstadoApi cargando={mascotas.cargando} error={mascotas.error} />
                                    {mascotasInscritas.length > 0 && (
                                        <>
                                            <label htmlFor="mascota-inscrita">Mascotas inscritas</label>
                                            <select
                                                id="mascota-inscrita"
                                                className="form-select"
                                                value={mascotaSeleccionada}
                                                onChange={(event) => setMascotaSeleccionada(event.target.value)}
                                            >
                                                <option value="">Selecciona una mascota</option>
                                                {mascotasInscritas.map(({ id, nombre, raza }) => (
                                                    <option key={id} value={id}>{nombre}{raza ? ` · ${raza}` : ''}</option>
                                                ))}
                                                <option value="otra">Ingresar otra mascota</option>
                                            </select>
                                        </>
                                    )}
                                    {!mascotas.cargando && !mascotas.error && !mascotasInscritas.length && (
                                        <p className="form-text mb-0">Esta cuenta no tiene mascotas inscritas. Puedes ingresar sus datos aquí.</p>
                                    )}
                                </div>
                            )}
                            {mascotaManual && (
                                <>
                                    <div className="col-md-6">
                                        <label htmlFor="mascota">Nombre de la mascota</label>
                                        <input
                                            id="mascota"
                                            className="form-control"
                                            maxLength={100}
                                            value={datos.mascota}
                                            onChange={(event) => cambiar('mascota', event.target.value)}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="especie">Especie</label>
                                        <select
                                            id="especie"
                                            className="form-select"
                                            value={datos.especie}
                                            onChange={(event) => cambiar('especie', event.target.value)}
                                        >
                                            <option value="">Selecciona una especie</option>
                                            <option value="PERRO">Perro</option>
                                            <option value="GATO">Gato</option>
                                            <option value="OTRO">Otro</option>
                                        </select>
                                    </div>
                                </>
                            )}
                            <div className="col-md-6">
                                <label htmlFor="fecha">Fecha</label>
                                <input
                                    id="fecha"
                                    type="date"
                                    className="form-control"
                                    value={datos.fecha}
                                    onChange={(event) =>
                                        setDatos({
                                            ...datos,
                                            fecha: event.target.value,
                                            horarioId: '',
                                        })
                                    }
                                />
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="hora">Hora</label>
                                <select
                                    id="hora"
                                    className="form-select"
                                    value={datos.horarioId}
                                    onChange={(event) => cambiar('horarioId', event.target.value)}
                                >
                                    <option value="">Selecciona una hora</option>
                                    {horarios
                                        .filter((horario) => horario.fecha === datos.fecha)
                                        .map((horario) => (
                                            <option key={horario.id} value={horario.id}>
                                                {horario.hora.slice(0, 5)} · {horario.veterinario}
                                            </option>
                                        ))}
                                </select>
                            </div>
                            <div className="col-12">
                                <label htmlFor="motivo">Motivo de consulta</label>
                                <textarea
                                    id="motivo"
                                    className="form-control"
                                    rows={4}
                                    maxLength={2000}
                                    value={datos.motivo}
                                    onChange={(event) => cambiar('motivo', event.target.value)}
                                />
                            </div>
                        </>
                    )}
                </div>
                {!cargando && !error && horarios.length === 0 && (
                    <p className="mt-3">No hay horarios disponibles para reservar.</p>
                )}
                <button
                    type="submit"
                    className="btn btn-tienda mt-4"
                    disabled={enviando || cargando || mascotas.cargando || !mostrarDatosCliente}
                >
                    {enviando ? 'Reservando…' : 'Reservar cita'}
                </button>
            </form>
        </main>
    );
}
