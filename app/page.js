// app/page.js
import Link from 'next/link';

export default function Home() {
  return (
    <div className="text-center">
      <h2 className="text-4xl font-bold mb-4 text-blue-700">
        Welcome to Pet Care Scheduler 🐶🐱
      </h2>
      <p className="text-lg max-w-xl mx-auto">
        Keep track of walks, feedings, vet visits, and more. Designed to help pet owners stay organized and keep their furry friends happy.
      </p>

      {/* Link to the Pets Page */}
      <Link href="/pets">
        <button className="mt-8 px-6 py-2 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700">
          View My Pets
        </button>
      </Link>

      {/* Link to the Schedule Page */}
      <Link href="/schedule">
        <button className="mt-4 px-6 py-2 bg-green-600 text-white rounded-xl shadow-lg hover:bg-green-700">
          Go to Schedule
        </button>
      </Link>
      { /* Link to the Breeds Page */}
      <Link href="/breeds">
        <button className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-xl shadow-lg hover:bg-purple-700">
          View Dog Breeds
        </button>
      </Link>
    </div>
  );
}