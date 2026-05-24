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
        backgroundColor: "#0f172a",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <form
        onSubmit={handleLogin}
        style={{
          background: "#1e293b",
          padding: "40px",
          borderRadius: "12px",
          width: "350px",
        }}
      >
        <h1 style={{ color: "white", textAlign: "center" }}>
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
            marginTop: "20px",
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
            marginTop: "15px",
          }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "20px",
            backgroundColor: "#2563eb",
            color: "white",
            border: "none",
          }}
        >
          {loading ? "Signing In..." : "Login"}
        </button>

        <p style={{ color: "white", marginTop: "15px" }}>
          {message}
        </p>
      </form>
    </div>
  );
}