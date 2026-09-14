import { Link } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}

export function EmptyState({ icon: Icon, title, description, actionLabel, actionHref }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in">
      <div className="w-20 h-20 rounded-full bg-ivory-dark flex items-center justify-center mb-4">
        <Icon size={36} className="text-maroon/60" />
      </div>
      <h2 className="font-serif text-xl font-semibold text-gray-900 mb-2">{title}</h2>
      <p className="text-gray-500 max-w-sm mb-6">{description}</p>
      {actionLabel && actionHref && (
        <Link to={actionHref} className="btn-primary">{actionLabel}</Link>
      )}
    </div>
  );
}
