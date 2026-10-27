
import { useState, type FormEvent } from 'react';
import BotonVolver from '../componentes/atomos/BotonVolver';

interface Props {
    onVolver: () => void;
    textoVolver?: string;
    servicioSeleccionado?: string;
}

interface DatosCita {
    dueno: string;
    correo: string;
    mascota: string;
    especie: string;
    fecha: string;
    hora: string;
    motivo: string;
}

const datosIniciales: DatosCita = {
    dueno: '',
    correo: '',
    mascota: '',
    especie: '',
    fecha: '',
    hora: '',
    motivo: '',
};

const horarios = [
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '15:00',
    '16:00',
];

export default function ReservarCita({
    onVolver,
    textoVolver = 'Volver a productos',
    servicioSeleccionado,
}: Props) {
    const [datos, setDatos] = useState<DatosCita>(datosIniciales);
    const [reservada, setReservada] = useState(false);

    const cambiar = (campo: keyof DatosCita, valor: string) => {
        setDatos((actual) => ({
            ...actual,
            [campo]: valor,
        }));
    };

    function reservar(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const errores = [
            !datos.dueno.trim() && 'Ingresa el nombre del dueño.',
            !/^\S+@\S+\.\S+$/.test(datos.correo) &&
                'Ingresa un correo válido.',
            !datos.mascota.trim() && 'Ingresa el nombre de la mascota.',
            !datos.especie && 'Selecciona una especie.',
            !datos.fecha && 'Selecciona una fecha.',
            !datos.hora && 'Selecciona una hora.',
            !datos.motivo.trim() && 'Indica el motivo de consulta.',
        ].filter(Boolean) as string[];

        if (errores.length > 0) {
            alert(
                `Revisa los siguientes datos:\n\n${errores
                    .map((error) => `• ${error}`)
                    .join('\n')}`
            );

            return;
        }

        const citaNueva = {
            mascota: datos.mascota.trim(),
            fecha: datos.fecha,
            hora: datos.hora,
            motivo: datos.motivo.trim(),
            veterinario: 'Por confirmar',
        };

        try {
            const guardadas = localStorage.getItem('citas-cliente');

            const citasAnteriores = guardadas
                ? JSON.parse(guardadas)
                : [];

            localStorage.setItem(
                'citas-cliente',
                JSON.stringify([citaNueva, ...citasAnteriores])
            );
        } catch {
            localStorage.setItem(
                'citas-cliente',
                JSON.stringify([citaNueva])
            );
        }

        setReservada(true);
    }

    if (reservada) {
        return (
            <main className="container pagina-cita">
                <section className="cita-confirmada">
                    <span>✓</span>

                    <h1>¡Cita reservada!</h1>

                    <p>
                        Enviaremos la confirmación a {datos.correo}.
                    </p>

                    <p>
                        <strong>{datos.mascota}</strong> tiene una cita el{' '}
                        {datos.fecha} a las {datos.hora}.
                    </p>

                    <button
                        type="button"
                        className="btn btn-tienda"
                        onClick={onVolver}
                    >
                        {textoVolver}
                    </button>
                </section>
            </main>
        );
    }

    return (
        <main className="container pagina-cita">
            <BotonVolver
                onClick={onVolver}
                texto={`← ${textoVolver}`}
            />

            <h1>Reservar cita</h1>

            <p className="cita-subtitulo">
                Agenda una atención para tu mascota.
            </p>
        
            {servicioSeleccionado && (
                <p className="mb-4 fw-bold texto-marca">
                    Servicio seleccionado: {servicioSeleccionado}
                </p>
            )}
            <form
                className="formulario-cita"
                noValidate
                onSubmit={reservar}
            >
                <h2>Datos de la atención</h2>

                <div className="row g-3">
                    <Campo
                        etiqueta="Nombre del dueño"
                        id="dueno"
                        valor={datos.dueno}
                        cambiar={(valor) => cambiar('dueno', valor)}
                    />

                    <Campo
                        etiqueta="Correo electrónico"
                        id="correo"
                        tipo="email"
                        valor={datos.correo}
                        cambiar={(valor) => cambiar('correo', valor)}
                    />

                    <Campo
                        etiqueta="Nombre de la mascota"
                        id="mascota"
                        valor={datos.mascota}
                        cambiar={(valor) => cambiar('mascota', valor)}
                    />

                    <div className="col-md-6">
                        <label htmlFor="especie">
                            Especie
                        </label>

                        <select
                            id="especie"
                            className="form-select"
                            value={datos.especie}
                            onChange={(event) =>
                                cambiar('especie', event.target.value)
                            }
                        >
                            <option value="">
                                Selecciona una especie
                            </option>

                            <option value="Perro">Perro</option>
                            <option value="Gato">Gato</option>
                            <option value="Otro">Otro</option>
                        </select>
                    </div>

                    <Campo
                        etiqueta="Fecha"
                        id="fecha"
                        tipo="date"
                        valor={datos.fecha}
                        cambiar={(valor) => cambiar('fecha', valor)}
                    />

                    <div className="col-md-6">
                        <label htmlFor="hora">
                            Hora
                        </label>

                        <select
                            id="hora"
                            className="form-select"
                            value={datos.hora}
                            onChange={(event) =>
                                cambiar('hora', event.target.value)
                            }
                        >
                            <option value="">
                                Selecciona una hora
                            </option>

                            {horarios.map((hora) => (
                                <option
                                    key={hora}
                                    value={hora}
                                >
                                    {hora}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="col-12">
                        <label htmlFor="motivo">
                            Motivo de consulta
                        </label>

                        <textarea
                            id="motivo"
                            className="form-control"
                            rows={4}
                            value={datos.motivo}
                            onChange={(event) =>
                                cambiar('motivo', event.target.value)
                            }
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="btn btn-tienda mt-4"
                >
                    Reservar cita
                </button>
            </form>
        </main>
    );
}

interface CampoProps {
    etiqueta: string;
    id: string;
    tipo?: string;
    valor: string;
    cambiar: (valor: string) => void;
}

function Campo({
    etiqueta,
    id,
    tipo = 'text',
    valor,
    cambiar,
}: CampoProps) {
    return (
        <div className="col-md-6">
            <label htmlFor={id}>
                {etiqueta}
            </label>

            <input
                id={id}
                type={tipo}
                className="form-control"
                value={valor}
                onChange={(event) => cambiar(event.target.value)}
            />
        </div>
    );
}
