"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBox, faPlus, faExclamationCircle, faEdit, faTrash, faDollarSign, faTags } from '@fortawesome/free-solid-svg-icons';
import { HashLoader } from 'react-spinners';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, deleteProduct } from '../../store/productSlice';

function ViewProducts() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.product);
  const { token, isAuthenticated, user } = useSelector((state) => state.user);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      router.push('/');
    }
  }, [isAuthenticated, token, router]);

  useEffect(() => {
    if (token) {
      dispatch(fetchProducts(token));
    }
  }, [dispatch, token]);

  const handleDelete = (id) => {
    dispatch(deleteProduct({ id, token }));
  };

  // Calculate statistics
  const totalProducts = products.length;
  const totalValue = products.reduce((sum, product) => sum + (parseFloat(product.price) || 0), 0);
  const uniqueCategories = [...new Set(products.map(product => product.category))].length;
  const uniqueBrands = [...new Set(products.map(product => product.brand))].length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center h-96">
          <div className="flex flex-col items-center">
            <HashLoader color="#2563eb" size={70} />
            <span className="mt-4 text-gray-600 font-medium">Loading your products...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div className='text-center'>
              <h1 className="text-3xl font-bold text-gray-900">Product Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back, {user?.name || 'User'}! Here's your product overview.</p>
            </div>
            <button
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105"
              onClick={() => router.push('/add-product')}
            >
              <FontAwesomeIcon icon={faPlus} className="h-5 w-5" />
              Add New Product
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-3xl font-bold text-gray-900">{totalProducts}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FontAwesomeIcon icon={faBox} className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-3xl font-bold text-green-600">${totalValue.toFixed(2)}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FontAwesomeIcon icon={faDollarSign} className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Categories</p>
                <p className="text-3xl font-bold text-blue-400">{uniqueCategories}</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <FontAwesomeIcon icon={faTags} className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Brands</p>
                <p className="text-3xl font-bold text-yellow-600">{uniqueBrands}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <FontAwesomeIcon icon={faTags} className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Product List */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Your Products</h2>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-12">
              <FontAwesomeIcon icon={faExclamationCircle} className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products yet</h3>
              <p className="text-gray-500 mb-6">Get started by adding your first product!</p>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
                onClick={() => router.push('/add-product')}
              >
                <FontAwesomeIcon icon={faPlus} className="h-4 w-4 mr-2" />
                Add First Product
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {products.map(product => (
                <div key={product.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold border bg-blue-100 text-blue-800 border-blue-200">
                          <FontAwesomeIcon icon={faBox} className="h-3 w-3 mr-1" />
                          {product.category || 'No category'}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <span className="flex items-center gap-1">
                          <FontAwesomeIcon icon={faTags} className="h-3 w-3" />
                          {product.category || 'No category'}
                        </span>
                        <span>•</span>
                        <span>{product.brand || 'No brand'}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>ID: {product.id}</span>
                        <span>•</span>
                        <span>Created by: {user?.email || 'Unknown'}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        className="flex items-center gap-2 px-4 py-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded-lg transition-colors"
                        onClick={() => router.push(`/edit-product/${product.id}`)}
                      >
                        <FontAwesomeIcon icon={faEdit} className="h-4 w-4" />
                        Edit
                      </button>
                      <button
                        className="flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-lg transition-colors"
                        onClick={() => handleDelete(product.id)}
                      >
                        <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ViewProducts;
