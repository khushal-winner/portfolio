const navItems = [
    { id: 'about', label: 'About' },
    { id: 'resume', label: 'Resume' },
    { id: 'projects', label: 'Projects' },
    { id: 'contact', label: 'Contact' },
] as const;

type NavSection = typeof navItems[number]['id'];

interface NavigationProps {
    active: NavSection;
    onNavigate: (section: NavSection) => void;
}

export default function Navigation({ active, onNavigate }: NavigationProps) {
    return (
        <nav
            className="flex items-center justify-end gap-1 sm:gap-2 py-2 overflow-x-auto"
            aria-label="Main navigation"
        >
            {navItems.map((item) => (
                <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={`px-3 sm:px-4 py-2 text-[13px] sm:text-[14px] font-medium rounded-btn transition-all duration-200 whitespace-nowrap
            ${active === item.id
                            ? 'text-accent-primary bg-accent-primary/10 border border-accent-primary'
                            : 'text-text-secondary hover:text-text-primary border border-transparent'
                        }`}
                    aria-current={active === item.id ? 'page' : undefined}
                >
                    {item.label}
                </button>
            ))}
        </nav>
    );
}
