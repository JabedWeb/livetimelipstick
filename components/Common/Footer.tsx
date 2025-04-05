import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-black text-white py-10 mt-10">
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-5 gap-8">
        {/* Exclusive Section */}
        <div>
          <h3 className="text-lg font-bold">Exclusive</h3>
          <p className="mt-2">Get 10% off your first order</p>
          <div className="flex items-center mt-3 border rounded-lg overflow-hidden">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-3 py-2 text-black flex-1 focus:outline-none"
            />
            <button className="bg-white text-black px-3 py-2">&rarr;</button>
          </div>
        </div>

        {/* Support Section */}
        <div>
          <h3 className="text-lg font-bold">Support</h3>
          <p className="mt-2">111 Bijoy sarani, Dhaka, DH 1515, Bangladesh.</p>
          <p className="mt-2">Jabedhasan231@gmail.com</p>
          <p className="mt-2">+8801793534981</p>
        </div>

        {/* Account Section */}
        <div>
          <h3 className="text-lg font-bold">Account</h3>
          <ul className="mt-2 space-y-2">
            <li>My Account</li>
            <li>Login / Register</li>
            <li>Cart</li>
            <li>Wishlist</li>
            <li>Shop</li>
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-bold">Quick Link</h3>
          <ul className="mt-2 space-y-2">
            <li>Privacy Policy</li>
            <li>Terms Of Use</li>
            <li>FAQ</li>
            <li>Contact</li>
          </ul>
        </div>

        {/* Download App Section */}
        <div>
          <h3 className="text-lg font-bold">Download App</h3>
          <p className="mt-2">Save $3 with App New User Only</p>
          {/* <div className="flex space-x-2 mt-2">
            <img src="/google-play.png" alt="Google Play" className="w-24" />
            <img src="/app-store.png" alt="App Store" className="w-24" />
          </div> */}
          <div className="flex space-x-4 mt-4">
            <FaFacebookF className="cursor-pointer" />
            <FaTwitter className="cursor-pointer" />
            <FaInstagram className="cursor-pointer" />
            <FaLinkedinIn className="cursor-pointer" />
          </div>
        </div>
      </div>
      {/* Copyright */}
      <div className="text-center border-t-2 pt-3  text-gray-400 uppercase text-sm mt-10">© Copyright Jabedweb of 2025</div>
    </footer>
  );
}
