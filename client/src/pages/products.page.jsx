import React, { useState } from 'react';
import { FiShoppingCart, FiX, FiSearch, FiEye } from 'react-icons/fi';

// Local images
import appleImg from '../assets/fruits/apple.png';
import bananaImg from '../assets/fruits/banana.jpg';
import orangeImg from '../assets/fruits/orange.png';
import strawberryImg from '../assets/fruits/straberry.jpg';
import mangoImg from '../assets/fruits/mango.jpg';

const initialFruits = [
    {
        id: 1,
        name: 'Apple',
        price: 199,
        description: 'Fresh and crispy red apples',
        image: appleImg,
        seller: 'Organic Farms',
        quantity: 10,
        category: 'fruit'
    },
    {
        id: 2,
        name: 'Banana',
        price: 199,
        description: 'Sweet and nutritious bananas',
        image: bananaImg,
        seller: 'Tropical Delights',
        quantity: 15,
        category: 'fruit'
    },
    {
        id: 3,
        name: 'Orange',
        price: 2.49,
        description: 'Juicy and vitamin C rich oranges',
        image: orangeImg,
        seller: 'Sunshine Groves',
        quantity: 8,
        category: 'fruit'
    },
    {
        id: 4,
        name: 'Strawberry',
        price: 399,
        description: 'Sweet and aromatic strawberries',
        image: strawberryImg,
        seller: 'Berry Farms',
        quantity: 12,
        category: 'berry'
    },
    {
        id: 5,
        name: 'Mango',
        price: 299,
        description: 'Exotic and flavorful mangoes',
        image: mangoImg,
        seller: 'Tropical Delights',
        quantity: 6,
        category: 'tropical'
    }
];

const ProductsPage = () => {
    const [cart, setCart] = useState([]);
    const [showCart, setShowCart] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    const addToCart = (fruit) => {
        setCart([...cart, { ...fruit, cartId: Date.now() }]);
    };

    const removeFromCart = (cartId) => {
        setCart(cart.filter(item => item.cartId !== cartId));
    };

    const filteredFruits = initialFruits.filter(fruit => {
        const matchesSearch = fruit.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || fruit.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const categories = ['all', ...new Set(initialFruits.map(fruit => fruit.category))];

    const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

    return (
        <div className="min-h-screen bg-gray-50">

            {/* Main Content */}
            <main className="container mx-auto p-4 pb-20">
                {/* Search and Filter Section */}
                <div className="mb-8 space-y-4">
                    <div className="relative">
                        <FiSearch className="absolute left-3 top-3.5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search fruits..."
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {categories.map(category => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-4 py-2 rounded-full text-sm capitalize ${selectedCategory === category ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Product Grid */}
                {filteredFruits.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredFruits.map((fruit) => (
                            <div key={fruit.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full">
                                {/* Image with fixed aspect ratio (1:1) */}
                                <div className="relative aspect-square overflow-hidden">
                                    <img
                                        src={fruit.image}
                                        alt={fruit.name}
                                        className="absolute inset-0 w-full h-full object-cover transition-transform hover:scale-105"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = 'https://via.placeholder.com/300?text=Fruit+Image';
                                        }}
                                    />
                                </div>

                                {/* Product Info */}
                                <div className="p-4 flex-grow flex flex-col">
                                    <div className="flex justify-between items-start">
                                        <h2 className="text-lg font-bold">{fruit.name}</h2>
                                        <span className="text-green-600 font-bold">RS.{fruit.price.toFixed(2)}</span>
                                    </div>
                                    <p className="text-gray-600 text-sm mt-1">{fruit.seller}</p>
                                    <p className="text-gray-500 text-sm mt-2 line-clamp-2">{fruit.description}</p>
                                    <p className="text-gray-500 text-xs mt-2">In Stock: {fruit.quantity}</p>
                                    <div className="flex gap-3 mt-4">
                                        <button
                                            onClick={() => addToCart(fruit)}
                                            className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <FiShoppingCart size={16} />
                                            Add to Cart
                                        </button>
                                        <button
                                            onClick={() => viewDetails(fruit)} // Assuming you have a viewDetails function
                                            className="flex-1 bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <FiEye size={16} /> {/* Using FiEye for view details icon */}
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <p className="text-gray-500 text-lg">No fruits found matching your search</p>
                    </div>
                )}
            </main>

            {/* Shopping Cart Sidebar */}
            {showCart && (
                <div className="fixed inset-0 z-50 overflow-hidden">
                    <div
                        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
                        onClick={() => setShowCart(false)}
                    ></div>

                    <div className="absolute inset-y-0 right-0 max-w-full flex">
                        <div className="relative w-screen max-w-md">
                            <div className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
                                <div className="flex-1 p-6 overflow-y-auto">
                                    <div className="flex items-start justify-between">
                                        <h2 className="text-lg font-medium">Your Shopping Cart</h2>
                                        <button
                                            onClick={() => setShowCart(false)}
                                            className="text-gray-400 hover:text-gray-500"
                                        >
                                            <FiX size={24} />
                                        </button>
                                    </div>

                                    <div className="mt-8">
                                        {cart.length === 0 ? (
                                            <div className="text-center py-8">
                                                <FiShoppingCart size={48} className="mx-auto text-gray-300 mb-4" />
                                                <p className="text-gray-500">Your cart is empty</p>
                                            </div>
                                        ) : (
                                            <div className="flow-root">
                                                <ul className="-my-6 divide-y divide-gray-200">
                                                    {cart.map((item) => (
                                                        <li key={item.cartId} className="py-6 flex">
                                                            <div className="flex-shrink-0 w-24 h-24 rounded-md overflow-hidden">
                                                                <img
                                                                    src={item.image}
                                                                    alt={item.name}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            </div>

                                                            <div className="ml-4 flex-1 flex flex-col">
                                                                <div>
                                                                    <div className="flex justify-between text-base font-medium text-gray-900">
                                                                        <h3>{item.name}</h3>
                                                                        <p className="ml-4">${item.price.toFixed(2)}</p>
                                                                    </div>
                                                                    <p className="mt-1 text-sm text-gray-500">{item.seller}</p>
                                                                </div>
                                                                <div className="flex-1 flex items-end justify-between text-sm">
                                                                    <p className="text-gray-500">Qty: 1</p>
                                                                    <button
                                                                        onClick={() => removeFromCart(item.cartId)}
                                                                        className="font-medium text-red-600 hover:text-red-500"
                                                                    >
                                                                        Remove
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {cart.length > 0 && (
                                    <div className="border-t border-gray-200 p-6">
                                        <div className="flex justify-between text-base font-medium text-gray-900">
                                            <p>Subtotal</p>
                                            <p>${totalPrice.toFixed(2)}</p>
                                        </div>
                                        <p className="mt-0.5 text-sm text-gray-500">Shipping calculated at checkout</p>
                                        <button
                                            className="mt-6 w-full bg-green-600 border border-transparent rounded-md py-3 px-4 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                        >
                                            Checkout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}


        </div>
    );
};

export default ProductsPage;