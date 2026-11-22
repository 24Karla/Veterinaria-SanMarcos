import { useEffect, useState, type FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import EstadoApi from '../componentes/moleculas/EstadoApi';
import {
    api,
    pedirDatos,
    mensajeError,
    obtenerSesion,
    type CitaApi,
    type FichaApi,
    type ConsultaApi,
    type MascotaApi,
    type UsuarioApi,
} from '../servicios/api';

export function AgendaVeterinario() {
    const nombre = obtenerSesion()?.nombre;
    const [citas, setCitas] = useState<CitaApi[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');
    const [ocupado, setOcupado] = useState(false);
    useEffect(() => {
        pedirDatos<CitaApi[]>(`${api.agenda}/api/citas`)
            .then((citas) =>
                setCitas(citas.filter((cita) => cita.veterinario === nombre)),
            )
            .catch((error) => setError(mensajeError(error)))
            .finally(() => setCargando(false));
    }, [nombre]);

    async function atender(id: number) {
        if (ocupado) return;
        setOcupado(true);
        setError('');
        try {
            const cita = await pedirDatos<CitaApi>(
                `${api.agenda}/api/citas/${id}/atendida`,
                { method: 'PUT' },
            );
            setCitas((actuales) =>
                actuales.map((actual) => (actual.id === id ? cita : actual)),
            );
        } catch (error) {
            setError(mensajeError(error));
        } finally {
            setOcupado(false);
        }
    }

    return (
        <main className="container panel-perfil">
            <Link to="/perfil/veterinario" className="btn btn-volver-tienda mb-4">
                ← Volver a mi perfil
            </Link>
            <h1>Mi agenda</h1>
            <EstadoApi cargando={cargando} error={error} />
            {!cargando && !error && citas.length === 0 && (
                <p>No tienes citas asignadas.</p>
            )}
            {citas.map((cita) => (
                <article className="perfil-tarjeta mb-3" key={cita.id}>
                    <h2>
                        {cita.mascota} · {cita.servicio}
                    </h2>
                    <p>
                        {cita.fecha} · {cita.hora.slice(0, 5)} · {cita.dueno} ·{' '}
                        {cita.estado}
                    </p>
                    <p>{cita.motivo}</p>
                    {cita.estado === 'RESERVADA' && (
                        <button
                            className="btn btn-tienda me-2"
                            disabled={ocupado}
                            onClick={() => atender(cita.id)}
                        >
                            Marcar atendida
                        </button>
                    )}
                    <Link
                        className="btn btn-volver-tienda"
                        to="/perfil/veterinario/historial"
                    >
                        Registrar atención clínica
                    </Link>
                </article>
            ))}
        </main>
    );
}

export function RecetasVeterinario() {
    return <PanelClinico soloRecetas />;
}

export function HistorialVeterinario() {
    return <PanelClinico soloRecetas={false} />;
}

const consultaVacia = {
    pacienteId: '',
    tipoServicio: 'Consulta general',
    motivoConsulta: '',
    diagnostico: '',
    medicamentosRecetados: '',
    indicaciones: '',
    pesoKg: '',
    proximoControl: '',
    nombreVacuna: '',
    lote: '',
    fechaAplicacion: '',
    fechaVencimiento: '',
};

function PanelClinico({ soloRecetas }: { soloRecetas: boolean }) {
    const sesion = obtenerSesion();
    const veterinarioId = sesion?.id;
    const [consultas, setConsultas] = useState<ConsultaApi[]>([]);
    const [fichas, setFichas] = useState<FichaApi[]>([]);
    const [mascotas, setMascotas] = useState<MascotaApi[]>([]);
    const [usuarios, setUsuarios] = useState<UsuarioApi[]>([]);
    const [mascotaId, setMascotaId] = useState('');
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');
    const [aviso, setAviso] = useState('');
    const [ocupado, setOcupado] = useState(false);
    const [mostrar, setMostrar] = useState(false);
    const [datos, setDatos] = useState(consultaVacia);

    useEffect(() => {
        if (!veterinarioId) return;
        Promise.all([
            pedirDatos<ConsultaApi[]>(
                `${api.ficha}/api/consultas?veterinarioId=${veterinarioId}`,
            ),
            pedirDatos<FichaApi[]>(`${api.ficha}/api/fichas`),
            pedirDatos<MascotaApi[]>(`${api.mascotas}/api/mascotas`),
            pedirDatos<UsuarioApi[]>(`${api.usuarios}/registro`),
        ])
            .then(([consultas, fichas, mascotas, usuarios]) => {
                setConsultas(consultas);
                setFichas(fichas);
                setMascotas(mascotas);
                setUsuarios(usuarios);
            })
            .catch((error) => setError(mensajeError(error)))
            .finally(() => setCargando(false));
    }, [veterinarioId]);

    async function crearFicha(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const mascota = mascotas.find((mascota) => mascota.id === Number(mascotaId));
        const dueno = usuarios.find((usuario) => usuario.id === mascota?.clienteId);
        if (!mascota || !dueno || ocupado) {
            setError('Selecciona una mascota con un dueño registrado.');
            return;
        }
        setOcupado(true);
        setError('');
        setAviso('');
        try {
            const ficha = await pedirDatos<FichaApi>(`${api.ficha}/api/fichas`, {
                method: 'POST',
                body: JSON.stringify({
                    nombre: mascota.nombre,
                    especie: mascota.especie,
                    raza: mascota.raza,
                    sexo: mascota.sexo,
                    duenoId: dueno.id,
                    nombreDueno: dueno.nombre,
                    telefonoDueno: dueno.telefono,
                }),
            });
            setFichas((actuales) => [...actuales, ficha]);
            setDatos((actuales) => ({ ...actuales, pacienteId: String(ficha.id) }));
            setAviso(`Ficha #${ficha.id} creada para ${mascota.nombre}.`);
        } catch (error) {
            setError(mensajeError(error));
        } finally {
            setOcupado(false);
        }
    }

    async function guardarConsulta(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (ocupado) return;
        setOcupado(true);
        setError('');
        setAviso('');
        try {
            const consulta = await pedirDatos<ConsultaApi>(`${api.ficha}/api/consultas`, {
                method: 'POST',
                body: JSON.stringify({
                    pacienteId: Number(datos.pacienteId),
                    veterinarioId,
                    nombreVeterinario: sesion?.nombre,
                    tipoServicio: datos.tipoServicio,
                    motivoConsulta: datos.motivoConsulta,
                    diagnostico: datos.diagnostico,
                    medicamentosRecetados: datos.medicamentosRecetados,
                    indicaciones: datos.indicaciones,
                    pesoKg: datos.pesoKg ? Number(datos.pesoKg) : null,
                    proximoControl: datos.proximoControl || null,
                    vacunasAplicadas: datos.nombreVacuna
                        ? [
                              {
                                  nombreVacuna: datos.nombreVacuna,
                                  lote: datos.lote,
                                  fechaAplicacion: datos.fechaAplicacion,
                                  fechaVencimiento: datos.fechaVencimiento,
                              },
                          ]
                        : [],
                }),
            });
            setConsultas((actuales) => [consulta, ...actuales]);
            setDatos(consultaVacia);
            setMostrar(false);
            setAviso('Atención clínica registrada.');
        } catch (error) {
            setError(mensajeError(error));
        } finally {
            setOcupado(false);
        }
    }

    const visibles = soloRecetas
        ? consultas.filter((consulta) => consulta.medicamentosRecetados?.trim())
        : consultas;
    return (
        <main className="container panel-perfil">
            <Link to="/perfil/veterinario" className="btn btn-volver-tienda mb-4">
                ← Volver a mi perfil
            </Link>
            <h1>{soloRecetas ? 'Recetas emitidas' : 'Historial clínico'}</h1>
            <EstadoApi cargando={cargando} error={error} />
            {aviso && (
                <p role="status" className="alert alert-success">
                    {aviso}
                </p>
            )}
            <button className="btn btn-tienda mb-3" onClick={() => setMostrar(!mostrar)}>
                Registrar atención
            </button>
            {mostrar && (
                <section className="perfil-grid mb-4">
                    <form className="perfil-tarjeta" onSubmit={crearFicha}>
                        <h2>Crear ficha para una mascota</h2>
                        <p>
                            Si ya tiene ficha, selecciónala en el formulario de atención.
                        </p>
                        <label htmlFor="mascota-ficha">Mascota registrada</label>
                        <select
                            id="mascota-ficha"
                            className="form-select"
                            required
                            value={mascotaId}
                            onChange={(event) => setMascotaId(event.target.value)}
                        >
                            <option value="">Selecciona una mascota</option>
                            {mascotas.map((mascota) => (
                                <option key={mascota.id} value={mascota.id}>
                                    {mascota.nombre} · Dueño #{mascota.clienteId}
                                </option>
                            ))}
                        </select>
                        <button className="btn btn-volver-tienda mt-3" disabled={ocupado}>
                            Crear ficha
                        </button>
                    </form>
                    <form className="perfil-tarjeta" onSubmit={guardarConsulta}>
                        <h2>Datos de la atención</h2>
                        <label htmlFor="paciente-consulta">Ficha del paciente</label>
                        <select
                            id="paciente-consulta"
                            className="form-select"
                            required
                            value={datos.pacienteId}
                            onChange={(event) =>
                                setDatos({ ...datos, pacienteId: event.target.value })
                            }
                        >
                            <option value="">Selecciona una ficha</option>
                            {fichas.map((ficha) => (
                                <option key={ficha.id} value={ficha.id}>
                                    #{ficha.id} · {ficha.nombre} · {ficha.nombreDueno}
                                </option>
                            ))}
                        </select>
                        {(Object.keys(consultaVacia) as (keyof typeof consultaVacia)[])
                            .filter((campo) => campo !== 'pacienteId')
                            .map((campo) => (
                                <div className="mb-2" key={campo}>
                                    <label htmlFor={`consulta-${campo}`}>
                                        {
                                            {
                                                pacienteId: 'Paciente',
                                                tipoServicio: 'Servicio',
                                                motivoConsulta: 'Motivo de consulta',
                                                diagnostico: 'Diagnóstico',
                                                medicamentosRecetados:
                                                    'Medicamentos recetados',
                                                indicaciones: 'Indicaciones',
                                                pesoKg: 'Peso en kg',
                                                proximoControl: 'Próximo control',
                                                nombreVacuna:
                                                    'Vacuna aplicada (opcional)',
                                                lote: 'Lote de vacuna',
                                                fechaAplicacion: 'Fecha de aplicación',
                                                fechaVencimiento: 'Fecha de vencimiento',
                                            }[campo]
                                        }
                                    </label>
                                    <input
                                        id={`consulta-${campo}`}
                                        className="form-control"
                                        value={datos[campo]}
                                        required={
                                            [
                                                'tipoServicio',
                                                'motivoConsulta',
                                                'diagnostico',
                                            ].includes(campo) ||
                                            (!!datos.nombreVacuna &&
                                                [
                                                    'fechaAplicacion',
                                                    'fechaVencimiento',
                                                ].includes(campo))
                                        }
                                        type={
                                            [
                                                'proximoControl',
                                                'fechaAplicacion',
                                                'fechaVencimiento',
                                            ].includes(campo)
                                                ? 'date'
                                                : campo === 'pesoKg'
                                                  ? 'number'
                                                  : 'text'
                                        }
                                        min="0"
                                        step={campo === 'pesoKg' ? '0.1' : undefined}
                                        onChange={(event) =>
                                            setDatos({
                                                ...datos,
                                                [campo]: event.target.value,
                                            })
                                        }
                                    />
                                </div>
                            ))}
                        <button className="btn btn-tienda mt-3" disabled={ocupado}>
                            Guardar atención
                        </button>
                    </form>
                </section>
            )}
            {!cargando && !error && visibles.length === 0 && (
                <p>No hay {soloRecetas ? 'recetas' : 'consultas'} registradas.</p>
            )}
            {visibles.map((consulta) => (
                <article className="perfil-tarjeta mb-3" key={consulta.id}>
                    <h2>
                        {consulta.nombrePaciente} · {consulta.tipoServicio}
                    </h2>
                    <p>
                        {new Date(consulta.fechaConsulta).toLocaleString('es-CL')} ·{' '}
                        {consulta.nombreVeterinario}
                    </p>
                    <p>
                        {soloRecetas
                            ? consulta.medicamentosRecetados
                            : consulta.diagnostico}
                    </p>
                    <Link
                        className="btn btn-volver-tienda"
                        to={`/perfil/veterinario/consultas/${consulta.id}`}
                    >
                        Ver detalle de consulta
                    </Link>
                </article>
            ))}
        </main>
    );
}

export function DetalleConsulta() {
    const { id } = useParams();
    const [consulta, setConsulta] = useState<ConsultaApi | null>(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');
    useEffect(() => {
        pedirDatos<ConsultaApi>(`${api.ficha}/api/consultas/${id}`)
            .then(setConsulta)
            .catch((error) => setError(mensajeError(error)))
            .finally(() => setCargando(false));
    }, [id]);
    return (
        <main className="container panel-perfil">
            <Link
                className="btn btn-volver-tienda mb-4"
                to="/perfil/veterinario/historial"
            >
                ← Volver al historial
            </Link>
            <h1>Detalle de consulta #{id}</h1>
            <EstadoApi cargando={cargando} error={error} />
            {consulta && (
                <article className="perfil-tarjeta">
                    <h2>{consulta.nombrePaciente}</h2>
                    <p>
                        {consulta.tipoServicio} · {consulta.nombreVeterinario}
                    </p>
                    <p>Motivo: {consulta.motivoConsulta}</p>
                    <p>Diagnóstico: {consulta.diagnostico}</p>
                    <p>Medicamentos: {consulta.medicamentosRecetados || 'Sin receta'}</p>
                    <p>
                        Indicaciones:{' '}
                        {consulta.indicaciones || 'Sin indicaciones adicionales'}
                    </p>
                    {consulta.proximoControl && (
                        <p>Próximo control: {consulta.proximoControl}</p>
                    )}
                </article>
            )}
        </main>
    );
}
