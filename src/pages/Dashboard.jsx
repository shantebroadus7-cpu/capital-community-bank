import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Dashboard() {

  const navigate = useNavigate();

  const [transactions, setTransactions] =
    useState([]);

  const username =
    localStorage.getItem("bank_username");

  const balance =
    Number(
      localStorage.getItem("bank_balance")
    ) || 250000;

  useEffect(() => {

    const token =
      localStorage.getItem("bank_token");

    if (!token) {
      navigate("/");
    }

    fetchTransactions();

  }, []);

  const fetchTransactions = async () => {

    try {

      const API_URL = import.meta.env.VITE_API_URL || "https://capital-bank-api.onrender.com";
      const response = await fetch(
        `${API_URL}/api/transactions`
      setTransactions(data);

    } catch (error) {

      console.log(error);

    }

  };

  const logout = () => {

    localStorage.removeItem("bank_token");

    navigate("/");

  };

  return (

    <div
      style={{
        minHeight: "100vh",
        background: "#020617",
        display: "flex",
        fontFamily: "Arial, sans-serif",
      }}
    >

      {/* SIDEBAR */}

      <div
        style={{
          width: "260px",
          background: "#0f172a",
          padding: "30px 20px",
          borderRight: "1px solid #1e293b",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >

        <div>

          {/* LOGO */}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "50px",
            }}
          >

            <div
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "14px",
                background:
                  "linear-gradient(to right, #2563eb, #3b82f6)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "white",
                fontWeight: "bold",
                fontSize: "22px",
              }}
            >
              C
            </div>

            <div>

              <h2
                style={{
                  color: "white",
                  margin: 0,
                  fontSize: "20px",
                }}
              >
                Capital Community
              </h2>

              <p
                style={{
                  color: "#94a3b8",
                  marginTop: "4px",
                  fontSize: "13px",
                }}
              >
                Digital Banking
              </p>

            </div>

          </div>

          {/* MENU */}

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >

            {[
              "Dashboard",
              "Accounts",
              "Transfers",
              "Transactions",
              "Cards",
              "Investments",
              "Support",
            ].map((item) => (

              <div
                key={item}
                style={{
                  padding: "15px",
                  borderRadius: "12px",
                  background:
                    item === "Dashboard"
                      ? "linear-gradient(to right, #2563eb, #1d4ed8)"
                      : "transparent",
                  color: "white",
                  cursor: "pointer",
                  fontSize: "15px",
                }}
              >
                {item}
              </div>

            ))}

          </div>

        </div>

        {/* LOGOUT */}

        <button
          onClick={logout}
          style={{
            padding: "15px",
            borderRadius: "12px",
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

      {/* MAIN CONTENT */}

      <div
        style={{
          flex: 1,
          padding: "35px",
          overflowY: "auto",
        }}
      >

        {/* HEADER */}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "35px",
          }}
        >

          <div>

            <h1
              style={{
                color: "white",
                marginBottom: "8px",
              }}
            >
              Welcome Back, {username} 👋
            </h1>

            <p
              style={{
                color: "#94a3b8",
              }}
            >
              Manage your finances securely
            </p>

          </div>

          <div
            style={{
              background: "#0f172a",
              padding: "14px 20px",
              borderRadius: "14px",
              color: "white",
              border: "1px solid #1e293b",
            }}
          >
            Premium Account
          </div>

        </div>

        {/* BALANCE */}

        <div
          style={{
            background:
              "linear-gradient(to right, #2563eb, #1d4ed8)",
            padding: "35px",
            borderRadius: "24px",
            color: "white",
            marginBottom: "35px",
          }}
        >

          <p
            style={{
              opacity: 0.9,
              marginBottom: "15px",
            }}
          >
            Available Balance
          </p>

          <h2
            style={{
              fontSize: "42px",
              marginBottom: "20px",
            }}
          >
            ${balance.toLocaleString()}
          </h2>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span>**** 9034</span>

            <span>VISA SIGNATURE</span>
          </div>

        </div>

        {/* ACTIONS */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "20px",
            marginBottom: "35px",
          }}
        >

          <div
            onClick={() => navigate("/transfer")}
            style={{
              background: "#0f172a",
              border: "1px solid #1e293b",
              borderRadius: "20px",
              padding: "25px",
              color: "white",
              cursor: "pointer",
            }}
          >
            <h3>Transfer Funds</h3>

            <p
              style={{
                marginTop: "10px",
                color: "#94a3b8",
              }}
            >
              Send money securely
            </p>

          </div>

          <div
            style={{
              background: "#0f172a",
              border: "1px solid #1e293b",
              borderRadius: "20px",
              padding: "25px",
              color: "white",
            }}
          >
            <h3>Manage Cards</h3>

            <p
              style={{
                marginTop: "10px",
                color: "#94a3b8",
              }}
            >
              Freeze and monitor cards
            </p>

          </div>

        </div>

        {/* TRANSACTIONS */}

        <div
          style={{
            background: "#0f172a",
            borderRadius: "24px",
            padding: "30px",
            border: "1px solid #1e293b",
          }}
        >

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "25px",
            }}
          >

            <h2
              style={{
                color: "white",
              }}
            >
              Recent Transactions
            </h2>

            <p
              style={{
                color: "#3b82f6",
              }}
            >
              View All
            </p>

          </div>

          {transactions.length === 0 ? (

            <p
              style={{
                color: "#94a3b8",
              }}
            >
              No transactions yet
            </p>

          ) : (

            transactions.map((tx, index) => (

              <div
                key={index}
                onClick={() =>
                  navigate("/receipt", {
                    state: tx,
                  })
                }
                style={{
                  background: "#020617",
                  border: "1px solid #1e293b",
                  borderRadius: "18px",
                  padding: "20px",
                  marginBottom: "15px",
                  cursor: "pointer",
                }}
              >

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >

                  <div>

                    <h4
                      style={{
                        color: "white",
                        marginBottom: "8px",
                      }}
                    >
                      {tx.recipient}
                    </h4>

                    <p
                      style={{
                        color: "#94a3b8",
                        fontSize: "14px",
                      }}
                    >
                      {tx.status}
                    </p>

                  </div>

                  <h3
                    style={{
                      color: "#ef4444",
                    }}
                  >
                    -${Number(tx.amount).toLocaleString()}
                  </h3>

                </div>

              </div>

            ))

          )}

        </div>

      </div>

    </div>

  );

}