// Initial balance
let accountBalance = 250000;

// Function to format number as currency
function formatCurrency(amount) {
    return `$${amount.toLocaleString()}`;
}

// Function to update the balance display
function updateBalanceDisplay() {
    const balanceElement = document.getElementById('balance');
    balanceElement.textContent = formatCurrency(accountBalance);
}

// Simulate fetching new balance from backend
function fetchBalance() {
    // Here you would make an API call to your backend
    // For demo, we'll just simulate a change
    // For example, adding a random amount for demo purposes
    const change = Math.floor(Math.random() * 1000 - 500); // Random change between -500 and +500
    accountBalance += change;
    updateBalanceDisplay();
}

// Event listener for refresh button
document.getElementById('refreshBtn').addEventListener('click', fetchBalance);

// Initialize display
updateBalanceDisplay();