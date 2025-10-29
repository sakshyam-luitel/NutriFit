import React, { useState, useEffect } from 'react';
import { marketplaceAPI, nutritionAPI } from '../api';

const Marketplace = () => {
  const [foods, setFoods] = useState([]);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('foods');
  const [season, setSeason] = useState('all');
  const [message, setMessage] = useState('');
  const [showCheckout, setShowCheckout] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (season === 'all') {
      fetchData();
    } else {
      fetchSeasonalFoods();
    }
  }, [season]);

  const fetchData = async () => {
    try {
      const [foodsRes, cartRes, ordersRes] = await Promise.all([
        nutritionAPI.getFoods(),
        marketplaceAPI.getCart(),
        marketplaceAPI.getOrders(),
      ]);
      setFoods(foodsRes.data);
      setCart(cartRes.data);
      setOrders(ordersRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSeasonalFoods = async () => {
    try {
      const response = await nutritionAPI.getSeasonalFoods(season);
      setFoods(response.data);
    } catch (error) {
      console.error('Error fetching seasonal foods:', error);
    }
  };

  const handleAddToCart = async (foodId) => {
    setMessage('');
    try {
      await marketplaceAPI.addToCart({
        food_id: foodId,
        quantity: 1,
      });
      setMessage('Added to cart!');
      const cartRes = await marketplaceAPI.getCart();
      setCart(cartRes.data);
    } catch (error) {
      setMessage('Error adding to cart');
    }
  };

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await marketplaceAPI.updateCart(itemId, { quantity: newQuantity });
      const cartRes = await marketplaceAPI.getCart();
      setCart(cartRes.data);
    } catch (error) {
      setMessage('Error updating cart');
    }
  };

  const handleRemoveFromCart = async (itemId) => {
    try {
      await marketplaceAPI.removeFromCart(itemId);
      const cartRes = await marketplaceAPI.getCart();
      setCart(cartRes.data);
      setMessage('Item removed from cart');
    } catch (error) {
      setMessage('Error removing item');
    }
  };

  const handleCheckout = async () => {
    if (!deliveryAddress) {
      setMessage('Please enter delivery address');
      return;
    }

    try {
      await marketplaceAPI.createOrder({
        delivery_address: deliveryAddress,
      });
      setMessage('Order placed successfully!');
      setShowCheckout(false);
      setDeliveryAddress('');
      const [cartRes, ordersRes] = await Promise.all([
        marketplaceAPI.getCart(),
        marketplaceAPI.getOrders(),
      ]);
      setCart(cartRes.data);
      setOrders(ordersRes.data);
      setActiveTab('orders');
    } catch (error) {
      setMessage(error.response?.data?.error || 'Error placing order');
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.subtotal, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading marketplace...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Local Food Marketplace</h1>

        {message && (
          <div className={`mb-6 p-4 rounded ${
            message.includes('success') || message.includes('Added')
              ? 'bg-green-100 border border-green-400 text-green-700'
              : 'bg-red-100 border border-red-400 text-red-700'
          }`}>
            {message}
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('foods')}
              className={`py-2 px-4 font-semibold border-b-2 ${
                activeTab === 'foods'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Browse Foods ({foods.length})
            </button>
            <button
              onClick={() => setActiveTab('cart')}
              className={`py-2 px-4 font-semibold border-b-2 ${
                activeTab === 'cart'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Cart ({cart.length})
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`py-2 px-4 font-semibold border-b-2 ${
                activeTab === 'orders'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Orders ({orders.length})
            </button>
          </div>
        </div>

        {/* Foods Tab */}
        {activeTab === 'foods' && (
          <div>
            {/* Season Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Season
              </label>
              <select
                value={season}
                onChange={(e) => setSeason(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary focus:border-primary"
              >
                <option value="all">All Seasons</option>
                <option value="spring">Spring (चैत्र-जेठ)</option>
                <option value="summer">Summer (आषाढ़-श्रावण)</option>
                <option value="autumn">Autumn (भाद्र-अश्विन)</option>
                <option value="winter">Winter (कार्तिक-फाल्गुन)</option>
              </select>
            </div>

            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
              {foods.map((food) => (
                <div key={food.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-bold">{food.name}</h3>
                        {food.name_nepali && (
                          <p className="text-sm text-gray-600">{food.name_nepali}</p>
                        )}
                      </div>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded capitalize">
                        {food.category}
                      </span>
                    </div>

                    <div className="text-xs text-gray-500 mb-4 capitalize">
                      {food.season.replace('_', ' ')}
                    </div>

                    <div className="space-y-2 mb-4 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Calories</span>
                        <span className="font-semibold">{food.calories} per 100g</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Protein</span>
                        <span className="font-semibold">{food.protein}g</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Carbs</span>
                        <span className="font-semibold">{food.carbohydrates}g</span>
                      </div>
                    </div>

                    {food.health_benefits && (
                      <p className="text-xs text-gray-600 mb-4 line-clamp-2">
                        {food.health_benefits}
                      </p>
                    )}

                    <button
                      onClick={() => handleAddToCart(food.id)}
                      className="w-full bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-secondary transition-colors"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cart Tab */}
        {activeTab === 'cart' && (
          <div>
            {cart.length > 0 ? (
              <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="bg-white p-6 rounded-lg shadow">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold mb-2">{item.food.name}</h3>
                          <p className="text-sm text-gray-600 mb-4">{item.food.name_nepali}</p>
                          <div className="flex items-center space-x-4">
                            <button
                              onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                              className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
                            >
                              -
                            </button>
                            <span className="font-semibold">{item.quantity}</span>
                            <button
                              onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                              className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-primary mb-2">
                            NPR {item.subtotal.toFixed(2)}
                          </div>
                          <button
                            onClick={() => handleRemoveFromCart(item.id)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-white p-6 rounded-lg shadow h-fit">
                  <h3 className="text-xl font-bold mb-4">Order Summary</h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>NPR {cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery</span>
                      <span>NPR 50.00</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span className="text-primary">NPR {(cartTotal + 50).toFixed(2)}</span>
                    </div>
                  </div>

                  {!showCheckout ? (
                    <button
                      onClick={() => setShowCheckout(true)}
                      className="w-full bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-secondary"
                    >
                      Proceed to Checkout
                    </button>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Delivery Address
                        </label>
                        <textarea
                          value={deliveryAddress}
                          onChange={(e) => setDeliveryAddress(e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary focus:border-primary"
                          placeholder="Enter your delivery address"
                        />
                      </div>
                      <button
                        onClick={handleCheckout}
                        className="w-full bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-secondary"
                      >
                        Place Order
                      </button>
                      <button
                        onClick={() => setShowCheckout(false)}
                        className="w-full bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-300"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white p-12 rounded-lg shadow text-center">
                <div className="text-6xl mb-4">🛒</div>
                <p className="text-gray-500 mb-4">Your cart is empty</p>
                <button
                  onClick={() => setActiveTab('foods')}
                  className="text-primary hover:text-secondary font-semibold"
                >
                  Browse Foods
                </button>
              </div>
            )}
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            {orders.length > 0 ? (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order.id} className="bg-white rounded-lg shadow">
                    <div className="bg-gradient-to-r from-primary to-secondary p-4">
                      <div className="flex justify-between items-start text-white">
                        <div>
                          <h3 className="text-lg font-bold">Order #{order.id.slice(0, 8)}</h3>
                          <p className="text-sm">{new Date(order.created_at).toLocaleString()}</p>
                        </div>
                        <span className="bg-white/20 px-3 py-1 rounded-full text-sm capitalize">
                          {order.status}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="mb-4">
                        <h4 className="font-semibold mb-2">Items:</h4>
                        <div className="space-y-2">
                          {order.order_items.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-sm">
                              <span>{item.food_name} x{item.quantity}</span>
                              <span>NPR {item.subtotal.toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="mb-4">
                        <h4 className="font-semibold mb-2">Delivery Address:</h4>
                        <p className="text-sm text-gray-600">{order.delivery_address}</p>
                      </div>
                      <div className="border-t pt-4">
                        <div className="flex justify-between font-bold">
                          <span>Total Amount</span>
                          <span className="text-primary">NPR {order.total_amount.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white p-12 rounded-lg shadow text-center">
                <div className="text-6xl mb-4">📦</div>
                <p className="text-gray-500 mb-4">No orders yet</p>
                <button
                  onClick={() => setActiveTab('foods')}
                  className="text-primary hover:text-secondary font-semibold"
                >
                  Start Shopping
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;