import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function formatMoney(value) {
  return `$${Number(value || 0).toLocaleString()}`;
}

export default function AdminDashboard() {

  const navigate = useNavigate();

  const [activeTab, setActiveTab] =
    useState("overview");

  const [overview, setOverview] =
    useState({
      totalUsers: 0,
      totalTransactions: 0,
      users: [],
      transactions: [],
    });

  const [allUsers, setAllUsers] =
    useState([]);

  const [allTransactions, setAllTransactions] =
    useState([]);

  const [searchQuery, setSearchQuery] =
    useState("");

  const [filterRole, setFilterRole] =
    useState("");

  const [selectedUser, setSelectedUser] =
    useState(null);

  const [editBalance, setEditBalance] =
    useState(0);

  const [editRole, setEditRole] =
    useState("");

  const [modalOpen, setModalOpen] =
    useState(false);

  const [transactionSearch, setTransactionSearch] =
    useState("");

  const [transactionFilter, setTransactionFilter] =
    useState("");

  const [createUserOpen, setCreateUserOpen] =
    useState(false);

  const [newUsername, setNewUsername] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [message, setMessage] =
    useState("");

  const API_URL =
    import.meta.env.VITE_API_URL ||
    "https://capital-bank-api.onrender.com";

  useEffect(() => {

    const token =
      localStorage.getItem("bank_admin_token");

    if (!token) {

      navigate("/admin/login");
      return;

    }

    setLoading(true);

    if (activeTab === "overview") {

      fetchOverview(token);

    } else if (activeTab === "customers") {

      fetchAllUsers(token);

    } else if (activeTab === "transactions") {

      fetchAllTransactions(token);

    }

  }, [activeTab]);

  const fetchOverview = async (token) => {

    try {

      const response = await fetch(
        `${API_URL}/api/admin/overview`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {

        if (
          response.status === 401 ||
          response.status === 403
        ) {

          handleLogout();
          return;

        }

        throw new Error(
          "Unable to load admin data"
        );

      }

      const data =
        await response.json();

      if (!data) {

        throw new Error(
          "Invalid admin response"
        );

      }

      setOverview({
        totalUsers:
          data.totalUsers || 0,
        totalTransactions:
          data.totalTransactions || 0,
        users:
          data.users || [],
        transactions:
          data.transactions || [],
      });

    } catch (error) {

      console.log(error);

      setMessage(
        error.message ||
        "Failed to load admin dashboard"
      );

    } finally {

      setLoading(false);

    }

  };

  const fetchAllUsers = async (token) => {

    try {

      const response = await fetch(
        `${API_URL}/api/admin/users`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {

        if (
          response.status === 401 ||
          response.status === 403
        ) {

          handleLogout();
          return;

        }

        throw new Error(
          "Unable to load users"
        );

      }

      const data =
        await response.json();

      setAllUsers(
        data.users || []
      );

    } catch (error) {

      console.log(error);

      setMessage(
        error.message ||
        "Failed to load users"
      );

    } finally {

      setLoading(false);

    }

  };

  const fetchAllTransactions = async (token) => {

    try {

      const response = await fetch(
        `${API_URL}/api/transactions`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {

        throw new Error(
          "Unable to load transactions"
        );

      }

      const data =
        await response.json();

      setAllTransactions(
        data || []
      );

    } catch (error) {

      console.log(error);

      setMessage(
        error.message ||
        "Failed to load transactions"
      );

    } finally {

      setLoading(false);

    }

  };

  function filteredUsers(
    users,
    query,
    role
  ) {

    let list =
      users || [];

    if (role) {

      list = list.filter(
        (u) =>
          (u.role || "")
            .toLowerCase() ===
          role.toLowerCase()
      );

    }

    if (query) {

      const q =
        query.toLowerCase();

      list = list.filter((u) => {

        const username =
          (u.username || "")
            .toLowerCase();

        const id =
          String(u._id || "");

        return (
          username.includes(q) ||
          id.includes(q)
        );

      });

    }

    return list;

  }

  function filteredTransactions(
    transactions,
    query,
    filter
  ) {

    let list =
      transactions || [];

    if (filter === "sender") {

      list = list.filter(
        (t) => t.sender
      );

    }

    if (filter === "recipient") {

      list = list.filter(
        (t) => t.recipient
      );

    }

    if (query) {

      const q =
        query.toLowerCase();

      list = list.filter((t) => {

        const sender =
          (t.sender || "")
            .toLowerCase();

        const recipient =
          (t.recipient || "")
            .toLowerCase();

        const bank =
          (t.bank || "")
            .toLowerCase();

        return (
          sender.includes(q) ||
          recipient.includes(q) ||
          bank.includes(q)
        );

      });

    }

    return list;

  }

  const openUserModal = (user) => {

    setSelectedUser(user);

    setEditBalance(
      user.balance || 0
    );

    setEditRole(
      user.role || "customer"
    );

    setModalOpen(true);

  };

  const handleCloseModal = () => {

    setModalOpen(false);

    setSelectedUser(null);

  };

  const handleUpdateUser = async () => {

    if (!selectedUser) return;

    const token =
      localStorage.getItem(
        "bank_admin_token"
      );

    try {

      const response =
        await fetch(
          `${API_URL}/api/admin/user/${selectedUser._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type":
                "application/json",
              Authorization:
                `Bearer ${token}`,
            },
            body: JSON.stringify({
              balance: editBalance,
              role: editRole,
            }),
          }
        );

      if (!response.ok) {

        throw new Error(
          "Failed to update user"
        );

      }

      setMessage(
        "User updated successfully"
      );

      fetchAllUsers(token);

      handleCloseModal();

    } catch (error) {

      console.log(error);

      setMessage(
        error.message ||
        "Update failed"
      );

    }

  };

  const handleDeleteUserPrompt =
    async (user) => {

      const ok =
        window.confirm(
          `Delete user ${user.username}?`
        );

      if (!ok) return;

      const token =
        localStorage.getItem(
          "bank_admin_token"
        );

      try {

        const response =
          await fetch(
            `${API_URL}/api/admin/user/${user._id}`,
            {
              method: "DELETE",
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        if (!response.ok) {

          throw new Error(
            "Failed to delete user"
          );

        }

        setMessage(
          "User deleted"
        );

        fetchAllUsers(token);

      } catch (error) {

        console.log(error);

        setMessage(
          error.message ||
          "Delete failed"
        );

      }

    };

  const handleCreateUser = async () => {

    if (
      !newUsername ||
      !newPassword
    ) {

      setMessage(
        "Username and password required"
      );

      return;

    }

    const token =
      localStorage.getItem(
        "bank_admin_token"
      );

    try {

      const response =
        await fetch(
          `${API_URL}/api/register`,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              username: newUsername,
              password: newPassword,
            }),
          }
        );

      if (!response.ok) {

        throw new Error(
          "Failed to create user"
        );

      }

      setMessage(
        "User created successfully"
      );

      setNewUsername("");

      setNewPassword("");

      setCreateUserOpen(false);

      fetchAllUsers(token);

    } catch (error) {

      console.log(error);

      setMessage(
        error.message ||
        "Creation failed"
      );

    }

  };

  const handleLogout = () => {

    localStorage.removeItem(
      "bank_admin_token"
    );

    localStorage.removeItem(
      "bank_admin_username"
    );

    navigate("/admin/login");

  };

  const adminUsername =
    localStorage.getItem(
      "bank_admin_username"
    ) || "Administrator";

  return (

    <div
      style={{
        minHeight: "100vh",
        background: "#020617",
        color: "white",
        padding: "30px",
        fontFamily:
          "Arial, sans-serif",
      }}
    >

      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >

        <div>

          <h1>
            Welcome,
            {" "}
            {adminUsername}
          </h1>

          <p
            style={{
              color: "#94a3b8",
            }}
          >
            Capital Community
            Bank Admin Dashboard
          </p>

        </div>

        <button
          onClick={handleLogout}
          style={{
            padding:
              "12px 20px",
            background:
              "#dc2626",
            border: "none",
            borderRadius:
              "10px",
            color: "white",
            cursor: "pointer",
          }}
        >
          Logout
        </button>

      </div>

      {message && (

        <div
          style={{
            marginBottom: "20px",
            background:
              "#7f1d1d",
            padding: "15px",
            borderRadius:
              "12px",
          }}
        >
          {message}
        </div>

      )}

      <div
        style={{
          display: "flex",
          gap: "12px",
          marginBottom: "25px",
        }}
      >

        {[
          "overview",
          "customers",
          "transactions",
        ].map((tab) => (

          <button
            key={tab}
            onClick={() =>
              setActiveTab(tab)
            }
            style={{
              padding:
                "12px 20px",
              background:
                activeTab === tab
                  ? "#2563eb"
                  : "#0f172a",
              border:
                "1px solid #1e293b",
              borderRadius:
                "10px",
              color: "white",
              cursor: "pointer",
            }}
          >
            {tab}
          </button>

        ))}

      </div>

      {loading ? (

        <p>Loading...</p>

      ) : (

        <>

          {activeTab ===
            "overview" && (

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit,minmax(250px,1fr))",
                gap: "20px",
              }}
            >

              <div
                style={{
                  background:
                    "#0f172a",
                  padding:
                    "25px",
                  borderRadius:
                    "18px",
                }}
              >
                <h3>
                  Total Users
                </h3>

                <h1>
                  {
                    overview.totalUsers
                  }
                </h1>
              </div>

              <div
                style={{
                  background:
                    "#0f172a",
                  padding:
                    "25px",
                  borderRadius:
                    "18px",
                }}
              >
                <h3>
                  Transactions
                </h3>

                <h1>
                  {
                    overview.totalTransactions
                  }
                </h1>
              </div>

            </div>

          )}

        </>

      )}

    </div>

  );

}