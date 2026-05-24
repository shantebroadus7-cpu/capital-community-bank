import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Transfer() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    recipient: "",
    bank: "",
    accountNumber: "",
    routingNumber: "",
    amount: "",
    description: "",
  });

  const [message, setMessage] = useState("");
  const [beneficiaries, setBeneficiaries] = useState(
  JSON.parse(localStorage.getItem("beneficiaries")) || []
);
  const [receipt, setReceipt] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
const saveBeneficiary = () => {

  const beneficiaryData = {
    recipient: formData.recipient,
    bank: formData.bank,
    accountNumber: formData.accountNumber,
    routingNumber: formData.routingNumber,
  };

  const updatedBeneficiaries = [
    beneficiaryData,
    ...beneficiaries,
  ];

  setBeneficiaries(updatedBeneficiaries);

  localStorage.setItem(
    "beneficiaries",
    JSON.stringify(updatedBeneficiaries)
  );

  setMessage("Beneficiary saved successfully");
};const loadBeneficiary = (beneficiary) => {

  setFormData({
    ...formData,
    recipient: beneficiary.recipient,
    bank: beneficiary.bank,
    accountNumber: beneficiary.accountNumber,
    routingNumber: beneficiary.routingNumber,
  });

};
  const handleTransfer = (e) => {
    e.preventDefault();

    const {
      recipient,
      bank,
      accountNumber,
      routingNumber,
      amount,
    } = formData;

    if (
      !recipient ||
      !bank ||
      !accountNumber ||
      !routingNumber ||
      !amount
    ) {
      setMessage("Please complete all required fields.");
      return;
    }
const currentBalance =
  Number(localStorage.getItem("bank_balance")) || 250000;

const transferAmount =
  Number(formData.amount);

if (transferAmount > currentBalance) {

  setMessage("Insufficient funds");

  return;
}

const updatedBalance =
  currentBalance - transferAmount;

localStorage.setItem(
  "bank_balance",
  updatedBalance
);
    const existingTransactions =
      JSON.parse(localStorage.getItem("transactions")) || [];

    const newTransaction = {
  name: recipient,
  bank,
  accountNumber,
  routingNumber,
  amount: `-$${Number(amount).toLocaleString()}`,
  status: "Completed",
  date: new Date().toLocaleString(),
};

    existingTransactions.unshift(newTransaction);

    localStorage.setItem(
      "transactions",
      JSON.stringify(existingTransactions)
    );

    const receiptData = {
      id:
        "TRX-" +
        Math.floor(Math.random() * 100000000),

      recipient: formData.recipient,

      bank: formData.bank,

      amount: formData.amount,

      date: new Date().toLocaleString(),

      status: "Completed",
    };

    setReceipt(receiptData);

    setMessage("Transfer request submitted successfully.");

    setTimeout(() => {

  navigate("/receipt", {
    state: {
      recipient: formData.recipient,
      bank: formData.bank,
      accountNumber: formData.accountNumber,
      routingNumber: formData.routingNumber,
      amount: formData.amount,
    },
  });

}, 2500);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(to bottom right, #020617, #0f172a)",
        padding: "40px",
        fontFamily: "Arial, sans-serif",
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
            Wire Transfer Center
          </h1>

          <p
            style={{
              color: "#94a3b8",
            }}
          >
            Secure domestic and international transfers
          </p>
        </div>

        <button
          onClick={() => navigate("/dashboard")}
          style={{
            padding: "12px 20px",
            border: "none",
            borderRadius: "12px",
            background: "#1e293b",
            color: "white",
            cursor: "pointer",
          }}
        >
          Back To Dashboard
        </button>
      </div>

      {/* MAIN CARD */}
      <div
        style={{
          maxWidth: "950px",
          margin: "0 auto",
          background: "#0f172a",
          borderRadius: "28px",
          padding: "40px",
          border: "1px solid #1e293b",
          boxShadow: "0 0 40px rgba(0,0,0,0.4)",
        }}
      >
        <div
          style={{
            marginBottom: "35px",
          }}
        >
          <h2
            style={{
              color: "white",
              marginBottom: "10px",
            }}
          >
            Transfer Details
          </h2>

          <p
            style={{
              color: "#94a3b8",
            }}
          >
            Enter beneficiary banking information securely.
          </p>
        </div>
{/* BENEFICIARIES */}

<div
  style={{
    marginBottom: "35px",
  }}
>
  <h3
    style={{
      color: "white",
      marginBottom: "18px",
    }}
  >
    Saved Beneficiaries
  </h3>

  {beneficiaries.length === 0 ? (

    <p
      style={{
        color: "#94a3b8",
      }}
    >
      No saved beneficiaries
    </p>

  ) : (

    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fit, minmax(240px, 1fr))",
        gap: "15px",
      }}
    >
      {beneficiaries.map((beneficiary, index) => (

        <div
          key={index}
          onClick={() => loadBeneficiary(beneficiary)}
          style={{
            background: "#020617",
            border: "1px solid #1e293b",
            borderRadius: "18px",
            padding: "18px",
            cursor: "pointer",
          }}
        >
          <h4
            style={{
              color: "white",
              marginBottom: "8px",
            }}
          >
            {beneficiary.recipient}
          </h4>

          <p
            style={{
              color: "#94a3b8",
              fontSize: "14px",
            }}
          >
            {beneficiary.bank}
          </p>

          <p
            style={{
              color: "#64748b",
              fontSize: "13px",
              marginTop: "6px",
            }}
          >
            {beneficiary.accountNumber}
          </p>
        </div>

      ))}
    </div>

  )}
