"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBox, faPlus, faExclamationCircle, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { HashLoader } from 'react-spinners';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, deleteProduct } from '../../store/productSlice';

function ViewProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  let token;
  try {
    token = JSON.parse(localStorage.getItem('token'));
  } catch (error) {
    token = null;
  }
  const router = useRouter();
  const dispatch = useDispatch();
  const { products: stateProducts, loading: stateLoading, error } = useSelector((state) => state.product);

  useEffect(() => {
    if (!token) {
      router.push('/');
    }
  }, [token, router]);

  useEffect(() => {
    dispatch(fetchProducts(token));
  }, [dispatch, token]);

  const handleDelete = (id) => {
    dispatch(deleteProduct({ id, token }));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
  };

  if (stateLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center">
          <HashLoader color="#2563eb" size={70} />
          <span className="mt-2 text-blue-600 font-medium">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold flex items-center gap-2 text-blue-700">
            <FontAwesomeIcon icon={faBox} className="h-6 w-6" />
            My Products
          </h2>
          <button
            className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow transition-colors"
            onClick={() => router.push('/add-product')}
          >
            <FontAwesomeIcon icon={faPlus} className="h-5 w-5" />
            Add Product
          </button>
        </div>
        {/* Desktop Table View */}
        <div className="hidden lg:block">
          <div className="bg-white shadow rounded-lg overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stateProducts.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-gray-400">
                      <FontAwesomeIcon icon={faExclamationCircle} className="h-8 w-8 mx-auto mb-2" />
                      No products found. Add your first product!
                    </td>
                  </tr>
                ) : (
                  stateProducts.map(p => (
                    <tr key={p.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{p.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{p.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-block bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-semibold">
                          {p.category || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.brand || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-bold text-green-600">{formatPrice(p.price)}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                        <button
                          className="flex items-center gap-1 px-3 py-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded transition-colors"
                          onClick={() => router.push(`/edit-product/${p.id}`)}
                        >
                          <FontAwesomeIcon icon={faEdit} className="h-4 w-4" />
                          Edit
                        </button>
                        <button
                          className="flex items-center gap-1 px-3 py-1 bg-red-100 hover:bg-red-200 text-red-800 rounded transition-colors"
                          onClick={() => handleDelete(p.id)}
                        >
                          <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        {/* Mobile Card View */}
        <div className="lg:hidden mt-6">
          {stateProducts.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <FontAwesomeIcon icon={faExclamationCircle} className="h-8 w-8 mx-auto mb-2" />
              No products found. Add your first product!
            </div>
          ) : (
            <div className="grid gap-4">
              {stateProducts.map(p => (
                <div key={p.id} className="bg-white shadow rounded-lg p-4 flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-lg text-gray-900">{p.name}</h3>
                    <span className="inline-block bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-semibold">
                      {p.category || 'N/A'}
                    </span>
                  </div>
                  <div className="text-gray-500 text-sm">Brand: {p.brand || 'N/A'}</div>
                  <div className="font-bold text-green-600">{formatPrice(p.price)}</div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-gray-400">ID: {p.id}</span>
                    <div className="flex gap-2">
                      <button
                        className="flex items-center gap-1 px-3 py-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded transition-colors"
                        onClick={() => router.push(`/edit-product/${p.id}`)}
                      >
                        <FontAwesomeIcon icon={faEdit} className="h-4 w-4" />
                        Edit
                      </button>
                      <button
                        className="flex items-center gap-1 px-3 py-1 bg-red-100 hover:bg-red-200 text-red-800 rounded transition-colors"
                        onClick={() => handleDelete(p.id)}
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
