import React from 'react';
import { classNames } from '../../utils/helpers';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({
  page,
  pageSize,
  total,
  pageCount,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
  className = ''
}) => {
  if (total === 0) return null;

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  return (
    <div className={classNames('flex flex-col sm:flex-row items-center justify-between gap-4 px-1', className)}>
      <div className="text-sm text-slate-500 tracking-tight">
        Showing <span className="font-semibold text-slate-800">{start}</span> to <span className="font-semibold text-slate-800">{end}</span> of <span className="font-semibold text-slate-800">{total}</span>
      </div>

      <div className="flex items-center gap-4">
        {onPageSizeChange && (
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <label htmlFor="pageSize">Rows:</label>
            <select
              id="pageSize"
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="border-slate-300 rounded-lg text-sm focus:ring-primary/20 focus:border-primary px-2 py-1 bg-white border"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex items-center gap-1">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="px-3 py-1 bg-primary/5 text-primary text-sm font-semibold rounded-lg border border-primary/10">
            {page} / {pageCount}
          </div>
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page === pageCount}
            className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
