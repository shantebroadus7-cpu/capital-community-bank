import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function formatMoney(value) {
  return `$${Number(value).toLocaleString()}`;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [overview, setOverview] = useState({
    totalUsers: 0,
    totalTransactions: 0,
    users: [],
    transactions: [],
  });
  const [allUsers, setAllUsers] = useState([]);
  const [allTransactions, setAllTransactions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [editBalance, setEditBalance] = useState(0);
  const [editRole, setEditRole] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [transactionSearch, setTransactionSearch] = useState("");
  const [transactionFilter, setTransactionFilter] = useState("");
  const [createUserOpen, setCreateUserOpen] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("bank_admin_token");
    if (!token) {
      navigate("/admin/login");
      return;
    }

    if (activeTab === "overview") {
      fetchOverview(token);
    } else if (activeTab === "customers") {
      fetchAllUsers(token);
    } else if (activeTab === "transactions") {
      fetchAllTransactions(token);
    }
  }, [activeTab]);

  const fetchOverview = async (token) => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || "https://capital-bank-api.onrender.com";
      const response = await fetch(
        `${API_URL}/api/admin/overview`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          handleLogout();
          return;
        }

        throw new Error("Unable to load admin data");
      }

      const data = await response.json();
      setOverview(data);
    } catch (error) {
      setMessage(error.message || "Failed to load admin dashboard");
    } finally {
      setLoading(false);
    }
  };

  function filteredUsers(users, query, role) {
    let list = users || [];
    if (role) list = list.filter((u) => u.role === role);
    if (query) {
      const q = query.toLowerCase();
      list = list.filter((u) => u.username.toLowerCase().includes(q) || String(u._id).includes(q));
    }
    return list;
  }

  function filteredTransactions(transactions, query, filter) {
    let list = transactions || [];
    if (filter === "sender") list = list.filter((t) => t.sender);
    if (filter === "recipient") list = list.filter((t) => t.recipient);
    if (query) {
      const q = query.toLowerCase();
      list = list.filter((t) => t.sender.toLowerCase().includes(q) || t.recipient.toLowerCase().includes(q) || t.bank.toLowerCase().includes(q));
    }
    return list;
  }

  const openUserModal = (user) => {
    setSelectedUser(user);
    setEditBalance(user.balance || 0);
    setEditRole(user.role || "user");
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedUser(null);
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;
    const token = localStorage.getItem("bank_admin_token");
    const API_URL = import.meta.env.VITE_API_URL || "https://capital-bank-api.onrender.com";

    try {
      const res = await fetch(`${API_URL}/api/admin/user/${selectedUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ balance: editBalance, role: editRole }),
      });

      if (!res.ok) throw new Error("Failed to update user");

      const data = await res.json();
      setMessage("User updated successfully");
      // refresh user list
      fetchAllUsers(token);
      handleCloseModal();
    } catch (error) {
      setMessage(error.message || "Update failed");
    }
  };

  const handleDeleteUserPrompt = async (user) => {
    const ok = window.confirm(`Delete user ${user.username}? This action cannot be undone.`);
    if (!ok) return;

    const token = localStorage.getItem("bank_admin_token");
    const API_URL = import.meta.env.VITE_API_URL || "https://capital-bank-api.onrender.com";

    try {
      const res = await fetch(`${API_URL}/api/admin/user/${user._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to delete user");

      setMessage("User deleted");
      fetchAllUsers(token);
    } catch (error) {
      setMessage(error.message || "Delete failed");
    }
  };

  const handleCreateUser = async () => {
    if (!newUsername || !newPassword) {
      setMessage("Username and password are required");
      return;
    }

    const token = localStorage.getItem("bank_admin_token");
    const API_URL = import.meta.env.VITE_API_URL || "https://capital-bank-api.onrender.com";

    try {
      const res = await fetch(`${API_URL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: newUsername, password: newPassword }),
      });

      if (!res.ok) throw new Error("Failed to create user");

      setMessage("User created successfully");
      setNewUsername("");
      setNewPassword("");
      setCreateUserOpen(false);
      fetchAllUsers(token);
    } catch (error) {
      setMessage(error.message || "Creation failed");
    }
  };

  const fetchAllUsers = async (token) => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || "https://capital-bank-api.onrender.com";
      const response = await fetch(
        `${API_URL}/api/admin/users`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          handleLogout();
          return;
        }

        throw new Error("Unable to load users");
      }

      const data = await response.json();
      setAllUsers(data.users || []);
    } catch (error) {
      setMessage(error.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllTransactions = async (token) => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || "https://capital-bank-api.onrender.com";
      const response = await fetch(
        `${API_URL}/api/transactions`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Unable to load transactions");
      }

      const data = await response.json();
      setAllTransactions(data || []);
    } catch (error) {
      setMessage(error.message || "Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("bank_admin_token");
    localStorage.removeItem("bank_admin_username");
    navigate("/admin/login");
  };

  const adminUsername = localStorage.getItem("bank_admin_username") || "Administrator";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#020617",
        color: "white",
        display: "flex",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          width: "280px",
          background: "#0f172a",
          borderRight: "1px solid #1e293b",
          padding: "30px 22px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div style={{ marginBottom: "40px" }}>
            <h2 style={{ margin: 0, fontSize: "24px" }}>Admin Portal</h2>
            <p style={{ color: "#94a3b8", marginTop: "8px" }}>Capital Community Bank</p>
          </div>

          <div style={{ display: "grid", gap: "10px" }}>
            {["overview", "customers", "transactions", "settings"].map((tab) => (
              <div
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: "14px 18px",
                  borderRadius: "14px",
                  background: activeTab === tab ? "linear-gradient(to right, #2563eb, #1d4ed8)" : "transparent",
                  color: "white",
                  cursor: "pointer",
                  fontSize: "15px",
                  transition: "all 0.2s",
                }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleLogout}
          style={{
            padding: "14px",
            borderRadius: "14px",
            border: "none",
            background: "#dc2626",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>

      <main style={{ flex: 1, padding: "34px", overflowY: "auto" }}>
        {activeTab === "overview" && (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: "18px",
                marginBottom: "32px",
              }}
            >
              <div>
                <h1 style={{ margin: 0 }}>Welcome back, {adminUsername}</h1>
                <p style={{ color: "#94a3b8", marginTop: "8px" }}>
                  Manage users, review transactions, and monitor bank activity.
                </p>
              </div>
              <div
                style={{
                  background: "#0f172a",
                  padding: "18px 24px",
                  borderRadius: "18px",
                  minWidth: "200px",
                  textAlign: "right",
                }}
              >
                <p style={{ color: "#94a3b8", margin: 0 }}>Total customers</p>
                <h2 style={{ marginTop: "10px" }}>{overview.totalUsers}</h2>
              </div>
            </div>

            {message && (
              <div
                style={{
                  marginBottom: "20px",
                  padding: "18px",
                  borderRadius: "16px",
                  background: "#7f1d1d",
                  color: "white",
                }}
              >
                {message}
              </div>
            )}

            <div style={{ display: "grid", gap: "22px" }}>
              <section
                style={{
                  background: "#0f172a",
                  borderRadius: "24px",
                  padding: "28px",
                  border: "1px solid #1e293b",
                }}
              >
                <h2 style={{ margin: "0 0 20px 0" }}>Key statistics</h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "18px" }}>
                  <div style={{ background: "#020617", padding: "18px", borderRadius: "18px" }}>
                    <p style={{ color: "#94a3b8", marginBottom: "10px" }}>Active users</p>
                    <h3 style={{ margin: 0 }}>{overview.totalUsers}</h3>
                  </div>
                  <div style={{ background: "#020617", padding: "18px", borderRadius: "18px" }}>
                    <p style={{ color: "#94a3b8", marginBottom: "10px" }}>Transactions</p>
                    <h3 style={{ margin: 0 }}>{overview.totalTransactions}</h3>
                  </div>
                  <div style={{ background: "#020617", padding: "18px", borderRadius: "18px" }}>
                    <p style={{ color: "#94a3b8", marginBottom: "10px" }}>Latest update</p>
                    <h3 style={{ margin: 0 }}>Real time</h3>
                  </div>
                </div>
              </section>

              <section
                style={{
                  display: "grid",
                  gap: "22px",
                  gridTemplateColumns: "2fr 3fr",
                }}
              >
                <div
                  style={{
                    background: "#0f172a",
                    borderRadius: "24px",
                    padding: "28px",
                    border: "1px solid #1e293b",
                  }}
                >
                  <h2 style={{ margin: "0 0 22px 0" }}>Latest customers</h2>
                  {loading ? (
                    <p>Loading customers…</p>
                  ) : overview.users.length === 0 ? (
                    <p style={{ color: "#94a3b8" }}>No customer records found.</p>
                  ) : (
                    <div style={{ display: "grid", gap: "14px" }}>
                      {overview.users.map((user) => (
                        <div
                          key={user._id}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "16px",
                            borderRadius: "14px",
                            background: "#020617",
                          }}
                        >
                          <div>
                            <p style={{ margin: 0, fontWeight: "bold" }}>{user.username}</p>
                            <p style={{ margin: 0, color: "#94a3b8", fontSize: "13px" }}>{user.role}</p>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <p style={{ margin: 0, fontWeight: "bold" }}>{formatMoney(user.balance)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div
                  style={{
                    background: "#0f172a",
                    borderRadius: "24px",
                    padding: "28px",
                    border: "1px solid #1e293b",
                  }}
                >
                  <h2 style={{ margin: "0 0 22px 0" }}>Recent transactions</h2>
                  {loading ? (
                    <p>Loading transactions…</p>
                  ) : overview.transactions.length === 0 ? (
                    <p style={{ color: "#94a3b8" }}>No transaction records found.</p>
                  ) : (
                    <div style={{ display: "grid", gap: "14px" }}>
                      {overview.transactions.map((transaction) => (
                        <div
                          key={transaction._id}
                          style={{
                            display: "grid",
                            gap: "6px",
                            padding: "16px",
                            borderRadius: "14px",
                            background: "#020617",
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}>
                            <p style={{ margin: 0, fontWeight: "bold" }}>{transaction.sender} → {transaction.recipient}</p>
                            <p style={{ margin: 0 }}>{formatMoney(transaction.amount)}</p>
                          </div>
                          <p style={{ margin: 0, color: "#94a3b8", fontSize: "13px" }}>
                            {transaction.bank} • {new Date(transaction.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </section>
            </div>
          </>
        )}

        {activeTab === "customers" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <div>
                <h1 style={{ margin: 0 }}>Customers</h1>
                <p style={{ color: "#94a3b8", marginTop: "4px" }}>Manage and view all customer accounts</p>
              </div>
              <button onClick={() => setCreateUserOpen(true)} style={{ padding: "12px 18px", borderRadius: "10px", background: "#10b981", color: "white", border: "none", cursor: "pointer", fontWeight: "bold" }}>+ Create User</button>
            </div>

            <div style={{ display: "flex", gap: "12px", marginBottom: "18px", alignItems: "center" }}>
              <input
                placeholder="Search by username or id"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ padding: "10px", borderRadius: "10px", border: "1px solid #334155", background: "#020617", color: "white", width: "320px" }}
              />

              <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)} style={{ padding: "10px", borderRadius: "10px", background: "#020617", color: "white", border: "1px solid #334155" }}>
                <option value="">All roles</option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>

              <button onClick={() => { const token = localStorage.getItem('bank_admin_token'); setLoading(true); fetchAllUsers(token); }} style={{ padding: "10px 14px", borderRadius: "10px", background: "#2563eb", color: "white", border: "none", cursor: "pointer" }}>
                Refresh
              </button>
            </div>

            {message && (
              <div
                style={{
                  marginBottom: "20px",
                  padding: "18px",
                  borderRadius: "16px",
                  background: "#7f1d1d",
                  color: "white",
                }}
              >
                {message}
              </div>
            )}

            <div
              style={{
                background: "#0f172a",
                borderRadius: "24px",
                padding: "18px",
                border: "1px solid #1e293b",
              }}
            >
              {loading ? (
                <p>Loading customers…</p>
              ) : filteredUsers(allUsers, searchQuery, filterRole).length === 0 ? (
                <p style={{ color: "#94a3b8" }}>No customers found.</p>
              ) : (
                <div style={{ display: "grid", gap: "12px" }}>
                  {filteredUsers(allUsers, searchQuery, filterRole).map((user) => (
                    <div
                      key={user._id}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "2fr 1fr 1fr 1fr 100px",
                        gap: "12px",
                        alignItems: "center",
                        padding: "12px",
                        borderRadius: "12px",
                        background: "#020617",
                      }}
                    >
                      <div>
                        <p style={{ margin: 0, fontWeight: "bold" }}>{user.username}</p>
                        <p style={{ margin: 0, color: "#94a3b8", fontSize: "13px" }}>ID: {user._id}</p>
                      </div>
                      <div>
                        <p style={{ margin: 0, color: "#94a3b8", fontSize: "12px" }}>Balance</p>
                        <p style={{ margin: 0, fontWeight: "bold" }}>{formatMoney(user.balance)}</p>
                      </div>
                      <div>
                        <p style={{ margin: 0, color: "#94a3b8", fontSize: "12px" }}>Role</p>
                        <p style={{ margin: 0, fontWeight: "bold", textTransform: "capitalize" }}>{user.role}</p>
                      </div>
                      <div>
                        <p style={{ margin: 0, color: "#94a3b8", fontSize: "12px" }}>Joined</p>
                        <p style={{ margin: 0, fontSize: "13px" }}>{new Date(user.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                        <button onClick={() => openUserModal(user)} style={{ padding: "8px 10px", borderRadius: "8px", background: "#10b981", color: "white", border: "none", cursor: "pointer" }}>Edit</button>
                        <button onClick={() => handleDeleteUserPrompt(user)} style={{ padding: "8px 10px", borderRadius: "8px", background: "#ef4444", color: "white", border: "none", cursor: "pointer" }}>Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {modalOpen && selectedUser && (
              <div style={{ position: "fixed", inset: 0, display: "flex", justifyContent: "center", alignItems: "center", background: "rgba(0,0,0,0.6)" }}>
                <div style={{ width: "600px", background: "#0f172a", padding: "20px", borderRadius: "16px", border: "1px solid #1e293b" }}>
                  <h2 style={{ margin: 0 }}>Edit User: {selectedUser.username}</h2>
                  <p style={{ color: "#94a3b8" }}>ID: {selectedUser._id}</p>

                  <label style={{ display: "block", marginTop: "12px", color: "#94a3b8" }}>Balance</label>
                  <input type="number" value={editBalance} onChange={(e) => setEditBalance(Number(e.target.value))} style={{ width: "100%", padding: "10px", borderRadius: "8px", background: "#020617", color: "white", border: "1px solid #334155" }} />

                  <label style={{ display: "block", marginTop: "12px", color: "#94a3b8" }}>Role</label>
                  <select value={editRole} onChange={(e) => setEditRole(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "8px", background: "#020617", color: "white", border: "1px solid #334155" }}>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>

                  <div style={{ display: "flex", gap: "10px", marginTop: "16px", justifyContent: "flex-end" }}>
                    <button onClick={handleCloseModal} style={{ padding: "10px 14px", borderRadius: "8px", background: "#64748b", color: "white", border: "none" }}>Cancel</button>
                    <button onClick={handleUpdateUser} style={{ padding: "10px 14px", borderRadius: "8px", background: "#2563eb", color: "white", border: "none" }}>Save</button>
                  </div>
                </div>
              </div>
            )}

            {createUserOpen && (
              <div style={{ position: "fixed", inset: 0, display: "flex", justifyContent: "center", alignItems: "center", background: "rgba(0,0,0,0.6)" }}>
                <div style={{ width: "600px", background: "#0f172a", padding: "20px", borderRadius: "16px", border: "1px solid #1e293b" }}>
                  <h2 style={{ margin: 0 }}>Create New User</h2>
                  <p style={{ color: "#94a3b8" }}>Add a new customer account</p>

                  <label style={{ display: "block", marginTop: "12px", color: "#94a3b8" }}>Username</label>
                  <input type="text" placeholder="Enter username" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "8px", background: "#020617", color: "white", border: "1px solid #334155" }} />

                  <label style={{ display: "block", marginTop: "12px", color: "#94a3b8" }}>Password</label>
                  <input type="password" placeholder="Enter password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "8px", background: "#020617", color: "white", border: "1px solid #334155" }} />

                  <div style={{ display: "flex", gap: "10px", marginTop: "16px", justifyContent: "flex-end" }}>
                    <button onClick={() => { setCreateUserOpen(false); setNewUsername(""); setNewPassword(""); }} style={{ padding: "10px 14px", borderRadius: "8px", background: "#64748b", color: "white", border: "none" }}>Cancel</button>
                    <button onClick={handleCreateUser} style={{ padding: "10px 14px", borderRadius: "8px", background: "#10b981", color: "white", border: "none" }}>Create</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "transactions" && (
          <div>
            <h1 style={{ margin: "0 0 8px 0" }}>Transactions</h1>
            <p style={{ color: "#94a3b8", marginBottom: "12px" }}>View all transaction history</p>

            <div style={{ display: "flex", gap: "12px", marginBottom: "18px", alignItems: "center" }}>
              <input
                placeholder="Search by sender, recipient, or bank"
                value={transactionSearch}
                onChange={(e) => setTransactionSearch(e.target.value)}
                style={{ padding: "10px", borderRadius: "10px", border: "1px solid #334155", background: "#020617", color: "white", width: "400px" }}
              />

              <select value={transactionFilter} onChange={(e) => setTransactionFilter(e.target.value)} style={{ padding: "10px", borderRadius: "10px", background: "#020617", color: "white", border: "1px solid #334155" }}>
                <option value="">All transactions</option>
                <option value="sender">Outgoing</option>
                <option value="recipient">Incoming</option>
              </select>
            </div>

            {message && (
              <div
                style={{
                  marginBottom: "20px",
                  padding: "18px",
                  borderRadius: "16px",
                  background: "#7f1d1d",
                  color: "white",
                }}
              >
                {message}
              </div>
            )}

            <div
              style={{
                background: "#0f172a",
                borderRadius: "24px",
                padding: "18px",
                border: "1px solid #1e293b",
              }}
            >
              {loading ? (
                <p>Loading transactions…</p>
              ) : filteredTransactions(allTransactions, transactionSearch, transactionFilter).length === 0 ? (
                <p style={{ color: "#94a3b8" }}>No transactions found.</p>
              ) : (
                <div style={{ display: "grid", gap: "12px" }}>
                  {filteredTransactions(allTransactions, transactionSearch, transactionFilter).map((transaction) => (
                    <div
                      key={transaction._id}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1.5fr 1.5fr 1fr 1fr 1fr",
                        gap: "16px",
                        alignItems: "center",
                        padding: "16px",
                        borderRadius: "14px",
                        background: "#020617",
                      }}
                    >
                      <div>
                        <p style={{ margin: 0, color: "#94a3b8", fontSize: "12px" }}>From</p>
                        <p style={{ margin: 0, fontWeight: "bold" }}>{transaction.sender}</p>
                      </div>
                      <div>
                        <p style={{ margin: 0, color: "#94a3b8", fontSize: "12px" }}>To</p>
                        <p style={{ margin: 0, fontWeight: "bold" }}>{transaction.recipient}</p>
                      </div>
                      <div>
                        <p style={{ margin: 0, color: "#94a3b8", fontSize: "12px" }}>Amount</p>
                        <p style={{ margin: 0, fontWeight: "bold" }}>{formatMoney(transaction.amount)}</p>
                      </div>
                      <div>
                        <p style={{ margin: 0, color: "#94a3b8", fontSize: "12px" }}>Bank</p>
                        <p style={{ margin: 0, fontSize: "13px" }}>{transaction.bank}</p>
                      </div>
                      <div>
                        <p style={{ margin: 0, color: "#94a3b8", fontSize: "12px" }}>Date</p>
                        <p style={{ margin: 0, fontSize: "13px" }}>{new Date(transaction.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div>
            <h1 style={{ margin: "0 0 8px 0" }}>Settings</h1>
            <p style={{ color: "#94a3b8", marginBottom: "24px" }}>Configure admin preferences</p>

            <div
              style={{
                background: "#0f172a",
                borderRadius: "24px",
                padding: "28px",
                border: "1px solid #1e293b",
                maxWidth: "600px",
              }}
            >
              <div style={{ marginBottom: "24px" }}>
                <h3 style={{ margin: "0 0 12px 0" }}>Admin Account</h3>
                <div
                  style={{
                    background: "#020617",
                    padding: "16px",
                    borderRadius: "14px",
                    marginBottom: "12px",
                  }}
                >
                  <p style={{ margin: 0, color: "#94a3b8", fontSize: "12px" }}>Username</p>
                  <p style={{ margin: "8px 0 0 0", fontWeight: "bold" }}>{adminUsername}</p>
                </div>
              </div>

              <div style={{ marginBottom: "24px" }}>
                <h3 style={{ margin: "0 0 12px 0" }}>System Information</h3>
                <div
                  style={{
                    background: "#020617",
                    padding: "16px",
                    borderRadius: "14px",
                    marginBottom: "12px",
                  }}
                >
                  <p style={{ margin: 0, color: "#94a3b8", fontSize: "12px" }}>API Endpoint</p>
                  <p style={{ margin: "8px 0 0 0", fontSize: "13px", wordBreak: "break-all" }}>
                    {import.meta.env.VITE_API_URL || "https://capital-bank-api.onrender.com"}
                  </p>
                </div>
              </div>

              <div style={{ marginBottom: "24px" }}>
                <h3 style={{ margin: "0 0 12px 0" }}>Help & Support</h3>
                <p style={{ color: "#94a3b8", margin: "0 0 12px 0" }}>
                  For assistance, contact your system administrator or visit the documentation.
                </p>
              </div>

              <button
                onClick={handleLogout}
                style={{
                  padding: "14px 24px",
                  borderRadius: "14px",
                  border: "none",
                  background: "#dc2626",
                  color: "white",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