</div>
        <form onSubmit={handleTransfer}>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "22px",
            }}
          >
            {/* Recipient */}
            <div>
              <label
                style={{
                  color: "#cbd5e1",
                  display: "block",
                  marginBottom: "10px",
                }}
              >
                Recipient Name
              </label>

              <input
                type="text"
                name="recipient"
                placeholder="John Smith"
                value={formData.recipient}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            {/* Bank */}
            <div>
              <label
                style={{
                  color: "#cbd5e1",
                  display: "block",
                  marginBottom: "10px",
                }}
              >
                Bank Name
              </label>

              <input
                type="text"
                name="bank"
                placeholder="Bank of America"
                value={formData.bank}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            {/* Account Number */}
            <div>
              <label
                style={{
                  color: "#cbd5e1",
                  display: "block",
                  marginBottom: "10px",
                }}
              >
                Account Number
              </label>

              <input
                type="text"
                name="accountNumber"
                placeholder="XXXXXXXXXXXX"
                value={formData.accountNumber}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            {/* Routing Number */}
            <div>
              <label
                style={{
                  color: "#cbd5e1",
                  display: "block",
                  marginBottom: "10px",
                }}
              >
                Routing Number
              </label>

              <input
                type="text"
                name="routingNumber"
                placeholder="021000021"
                value={formData.routingNumber}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            {/* Amount */}
            <div>
              <label
                style={{
                  color: "#cbd5e1",
                  display: "block",
                  marginBottom: "10px",
                }}
              >
                Transfer Amount
              </label>

              <input
                type="number"
                name="amount"
                placeholder="$0.00"
                value={formData.amount}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            {/* Transfer Type */}
            <div>
              <label
                style={{
                  color: "#cbd5e1",
                  display: "block",
                  marginBottom: "10px",
                }}
              >
                Transfer Type
              </label>

              <select
                name="type"
                onChange={handleChange}
                style={inputStyle}
              >
                <option>Domestic Wire</option>
                <option>International Wire</option>
                <option>ACH Transfer</option>
              </select>
            </div>
          </div>

          {/* DESCRIPTION */}
          <div style={{ marginTop: "25px" }}>
            <label
              style={{
                color: "#cbd5e1",
                display: "block",
                marginBottom: "10px",
              }}
            >
              Transfer Description
            </label>

            <textarea
              name="description"
              placeholder="Purpose of transfer..."
              value={formData.description}
              onChange={handleChange}
              rows="5"
              style={{
                ...inputStyle,
                resize: "none",
              }}
            />
          </div>

          {/* SECURITY BOX */}
          <div
            style={{
              marginTop: "30px",
              background: "#020617",
              border: "1px solid #1e293b",
              padding: "20px",
              borderRadius: "18px",
            }}
          >
            <h3
              style={{
                color: "white",
                marginBottom: "10px",
              }}
            >
              Secure Transfer Notice
            </h3>

            <p
              style={{
                color: "#94a3b8",
                lineHeight: "1.7",
              }}
            >
              All transfer requests are protected with encrypted
              banking security protocols and monitored for fraud
              prevention.
            </p>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            style={{
              width: "100%",
              marginTop: "30px",
              padding: "18px",
              border: "none",
              borderRadius: "16px",
              background:
                "linear-gradient(to right, #2563eb, #1d4ed8)",
              color: "white",
              fontWeight: "bold",
              fontSize: "17px",
              cursor: "pointer",
              boxShadow: "0 15px 30px rgba(37,99,235,0.3)",
            }}
          ><button
  type="button"
  onClick={saveBeneficiary}
  style={{
    width: "100%",
    marginTop: "25px",
    padding: "16px",
    border: "1px solid #2563eb",
    borderRadius: "16px",
    background: "transparent",
    color: "#3b82f6",
    fontWeight: "bold",
    fontSize: "16px",
    cursor: "pointer",
  }}
