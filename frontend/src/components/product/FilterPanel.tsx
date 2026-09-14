import type { ProductFilters } from '../../types';
import { FABRICS, COLORS, OCCASIONS, REGIONS, BLOUSE_STATUSES } from '../../data/products';
import { formatPrice } from '../../utils/format';

interface FilterPanelProps {
  filters: ProductFilters;
  onChange: (filters: ProductFilters) => void;
  onClear: () => void;
}

function CheckboxGroup({
  label,
  options,
  selected,
  onToggle,
}: {
  label: string;
  options: string[];
  selected: string[];
  onToggle: (val: string) => void;
}) {
  return (
    <div className="mb-5">
      <h3 className="font-medium text-sm text-gray-900 mb-2">{label}</h3>
      <div className="space-y-2 max-h-40 overflow-y-auto">
        {options.map((opt) => (
          <label key={opt} className="flex items-center gap-2 cursor-pointer min-h-[36px]">
            <input
              type="checkbox"
              checked={selected.includes(opt)}
              onChange={() => onToggle(opt)}
              className="w-4 h-4 accent-maroon rounded"
            />
            <span className="text-sm text-gray-600">{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

export function FilterPanel({ filters, onChange, onClear }: FilterPanelProps) {
  const toggleArray = (key: keyof ProductFilters, val: string) => {
    const current = (filters[key] as string[]) || [];
    const updated = current.includes(val) ? current.filter((v) => v !== val) : [...current, val];
    onChange({ ...filters, [key]: updated.length ? updated : undefined });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-serif text-lg font-semibold text-maroon">Filters</h2>
        <button onClick={onClear} className="text-sm text-maroon hover:underline">Clear all</button>
      </div>

      <div className="mb-5">
        <h3 className="font-medium text-sm text-gray-900 mb-2">Price Range</h3>
        <div className="flex items-center gap-2 mb-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.priceMin ?? ''}
            onChange={(e) => onChange({ ...filters, priceMin: e.target.value ? Number(e.target.value) : undefined })}
            className="input-field text-sm py-2"
          />
          <span className="text-gray-400">—</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.priceMax ?? ''}
            onChange={(e) => onChange({ ...filters, priceMax: e.target.value ? Number(e.target.value) : undefined })}
            className="input-field text-sm py-2"
          />
        </div>
        <input
          type="range"
          min={0}
          max={40000}
          step={500}
          value={filters.priceMax ?? 40000}
          onChange={(e) => onChange({ ...filters, priceMax: Number(e.target.value) })}
          className="w-full accent-maroon"
        />
        <p className="text-xs text-gray-500 mt-1">Up to {formatPrice(filters.priceMax ?? 40000)}</p>
      </div>

      <CheckboxGroup label="Fabric" options={FABRICS} selected={filters.fabric || []} onToggle={(v) => toggleArray('fabric', v)} />
      <CheckboxGroup label="Color" options={COLORS.slice(0, 12)} selected={filters.color || []} onToggle={(v) => toggleArray('color', v)} />
      <CheckboxGroup label="Occasion" options={OCCASIONS} selected={filters.occasion || []} onToggle={(v) => toggleArray('occasion', v)} />
      <CheckboxGroup label="Region / Style" options={REGIONS} selected={filters.region || []} onToggle={(v) => toggleArray('region', v)} />
      <CheckboxGroup label="Blouse Status" options={BLOUSE_STATUSES} selected={filters.blouseStatus || []} onToggle={(v) => toggleArray('blouseStatus', v)} />

      <div className="mb-5">
        <h3 className="font-medium text-sm text-gray-900 mb-2">Minimum Rating</h3>
        {[4, 3, 2].map((r) => (
          <label key={r} className="flex items-center gap-2 cursor-pointer min-h-[36px]">
            <input
              type="radio"
              name="rating"
              checked={filters.rating === r}
              onChange={() => onChange({ ...filters, rating: r })}
              className="accent-maroon"
            />
            <span className="text-sm text-gray-600">{r}★ & above</span>
          </label>
        ))}
      </div>

      <label className="flex items-center gap-2 cursor-pointer min-h-[44px]">
        <input
          type="checkbox"
          checked={!!filters.discount}
          onChange={(e) => onChange({ ...filters, discount: e.target.checked || undefined })}
          className="w-4 h-4 accent-maroon"
        />
        <span className="text-sm text-gray-600">On Sale only</span>
      </label>
    </div>
  );
}
