import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function formatMoney(value) {
  return `$${Number(value).toLocaleString()}`;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [overview, setOverview] = useState({
    totalUsers: 0,
    totalTransactions: 0,
    users: [],
    transactions: [],
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("bank_admin_token");
    if (!token) {
      navigate("/admin/login");
      return;
    }

    fetchOverview(token);
  }, []);

  const fetchOverview = async (token) => {
    try {
      const response = await fetch(
        "https://capital-bank-api.onrender.com/api/admin/overview",
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
            {["Overview", "Customers", "Transactions", "Settings"].map((item) => (
              <div
                key={item}
                style={{
                  padding: "14px 18px",
                  borderRadius: "14px",
                  background: item === "Overview" ? "linear-gradient(to right, #2563eb, #1d4ed8)" : "transparent",
                  color: "white",
                  cursor: "default",
                  fontSize: "15px",
                }}
              >
                {item}
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
      </main>
    </div>
  );
}
