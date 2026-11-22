import { useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import BotonVolver from '../componentes/atomos/BotonVolver';
import EstadoApi from '../componentes/moleculas/EstadoApi';
import {
    api,
    pedirDatos,
    obtenerSesion,
    mensajeError,
    type HorarioApi,
    type MascotaApi,
    type CitaApi,
} from '../servicios/api';

interface Props {
    onVolver: () => void;
    textoVolver?: string;
    servicioSeleccionado?: string;
}

export default function ReservarCita({
    onVolver,
    textoVolver = 'Volver a productos',
    servicioSeleccionado,
}: Props) {
    const sesion = obtenerSesion();
    const [horarios, setHorarios] = useState<HorarioApi[]>([]);
    const [mascotas, setMascotas] = useState<MascotaApi[]>([]);
    const [mascotaId, setMascotaId] = useState('');
    const [horarioId, setHorarioId] = useState('');
    const [fecha, setFecha] = useState('');
    const [motivo, setMotivo] = useState('');
    const [cargando, setCargando] = useState(true);
    const [enviando, setEnviando] = useState(false);
    const [error, setError] = useState('');
    const [reservada, setReservada] = useState<CitaApi | null>(null);
    const clienteId = sesion?.id;

    useEffect(() => {
        if (!clienteId) return;
        Promise.all([
            pedirDatos<HorarioApi[]>(`${api.agenda}/api/horarios`),
            pedirDatos<MascotaApi[]>(
                `${api.mascotas}/api/mascotas?clienteId=${clienteId}`,
            ),
        ])
            .then(([horarios, mascotas]) => {
                setHorarios(horarios);
                setMascotas(mascotas);
            })
            .catch((error) => setError(mensajeError(error)))
            .finally(() => setCargando(false));
    }, [clienteId]);

    async function reservar(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (enviando) return;
        const mascota = mascotas.find((mascota) => mascota.id === Number(mascotaId));
        if (!mascota || !horarioId || !motivo.trim()) {
            setError('Selecciona tu mascota, un horario disponible y el motivo.');
            return;
        }
        setEnviando(true);
        setError('');
        try {
            const cita = await pedirDatos<CitaApi>(`${api.agenda}/api/citas`, {
                method: 'POST',
                body: JSON.stringify({
                    horarioId: Number(horarioId),
                    dueno: sesion?.nombre,
                    correo: sesion?.correo,
                    mascota: mascota.nombre,
                    especie: mascota.especie,
                    servicio: servicioSeleccionado || 'Consulta general',
                    motivo: motivo.trim(),
                }),
            });
            setReservada(cita);
        } catch (error) {
            setError(mensajeError(error));
            pedirDatos<HorarioApi[]>(`${api.agenda}/api/horarios`)
                .then(setHorarios)
                .catch(() => {});
            setHorarioId('');
        } finally {
            setEnviando(false);
        }
    }

    if (!sesion) {
        return (
            <main className="container pagina-cita">
                <h1>Inicia sesión para reservar</h1>
                <Link className="btn btn-tienda" to="/login">
                    Iniciar sesión
                </Link>
            </main>
        );
    }

    if (reservada) {
        return (
            <main className="container pagina-cita">
                <section className="cita-confirmada">
                    <span>✓</span>
                    <h1>¡Cita reservada!</h1>
                    <p>
                        {reservada.mascota}: {reservada.fecha} a las{' '}
                        {reservada.hora.slice(0, 5)} con {reservada.veterinario}.
                    </p>
                    <p>Número de reserva: {reservada.id}.</p>
                    <button className="btn btn-tienda" onClick={onVolver}>
                        {textoVolver}
                    </button>
                </section>
            </main>
        );
    }

    return (
        <main className="container pagina-cita">
            <BotonVolver onClick={onVolver} texto={`← ${textoVolver}`} />
            <h1>Reservar cita</h1>
            <EstadoApi cargando={cargando} error={error} />
            {servicioSeleccionado && <p>Servicio: {servicioSeleccionado}</p>}
            {!cargando && mascotas.length === 0 && (
                <p>
                    Primero registra una mascota en{' '}
                    <Link to="/perfil/cliente">tu perfil</Link>.
                </p>
            )}
            <form className="formulario-cita" onSubmit={reservar}>
                <p>
                    Dueño: {sesion.nombre} · {sesion.correo}
                </p>
                <label htmlFor="mascota">Mascota</label>
                <select
                    id="mascota"
                    className="form-select mb-3"
                    value={mascotaId}
                    onChange={(event) => setMascotaId(event.target.value)}
                >
                    <option value="">Selecciona tu mascota</option>
                    {mascotas.map((mascota) => (
                        <option key={mascota.id} value={mascota.id}>
                            {mascota.nombre} · {mascota.especie}
                        </option>
                    ))}
                </select>
                <label htmlFor="fecha">Fecha</label>
                <select
                    id="fecha"
                    className="form-select mb-3"
                    value={fecha}
                    onChange={(event) => {
                        setFecha(event.target.value);
                        setHorarioId('');
                    }}
                >
                    <option value="">Selecciona una fecha disponible</option>
                    {[...new Set(horarios.map((horario) => horario.fecha))].map(
                        (fecha) => (
                            <option key={fecha}>{fecha}</option>
                        ),
                    )}
                </select>
                <label htmlFor="horario">Hora y veterinario</label>
                <select
                    id="horario"
                    className="form-select mb-3"
                    value={horarioId}
                    onChange={(event) => setHorarioId(event.target.value)}
                >
                    <option value="">Selecciona un horario</option>
                    {horarios
                        .filter((horario) => horario.fecha === fecha)
                        .map((horario) => (
                            <option key={horario.id} value={horario.id}>
                                {horario.hora.slice(0, 5)} · {horario.veterinario}
                            </option>
                        ))}
                </select>
                {!cargando && !error && horarios.length === 0 && (
                    <p>
                        No hay horarios disponibles. Administración debe habilitar nuevos
                        horarios.
                    </p>
                )}
                <label htmlFor="motivo">Motivo de consulta</label>
                <textarea
                    id="motivo"
                    className="form-control"
                    rows={4}
                    maxLength={2000}
                    value={motivo}
                    onChange={(event) => setMotivo(event.target.value)}
                />
                <button
                    className="btn btn-tienda mt-3"
                    disabled={enviando || cargando || mascotas.length === 0}
                >
                    {enviando ? 'Reservando…' : 'Reservar cita'}
                </button>
            </form>
        </main>
    );
}
