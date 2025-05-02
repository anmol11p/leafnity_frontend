import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { NavLink } from "react-router-dom";
import FooterApi from "../../api/footer.json";

export default function Footer() {
  const icons = {
    Mail: <Mail size={18} />,
    Phone: <Phone size={18} />,
    MapPin: <MapPin size={18} />,
  };

  return (
    <footer className="bg-gray-800 text-white pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="footerContent grid md:grid-cols-3 gap-12">
          {/* Leafnity Section */}
          <div className="sec-common flex flex-col">
            <h3 className="text-2xl font-semibold text-green-500 mb-4">
              Leafnity
            </h3>
            <p className="text-lg text-gray-400">
              Your one-stop shop for all gardening needs.
            </p>
          </div>

          {/* Contact Us Section */}
          <div className="sec-common flex flex-col">
            <h3 className="text-2xl font-semibold text-green-500 mb-4">
              Contact Us
            </h3>
            <div className="iconTextFooter space-y-4">
              {FooterApi.map((currElem, index) => (
                <p
                  key={index}
                  className="flex items-center text-lg text-gray-400 space-x-2"
                >
                  {icons[currElem.icon]}
                  <span>{currElem.title}</span>
                </p>
              ))}
            </div>
          </div>

          {/* Quick Links Section */}
          <div className="sec-common flex flex-col">
            <h3 className="text-2xl font-semibold text-green-500 mb-4">
              Quick Links
            </h3>
            <ul className="QuickLinks space-y-3">
              <li>
                <NavLink
                  to="/about"
                  className="hover:text-green-400 transition-colors"
                >
                  About Us
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/products"
                  className="hover:text-green-400 transition-colors"
                >
                  Products
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/shipping"
                  className="hover:text-green-400 transition-colors"
                >
                  Shipping Policy
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/contact"
                  className="hover:text-green-400 transition-colors"
                >
                  Contact
                </NavLink>
              </li>
            </ul>
          </div>
        </div>

        <div className="footerBottom mt-12 text-center">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Leafnity. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
