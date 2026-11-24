export const horarioSemana = { apertura: '08:30', cierre: '21:00' };
export const horarioSabado = { apertura: '09:00', cierre: '19:30' };

export function horarioParaFecha(fecha: string) {
    if (!fecha) return null;

    const dia = new Date(`${fecha}T00:00:00Z`).getUTCDay();
    if (dia === 0) return null;

    return dia === 6 ? horarioSabado : horarioSemana;
}

export function describirHorario({ apertura, cierre }: typeof horarioSemana) {
    return `de ${apertura} a ${cierre} hrs`;
}

export const horarioAtencion = [
    `Lunes a viernes ${describirHorario(horarioSemana)}`,
    `Sábado ${describirHorario(horarioSabado)}`,
    'Domingo cerrado',
];
