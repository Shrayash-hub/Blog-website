function Logo({width = '100px', variant = 'light'}) {
    const isDark = variant === 'dark'
    
    return (
        <div className="inline-flex items-center text-current">
            <span className={`font-serif text-3xl  tracking-tight ${
                isDark ? 'text-white' : 'text-stone-950'
            }`}>
                Blogfolio
            </span>
        </div>
    )
}

export default Logo;
