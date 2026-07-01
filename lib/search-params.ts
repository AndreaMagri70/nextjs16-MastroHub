type ParsePaginationParamsInput = {
  query?: string;
  page?: string;
  pageSize?: number;
};

export function parsePaginationParams({
  query,
  page,
  pageSize = 10,
}: ParsePaginationParamsInput) {
  const searchQuery = query?.trim() || undefined;
  const currentPage = Math.max(Number(page) || 1, 1);
  const skip = (currentPage - 1) * pageSize;

  return {
    searchQuery,
    currentPage,
    pageSize,
    skip,
  };
}
