import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { products } from '../../data/products';
import { formatPrice } from '../../utils/format';

interface SearchBarProps {
  expanded?: boolean;
  onClose?: () => void;
}

export function SearchBar({ expanded, onClose }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<typeof products>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (expanded && inputRef.current) inputRef.current.focus();
  }, [expanded]);

  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }
    const q = query.toLowerCase();
    const matches = products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.fabric.toLowerCase().includes(q) ||
          p.region.toLowerCase().includes(q)
      )
      .slice(0, 6);
    setSuggestions(matches);
  }, [query]);

  const handleSearch = (q?: string) => {
    const term = q || query;
    if (!term.trim()) return;
    navigate(`/search?q=${encodeURIComponent(term.trim())}`);
    setQuery('');
    setShowSuggestions(false);
    onClose?.();
  };

  return (
    <div className="relative flex-1 max-w-xl">
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setShowSuggestions(true); }}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Search sarees, fabrics, styles..."
          className="input-field pl-10 pr-10 text-sm"
        />
        {query && (
          <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            <X size={16} />
          </button>
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-100 z-50 overflow-hidden">
          {suggestions.map((s) => (
            <button
              key={s.id}
              onClick={() => handleSearch(s.name)}
              className="flex items-center gap-3 w-full px-3 py-2.5 hover:bg-ivory-dark transition-colors text-left min-h-[44px]"
            >
              <img src={s.images[0]} alt="" className="w-10 h-12 object-cover rounded" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{s.name}</p>
                <p className="text-xs text-gray-500">{s.fabric}</p>
              </div>
              <span className="text-sm font-semibold text-maroon shrink-0">{formatPrice(s.discountedPrice)}</span>
            </button>
          ))}
          <button
            onClick={() => handleSearch()}
            className="w-full px-3 py-2.5 text-sm text-maroon font-medium hover:bg-ivory-dark border-t min-h-[44px]"
          >
            See all results for "{query}"
          </button>
        </div>
      )}
    </div>
  );
}