>
  Save Beneficiary
</button>
            Submit Transfer Request
          </button>

          {message && (
            <p
              style={{
                marginTop: "20px",
                color: "#22c55e",
                textAlign: "center",
                fontSize: "16px",
              }}
            >
              {message}
            </p>
          )}

          {/* RECEIPT UI */}
          {receipt && (

            <div
              style={{
                marginTop: "35px",
                background: "#020617",
                border: "1px solid #1e293b",
                borderRadius: "22px",
                padding: "30px",
              }}
            >
              <h2
                style={{
                  color: "white",
                  marginBottom: "25px",
                }}
              >
                Transfer Receipt
              </h2>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(250px, 1fr))",
                  gap: "20px",
                }}
              >

                <div>
                  <p style={labelStyle}>Receipt Number</p>
                  <h3 style={valueStyle}>{receipt.id}</h3>
                </div>

                <div>
                  <p style={labelStyle}>Recipient</p>
                  <h3 style={valueStyle}>
                    {receipt.recipient}
                  </h3>
                </div>

                <div>
                  <p style={labelStyle}>Bank</p>
                  <h3 style={valueStyle}>
                    {receipt.bank}
                  </h3>
                </div>

                <div>
                  <p style={labelStyle}>Amount</p>
                  <h3 style={valueStyle}>
                    ${Number(receipt.amount).toLocaleString()}
                  </h3>
                </div>

                <div>
                  <p style={labelStyle}>Date</p>
                  <h3 style={valueStyle}>
                    {receipt.date}
                  </h3>
                </div>

                <div>
                  <p style={labelStyle}>Status</p>
                  <h3
                    style={{
                      color: "#22c55e",
                    }}
                  >
                    {receipt.status}
                  </h3>
                </div>

              </div>
            </div>

          )}

        </form>
      </div>
    </div>
  );
}

const labelStyle = {
  color: "#94a3b8",
  marginBottom: "8px",
  fontSize: "14px",
};

const valueStyle = {
  color: "white",
};

const inputStyle = {
  width: "100%",
  padding: "15px",
  borderRadius: "14px",
  border: "1px solid #1e293b",
  background: "#020617",
  color: "white",
  fontSize: "15px",
  outline: "none",
};