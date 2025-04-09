"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function PetsPage() {
  // State to hold the list of pets
  const [pets, setPets] = useState([
    { id: 1, name: 'Buddy', type: 'Dog', age: 3 },
    { id: 2, name: 'Whiskers', type: 'Cat', age: 2 },
    { id: 3, name: 'Fluffy', type: 'Rabbit', age: 1 },
  ]);

  // State to hold the current form input values
  const [newPet, setNewPet] = useState({
    name: '',
    type: '',
    age: '',
  });

  // Handle changes in form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPet((prevPet) => ({
      ...prevPet,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPet.name && newPet.type && newPet.age) {
      setPets((prevPets) => [...prevPets, { ...newPet, id: Date.now() }]);
      setNewPet({ name: '', type: '', age: '' });
    }
  };

  // Handle pet removal
  const handleRemovePet = (id) => {
    setPets((prevPets) => prevPets.filter(pet => pet.id !== id));
  };

  return (
    <div className="text-center">
      {/* Back button added here */}
      <div className="text-left mb-4">
        <Link href="/" className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          ← Back to Home
        </Link>
      </div>

      <h2 className="text-4xl font-bold mb-4 text-blue-700">My Pets 🐾</h2>
      
      {/* Form to add a new pet */}
      <form onSubmit={handleSubmit} className="mb-8">
        <input
          type="text"
          name="name"
          value={newPet.name}
          onChange={handleChange}
          placeholder="Pet Name"
          className="px-4 py-2 mr-2 border rounded-lg"
        />
        <input
          type="text"
          name="type"
          value={newPet.type}
          onChange={handleChange}
          placeholder="Pet Type"
          className="px-4 py-2 mr-2 border rounded-lg"
        />
        <input
          type="number"
          name="age"
          value={newPet.age}
          onChange={handleChange}
          placeholder="Pet Age"
          className="px-4 py-2 mr-2 border rounded-lg"
        />
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Add Pet
        </button>
      </form>
      
      {/* Display the list of pets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {pets.map((pet) => (
          <div key={pet.id} className="bg-white shadow-lg rounded-lg p-4 relative">
            <button
              onClick={() => handleRemovePet(pet.id)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
              aria-label="Remove pet"
            >
              ×
            </button>
            <h3 className="text-xl font-semibold text-gray-800">{pet.name}</h3>
            <p className="text-gray-600">Type: {pet.type}</p>
            <p className="text-gray-600">Age: {pet.age} years</p>
          </div>
        ))}
      </div>
    </div>
  );
}