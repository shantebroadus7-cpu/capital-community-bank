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
        setMessage("Login successful");
        setLoggedIn(true);
      } else {
        setMessage(data.message || "Login failed");
      }
    } catch (error) {
      setMessage("Server connection error");
    } finally {
      setLoading(false);
    }
  };

  if (loggedIn) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#0f172a",
          color: "white",
          padding: "40px",
          fontFamily: "Arial",
        }}
      >
        <h1>Capital Community Bank Dashboard</h1>

        <div
          style={{
            background: "#1e293b",
            padding: "20px",
            borderRadius: "12px",
            marginTop: "20px",
            maxWidth: "500px",
          }}
        >
          <h2>Available Balance</h2>
          <h1>$250,000.00</h1>
        </div>

        <div
          style={{
            background: "#1e293b",
            padding: "20px",
            borderRadius: "12px",
            marginTop: "20px",
            maxWidth: "500px",
          }}
        >
          <h2>Account Details</h2>
          <p>Account Name: John Doe</p>
          <p>Account Number: 4589201345</p>
          <p>Status: Active</p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#020617",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Arial",
      }}
    >
      <div
        style={{
          background: "#111827",
          padding: "40px",
          borderRadius: "15px",
          width: "350px",
          color: "white",
          boxShadow: "0 0 20px rgba(0,0,0,0.4)",
        }}
      >
        <h1 style={{ textAlign: "center", marginBottom: "30px" }}>
          Capital Community Bank
        </h1>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "15px",
            borderRadius: "8px",
            border: "none",
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "20px",
            borderRadius: "8px",
            border: "none",
          }}
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "8px",
            border: "none",
            background: "#2563eb",
            color: "white",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          {loading ? "Signing In..." : "Sign In Securely"}
        </button>

        <p style={{ marginTop: "15px", textAlign: "center" }}>
          {message}
        </p>
      </div>
    </div>
  );
}

export default App;