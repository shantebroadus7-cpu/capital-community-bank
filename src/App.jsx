import { useState } from "react";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);

    try {
      const response = await fetch(
        "https://capital-bank-api.onrender.com/api/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("bank_token", data.token);
        setLoggedIn(true);
      } else {
        setMessage(data.message || "Invalid login credentials");
      }
    } catch (error) {
      setMessage("Unable to connect to secure banking server");
    } finally {
      setLoading(false);
    }
  };

  if (loggedIn) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#0b1120",
          color: "white",
          fontFamily: "Arial, sans-serif",
          padding: "40px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "40px",
            borderBottom: "1px solid #1e293b",
            paddingBottom: "20px",
          }}
        >
          <div>
            <h1 style={{ margin: 0 }}>Capital Community Bank</h1>
            <p style={{ color: "#94a3b8" }}>
              Welcome back, John Doe
            </p>
          </div>

          <button
            onClick={() => {
              localStorage.removeItem("bank_token");
              window.location.reload();
            }}
            style={{
              background: "#dc2626",
              color: "white",
              border: "none",
              padding: "12px 20px",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "20px",
          }}
        >
          <div
            style={{
              background: "#111827",
              padding: "25px",
              borderRadius: "16px",
            }}
          >
            <p style={{ color: "#94a3b8" }}>Available Balance</p>
            <h1>$250,000.00</h1>
          </div>

          <div
            style={{
              background: "#111827",
              padding: "25px",
              borderRadius: "16px",
            }}
          >
            <p style={{ color: "#94a3b8" }}>Account Number</p>
            <h2>4589201345</h2>
          </div>

          <div
            style={{
              background: "#111827",
              padding: "25px",
              borderRadius: "16px",
            }}
          >
            <p style={{ color: "#94a3b8" }}>Routing Number</p>
            <h2>021000021</h2>
          </div>
        </div>

        <div
          style={{
            background: "#111827",
            marginTop: "30px",
            borderRadius: "16px",
            padding: "25px",
          }}
        >
          <h2>Recent Transactions</h2>

          <table
            style={{
              width: "100%",
              marginTop: "20px",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr style={{ color: "#94a3b8", textAlign: "left" }}>
                <th style={{ paddingBottom: "15px" }}>Date</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td style={{ padding: "15px 0" }}>May 22, 2026</td>
                <td>Wire Transfer Deposit</td>
                <td style={{ color: "#22c55e" }}>+$15,000.00</td>
                <td>Completed</td>
              </tr>

              <tr>
                <td style={{ padding: "15px 0" }}>May 20, 2026</td>
                <td>ATM Withdrawal</td>
                <td style={{ color: "#ef4444" }}>-$500.00</td>
                <td>Completed</td>
              </tr>

              <tr>
                <td style={{ padding: "15px 0" }}>May 18, 2026</td>
                <td>Online Transfer</td>
                <td style={{ color: "#ef4444" }}>-$2,300.00</td>
                <td>Pending</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(to bottom right, #020617, #0f172a)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          width: "400px",
          background: "#111827",
          borderRadius: "20px",
          padding: "40px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <h1 style={{ color: "white", marginBottom: "10px" }}>
            Capital Community Bank
          </h1>

          <p style={{ color: "#94a3b8" }}>
            Secure Online Banking Portal
          </p>
        </div>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            width: "100%",
            padding: "14px",
            marginBottom: "20px",
            borderRadius: "10px",
            border: "1px solid #334155",
            background: "#1e293b",
            color: "white",
            fontSize: "15px",
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: "14px",
            marginBottom: "20px",
            borderRadius: "10px",
            border: "1px solid #334155",
            background: "#1e293b",
            color: "white",
            fontSize: "15px",
          }}
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "10px",
            border: "none",
            background: "#2563eb",
            color: "white",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          {loading ? "Authenticating..." : "Sign In Securely"}
        </button>

        {message && (
          <p
            style={{
              color: "#ef4444",
              marginTop: "20px",
              textAlign: "center",
            }}
          >
            {message}
          </p>
        )}

        <div
          style={{
            marginTop: "25px",
            textAlign: "center",
            color: "#64748b",
            fontSize: "13px",
          }}
        >
          Protected by encrypted banking security
        </div>
      </div>
    </div>
  );
}

export default App;