import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DollarSign, CreditCard, Wallet, User, Bell } from 'lucide-react';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://capital-bank-api.onrender.com/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        setIsLoggedIn(true);
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (error) {
      console.error(error);
      alert('Server error');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <Card className="w-full max-w-md shadow-2xl rounded-3xl border-0">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wallet className="text-white w-8 h-8" />
              </div>

              <h1 className="text-3xl font-bold text-gray-800">
                Capital Community Bank
              </h1>

              <p className="text-gray-500 mt-2">
                Secure Online Banking Portal
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Email Address
                </label>

                <Input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={loginData.email}
                  onChange={handleChange}
                  required
                  className="h-12 rounded-xl"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Password
                </label>

                <Input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={loginData.password}
                  onChange={handleChange}
                  required
                  className="h-12 rounded-xl"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-12 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-base"
              >
                Login to Account
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-700 text-white p-5 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Capital Community Bank</h1>
            <p className="text-sm text-blue-100">Welcome back</p>
          </div>

          <div className="flex items-center gap-4">
            <Bell className="w-5 h-5" />
            <User className="w-8 h-8 bg-white text-blue-700 rounded-full p-1" />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="rounded-3xl shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-gray-600 font-medium">Available Balance</h2>
                <DollarSign className="text-green-600" />
              </div>

              <h3 className="text-3xl font-bold text-gray-800">$12,540.00</h3>
            </CardContent>
          </Card>

          <Card className="rounded-3xl shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-gray-600 font-medium">Savings Account</h2>
                <Wallet className="text-blue-600" />
              </div>

              <h3 className="text-3xl font-bold text-gray-800">$8,200.00</h3>
            </CardContent>
          </Card>

          <Card className="rounded-3xl shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-gray-600 font-medium">Credit Card</h2>
                <CreditCard className="text-red-500" />
              </div>

              <h3 className="text-3xl font-bold text-gray-800">$2,140.00</h3>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="transactions" className="w-full">
          <TabsList className="mb-6 rounded-xl bg-white shadow-sm p-1">
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="transfer">Transfer</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="transactions">
            <Card className="rounded-3xl shadow-lg border-0">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-6 text-gray-800">
                  Recent Transactions
                </h2>

                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-4">
                    <div>
                      <p className="font-medium text-gray-800">Amazon Purchase</p>
                      <span className="text-sm text-gray-500">May 20, 2026</span>
                    </div>

                    <p className="text-red-500 font-semibold">-$120.00</p>
                  </div>

                  <div className="flex items-center justify-between border-b pb-4">
                    <div>
                      <p className="font-medium text-gray-800">Salary Deposit</p>
                      <span className="text-sm text-gray-500">May 18, 2026</span>
                    </div>

                    <p className="text-green-600 font-semibold">+$4,000.00</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-800">Netflix Subscription</p>
                      <span className="text-sm text-gray-500">May 15, 2026</span>
                    </div>

                    <p className="text-red-500 font-semibold">-$15.99</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transfer">
            <Card className="rounded-3xl shadow-lg border-0">
              <CardContent className="p-6 space-y-5">
                <h2 className="text-xl font-bold text-gray-800">
                  Transfer Funds
                </h2>

                <Input placeholder="Recipient Account Number" className="h-12 rounded-xl" />

                <Input placeholder="Bank Name" className="h-12 rounded-xl" />

                <Input placeholder="Amount" className="h-12 rounded-xl" />

                <Button className="bg-blue-700 hover:bg-blue-800 rounded-xl h-12 w-full">
                  Send Transfer
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <Card className="rounded-3xl shadow-lg border-0">
              <CardContent className="p-6 space-y-4">
                <h2 className="text-xl font-bold text-gray-800">Account Profile</h2>

                <div>
                  <p className="text-gray-500 text-sm">Full Name</p>
                  <p className="font-medium text-gray-800">John Doe</p>
                </div>

                <div>
                  <p className="text-gray-500 text-sm">Email Address</p>
                  <p className="font-medium text-gray-800">john@example.com</p>
                </div>

                <div>
                  <p className="text-gray-500 text-sm">Account Number</p>
                  <p className="font-medium text-gray-800">**** 4587</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
