"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

// Product type from the products page
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
}

// Import the mock data (in a real app, this would come from a database or API)
const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Complete Diwali Poojan Kit',
    description: 'Everything you need for a traditional Diwali poojan ceremony. This comprehensive kit includes diyas, candles, incense sticks, rangoli colors, and all essential items for a proper Diwali celebration. Perfect for families wanting to observe the festival with authentic rituals.',
    price: 1299,
    discountPrice: 999,
    image: '/products/diwali-kit.webp',
    category: 'pooja-kits',
    rating: 4.8,
    inStock: true,
    isFeatured: true,
  },
  {
    id: '2',
    name: 'Brass Panchpatra Set',
    description: 'Traditional brass panchpatra set for daily rituals. Meticulously crafted from high-quality brass, this set includes all five essential items needed for daily puja. The durable finish ensures long-lasting shine and the perfect size makes it convenient for regular use.',
    price: 850,
    image: '/products/panchpatra.webp',
    category: 'accessories',
    rating: 4.6,
    inStock: true,
  },
  {
    id: '3',
    name: 'Ganesha Idol - Eco-friendly',
    description: 'Handcrafted eco-friendly clay Ganesha idol. Made from natural clay and painted with non-toxic colors, this beautiful idol is both environmentally conscious and spiritually significant. Perfect for Ganesh Chaturthi celebrations or as a permanent addition to your home temple.',
    price: 599,
    discountPrice: 499,
    image: '/products/ganesha.webp',
    category: 'idols',
    rating: 4.9,
    inStock: true,
    isFeatured: true,
  },
  {
    id: '4',
    name: 'Premium Camphor Tablets',
    description: 'High quality camphor tablets for aarti. These pure camphor tablets burn cleanly with a pleasant aroma, ideal for daily aarti ceremonies. Each tablet is precisely measured to provide the perfect amount of fragrance and light for your religious rituals.',
    price: 120,
    image: '/products/camphor.webp',
    category: 'accessories',
    rating: 4.7,
    inStock: true,
  },
  {
    id: '5',
    name: 'Sandalwood Incense Sticks',
    description: 'Pure sandalwood incense sticks - Pack of 30. Made from genuine sandalwood powder, these incense sticks provide an authentic, calming fragrance. Perfect for meditation, prayer, or creating a peaceful atmosphere in your home. Each stick burns for approximately 45 minutes.',
    price: 199,
    image: '/products/incense.webp',
    category: 'incense',
    rating: 4.5,
    inStock: true,
  },
  {
    id: '6',
    name: 'Lakshmi Ganesh Idol Set',
    description: 'Beautiful brass Lakshmi Ganesh idol set for prosperity. This elegantly designed set features detailed craftsmanship with traditional symbolism. Having these deities in your home or office is believed to bring wealth and remove obstacles. The set comes with a sturdy base for stable placement.',
    price: 2499,
    discountPrice: 1999,
    image: '/products/lakshmi-ganesh.webp',
    category: 'idols',
    rating: 4.8,
    inStock: true,
  },
  {
    id: '7',
    name: 'Navgraha Yantra',
    description: 'Sacred geometry Navgraha (nine planets) yantra on copper plate. This precisely etched yantra represents the cosmic influence of all nine planets. Made from pure copper with detailed Sanskrit inscriptions, it\'s ideal for placement in homes or offices to balance planetary energies.',
    price: 1450,
    image: '/products/navgraha.webp',
    category: 'accessories',
    rating: 4.7,
    inStock: true,
  },
  {
    id: '8',
    name: 'Brass Oil Lamp (Diya)',
    description: 'Traditional hanging brass oil lamp for temple or home. This intricately designed oil lamp can be filled with ghee or oil to provide a serene, steady flame. The hanging chain allows versatile placement, and the brass construction ensures durability and a timeless aesthetic.',
    price: 799,
    image: '/products/diya.webp',
    category: 'lamps',
    rating: 4.6,
    inStock: true,
    isFeatured: true,
  },
  {
    id: '9',
    name: 'Bhagavad Gita - Hardcover',
    description: 'Illustrated hardcover Bhagavad Gita with Sanskrit and English translation. This beautiful edition contains the complete text with parallel Sanskrit, transliteration, and English translation. The book includes 18 color illustrations and a comprehensive glossary to aid understanding of this sacred text.',
    price: 550,
    image: '/products/gita.webp',
    category: 'books',
    rating: 5.0,
    inStock: true,
  },
  {
    id: '10',
    name: 'Complete Satyanarayan Puja Kit',
    description: 'All items needed for Satyanarayan puja in one convenient package. This comprehensive kit contains all the necessary items for performing the auspicious Satyanarayan puja, including detailed instructions. Perfect for special occasions like housewarming, anniversaries, or fulfilling religious vows.',
    price: 1199,
    discountPrice: 999,
    image: '/products/satyanarayan.webp',
    category: 'pooja-kits',
    rating: 4.9,
    inStock: true,
  },
  {
    id: '11',
    name: 'Silver Plated Pooja Thali Set',
    description: 'Elegant silver plated thali set for daily aarti. This beautifully crafted set includes a thali, bell, diya, and containers for kumkum, rice, and flowers. The silver plating adds a touch of luxury to your daily prayers while maintaining traditions.',
    price: 1899,
    image: '/products/thali.webp',
    category: 'accessories',
    rating: 4.7,
    inStock: true,
    isFeatured: true,
  },
  {
    id: '12',
    name: 'Rudraksha Mala',
    description: '108 bead authentic Rudraksha japa mala with certification. Each Rudraksha bead is carefully selected and authenticated. This mala is ideal for meditation, japa, or wearing as a spiritual accessory. Comes with a certification of authenticity and a cotton storage pouch.',
    price: 1299,
    image: '/products/rudraksha.webp',
    category: 'accessories',
    rating: 4.8,
    inStock: true,
  },
];

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [isBrowser, setIsBrowser] = useState(false);

  // Set isBrowser to true once component mounts
  useEffect(() => {
    setIsBrowser(true);
  }, []);

  // Load product data
  useEffect(() => {
    // In a real app, fetch from API
    const foundProduct = PRODUCTS.find(p => p.id === productId);
    if (foundProduct) {
      setProduct(foundProduct);
      
      // Get recommended products from the same category
      const similar = PRODUCTS.filter(p => 
        p.id !== productId && p.category === foundProduct.category
      ).slice(0, 4);
      
      setRecommendedProducts(similar);
    } else {
      // Product not found - redirect to products page
      router.push('/products');
    }
  }, [productId, router]);
  
  // Check wishlist status - only run on client side
  useEffect(() => {
    if (isBrowser && typeof window !== 'undefined') {
      try {
        const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        setIsInWishlist(wishlist.includes(productId));
      } catch (error) {
        console.error('Error accessing localStorage:', error);
        setIsInWishlist(false);
      }
    }
  }, [productId, isBrowser]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  const handleAddToCart = () => {
    // In a real app, would add to cart in state/context
    // For now, just show feedback
    setIsAddedToCart(true);
    setTimeout(() => setIsAddedToCart(false), 2000);
  };

  const handleToggleWishlist = () => {
    if (isBrowser && typeof window !== 'undefined') {
      try {
        const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        let newWishlist;
        
        if (isInWishlist) {
          newWishlist = wishlist.filter((id: string) => id !== productId);
        } else {
          newWishlist = [...wishlist, productId];
        }
        
        localStorage.setItem('wishlist', JSON.stringify(newWishlist));
        setIsInWishlist(!isInWishlist);
      } catch (error) {
        console.error('Error modifying wishlist:', error);
      }
    }
  };

  const calculateDiscount = () => {
    if (product.discountPrice) {
      const discount = ((product.price - product.discountPrice) / product.price) * 100;
      return Math.round(discount);
    }
    return 0;
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumbs */}
        <nav className="flex mb-6 text-sm text-gray-500" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/" className="hover:text-orange-600">
                Home
              </Link>
            </li>
            <li className="flex items-center">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <Link href="/products" className="ml-2 hover:text-orange-600">
                Products
              </Link>
            </li>
            <li className="flex items-center">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <span className="ml-2 text-gray-700" aria-current="page">
                {product.name}
              </span>
            </li>
          </ol>
        </nav>

        {/* Product Details */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
            {/* Product Image */}
            <div className="relative h-80 md:h-96 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
              {/* In a real app, replace with actual image */}
              <div className="text-center p-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="mt-4 text-gray-500">{product.name} Image</p>
              </div>

              {/* Discount badge */}
              {product.discountPrice && (
                <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1.5 rounded-full">
                  {calculateDiscount()}% OFF
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>
                
                {/* Rating */}
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`} viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 ml-2">{product.rating.toFixed(1)} ({Math.floor(product.rating * 10)} reviews)</span>
                </div>

                {/* Price */}
                <div className="mb-6">
                  {product.discountPrice ? (
                    <div className="flex items-center">
                      <span className="text-3xl font-bold text-gray-900">₹{product.discountPrice}</span>
                      <span className="ml-3 text-xl text-gray-500 line-through">₹{product.price}</span>
                    </div>
                  ) : (
                    <span className="text-3xl font-bold text-gray-900">₹{product.price}</span>
                  )}
                  {product.discountPrice && (
                    <p className="text-green-600 text-sm mt-1">You save: ₹{product.price - product.discountPrice} ({calculateDiscount()}%)</p>
                  )}
                </div>

                {/* Stock Status */}
                <div className="mb-6">
                  {product.inStock ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                      </svg>
                      In Stock
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                      <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                      </svg>
                      Out of Stock
                    </span>
                  )}
                </div>

                {/* Quantity Selector */}
                {product.inStock && (
                  <div className="mb-6">
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity
                    </label>
                    <div className="flex items-center">
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="text-gray-500 focus:outline-none focus:text-gray-600 p-1"
                      >
                        <svg className="h-5 w-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                          <path d="M20 12H4"></path>
                        </svg>
                      </button>
                      <input
                        id="quantity"
                        className="mx-2 border text-center w-12 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
                        type="number"
                        value={quantity}
                        min="1"
                        onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                      />
                      <button
                        type="button"
                        onClick={() => setQuantity(quantity + 1)}
                        className="text-gray-500 focus:outline-none focus:text-gray-600 p-1"
                      >
                        <svg className="h-5 w-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                          <path d="M12 4v16m8-8H4"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                    className={`flex-1 py-3 px-4 flex justify-center items-center rounded-md font-medium transition ${
                      product.inStock
                        ? 'bg-orange-600 hover:bg-orange-700 text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <svg className="h-5 w-5 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                    {isAddedToCart ? 'Added to Cart!' : 'Add to Cart'}
                  </button>
                  
                  <button
                    onClick={handleToggleWishlist}
                    className={`py-3 px-4 rounded-md font-medium transition ${
                      isInWishlist
                        ? 'bg-red-100 text-red-600 hover:bg-red-200'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <svg className="h-5 w-5" fill={isInWishlist ? 'currentColor' : 'none'} strokeLinecap="round" strokeLinejoin="round" strokeWidth={isInWishlist ? "0" : "2"} viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-t border-gray-200">
            <div className="flex border-b">
              <button
                onClick={() => setActiveTab('description')}
                className={`flex-1 py-4 px-6 text-center border-b-2 font-medium ${
                  activeTab === 'description'
                    ? 'border-orange-600 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab('specifications')}
                className={`flex-1 py-4 px-6 text-center border-b-2 font-medium ${
                  activeTab === 'specifications'
                    ? 'border-orange-600 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Specifications
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`flex-1 py-4 px-6 text-center border-b-2 font-medium ${
                  activeTab === 'reviews'
                    ? 'border-orange-600 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Reviews
              </button>
            </div>
            
            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'description' && (
                <div className="prose max-w-none">
                  <p>{product.description}</p>
                  <p className="mt-4">
                    Our products are sourced from authentic suppliers and craftsmen across India,
                    ensuring quality and authenticity in every item. Each product undergoes thorough
                    quality checks before being offered to our customers.
                  </p>
                </div>
              )}
              
              {activeTab === 'specifications' && (
                <div className="overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Category</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {product.category.charAt(0).toUpperCase() + product.category.slice(1).replace('-', ' ')}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Material</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          Various (depends on the specific product)
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Origin</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">India</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Package Contents</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {product.name} with packaging
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
              
              {activeTab === 'reviews' && (
                <div>
                  <div className="flex items-center mb-6">
                    <div className="flex text-yellow-400 mr-2">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`} viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-lg font-medium text-gray-900">{product.rating.toFixed(1)} out of 5</span>
                  </div>
                  
                  {/* Sample reviews - in a real app, these would be fetched from a database */}
                  <div className="space-y-6">
                    <div className="border-b pb-6">
                      <div className="flex items-center mb-2">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${i < 5 ? 'text-yellow-400' : 'text-gray-300'}`} viewBox="0 0 20 20" fill="currentColor">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-600">1 month ago</span>
                      </div>
                      <h4 className="font-medium text-gray-900">Rahul S.</h4>
                      <p className="mt-2 text-gray-600">
                        Excellent quality product. Received within the promised delivery time.
                        The packaging was also very good and secure. Would definitely buy again.
                      </p>
                    </div>
                    
                    <div className="border-b pb-6">
                      <div className="flex items-center mb-2">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${i < 4 ? 'text-yellow-400' : 'text-gray-300'}`} viewBox="0 0 20 20" fill="currentColor">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-600">2 months ago</span>
                      </div>
                      <h4 className="font-medium text-gray-900">Priya M.</h4>
                      <p className="mt-2 text-gray-600">
                        Very satisfied with my purchase. The quality is good for the price.
                        Delivery was fast and the product is exactly as described on the website.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recommended Products */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendedProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <Link href={`/products/${product.id}`} className="block">
                  <div className="relative h-48 bg-gray-200">
                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                      {/* In a real app, you'd use a real image */}
                      <div className="text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="mt-2 text-xs">{product.name}</p>
                      </div>
                    </div>
                    {product.discountPrice && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                        SALE
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 mb-1 line-clamp-1">{product.name}</h3>
                    <div className="flex items-center mb-2">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} xmlns="http://www.w3.org/2000/svg" className={`h-3 w-3 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`} viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                        <span className="text-xs text-gray-500 ml-1">{product.rating.toFixed(1)}</span>
                      </div>
                    </div>
                    {product.discountPrice ? (
                      <div className="flex items-center">
                        <span className="text-sm font-bold text-gray-900">₹{product.discountPrice}</span>
                        <span className="ml-2 text-xs text-gray-500 line-through">₹{product.price}</span>
                      </div>
                    ) : (
                      <span className="text-sm font-bold text-gray-900">₹{product.price}</span>
                    )}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}