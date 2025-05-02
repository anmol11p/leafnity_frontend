import { NavLink } from "react-router-dom";
import { FaStar } from "react-icons/fa";

const Home = () => {
  const features = [
    {
      title: "Wide Selection",
      text: "Discover a wide variety of indoor and outdoor plants curated for your home and garden.",
      icon: "🌿",
    },
    {
      title: "Fast Delivery",
      text: "Get your favorite plants delivered to your doorstep with our reliable and quick shipping.",
      icon: "🚚",
    },
    {
      title: "Plant Care Tips",
      text: "Learn how to care for your plants with our expert tips and guidance for a thriving garden.",
      icon: "🌱",
    },
  ];

  const testimonials = [
    {
      feedback:
        "The plants I ordered arrived in perfect condition and have transformed my living space. Highly recommend!",
      customer_name: "Alice Smith",
      rating: 5,
      products_purchased: ["Monstera", "Fiddle Leaf Fig"],
      date_of_purchase: "2024-04-10",
    },
    {
      feedback:
        "Excellent service and beautiful plants! The plant care tips were a great bonus.",
      customer_name: "John Doe",
      rating: 4,
      products_purchased: ["Snake Plant", "Peace Lily"],
      date_of_purchase: "2024-03-22",
    },
    {
      feedback:
        "Fast delivery and amazing quality. The customer support team was very helpful too.",
      customer_name: "Sarah Johnson",
      rating: 5,
      products_purchased: ["Succulent Set", "ZZ Plant"],
      date_of_purchase: "2024-02-15",
    },
  ];

  return (
    <main className="flex flex-col gap-16 mt-10">
      {/* Hero Section */}
      <section className="flex flex-col lg:flex-row items-center gap-10 p-10 bg-gradient-to-r from-green-100 to-green-200 rounded-3xl shadow-xl">
        <div className="flex flex-col gap-6 lg:w-1/2">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
            Embrace Nature's Beauty with Our Exclusive Plant Selection!
          </h1>
          <p className="text-gray-700">
            Bring life to your home with our stunning collection of plants. Shop
            now and enjoy the beauty of nature indoors.
          </p>
          <NavLink
            to="/products"
            className="inline-flex items-center justify-center bg-gradient-to-r from-green-400 to-emerald-500 text-white font-semibold px-8 py-4 rounded-full hover:scale-105 transition-transform duration-300 shadow-md"
          >
            Get Started
          </NavLink>
        </div>

        <div className="flex gap-6 lg:w-1/2">
          {[
            "./images/img-1-hero.webp",
            "./images/img-2-hero.webp",
            "./images/img-3-hero.webp",
          ].map((img, index) => (
            <div
              key={index}
              className="w-1/3 overflow-hidden rounded-3xl shadow-lg hover:scale-105 transition-transform duration-500 backdrop-blur-lg bg-white/30"
            >
              <img
                src={img}
                alt="Plant"
                className="w-full h-64 md:h-80 object-cover"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="text-center">
        <h2 className="text-3xl font-bold mb-10">Why Choose Us?</h2>
        <div className="grid gap-8 grid-cols-1 md:grid-cols-3 p-5">
          {features.map((feature, i) => (
            <div
              key={i}
              className="p-8 bg-white/60 backdrop-blur-md rounded-3xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-transform duration-500"
            >
              <div className="text-4xl mb-6">{feature.icon}</div>
              <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-700">{feature.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="text-center p-10">
        <h2 className="text-3xl font-bold mb-10">Happy Customers</h2>
        <div className="grid gap-8 grid-cols-1 md:grid-cols-3">
          {testimonials.map((testimonial, i) => (
            <div
              key={i}
              className="p-6 bg-white/50 backdrop-blur-xl rounded-3xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition duration-500"
            >
              <p className="text-gray-800 italic mb-4">
                "{testimonial.feedback}"
              </p>
              <div className="flex justify-center gap-1 text-yellow-400 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <FaStar
                    key={i}
                    className="hover:scale-125 transition-transform"
                  />
                ))}
              </div>
              <p className="font-bold text-lg">{testimonial.customer_name}</p>
              <div className="text-sm text-gray-500">
                <p>Purchased: {testimonial.products_purchased.join(", ")}</p>
                <p>Date: {testimonial.date_of_purchase}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* Call to Action Section */}
      <section className="my-12 md:my-16 p-10 bg-gradient-to-r from-green-100 to-green-200 rounded-3xl shadow-2xl">
        <div className="flex flex-col-reverse md:flex-row items-center gap-10">
          {/* Text and Form */}
          <div className="flex flex-col gap-6 md:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Join Our Plant Community
            </h2>
            <p className="text-gray-700">
              Subscribe to get exclusive plant care tips, new arrivals, and
              special offers directly to your inbox!
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 w-full px-5 py-4 rounded-full bg-white/80 focus:outline-none focus:ring-4 focus:ring-green-400 transition"
              />
              <button className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-full hover:scale-105 transition-transform duration-300 shadow-lg">
                Join Now
              </button>
            </div>
          </div>

          {/* Image */}
          <div className="md:w-1/2 flex justify-center">
            <img
              src="/images/img-joinUssection.webp"
              alt="Girl watering plants"
              className="w-full h-80 object-cover rounded-3xl shadow-lg hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
