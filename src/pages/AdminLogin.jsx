import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    const API_URL = import.meta.env.VITE_API_URL || "https://capital-bank-api.onrender.com";

    try {
      const response = await fetch(
        `${API_URL}/api/login`,
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
        if (data.role !== "admin") {
          setMessage("Only admin users may sign in here.");
          return;
        }

        localStorage.setItem("bank_admin_token", data.token);
        localStorage.setItem("bank_admin_username", data.username);

        navigate("/admin/dashboard");
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
    <div
      style={{
        minHeight: "100vh",
        background: "#020617",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Arial, sans-serif",
        padding: "20px",
      }}
    >
      <form
        onSubmit={handleLogin}
        style={{
          width: "420px",
          background: "#0f172a",
          padding: "40px",
          borderRadius: "24px",
          border: "1px solid #1e293b",
        }}
      >
        <h1
          style={{
            color: "white",
            marginBottom: "10px",
          }}
        >
          Admin Portal Sign In
        </h1>

        <p
          style={{
            color: "#94a3b8",
            marginBottom: "30px",
          }}
        >
          Access bank operations, customer insights, and transaction monitoring.
        </p>

        <input
          type="text"
          placeholder="Admin Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            width: "100%",
            padding: "15px",
            marginBottom: "18px",
            borderRadius: "12px",
            border: "1px solid #334155",
            background: "#020617",
            color: "white",
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: "15px",
            marginBottom: "22px",
            borderRadius: "12px",
            border: "1px solid #334155",
            background: "#020617",
            color: "white",
          }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "15px",
            borderRadius: "12px",
            border: "none",
            background: "linear-gradient(to right, #2563eb, #1d4ed8)",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>

        <p
          style={{
            color: "#94a3b8",
            marginTop: "20px",
            minHeight: "24px",
          }}
        >
          {message}
        </p>

        <p style={{ color: "#94a3b8", fontSize: "14px", marginTop: "10px" }}>
          Need the customer portal? <a href="/" style={{ color: "#60a5fa" }}>Go to login</a>
        </p>
      </form>
    </div>
  );
}
