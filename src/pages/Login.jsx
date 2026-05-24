import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

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

        navigate("/dashboard");
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
        background:
          "linear-gradient(to right, #0f172a, #1e3a8a, #0f172a)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Arial",
        padding: "20px",
      }}
    >
      <div
        style={{
          display: "flex",
          width: "950px",
          background: "#111827",
          borderRadius: "20px",
          overflow: "hidden",
          boxShadow: "0 0 40px rgba(0,0,0,0.5)",
        }}
      >
        {/* LEFT SIDE */}
        <div
          style={{
            flex: 1,
            background:
              "linear-gradient(to bottom right, #2563eb, #1d4ed8)",
            color: "white",
            padding: "60px 40px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <h1
            style={{
              fontSize: "42px",
              marginBottom: "20px",
            }}
          >
            Capital Community Bank
          </h1>

          <p
            style={{
              fontSize: "18px",
              lineHeight: "1.7",
              opacity: 0.9,
            }}
          >
            Secure digital banking with premium financial services,
            international transfers, investment management, and
            enterprise-grade account protection.
          </p>

          <div
            style={{
              marginTop: "40px",
              padding: "20px",
              background: "rgba(255,255,255,0.1)",
              borderRadius: "12px",
            }}
          >
            <h3>Trusted Online Banking</h3>

            <p style={{ marginTop: "10px" }}>
              ✔ Secure Transactions
            </p>

            <p>✔ 24/7 Account Access</p>

            <p>✔ Global Banking Support</p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div
          style={{
            flex: 1,
            background: "#111827",
            padding: "60px 40px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <h2
            style={{
              color: "white",
              fontSize: "32px",
              marginBottom: "10px",
            }}
          >
            Welcome Back
          </h2>

          <p
            style={{
              color: "#9ca3af",
              marginBottom: "35px",
            }}
          >
            Sign in to access your account dashboard
          </p>

          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                width: "100%",
                padding: "15px",
                marginBottom: "20px",
                borderRadius: "10px",
                border: "1px solid #374151",
                background: "#1f2937",
                color: "white",
                fontSize: "16px",
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
                marginBottom: "20px",
                borderRadius: "10px",
                border: "1px solid #374151",
                background: "#1f2937",
                color: "white",
                fontSize: "16px",
              }}
            />

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "15px",
                background:
                  "linear-gradient(to right, #2563eb, #1d4ed8)",
                color: "white",
                border: "none",
                borderRadius: "10px",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              {loading ? "Signing In..." : "Secure Login"}
            </button>

            {message && (
              <p
                style={{
                  color: "#f87171",
                  marginTop: "20px",
                  textAlign: "center",
                }}
              >
                {message}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}