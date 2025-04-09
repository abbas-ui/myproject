import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="bg-blue-600 text-white px-6 py-4 shadow-md">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold hover:opacity-90 transition-opacity">
          🐾 Pet Care Scheduler
        </Link>
        <ul className="flex gap-6 text-lg">
          <li>
            <Link 
              href="/" 
              className="hover:underline underline-offset-4 transition-all"
              aria-current="page"
            >
              Home
            </Link>
          </li>
          <li>
            <Link 
              href="/pets" 
              className="hover:underline underline-offset-4 transition-all"
            >
              My Pets
            </Link>
          </li>
          <li>
            <Link 
              href="/schedule" 
              className="hover:underline underline-offset-4 transition-all"
            >
              Schedule
            </Link>
          </li>
          <li>
            <Link 
              href="/about" 
              className="hover:underline underline-offset-4 transition-all"
            >
              About
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;