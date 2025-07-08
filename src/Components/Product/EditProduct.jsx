"use client"
import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTag, faThLarge, faCopyright, faRupeeSign, faTimes, faSave } from '@fortawesome/free-solid-svg-icons';
import { HashLoader } from 'react-spinners';

function EditProduct({ id }) {
  const [product, setProduct] = useState({
    name: '',
    category: '',
    price: '',
    brand: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  let token;
  try {
    token = JSON.parse(localStorage.getItem('token'));
  } catch (error) {
    token = null;
  }

  useEffect(() => {
    if (!token) {
      router.push('/');
    }
  }, [token, router]);

  useEffect(() => {
    if (token && id) {
      setLoading(true);
      axios.get(`/api/product?id=${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => {
        if (res.data && res.data.product) {
          setProduct(res.data.product);
        }
        setLoading(false);
      }).catch(() => {
        setLoading(false);
      });
    }
  }, [id, token]);

  const handleChange = e => {
    const { name, value } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || '' : value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.put('/api/product', { id, ...product }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      router.push('/view-product');
    } catch (err) {
      alert('Update failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-lg mx-auto">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="bg-blue-600 text-white px-6 py-4">
            <h4 className="text-xl font-bold flex items-center gap-2">
              <FontAwesomeIcon icon={faEdit} className="h-5 w-5" />
              Edit Product
            </h4>
          </div>
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                  <FontAwesomeIcon icon={faTag} className="h-4 w-4" />
                  Product Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
                  id="name"
                  name="name"
                  value={product.name}
                  onChange={handleChange}
                  placeholder="Enter product name"
                  required
                />
              </div>
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                  <FontAwesomeIcon icon={faThLarge} className="h-4 w-4" />
                  Category
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
                  id="category"
                  name="category"
                  value={product.category}
                  onChange={handleChange}
                  placeholder="Enter product category"
                />
              </div>
              <div>
                <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                  <FontAwesomeIcon icon={faCopyright} className="h-4 w-4" />
                  Brand
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
                  id="brand"
                  name="brand"
                  value={product.brand}
                  onChange={handleChange}
                  placeholder="Enter product brand"
                />
              </div>
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                  <FontAwesomeIcon icon={faRupeeSign} className="h-4 w-4" />
                  Price
                </label>
                <div className="flex items-center rounded-md shadow-sm border border-gray-300 focus-within:ring-2 focus-within:ring-blue-400 bg-white overflow-hidden">
                  <span className="inline-flex items-center px-3 bg-gray-50 text-gray-500 text-sm border-r border-gray-300">
                    <FontAwesomeIcon icon={faRupeeSign} className="h-4 w-4" />
                  </span>
                  <input
                    type="number"
                    className="w-full px-4 py-2 focus:outline-none text-black bg-transparent border-0 focus:ring-0"
                    id="price"
                    name="price"
                    value={product.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded transition-colors flex items-center gap-1"
                  onClick={() => router.push('/view-product')}
                >
                  <FontAwesomeIcon icon={faTimes} className="h-4 w-4" />
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors flex items-center gap-1"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <HashLoader color="#fff" size={20} />
                      <span className="ml-2">Updating...</span>
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faSave} className="h-4 w-4" />
                      Update Product
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditProduct;
