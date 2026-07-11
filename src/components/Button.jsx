export default function Button({
    children,
    type = "button",
    bgColor = "bg-stone-950",
    textColor = "text-white",
    className = "",
    ...props
}) {
    return (
        <button
            type={type}
            className={`inline-flex items-center justify-center rounded-sm px-5 py-2.5 text-[11px] font-bold uppercase tracking-widest transition-colors duration-150 active:scale-[0.98] ${bgColor} ${textColor} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
