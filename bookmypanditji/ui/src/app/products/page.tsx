'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useProducts, useProductCategories } from '@/hooks/useApi';
import { ProductSearchParams, ProductCategory } from '@/lib/api';

export default function ProductsPage() {
  const [filters, setFilters] = useState<ProductSearchParams>({
    page: 1,
    limit: 12,
    category: undefined,
    search: undefined,
    minPrice: undefined,
    maxPrice: undefined,
    inStock: undefined,
    sortBy: 'name',
    sortOrder: 'asc',
  });

  const { data, isLoading, error, refetch } = useProducts(filters);
  const { data: categoriesData } = useProductCategories();

  const handleFilterChange = (name: string, value: string | number | boolean | undefined) => {
    setFilters(prev => ({ ...prev, [name]: value, page: 1 }));
  };

  const handleSearch = () => {
    setFilters(prev => ({ ...prev, page: 1 }));
  };

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      refetch();
    }, 300);
    return () => clearTimeout(timer);
  }, [filters, refetch]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900">Sacred Products</h1>
          <p className="mt-2 text-lg text-gray-600">
            Discover our collection of authentic sacred items for your spiritual needs
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white p-5 rounded-lg shadow-sm">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                <div className="relative rounded-md shadow-sm">
                  <input
                    type="text"
                    value={filters.search || ''}
                    onChange={(e) => handleFilterChange('search', e.target.value || undefined)}
                    placeholder="Search products..."
                    className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 focus:border-orange-500 focus:outline-none focus:ring-orange-500 text-sm"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Categories</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      checked={!filters.category}
                      onChange={() => handleFilterChange('category', undefined)}
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300"
                    />
                    <span className="ml-2 block text-sm text-gray-700">All Categories</span>
                  </label>
                  {categoriesData?.map((cat: string) => (
                    <label key={cat} className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        checked={filters.category === cat}
                        onChange={() => handleFilterChange('category', cat)}
                        className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300"
                      />
                      <span className="ml-2 block text-sm text-gray-700">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min="0"
                    value={filters.minPrice || ''}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value ? parseInt(e.target.value) : undefined)}
                    className="block w-full rounded-md border-gray-300 py-1.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500"
                    placeholder="Min"
                  />
                  <span className="text-gray-500">to</span>
                  <input
                    type="number"
                    value={filters.maxPrice || ''}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value ? parseInt(e.target.value) : undefined)}
                    className="block w-full rounded-md border-gray-300 py-1.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500"
                    placeholder="Max"
                  />
                </div>
                <div className="mt-4">
                  <input
                    type="range"
                    min="0"
                    max="5000"
                    step="100"
                    value={filters.minPrice || 0}
                    onChange={(e) => handleFilterChange('minPrice', parseInt(e.target.value))}
                    className="w-full accent-orange-600"
                  />
                  <input
                    type="range"
                    min="0"
                    max="5000"
                    step="100"
                    value={filters.maxPrice || 5000}
                    onChange={(e) => handleFilterChange('maxPrice', parseInt(e.target.value))}
                    className="w-full accent-orange-600"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.inStock}
                    onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 block text-sm text-gray-700">In Stock Only</span>
                </label>
              </div>

              <button
                onClick={() => setFilters({
                  page: 1,
                  limit: 12,
                  sortBy: 'name',
                  sortOrder: 'asc',
                })}
                className="w-full py-2 px-4 border border-orange-300 rounded-md shadow-sm text-sm font-medium text-orange-700 bg-white hover:bg-orange-50 focus:outline-none"
              >
                Reset Filters
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Sort Controls */}
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div className="mb-4 sm:mb-0">
                  <span className="text-sm text-gray-700">
                    Showing <span className="font-medium">{data?.meta?.page ? ((data.meta.page - 1) * (data.meta?.limit || 12)) + 1 : 1}</span> to{' '}
                    <span className="font-medium">{Math.min(data?.meta?.page * (data.meta?.limit || 12) || 12, data?.meta?.total || 0)}</span> of{' '}
                    <span className="font-medium">{data?.meta?.total || 0}</span> results
                  </span>
                </div>
                <div className="flex items-center">
                  <label htmlFor="sort" className="sr-only">Sort by</label>
                  <select
                    id="sort"
                    name="sort"
                    value={`${filters.sortBy}:${filters.sortOrder}`}
                    onChange={(e) => {
                      const [sortBy, sortOrder] = e.target.value.split(':');
                      handleFilterChange('sortBy', sortBy);
                      handleFilterChange('sortOrder', sortOrder);
                    }}
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md"
                  >
                    <option value="name:asc">Name (A-Z)</option>
                    <option value="name:desc">Name (Z-A)</option>
                    <option value="price:asc">Price: Low to High</option>
                    <option value="price:desc">Price: High to Low</option>
                    <option value="category:asc">Category</option>
                    <option value="createdAt:desc">Newest First</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
                    <div className="h-48 bg-gray-200"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            )} else if (error) {
              <div className="text-center py-12 text-red-600">
                Failed to load products. Please try again.
              </div>
            } else if (data?.data?.length === 0) {
              <div className="col-span-full py-10 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">No products found</h3>
                <p className="mt-1 text-gray-500">Try adjusting your filters or search query.</p>
                <div className="mt-6">
                  <button
                    onClick={() => setFilters({
                      page: 1,
                      limit: 12,
                      sortBy: 'name',
                      sortOrder: 'asc',
                    })}
                    className="inline-flex items-center px-4 py-2 border border-orange-300 rounded-md shadow-sm text-sm font-medium text-orange-700 bg-white hover:bg-orange-50 focus:outline-none"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            )} else {
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {data?.data?.map((product: any) => (
                    <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                      <div className="relative">
                        <Link href={`/products/${product.id}`}>
                          <div className="relative h-48 bg-gray-200 flex items-center justify-center">
                            {product.images?.[0] ? (
                              <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            )
                          </div>
                        </Link>
                        <div className="p-4">
                          <Link href={`/products/${product.id}`}>
                            <h2 className="text-lg font-medium text-gray-900 mb-1 hover:text-orange-600 transition-colors">
                              {product.name}
                            </h2>
                          </Link>
                          <div className="flex items-center mb-2">
                            <div className="flex text-yellow-400">
                              {[...Array(5)].map((_, i) => (
                                <svg key={i} xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${i < Math.floor(product.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`} viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8 2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364 1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                            <span className="ml-1 text-xs text-gray-500">({product.reviewCount || 0})</span>
                          </div>
                          <div className="flex items-center">
                            {product.compareAtPrice && product.compareAtPrice > product.price ? (
                              <>
                                <span className="text-lg font-bold text-orange-600">₹{Number(product.price).toLocaleString()}</span>
                                <span className="ml-2 text-sm text-gray-500 line-through">₹{Number(product.compareAtPrice).toLocaleString()}</span>
                              </>
                            ) : (
                              <span className="text-lg font-bold text-orange-600">₹{Number(product.price).toLocaleString()}</span>
                            )}
                          </div>
                          <button
                            className={`mt-3 w-full py-2 px-4 rounded-md text-sm font-medium ${
                              product.stockQuantity > 0
                                ? 'bg-orange-600 text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                            disabled={product.stockQuantity <= 0}
                          >
                            {product.stockQuantity > 0 ? 'Add to Cart' : 'Out of Stock'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {data && data.meta.totalPages > 1 && (
                  <div className="mt-6 flex items-center justify-center">
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => setFilters(prev => ({ ...prev, page: Math.max(1, (prev.page || 1) - 1 )))}
                        disabled={(data.meta?.page || 1) <= 1}
                        className={`relative inline-flex items-center px-2 py-2 rounded-l-md border ${
                          (data.meta?.page || 1) <= 1
                            ? 'border-gray-300 bg-white text-gray-300 cursor-not-allowed'
                            : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        <span className="sr-only">Previous</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                      
                      {Array.from({ length: data.meta?.totalPages || 1 }, (_, i) => i + 1).slice(0, 5).map((page) => (
                        <button
                          key={page}
                          onClick={() => setFilters(prev => ({ ...prev, page }))}
                          className={`relative inline-flex items-center px-4 py-2 border ${
                            filters.page === page
                              ? 'z-10 bg-orange-50 border-orange-500 text-orange-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                      <button
                        onClick={() => setFilters(prev => ({ ...prev, page: (prev.page || 1) + 1 )))}
                        disabled={(data.meta?.page || 1) >= (data.meta?.totalPages || 1)}
                        className={`relative inline-flex items-center px-2 py-2 rounded-r-md border ${
                          (data.meta?.page || 1) >= (data.meta?.totalPages || 1)
                            ? 'border-gray-300 bg-white text-gray-300 cursor-not-allowed'
                            : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        <span className="sr-only">Next</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10l-3.293-3.293a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </nav>
                  </div>
                )}
              </div>
            </>
          </div>
        </div>
      </div>
    </div>
  );
}