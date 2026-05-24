import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Dashboard() {
  const navigate = useNavigate();
  const username = localStorage.getItem("bank_username");
  const balance = localStorage.getItem("bank_balance");
  useEffect(() => {
  const token = localStorage.getItem("bank_token");

  if (!token) {
    navigate("/");
  }
}, []);
  useEffect(() => {
  const token = localStorage.getItem("bank_token");

  if (!token) {
    navigate("/");
  }
}, []);

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
        {/* TOP BAR */}
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

        {/* BALANCE CARDS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "22px",
            marginBottom: "35px",
          }}
        >
          {/* MAIN BALANCE */}
          <div
            style={{
              background:
                "linear-gradient(to right, #2563eb, #1d4ed8)",
              padding: "30px",
              borderRadius: "22px",
              color: "white",
              boxShadow: "0 20px 40px rgba(37,99,235,0.25)",
            }}
          >
            <p
              style={{
                opacity: 0.9,
                marginBottom: "15px",
              }}
            >
              Total Balance
            </p>

            <h2
              style={{
                fontSize: "38px",
                marginBottom: "25px",
              }}
            >
              ${Number(balance).toLocaleString()}
            </h2>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                opacity: 0.9,
              }}
            >
              <span>**** 9034</span>

              <span>VISA</span>
            </div>
          </div>

          {/* SAVINGS */}
          <div
            style={{
              background: "#0f172a",
              padding: "30px",
              borderRadius: "22px",
              border: "1px solid #1e293b",
              color: "white",
            }}
          >
            <p
              style={{
                color: "#94a3b8",
                marginBottom: "12px",
              }}
            >
              Savings Account
            </p>

            <h2>$80,500.00</h2>

            <p
              style={{
                marginTop: "20px",
                color: "#22c55e",
              }}
            >
              +4.5% this month
            </p>
          </div>

          {/* INVESTMENTS */}
          <div
            style={{
              background: "#0f172a",
              padding: "30px",
              borderRadius: "22px",
              border: "1px solid #1e293b",
              color: "white",
            }}
          >
            <p
              style={{
                color: "#94a3b8",
                marginBottom: "12px",
              }}
            >
              Investments
            </p>

            <h2>$120,300.00</h2>

            <p
              style={{
                marginTop: "20px",
                color: "#3b82f6",
              }}
            >
              Portfolio Growth Active
            </p>
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div
          style={{
            marginBottom: "35px",
          }}
        >
          <h2
            style={{
              color: "white",
              marginBottom: "20px",
            }}
          >
            Quick Actions
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "20px",
            }}
          >
            <div
  onClick={() => navigate("/transfer")}
  style={{
    background: "#0f172a",
    border: "1px solid #1e293b",
    borderRadius: "18px",
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
      fontSize: "14px",
    }}
  >
    Send money securely
  </p>
</div>

<div
  style={{
    background: "#0f172a",
    border: "1px solid #1e293b",
    borderRadius: "18px",
    padding: "25px",
    color: "white",
  }}
>
  <h3>Pay Bills</h3>

  <p
    style={{
      marginTop: "10px",
      color: "#94a3b8",
      fontSize: "14px",
    }}
  >
    Manage utility payments
  </p>
</div>

<div
  style={{
    background: "#0f172a",
    border: "1px solid #1e293b",
    borderRadius: "18px",
    padding: "25px",
    color: "white",
  }}
>
  <h3>Deposit Check</h3>

  <p
    style={{
      marginTop: "10px",
      color: "#94a3b8",
      fontSize: "14px",
    }}
  >
    Deposit checks digitally
  </p>
</div>

<div
  style={{
    background: "#0f172a",
    border: "1px solid #1e293b",
    borderRadius: "18px",
    padding: "25px",
    color: "white",
  }}
>
  <h3>View Cards</h3>

  <p
    style={{
      marginTop: "10px",
      color: "#94a3b8",
      fontSize: "14px",
    }}
  >
    Manage debit and credit cards
  </p>
</div>
          </div>
        </div>

        {/* TRANSACTIONS */}
        <div
          style={{
            background: "#0f172a",
            borderRadius: "22px",
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
            <h2 style={{ color: "white" }}>
              Recent Transactions
            </h2>

            <p style={{ color: "#3b82f6", cursor: "pointer" }}>
              View All
            </p>
          </div>

          {[
            {
              name: "Amazon Purchase",
              amount: "-$240.00",
              status: "Completed",
            },
            {
              name: "Salary Deposit",
              amount: "+$8,500.00",
              status: "Completed",
            },
            {
              name: "Wire Transfer",
              amount: "-$1,200.00",
              status: "Pending",
            },
          ].map((tx, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "18px 0",
                borderBottom:
                  index !== 2
                    ? "1px solid #1e293b"
                    : "none",
              }}
            >
              <div>
                <h4
                  style={{
                    color: "white",
                    marginBottom: "6px",
                  }}
                >
                  {tx.name}
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
                  color:
                    tx.amount.includes("+")
                      ? "#22c55e"
                      : "#f87171",
                }}
              >
                {tx.amount}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}