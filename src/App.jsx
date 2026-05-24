import { useState } from "react";

export default function CapitalCommunityBank() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleLogin = async () => {
    try {
      setLoading(true);
      setMessage("");

      const response = await fetch("https://capital-community-bank-online.vercel.app/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("bank_token", data.token);
        setMessage("Login successful");
      } else {
        setMessage(data.message || "Login failed");
      }
    } catch (error) {
      setMessage("Server connection error");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      {/* Header */}
      <header className="bg-slate-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-wide">Capital Community Bank</h1>
            <p className="text-sm text-slate-300">Secure Digital Banking Platform</p>
          </div>

          <nav className="hidden md:flex gap-8 text-sm font-medium">
            <a href="#" className="hover:text-blue-300 transition">Accounts</a>
            <a href="#" className="hover:text-blue-300 transition">Payments</a>
            <a href="#" className="hover:text-blue-300 transition">Transfers</a>
            <a href="#" className="hover:text-blue-300 transition">Support</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-r from-slate-900 to-blue-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="uppercase tracking-[0.25em] text-blue-300 text-sm mb-4">
              Trusted Community Banking
            </p>
            <h2 className="text-5xl font-bold leading-tight mb-6">
              Banking Designed for Modern Financial Life
            </h2>
            <p className="text-slate-300 text-lg leading-relaxed mb-8">
              Manage accounts, monitor transactions, transfer funds, and access
              secure online banking tools from anywhere.
            </p>

            <div className="flex gap-4 flex-wrap">
              <button className="bg-white text-slate-900 px-6 py-3 rounded-2xl font-semibold hover:scale-105 transition">
                Open Account
              </button>

              <button className="border border-white px-6 py-3 rounded-2xl font-semibold hover:bg-white hover:text-slate-900 transition">
                Learn More
              </button>
            </div>
          </div>

          {/* Login Card */}
          <div className="bg-white text-slate-900 rounded-3xl shadow-2xl p-8 max-w-md w-full mx-auto">
            <h3 className="text-2xl font-bold mb-2">Online Banking Login</h3>
            <p className="text-slate-500 mb-6">
              Secure access to your banking dashboard.
            </p>

            <div className="space-y-4">
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                type="text"
                placeholder="Username"
                className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />

              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Password"
                className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />

              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-xl font-semibold transition"
              >
                {loading ? "Signing In..." : "Sign In Securely"}
              </button>

              {message && (
                <p className="text-sm text-center text-slate-600">{message}</p>
              )}
            </div>

            <div className="flex justify-between text-sm mt-5 text-blue-700">
              <a href="#">Forgot Password?</a>
              <a href="#">Enroll Now</a>
            </div>
          </div>
        </div>
      </section>

      {/* Banking Overview */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Checking Account</h3>
              <span className="text-green-600 font-semibold">Active</span>
            </div>

            <p className="text-slate-500 text-sm">Available Balance</p>
            <h2 className="text-4xl font-bold mt-2">$24,850.20</h2>

            <button className="mt-6 bg-slate-900 text-white px-5 py-3 rounded-xl hover:bg-slate-700 transition">
              View Details
            </button>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-200">
            <h3 className="text-lg font-semibold mb-6">Recent Transactions</h3>

            <div className="space-y-5 text-sm">
              <div className="flex justify-between">
                <div>
                  <p className="font-medium">Payroll Deposit</p>
                  <p className="text-slate-500">May 20, 2026</p>
                </div>
                <p className="text-green-600 font-semibold">+$4,500</p>
              </div>

              <div className="flex justify-between">
                <div>
                  <p className="font-medium">Electric Utility</p>
                  <p className="text-slate-500">May 18, 2026</p>
                </div>
                <p className="text-red-500 font-semibold">-$142</p>
              </div>

              <div className="flex justify-between">
                <div>
                  <p className="font-medium">Online Transfer</p>
                  <p className="text-slate-500">May 16, 2026</p>
                </div>
                <p className="text-red-500 font-semibold">-$800</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-700 to-slate-900 text-white rounded-3xl p-8 shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Security Center</h3>

            <div className="space-y-4 text-sm text-slate-200">
              <div className="bg-white/10 rounded-2xl p-4">
                Multi-factor authentication enabled
              </div>

              <div className="bg-white/10 rounded-2xl p-4">
                Real-time fraud monitoring active
              </div>

              <div className="bg-white/10 rounded-2xl p-4">
                256-bit encrypted banking sessions
              </div>
            </div>

            <button className="mt-8 bg-white text-slate-900 px-5 py-3 rounded-xl font-semibold hover:scale-105 transition">
              Manage Security
            </button>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="bg-white py-16 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="uppercase text-blue-700 tracking-[0.2em] text-sm mb-3">
              Digital Services
            </p>
            <h2 className="text-4xl font-bold">Everything You Need in One Platform</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200 hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-3">Mobile Banking</h3>
              <p className="text-slate-600 leading-relaxed">
                Access your finances anytime with secure mobile banking features.
              </p>
            </div>

            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200 hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-3">Instant Transfers</h3>
              <p className="text-slate-600 leading-relaxed">
                Send and receive funds instantly with protected transfer systems.
              </p>
            </div>

            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200 hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-3">Bill Payments</h3>
              <p className="text-slate-600 leading-relaxed">
                Schedule recurring payments and monitor your billing activity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between gap-8">
          <div>
            <h3 className="text-xl font-bold text-white">Capital Community Bank</h3>
            <p className="mt-3 max-w-md text-sm leading-relaxed">
              Providing secure, reliable, and community-focused financial services
              through innovative digital banking solutions.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 text-sm">
            <div>
              <h4 className="text-white font-semibold mb-3">Banking</h4>
              <ul className="space-y-2">
                <li>Savings Accounts</li>
                <li>Loans</li>
                <li>Credit Cards</li>
                <li>Business Banking</li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-3">Support</h4>
              <ul className="space-y-2">
                <li>Customer Care</li>
                <li>Fraud Protection</li>
                <li>Security Center</li>
                <li>Contact Us</li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

/*
====================================================
BACKEND SERVER SETUP (Node.js + Express)
====================================================

1. Create backend folder:

mkdir backend
cd backend

2. Install dependencies:

npm init -y
npm install express cors dotenv bcryptjs jsonwebtoken mongoose
npm install nodemon --save-dev

3. Create server.js

----------------------------------------------------

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('Database Connected'));

const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  balance: Number,
});

const User = mongoose.model('User', UserSchema);

app.post('/api/register', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = new User({
      username: req.body.username,
      password: hashedPassword,
      balance: 24850.20,
    });

    await user.save();

    res.json({ message: 'Account created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      username: user.username,
      balance: user.balance,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.listen(5000, () => {
  console.log('Backend running on port 5000');
});

----------------------------------------------------

4. Create .env file:

MONGO_URI=your_mongodb_connection
JWT_SECRET=capitalcommunitybanksecurekey

5. Run backend:

npx nodemon server.js

====================================================
MONGODB DATABASE
====================================================

Use MongoDB Atlas:
https://www.mongodb.com/atlas

Create cluster and copy connection string.

====================================================
DEPLOYMENT
====================================================

Frontend:
- Vercel
- Netlify

Backend:
- Render
- Railway
- AWS EC2

====================================================
SECURITY FEATURES TO ADD NEXT
====================================================

- Two-factor authentication
- Transaction history APIs
- Admin dashboard
- Fraud monitoring
- Email verification
- Password reset system
- Secure banking sessions
- HTTPS SSL encryption
- Role-based account access

*/
