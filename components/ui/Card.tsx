import { ReactNode, HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    className?: string;
}

export function Card({ children, className = '', ...props }: CardProps) {
    return (
        <div className={`bg-bg-card border border-border-main rounded-xl shadow-sm overflow-hidden ${className}`} {...props}>
            {children}
        </div>
    );
}

export function CardHeader({ children, className = '' }: CardProps) {
    return <div className={`px-6 py-4 border-b border-border-main ${className}`}>{children}</div>;
}

export function CardTitle({ children, className = '' }: CardProps) {
    return <h3 className={`text-lg font-semibold text-text-primary ${className}`}>{children}</h3>;
}

export function CardContent({ children, className = '' }: CardProps) {
    return <div className={`p-6 ${className}`}>{children}</div>;
}

export function CardFooter({ children, className = '' }: CardProps) {
    return <div className={`px-6 py-4 bg-bg-secondary border-t border-border-main ${className}`}>{children}</div>;
}
