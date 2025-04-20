"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

// Product types
type ProductCategory = 'all' | 'pooja-kits' | 'idols' | 'incense' | 'lamps' | 'books' | 'accessories';
type SortOption = 'default' | 'price-low-high' | 'price-high-low' | 'rating-high-low' | 'newest';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  image: string;
  category: string;
  rating: number;
  inStock: boolean;
  isFeatured?: boolean;
  dateAdded?: string; // For sorting by newest
}

// Mock data for products
const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Complete Diwali Poojan Kit',
    description: 'Everything you need for a traditional Diwali poojan ceremony',
    price: 1299,
    discountPrice: 999,
    image: '/products/diwali-kit.webp',
    category: 'pooja-kits',
    rating: 4.8,
    inStock: true,
    isFeatured: true,
    dateAdded: '2025-03-15',
  },
  {
    id: '2',
    name: 'Brass Panchpatra Set',
    description: 'Traditional brass panchpatra set for daily rituals',
    price: 850,
    image: '/products/panchpatra.webp',
    category: 'accessories',
    rating: 4.6,
    inStock: true,
    dateAdded: '2025-02-20',
  },
  {
    id: '3',
    name: 'Ganesha Idol - Eco-friendly',
    description: 'Handcrafted eco-friendly clay Ganesha idol',
    price: 599,
    discountPrice: 499,
    image: '/products/ganesha.webp',
    category: 'idols',
    rating: 4.9,
    inStock: true,
    isFeatured: true,
    dateAdded: '2025-04-01',
  },
  {
    id: '4',
    name: 'Premium Camphor Tablets',
    description: 'High quality camphor tablets for aarti',
    price: 120,
    image: '/products/camphor.webp',
    category: 'accessories',
    rating: 4.7,
    inStock: true,
    dateAdded: '2025-01-10',
  },
  {
    id: '5',
    name: 'Sandalwood Incense Sticks',
    description: 'Pure sandalwood incense sticks - Pack of 30',
    price: 199,
    image: '/products/incense.webp',
    category: 'incense',
    rating: 4.5,
    inStock: true,
    dateAdded: '2025-03-25',
  },
  {
    id: '6',
    name: 'Lakshmi Ganesh Idol Set',
    description: 'Beautiful brass Lakshmi Ganesh idol set for prosperity',
    price: 2499,
    discountPrice: 1999,
    image: '/products/lakshmi-ganesh.webp',
    category: 'idols',
    rating: 4.8,
    inStock: true,
    dateAdded: '2025-02-05',
  },
  {
    id: '7',
    name: 'Navgraha Yantra',
    description: 'Sacred geometry Navgraha (nine planets) yantra on copper plate',
    price: 1450,
    image: '/products/navgraha.webp',
    category: 'accessories',
    rating: 4.7,
    inStock: true,
    dateAdded: '2025-01-15',
  },
];

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // States for filtering, sorting, and pagination
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('all');
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(3000);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Wishlist state
  const [wishlist, setWishlist] = useState<string[]>([]);

  // Comparison state
  const [compareList, setCompareList] = useState<string[]>([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Recently viewed products
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);

  // Load filters and page state from URL query params
  useEffect(() => {
    const category = searchParams.get('category') as ProductCategory;
    const sort = searchParams.get('sort') as SortOption;
    const minPriceParam = searchParams.get('minPrice');
    const maxPriceParam = searchParams.get('maxPrice');
    const inStock = searchParams.get('inStock');
    const search = searchParams.get('search');
    const page = searchParams.get('page');

    if (category) setSelectedCategory(category);
    if (sort) setSortBy(sort);
    if (minPriceParam) setMinPrice(Number(minPriceParam));
    if (maxPriceParam) setMaxPrice(Number(maxPriceParam));
    if (inStock) setInStockOnly(inStock === 'true');
    if (search) setSearchQuery(search);
    if (page) setCurrentPage(Number(page));

    // Load wishlist from localStorage
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist));
    }

    // Load recently viewed from localStorage
    const savedRecentlyViewed = localStorage.getItem('recentlyViewed');
    if (savedRecentlyViewed) {
      const recentIds = JSON.parse(savedRecentlyViewed);
      const recentProducts = PRODUCTS.filter(p => recentIds.includes(p.id))
                                    .slice(0, 4); // Show at most 4 recent products
      setRecentlyViewed(recentProducts);
    }

    // Load compare list from localStorage
    const savedCompareList = localStorage.getItem('compareList');
    if (savedCompareList) {
      setCompareList(JSON.parse(savedCompareList));
    }
  }, [searchParams]);

  // Update URL when filters change
  const updateQueryParams = () => {
    const params = new URLSearchParams();
    if (selectedCategory !== 'all') params.append('category', selectedCategory);
    if (sortBy !== 'default') params.append('sort', sortBy);
    if (minPrice > 0) params.append('minPrice', minPrice.toString());
    if (maxPrice < 3000) params.append('maxPrice', maxPrice.toString());
    if (inStockOnly) params.append('inStock', 'true');
    if (searchQuery) params.append('search', searchQuery);
    if (currentPage > 1) params.append('page', currentPage.toString());

    router.push(`/products?${params.toString()}`);
  };

  useEffect(() => {
    // Update URL when filters change, but only after initial render
    if (typeof window !== 'undefined') {
      updateQueryParams();
    }
  }, [selectedCategory, sortBy, minPrice, maxPrice, inStockOnly, searchQuery, currentPage]);

  // Toggle wishlist item
  const toggleWishlist = (productId: string) => {
    const isInWishlist = wishlist.includes(productId);
    let newWishlist;

    if (isInWishlist) {
      newWishlist = wishlist.filter(id => id !== productId);
    } else {
      newWishlist = [...wishlist, productId];
    }

    setWishlist(newWishlist);
    localStorage.setItem('wishlist', JSON.stringify(newWishlist));
  };

  // Toggle compare item
  const toggleCompare = (productId: string) => {
    const isInCompareList = compareList.includes(productId);
    let newCompareList;

    if (isInCompareList) {
      newCompareList = compareList.filter(id => id !== productId);
    } else {
      // Limit to 3 items maximum
      if (compareList.length >= 3) {
        alert("You can only compare up to 3 products. Please remove one first.");
        return;
      }
      newCompareList = [...compareList, productId];
    }

    setCompareList(newCompareList);
    localStorage.setItem('compareList', JSON.stringify(newCompareList));
  };

  // Apply filters and sorting to get filtered products
  const getFilteredProducts = (): Product[] => {
    return PRODUCTS.filter(product => {
      // Category filter
      if (selectedCategory !== 'all' && product.category !== selectedCategory) return false;

      // Price range filter
      if (product.price < minPrice || product.price > maxPrice) return false;

      // In-stock filter
      if (inStockOnly && !product.inStock) return false;

      // Search query
      if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !product.description.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      // Apply sorting
      switch (sortBy) {
        case 'price-low-high':
          return (a.discountPrice || a.price) - (b.discountPrice || b.price);
        case 'price-high-low':
          return (b.discountPrice || b.price) - (a.discountPrice || a.price);
        case 'rating-high-low':
          return b.rating - a.rating;
        case 'newest':
          return new Date(b.dateAdded || '').getTime() - new Date(a.dateAdded || '').getTime();
        default:
          // Default sorting - featured first, then by id
          if (a.isFeatured && !b.isFeatured) return -1;
          if (!a.isFeatured && b.isFeatured) return 1;
          return Number(a.id) - Number(b.id);
      }
    });
  };

  const filteredProducts = getFilteredProducts();

  // Get current page items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

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
        
        {/* Recently Viewed Products (if any) */}
        {recentlyViewed.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Recently Viewed</h2>
              <button 
                onClick={() => {
                  setRecentlyViewed([]);
                  localStorage.removeItem('recentlyViewed');
                }}
                className="text-sm text-orange-600 hover:text-orange-800"
              >
                Clear
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {recentlyViewed.map(product => (
                <Link key={product.id} href={`/products/${product.id}`}>
                  <div className="bg-white rounded-lg shadow-sm p-3 flex items-center space-x-3 hover:shadow-md transition-shadow">
                    <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="flex-1 truncate">
                      <h3 className="text-sm font-medium text-gray-900 truncate">{product.name}</h3>
                      <p className="text-sm text-orange-600 font-medium">₹{product.discountPrice || product.price}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
        
        {/* Compare Products Bar (shown when items are selected) */}
        {compareList.length > 0 && (
          <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-10 py-3 px-4">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="font-medium text-gray-700">Compare Products:</span>
                  <div className="flex space-x-2">
                    {compareList.map(id => {
                      const product = PRODUCTS.find(p => p.id === id);
                      return (
                        <div key={id} className="relative bg-gray-100 rounded-md p-2 flex items-center space-x-2">
                          <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <span className="text-xs font-medium truncate max-w-[100px]">{product?.name}</span>
                          <button 
                            onClick={() => toggleCompare(id)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <Link
                    href={`/products/compare?ids=${compareList.join(',')}`}
                    className={`px-4 py-2 rounded-md text-white font-medium ${compareList.length < 2 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-orange-600 hover:bg-orange-700'}`}
                    onClick={(e) => {
                      if (compareList.length < 2) {
                        e.preventDefault();
                        alert("Please select at least 2 products to compare");
                      }
                    }}
                  >
                    Compare {compareList.length > 0 ? `(${compareList.length})` : ''}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white p-5 rounded-lg shadow-sm">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                <div className="relative rounded-md shadow-sm">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
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
                  <div className="flex items-center">
                    <input
                      id="category-all"
                      name="category"
                      type="radio"
                      checked={selectedCategory === 'all'}
                      onChange={() => setSelectedCategory('all')}
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300"
                    />
                    <label htmlFor="category-all" className="ml-2 block text-sm text-gray-700">
                      All Categories
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="category-pooja-kits"
                      name="category"
                      type="radio"
                      checked={selectedCategory === 'pooja-kits'}
                      onChange={() => setSelectedCategory('pooja-kits')}
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300"
                    />
                    <label htmlFor="category-pooja-kits" className="ml-2 block text-sm text-gray-700">
                      Pooja Kits
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="category-idols"
                      name="category"
                      type="radio"
                      checked={selectedCategory === 'idols'}
                      onChange={() => setSelectedCategory('idols')}
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300"
                    />
                    <label htmlFor="category-idols" className="ml-2 block text-sm text-gray-700">
                      Idols
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="category-incense"
                      name="category"
                      type="radio"
                      checked={selectedCategory === 'incense'}
                      onChange={() => setSelectedCategory('incense')}
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300"
                    />
                    <label htmlFor="category-incense" className="ml-2 block text-sm text-gray-700">
                      Incense
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="category-lamps"
                      name="category"
                      type="radio"
                      checked={selectedCategory === 'lamps'}
                      onChange={() => setSelectedCategory('lamps')}
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300"
                    />
                    <label htmlFor="category-lamps" className="ml-2 block text-sm text-gray-700">
                      Lamps
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="category-books"
                      name="category"
                      type="radio"
                      checked={selectedCategory === 'books'}
                      onChange={() => setSelectedCategory('books')}
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300"
                    />
                    <label htmlFor="category-books" className="ml-2 block text-sm text-gray-700">
                      Books
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="category-accessories"
                      name="category"
                      type="radio"
                      checked={selectedCategory === 'accessories'}
                      onChange={() => setSelectedCategory('accessories')}
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300"
                    />
                    <label htmlFor="category-accessories" className="ml-2 block text-sm text-gray-700">
                      Accessories
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min="0"
                    max={maxPrice}
                    value={minPrice}
                    onChange={(e) => setMinPrice(Number(e.target.value))}
                    className="block w-full rounded-md border-gray-300 py-1.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500"
                  />
                  <span className="text-gray-500">to</span>
                  <input
                    type="number"
                    min={minPrice}
                    max="3000"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="block w-full rounded-md border-gray-300 py-1.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500"
                  />
                </div>
                <div className="mt-4">
                  <input
                    type="range"
                    min="0"
                    max="3000"
                    step="100"
                    value={minPrice}
                    onChange={(e) => setMinPrice(Number(e.target.value))}
                    className="w-full accent-orange-600"
                  />
                  <input
                    type="range"
                    min="0"
                    max="3000"
                    step="100"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-orange-600"
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <div className="flex items-center">
                  <input
                    id="in-stock"
                    name="in-stock"
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <label htmlFor="in-stock" className="ml-2 block text-sm text-gray-700">
                    In Stock Only
                  </label>
                </div>
              </div>
              
              <div>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSortBy('default');
                    setMinPrice(0);
                    setMaxPrice(3000);
                    setInStockOnly(false);
                    setSearchQuery('');
                    setCurrentPage(1);
                  }}
                  className="w-full py-2 px-4 border border-orange-300 rounded-md shadow-sm text-sm font-medium text-orange-700 bg-white hover:bg-orange-50 focus:outline-none"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="flex-1">
            {/* Sort Controls */}
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div className="mb-4 sm:mb-0">
                  <span className="text-sm text-gray-700">
                    Showing <span className="font-medium">{Math.min(indexOfFirstItem + 1, filteredProducts.length)}</span> to{' '}
                    <span className="font-medium">{Math.min(indexOfLastItem, filteredProducts.length)}</span> of{' '}
                    <span className="font-medium">{filteredProducts.length}</span> results
                  </span>
                </div>
                <div className="flex items-center">
                  <label htmlFor="sort" className="sr-only">Sort by</label>
                  <select
                    id="sort"
                    name="sort"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md"
                  >
                    <option value="default">Featured</option>
                    <option value="price-low-high">Price: Low to High</option>
                    <option value="price-high-low">Price: High to Low</option>
                    <option value="rating-high-low">Highest Rated</option>
                    <option value="newest">Newest First</option>
                  </select>
                </div>
              </div>
            </div>
            
            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {currentItems.length > 0 ? (
                currentItems.map((product) => (
                  <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="relative">
                      {/* Product image */}
                      <Link href={`/products/${product.id}`} onClick={() => {
                        // Add to recently viewed
                        const recentIds = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
                        // Add to front of array, remove duplicates, limit to 4
                        const newRecentIds = [
                          product.id, 
                          ...recentIds.filter((id: string) => id !== product.id)
                        ].slice(0, 4);
                        localStorage.setItem('recentlyViewed', JSON.stringify(newRecentIds));
                      }}>
                        <div className="relative h-48 bg-gray-200 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      </Link>
                      
                      {/* Wishlist button */}
                      <button
                        onClick={() => toggleWishlist(product.id)}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-white shadow-sm hover:bg-gray-100 focus:outline-none"
                        aria-label={`${wishlist.includes(product.id) ? 'Remove from' : 'Add to'} wishlist`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className={`h-5 w-5 ${wishlist.includes(product.id) ? 'text-red-500 fill-current' : 'text-gray-400'}`}
                          viewBox="0 0 20 20"
                          fill="none"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={wishlist.includes(product.id) ? 0 : 1.5}
                            d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                          />
                        </svg>
                      </button>
                      
                      {/* Compare button */}
                      <button
                        onClick={() => toggleCompare(product.id)}
                        className="absolute top-2 left-2 p-1.5 rounded-full bg-white shadow-sm hover:bg-gray-100 focus:outline-none"
                        aria-label={`${compareList.includes(product.id) ? 'Remove from' : 'Add to'} compare`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className={`h-5 w-5 ${compareList.includes(product.id) ? 'text-blue-500' : 'text-gray-400'}`}
                          viewBox="0 0 20 20"
                          fill="none"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M9 9V4.5M15 9h-6m0 0H3m6 0v4.5M10.5 19.5h3a3 3 0 003-3v-8.25M10.5 19.5h-3a3 3 0 01-3-3v-8.25M10.5 19.5v-10.5"
                          />
                        </svg>
                      </button>
                      
                      {/* Sale badge */}
                      {product.discountPrice && (
                        <div className="absolute bottom-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                          SAVE {Math.round((product.price - product.discountPrice) / product.price * 100)}%
                        </div>
                      )}
                      
                      {/* Stock status */}
                      {!product.inStock && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                          <span className="text-white font-bold px-3 py-2 bg-gray-900 bg-opacity-75 rounded-md">
                            Out of Stock
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4">
                      <Link href={`/products/${product.id}`}>
                        <h2 className="text-lg font-medium text-gray-900 mb-1 hover:text-orange-600 transition-colors">
                          {product.name}
                        </h2>
                      </Link>
                      
                      {/* Rating */}
                      <div className="flex items-center mb-2">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`} viewBox="0 0 20 20" fill="currentColor">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="ml-1 text-xs text-gray-500">{product.rating}</span>
                      </div>
                      
                      {/* Price */}
                      <div className="flex items-center">
                        {product.discountPrice ? (
                          <>
                            <span className="text-lg font-bold text-orange-600">₹{product.discountPrice}</span>
                            <span className="ml-2 text-sm text-gray-500 line-through">₹{product.price}</span>
                          </>
                        ) : (
                          <span className="text-lg font-bold text-orange-600">₹{product.price}</span>
                        )}
                      </div>
                      
                      {/* Quick add to cart */}
                      <button
                        disabled={!product.inStock}
                        className={`mt-3 w-full py-2 px-4 rounded-md text-sm font-medium ${
                          product.inStock
                            ? 'bg-orange-600 text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                        onClick={() => {
                          alert(`${product.name} added to cart!`);
                        }}
                      >
                        {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-10 text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="mt-2 text-lg font-medium text-gray-900">No products found</h3>
                  <p className="mt-1 text-gray-500">Try adjusting your filters or search query.</p>
                  <div className="mt-6">
                    <button
                      onClick={() => {
                        setSelectedCategory('all');
                        setSortBy('default');
                        setMinPrice(0);
                        setMaxPrice(3000);
                        setInStockOnly(false);
                        setSearchQuery('');
                      }}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                    >
                      Reset Filters
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Pagination */}
            {filteredProducts.length > itemsPerPage && (
              <div className="mt-6 flex items-center justify-center">
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => paginate(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border ${
                      currentPage === 1
                        ? 'border-gray-300 bg-white text-gray-300 cursor-not-allowed'
                        : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">Previous</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  {[...Array(Math.ceil(filteredProducts.length / itemsPerPage)).keys()].map(number => {
                    // Show limited number of pages
                    if (
                      number + 1 === 1 ||
                      number + 1 === Math.ceil(filteredProducts.length / itemsPerPage) ||
                      (number + 1 >= currentPage - 1 && number + 1 <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={number}
                          onClick={() => paginate(number + 1)}
                          className={`relative inline-flex items-center px-4 py-2 border ${
                            currentPage === number + 1
                              ? 'z-10 bg-orange-50 border-orange-500 text-orange-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {number + 1}
                        </button>
                      );
                    } else if (
                      (number + 1 === currentPage - 2 && currentPage > 3) ||
                      (number + 1 === currentPage + 2 && currentPage < Math.ceil(filteredProducts.length / itemsPerPage) - 2)
                    ) {
                      return (
                        <span
                          key={number}
                          className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-gray-700"
                        >
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                  
                  <button
                    onClick={() => paginate(Math.min(Math.ceil(filteredProducts.length / itemsPerPage), currentPage + 1))}
                    disabled={currentPage === Math.ceil(filteredProducts.length / itemsPerPage)}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border ${
                      currentPage === Math.ceil(filteredProducts.length / itemsPerPage)
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
        </div>
      </div>
    </div>
  );
}