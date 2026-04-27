import React from 'react';
import { Search, ChevronDown, Filter } from 'lucide-react';

const FilterField = ({ children, icon: Icon, label }) => (
  <div className="relative flex-1 min-w-[200px] group">
    <div className="absolute left-3 top-2.5 text-rose-400 group-focus-within:text-rose-500 transition-colors">
      <Icon size={16} />
    </div>
    {children}
  </div>
);

const FilterInput = ({ value, onChange, placeholder }) => (
  <input
    type="text"
    placeholder={placeholder}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="w-full pl-9 pr-4 py-2 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none transition-all focus:border-rose-500 focus:ring-1 focus:ring-rose-500 text-gray-700 dark:text-gray-400"
  />
);

const FilterSelect = ({ value, onChange, options, label }) => (
  <div className="relative w-full">
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full pl-9 pr-8 py-2 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg text-sm appearance-none outline-none transition-all focus:border-rose-500 focus:ring-1 focus:ring-rose-500 text-gray-700 dark:text-gray-400 cursor-pointer"
    >
      <option value="">{label}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
    <div className="pointer-events-none absolute right-3 top-2.5 text-neutral-400">
      <ChevronDown size={16} />
    </div>
  </div>
);

export const FilterBar = ({ nameInput, setNameInput, filters, handleFilterChange, branches, halls }) => {
  return (
    <div className="flex flex-wrap gap-3 p-4 bg-transparent md:bg-white/70 md:dark:bg-black/70 md:border border-white/80 dark:border-black/80 md:rounded-lg text-sm outline-none transition-all focus:border-rose-500 focus:ring-1 focus:ring-rose-500 text-gray-700 dark:text-gray-400 md:sticky top-12 z-20 backdrop-blur-md">
      <FilterField icon={Search} label="Name">
        <FilterInput value={nameInput} onChange={setNameInput} placeholder="Search by name..." />
      </FilterField>

      <FilterField icon={Filter} label="Branch">
        <FilterSelect value={filters.branch} onChange={(val) => handleFilterChange("branch", val)} options={branches} label="Branch" />
      </FilterField>

      <FilterField icon={Filter} label="Hall">
        <FilterSelect value={filters.hall} onChange={(val) => handleFilterChange("hall", val)} options={halls} label="Hall" />
      </FilterField>

    </div>
  );
};