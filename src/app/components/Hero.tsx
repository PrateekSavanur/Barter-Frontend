import Image from "next/image";

export default function Hero() {
  return (
    <main className="bg-gray-50 text-gray-800">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-teal-400 to-blue-500 text-white overflow-hidden">
        <div className="container mx-auto px-6 py-24 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold">
            Welcome to <span className="text-yellow-300">Swapify</span>
          </h1>
          <p className="mt-8 text-lg md:text-2xl">
            Your trusted platform for effortless bartering. Trade goods and
            services in a seamless, secure, and community-driven way.
          </p>
          <button className="mt-8 px-8 py-4 bg-yellow-300 text-gray-800 font-bold rounded-full shadow-lg hover:bg-yellow-400 transition duration-300">
            Get Started
          </button>
        </div>
      </section>

      {/* Why Choose Swapify Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800">
            Why Choose <span className="text-purple-600">Swapify?</span>
          </h2>
          <p className="mt-4 text-lg md:text-xl text-gray-600">
            Swapify redefines bartering with innovation and simplicity.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-12 mt-16">
          <div className="flex flex-col justify-center">
            <ul className="space-y-8">
              <li className="flex items-start">
                <span className="w-10 h-10 bg-green-500 text-white flex items-center justify-center rounded-full shadow-lg">
                  ✓
                </span>
                <div className="ml-4">
                  <h4 className="text-lg font-semibold">
                    User-Friendly Interface
                  </h4>
                  <p className="text-gray-600">
                    Navigate the platform with ease using our clean and
                    intuitive design.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <span className=" w-10 h-10 bg-green-500 text-white flex items-center justify-center rounded-full shadow-lg">
                  🔒
                </span>
                <div className="ml-4">
                  <h4 className="text-lg font-semibold">Secure Transactions</h4>
                  <p className="text-gray-600">
                    State-of-the-art encryption ensures data safety and seamless
                    exchanges.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="w-10 h-10 bg-green-500 text-white flex items-center justify-center rounded-full shadow-lg">
                  🔄
                </span>
                <div className="ml-4">
                  <h4 className="text-lg font-semibold">
                    Diverse Bartering Options
                  </h4>
                  <p className="text-gray-600">
                    Trade anything—from goods to services—tailored to individual
                    needs.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="w-10 h-10 bg-green-500 text-white flex items-center justify-center rounded-full shadow-lg">
                  👥
                </span>
                <div className="ml-4">
                  <h4 className="text-lg font-semibold">Community Support</h4>
                  <p className="text-gray-600">
                    Connect with like-minded individuals in a safe, supportive
                    environment.
                  </p>
                </div>
              </li>
            </ul>
          </div>
          <div className="relative w-full h-80 md:h-auto">
            <Image
              src="/Barter.jpg"
              alt="Bartering illustration"
              layout="fill"
              objectFit="cover"
              className="rounded-lg shadow-xl"
              priority
            />
          </div>
        </div>
      </section>

      {/* Join Community Section */}
      <section className="bg-gradient-to-r from-teal-400 to-blue-500 text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800">
            Join the <span className="text-purple-600">Swapify</span> Community
          </h2>
          <p className="mt-6 text-lg md:text-xl text-gray-700">
            Sign up today and start trading in just a few clicks!
          </p>
          <button className="mt-8 px-10 py-4 bg-purple-600 text-white font-bold rounded-full shadow-lg hover:bg-purple-700 transition duration-300">
            Create an Account
          </button>
        </div>
      </section>
    </main>
  );
}
