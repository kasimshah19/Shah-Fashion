import { cn } from '../../utils/format';

interface BadgeProps {
  variant: 'sale' | 'new' | 'bestseller' | 'lowstock';
  children: React.ReactNode;
}

const variants = {
  sale: 'bg-maroon text-white',
  new: 'bg-bottle text-white',
  bestseller: 'bg-gold text-white',
  lowstock: 'bg-orange-500 text-white',
};

export function Badge({ variant, children }: BadgeProps) {
  return <span className={cn('badge', variants[variant])}>{children}</span>;
}
