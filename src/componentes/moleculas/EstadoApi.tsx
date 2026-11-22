interface Props {
    cargando: boolean;
    error: string;
}

export default function EstadoApi({ cargando, error }: Props) {
    return (
        <>
            {cargando && <p role="status">Cargando datos…</p>}
            {error && (
                <p className="alert alert-danger" role="alert">
                    {error}
                </p>
            )}
        </>
    );
}
