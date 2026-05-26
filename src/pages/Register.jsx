import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {

  const navigate = useNavigate();

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleRegister = async (e) => {

    e.preventDefault();

    setLoading(true);

    setMessage("");

    try {

      const response = await fetch(
        "https://capital-bank-api.onrender.com/api/register",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            username,
            password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {

        setMessage(
          "Account created successfully"
        );

        setTimeout(() => {

          navigate("/");

        }, 1500);

      } else {

        setMessage(data.message);

      }

    } catch (error) {

      setMessage("Server connection failed");

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
        fontFamily: "Arial",
      }}
    >

      <form
        onSubmit={handleRegister}
        style={{
          background: "#0f172a",
          padding: "40px",
          width: "420px",
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
          Open New Account
        </h1>

        <p
          style={{
            color: "#94a3b8",
            marginBottom: "30px",
          }}
        >
          Secure digital banking registration
        </p>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) =>
            setUsername(e.target.value)
          }
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
          onChange={(e) =>
            setPassword(e.target.value)
          }
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
            background:
              "linear-gradient(to right, #2563eb, #1d4ed8)",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          {loading
            ? "Creating Account..."
            : "Create Account"}
        </button>

        <p
          style={{
            color: "#94a3b8",
            marginTop: "20px",
          }}
        >
          {message}
        </p>

      </form>

    </div>

  );

}