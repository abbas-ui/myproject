"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function BreedsPage() {
  const [breeds, setBreeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newBreed, setNewBreed] = useState({
    name: '',
    temperament: '',
    life_span: '',
    image: null,
  });
  const [previewImage, setPreviewImage] = useState(null);

  // Fetch breeds from API and localStorage
  useEffect(() => {
    const fetchBreeds = async () => {
      try {
        // Fetch from TheDogAPI
        const apiResponse = await fetch('https://api.thedogapi.com/v1/breeds?limit=20');
        if (!apiResponse.ok) throw new Error('Failed to fetch breeds');
        const apiData = await apiResponse.json();

        // Process API breeds with proper image handling
        const processedBreeds = await Promise.all(
          apiData.map(async (breed) => {
            let imageUrl = breed.image?.url;
            
            // If no image from TheDogAPI, try Dog CEO API
            if (!imageUrl) {
              try {
                const breedSlug = breed.name.toLowerCase().split(' ')[0];
                const imgResponse = await fetch(
                  `https://dog.ceo/api/breed/${breedSlug}/images/random`
                );
                const imgData = await imgResponse.json();
                imageUrl = imgData.message;
              } catch (error) {
                console.error('Failed to fetch image from Dog CEO API:', error);
              }
            }

            return {
              ...breed,
              id: String(breed.id || `api-${breed.name.toLowerCase().replace(/\s+/g, '-')}`),
              image: { url: imageUrl || null }
            };
          })
        );

        // Load user breeds from localStorage
        const userBreeds = (JSON.parse(localStorage.getItem('userBreeds')) || []).map(breed => ({
          ...breed,
          id: String(breed.id)
        }));

        setBreeds([...processedBreeds, ...userBreeds]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBreeds();
  }, []);

  // Handle image upload with preview
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setNewBreed({ ...newBreed, image: file });
      };
      reader.readAsDataURL(file);
    }
  };

  // Add new breed
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newBreed.name.trim()) return;

    const userBreed = {
      id: `user-${Date.now()}`,
      name: newBreed.name,
      temperament: newBreed.temperament || 'Not specified',
      life_span: newBreed.life_span || 'Unknown',
      image: { url: previewImage },
    };

    // Update state
    const updatedBreeds = [...breeds, userBreed];
    setBreeds(updatedBreeds);

    // Save to localStorage
    const userBreeds = JSON.parse(localStorage.getItem('userBreeds')) || [];
    localStorage.setItem('userBreeds', JSON.stringify([...userBreeds, userBreed]));

    // Reset form
    setNewBreed({ name: '', temperament: '', life_span: '', image: null });
    setPreviewImage(null);
  };

  // Remove breed
  const handleRemoveBreed = (breedId) => {
    breedId = String(breedId);
    
    // Remove from state
    const updatedBreeds = breeds.filter(breed => String(breed.id) !== breedId);
    setBreeds(updatedBreeds);

    // Remove from localStorage if user-added
    if (breedId.startsWith('user-')) {
      const userBreeds = JSON.parse(localStorage.getItem('userBreeds')) || [];
      const updatedUserBreeds = userBreeds.filter(breed => String(breed.id) !== breedId);
      localStorage.setItem('userBreeds', JSON.stringify(updatedUserBreeds));
    }
  };

  if (loading) return (
    <div className="text-center py-8">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
      <p className="mt-4 text-lg">Loading breeds...</p>
    </div>
  );
  
  if (error) return (
    <div className="text-center py-8">
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 max-w-md mx-auto">
        <p className="font-bold">Error</p>
        <p>{error}</p>
      </div>
      <button 
        onClick={() => window.location.reload()}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Try Again
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Link href="/" className="flex items-center text-blue-600 hover:text-blue-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Dog Breeds 🐕</h1>
          <div className="w-6"></div>
        </div>

        {/* Add Breed Form */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Add Your Own Breed</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Breed Name*</label>
                <input
                  type="text"
                  value={newBreed.name}
                  onChange={(e) => setNewBreed({ ...newBreed, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
                  required
                  placeholder="Enter breed name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Temperament</label>
                <input
                  type="text"
                  value={newBreed.temperament}
                  onChange={(e) => setNewBreed({ ...newBreed, temperament: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
                  placeholder="Describe temperament"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Life Span</label>
                <input
                  type="text"
                  value={newBreed.life_span}
                  onChange={(e) => setNewBreed({ ...newBreed, life_span: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
                  placeholder="e.g., 10-12 years"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Upload Image*</label>
                <div className="flex items-center space-x-4">
                  <label className="cursor-pointer">
                    <div className="px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50">
                      <span className="text-sm font-medium text-gray-700">Choose File</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        required
                      />
                    </div>
                  </label>
                  {previewImage && (
                    <div className="relative">
                      <img src={previewImage} alt="Preview" className="h-12 w-12 object-cover rounded-lg" />
                      <button
                        type="button"
                        onClick={() => setPreviewImage(null)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Add Breed
            </button>
          </form>
        </div>

        {/* Breeds Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {breeds.map((breed) => {
            const breedId = String(breed.id);
            const imageUrl = breed.image?.url;

            return (
              <div key={breedId} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow relative">
                {/* Remove button */}
                <button
                  onClick={() => handleRemoveBreed(breedId)}
                  className="absolute top-2 right-2 z-10 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                  aria-label={`Remove ${breed.name} breed`}
                >
                  ×
                </button>
                
                {/* Breed Image */}
                <div className="h-48 bg-gray-100 relative">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={breed.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://placedog.net/300/200?random=${breedId}`;
                        e.target.className = "w-full h-full object-contain p-4 bg-gray-200";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>
                
                {/* Breed Info */}
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{breed.name}</h3>
                  <p className="text-gray-600 mb-2">
                    <span className="font-medium">Temperament:</span> {breed.temperament || 'Not specified'}
                  </p>
                  <p className="text-gray-600 mb-3">
                    <span className="font-medium">Life Span:</span> {breed.life_span || 'Unknown'}
                  </p>
                  {breedId.startsWith('user-') && (
                    <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                      Added by User
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}