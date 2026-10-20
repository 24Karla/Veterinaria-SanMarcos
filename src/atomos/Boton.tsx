interface BotonProps {
    texto: string;
    className?: string;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    onClick?: () => void;
}

export default function Boton({
    texto,
    className = '',
    type = 'button',
    disabled = false,
    onClick,
}: BotonProps) {
    return (
    <button
        type={type}
        className={className}
        disabled={disabled}
        onClick={onClick}
    >
        {texto}
    </button>
    );
}