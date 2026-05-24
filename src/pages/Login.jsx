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
        localStorage.setItem("bank_username", data.username);
        localStorage.setItem("bank_balance", data.balance);

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
          "linear-gradient(135deg, #020617, #0f172a, #1e3a8a)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "30px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          width: "1100px",
          minHeight: "650px",
          background: "#0f172a",
          borderRadius: "28px",
          overflow: "hidden",
          display: "flex",
          boxShadow: "0 0 60px rgba(0,0,0,0.55)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {/* LEFT SIDE */}
        <div
          style={{
            flex: 1,
            background:
              "linear-gradient(to bottom right, #2563eb, #1d4ed8, #1e40af)",
            padding: "70px 60px",
            color: "white",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            position: "relative",
          }}
        >
          <div>
            {/* LOGO */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "15px",
                marginBottom: "50px",
              }}
            >
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "16px",
                  background: "rgba(255,255,255,0.15)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: "28px",
                  fontWeight: "bold",
                  backdropFilter: "blur(10px)",
                }}
              >
                C
              </div>

              <div>
                <h1
                  style={{
                    margin: 0,
                    fontSize: "30px",
                    fontWeight: "bold",
                  }}
                >
                  Capital Community
                </h1>

                <p
                  style={{
                    marginTop: "5px",
                    opacity: 0.85,
                  }}
                >
                  Premium Digital Banking
                </p>
              </div>
            </div>

            <h2
              style={{
                fontSize: "52px",
                lineHeight: "1.2",
                marginBottom: "25px",
              }}
            >
              Secure Banking <br />
              Built For The Future
            </h2>

            <p
              style={{
                fontSize: "18px",
                lineHeight: "1.8",
                opacity: 0.92,
                maxWidth: "480px",
              }}
            >
              Manage transfers, monitor accounts, access secure
              banking tools, and experience enterprise-grade
              financial security from anywhere in the world.
            </p>
          </div>

          {/* FEATURE CARDS */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "18px",
              marginTop: "40px",
            }}
          >
            <div
              style={{
                background: "rgba(255,255,255,0.1)",
                padding: "20px",
                borderRadius: "18px",
                backdropFilter: "blur(10px)",
              }}
            >
              <h3 style={{ marginBottom: "10px" }}>
                🔒 Secure Access
              </h3>

              <p style={{ opacity: 0.9 }}>
                Protected multi-layer banking authentication.
              </p>
            </div>

            <div
              style={{
                background: "rgba(255,255,255,0.1)",
                padding: "20px",
                borderRadius: "18px",
                backdropFilter: "blur(10px)",
              }}
            >
              <h3 style={{ marginBottom: "10px" }}>
                🌍 Global Transfers
              </h3>

              <p style={{ opacity: 0.9 }}>
                Fast international payment processing.
              </p>
            </div>

            <div
              style={{
                background: "rgba(255,255,255,0.1)",
                padding: "20px",
                borderRadius: "18px",
                backdropFilter: "blur(10px)",
              }}
            >
              <h3 style={{ marginBottom: "10px" }}>
                📈 Investments
              </h3>

              <p style={{ opacity: 0.9 }}>
                Monitor portfolios and financial growth.
              </p>
            </div>

            <div
              style={{
                background: "rgba(255,255,255,0.1)",
                padding: "20px",
                borderRadius: "18px",
                backdropFilter: "blur(10px)",
              }}
            >
              <h3 style={{ marginBottom: "10px" }}>
                ⚡ Real-Time Banking
              </h3>

              <p style={{ opacity: 0.9 }}>
                Instant balance and account updates.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div
          style={{
            flex: 1,
            background: "#020617",
            padding: "70px 60px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              marginBottom: "40px",
            }}
          >
            <h2
              style={{
                color: "white",
                fontSize: "42px",
                marginBottom: "10px",
              }}
            >
              Welcome Back
            </h2>

            <p
              style={{
                color: "#94a3b8",
                fontSize: "17px",
              }}
            >
              Sign in securely to your banking account
            </p>
          </div>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: "22px" }}>
              <label
                style={{
                  color: "#cbd5e1",
                  display: "block",
                  marginBottom: "10px",
                  fontSize: "15px",
                }}
              >
                Username
              </label>

              <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{
                  width: "100%",
                  padding: "16px",
                  borderRadius: "14px",
                  border: "1px solid #1e293b",
                  background: "#0f172a",
                  color: "white",
                  fontSize: "16px",
                  outline: "none",
                }}
              />
            </div>

            <div style={{ marginBottom: "28px" }}>
              <label
                style={{
                  color: "#cbd5e1",
                  display: "block",
                  marginBottom: "10px",
                  fontSize: "15px",
                }}
              >
                Password
              </label>

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: "100%",
                  padding: "16px",
                  borderRadius: "14px",
                  border: "1px solid #1e293b",
                  background: "#0f172a",
                  color: "white",
                  fontSize: "16px",
                  outline: "none",
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "17px",
                borderRadius: "14px",
                border: "none",
                background:
                  "linear-gradient(to right, #2563eb, #3b82f6)",
                color: "white",
                fontSize: "17px",
                fontWeight: "bold",
                cursor: "pointer",
                boxShadow: "0 10px 25px rgba(37,99,235,0.4)",
              }}
            >
              {loading ? "Signing In..." : "Access Secure Banking"}
            </button>

            {message && (
              <p
                style={{
                  marginTop: "20px",
                  color: "#f87171",
                  textAlign: "center",
                }}
              >
                {message}
              </p>
            )}
          </form>

          <div
            style={{
              marginTop: "35px",
              textAlign: "center",
              color: "#64748b",
              fontSize: "14px",
            }}
          >
            Protected by enterprise-grade banking encryption
          </div>
        </div>
      </div>
    </div>
  );
}