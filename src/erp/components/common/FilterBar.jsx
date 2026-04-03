import React from 'react';
import { classNames } from '../../utils/helpers';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';

const FilterBar = ({
  searchPlaceholder = 'Search...',
  searchValue = '',
  onSearchChange,
  filters = [], // Array of { key, label, options: [{value, label}] }
  filterValues = {}, // { key: value }
  onFilterChange,
  onReset,
  hasActiveFilters = false,
  className = '',
}) => {
  return (
    <div className={classNames('bg-white p-4 rounded-xl border border-erp-border mb-6 shadow-sm', className)}>
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 min-w-[280px]">
          <Input
            icon="search"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Filters */}
        {filters.length > 0 && (
          <div className="flex flex-wrap items-center gap-3">
            {filters.map((filter) => (
              <div key={filter.key} className="w-full sm:w-auto min-w-[160px]">
                <Select
                  placeholder={filter.label}
                  options={filter.options}
                  value={filterValues[filter.key] || ''}
                  onChange={(e) => onFilterChange(filter.key, e.target.value)}
                />
              </div>
            ))}
          </div>
        )}

        {/* Reset Button */}
        {hasActiveFilters && onReset && (
          <div className="flex items-center shrink-0">
            <Button
              variant="ghost"
              icon="restart_alt"
              onClick={onReset}
              className="text-red-500 hover:text-red-600 hover:bg-red-50"
            >
              Reset
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
