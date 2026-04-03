import { useState, useCallback } from 'react';
import { DEFAULT_PAGE_SIZE } from '../utils/constants';

/**
 * Hook for managing pagination state
 */
const usePagination = (initialPageSize = DEFAULT_PAGE_SIZE) => {
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: initialPageSize,
    pageCount: 1,
    total: 0,
  });

  const setPage = useCallback((page) => {
    setPagination((prev) => ({ ...prev, page }));
  }, []);

  const setPageSize = useCallback((pageSize) => {
    setPagination((prev) => ({ ...prev, pageSize, page: 1 }));
  }, []);

  const updateFromResponse = useCallback((meta) => {
    if (meta?.pagination) {
      const { page, pageSize, total, pageCount } = meta.pagination;
      setPagination((prev) => {
        // Only update if something actually changed to prevent infinite loops
        if (
          prev.page === page &&
          prev.pageSize === pageSize &&
          prev.total === total &&
          prev.pageCount === pageCount
        ) {
          return prev;
        }
        return { page, pageSize, total, pageCount };
      });
    }
  }, []);

  const reset = useCallback(() => {
    setPagination({
      page: 1,
      pageSize: initialPageSize,
      pageCount: 1,
      total: 0,
    });
  }, [initialPageSize]);

  return {
    ...pagination,
    setPage,
    setPageSize,
    updateFromResponse,
    reset,
    // Strapi query params
    params: {
      'pagination[page]': pagination.page,
      'pagination[pageSize]': pagination.pageSize,
    },
  };
};

export default usePagination;
