import { useLocation, useNavigate } from "react-router-dom";

export default function Receipt() {

  const location = useLocation();

  const navigate = useNavigate();

  const data = location.state;

  if (!data) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#020617",
          color: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "Arial",
          flexDirection: "column",
        }}
      >
        <h1>No Receipt Data Found</h1>

        <button
          onClick={() => navigate("/dashboard")}
          style={{
            marginTop: "20px",
            padding: "14px 20px",
            border: "none",
            borderRadius: "12px",
            background: "#2563eb",
            color: "white",
            cursor: "pointer",
          }}
        >
          Back To Dashboard
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(to bottom right, #020617, #0f172a)",
        padding: "40px",
        fontFamily: "Arial",
      }}
    >

      <div
        style={{
          maxWidth: "700px",
          margin: "0 auto",
          background: "#0f172a",
          borderRadius: "24px",
          padding: "40px",
          border: "1px solid #1e293b",
        }}
      >

        <h1
          style={{
            color: "white",
            marginBottom: "30px",
          }}
        >
          Transfer Receipt
        </h1>

        <ReceiptItem
          label="Recipient"
          value={data.recipient}
        />

        <ReceiptItem
          label="Bank"
          value={data.bank}
        />

        <ReceiptItem
          label="Account Number"
          value={data.accountNumber}
        />

        <ReceiptItem
          label="Routing Number"
          value={data.routingNumber}
        />

        <ReceiptItem
          label="Amount"
          value={`$${Number(data.amount).toLocaleString()}`}
        />

        <button
          onClick={() => navigate("/dashboard")}
          style={{
            marginTop: "30px",
            width: "100%",
            padding: "16px",
            border: "none",
            borderRadius: "14px",
            background: "#2563eb",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Back To Dashboard
        </button>

      </div>

    </div>
  );
}

function ReceiptItem({ label, value }) {
  return (
    <div
      style={{
        marginBottom: "20px",
        background: "#020617",
        padding: "18px",
        borderRadius: "14px",
      }}
    >
      <p
        style={{
          color: "#94a3b8",
          marginBottom: "6px",
        }}
      >
        {label}
      </p>

      <h3
        style={{
          color: "white",
        }}
      >
        {value}
      </h3>
    </div>
  );
}