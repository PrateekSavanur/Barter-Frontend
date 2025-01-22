import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-gray-800 to-gray-900 py-8 shadow-md">
      <div className="container mx-auto px-6 flex flex-col justify-between items-center space-y-4">
        <div className="flex items-center space-x-3">
          <Image
            src="/logo.png"
            alt="Swapify Logo"
            width={40}
            height={40}
            className="w-10 h-10"
          />
          <span className="text-xl font-semibold text-white">Swapify</span>
        </div>

        <div className="flex space-x-6 text-gray-300">
          <a
            href="#about"
            className="hover:text-purple-400 transition duration-300"
          >
            About
          </a>
          <a
            href="#services"
            className="hover:text-purple-400 transition duration-300"
          >
            Services
          </a>
          <a
            href="#contact"
            className="hover:text-purple-400 transition duration-300"
          >
            Contact
          </a>
        </div>
      </div>

      <div className="mt-6 text-center text-gray-400">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Swapify. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
