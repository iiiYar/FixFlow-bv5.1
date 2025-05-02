// Wallet functionality
let walletBalance = 0;
let transactions = [];

// Update wallet balance display
function updateWalletDisplay() {
    document.getElementById('walletBalance').textContent = walletBalance.toFixed(2);
}

// Add transaction to history
function addTransaction(type, amount) {
    const transaction = {
        id: transactions.length + 1,
        type: type,
        amount: amount,
        date: new Date().toLocaleString()
    };
    transactions.unshift(transaction);
    updateTransactionsList();
}

// Update transactions list display
function updateTransactionsList() {
    const transactionsList = document.getElementById('transactionsList');
    transactionsList.innerHTML = transactions
        .slice(0, 5)
        .map(transaction => `
            <div class="flex justify-between items-center p-2 bg-gray-50 rounded-lg dark:bg-gray-700">
                <div class="flex items-center">
                    <span class="${transaction.type === 'deposit' ? 'text-green-500' : 'text-red-500'} mr-2">
                        ${transaction.type === 'deposit' ? '+' : '-'}
                    </span>
                    <span class="text-sm text-gray-600 dark:text-gray-400">${transaction.date}</span>
                </div>
                <span class="font-medium">${transaction.amount.toFixed(2)}</span>
            </div>
        `)
        .join('');
}

// Handle deposit form submission
document.getElementById('depositForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const amount = parseFloat(document.getElementById('depositAmount').value);
    if (amount > 0) {
        walletBalance += amount;
        updateWalletDisplay();
        addTransaction('deposit', amount);
        // Close modal
        const modal = document.getElementById('depositModal');
        if (typeof modal.hide === 'function') modal.hide();
        // Reset form
        this.reset();
    }
});

// Handle withdraw form submission
document.getElementById('withdrawForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const amount = parseFloat(document.getElementById('withdrawAmount').value);
    if (amount > 0 && amount <= walletBalance) {
        walletBalance -= amount;
        updateWalletDisplay();
        addTransaction('withdraw', amount);
        // Close modal
        const modal = document.getElementById('withdrawModal');
        if (typeof modal.hide === 'function') modal.hide();
        // Reset form
        this.reset();
    } else {
        alert('Insufficient funds!');
    }
});

// Devices functionality
let devices = [];

// Update statistics
function updateStats() {
    const availableDevices = devices.filter(device => device.status === 'available').length;
    const totalPurchase = devices.reduce((sum, device) => sum + device.purchasePrice, 0);
    const totalValue = devices.reduce((sum, device) => sum + device.sellingPrice, 0);
    const totalProfit = totalValue - totalPurchase;

    document.getElementById('availableDevices').textContent = availableDevices;
    document.getElementById('totalPurchase').textContent = totalPurchase.toFixed(2);
    document.getElementById('totalValue').textContent = totalValue.toFixed(2);
    document.getElementById('totalProfit').textContent = totalProfit.toFixed(2);
}

// Add new device
document.getElementById('addDeviceForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const newDevice = {
        id: devices.length + 1,
        name: document.getElementById('deviceName').value,
        owner: document.getElementById('deviceOwner').value,
        purchasePrice: parseFloat(document.getElementById('purchasePrice').value),
        sellingPrice: parseFloat(document.getElementById('sellingPrice').value),
        status: document.getElementById('deviceStatus').value
    };
    devices.push(newDevice);
    updateDevicesTable();
    updateStats();
    // Close modal
    const modal = document.getElementById('addDeviceModal');
    if (typeof modal.hide === 'function') modal.hide();
    // Reset form
    this.reset();
});

// Update devices table
function updateDevicesTable() {
    const tbody = document.getElementById('devicesTableBody');
    tbody.innerHTML = devices.map(device => `
        <tr class="hover:bg-gray-50 dark:hover:bg-gray-600">
            <td class="p-4 text-sm font-normal text-gray-900 whitespace-nowrap dark:text-white">
                ${device.name}
            </td>
            <td class="p-4 text-sm font-normal text-gray-500 whitespace-nowrap dark:text-gray-400">
                ${device.owner}
            </td>
            <td class="p-4 text-sm font-normal text-gray-500 whitespace-nowrap dark:text-gray-400">
                $${device.purchasePrice.toFixed(2)}
            </td>
            <td class="p-4 text-sm font-normal text-gray-500 whitespace-nowrap dark:text-gray-400">
                $${device.sellingPrice.toFixed(2)}
            </td>
            <td class="p-4 text-sm font-normal text-gray-500 whitespace-nowrap dark:text-gray-400">
                ${device.status}
            </td>
            <td class="p-4 text-sm font-normal text-right whitespace-nowrap">
                <button type="button" onclick="editDevice(${device.id})" class="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800">Edit</button>
            </td>
        </tr>
    `).join('');
}

// Search functionality
document.getElementById('deviceSearch').addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    const filteredDevices = devices.filter(device =>
        device.name.toLowerCase().includes(searchTerm) ||
        device.owner.toLowerCase().includes(searchTerm)
    );
    updateDevicesTable(filteredDevices);
});

// Initialize displays
updateWalletDisplay();
updateTransactionsList();
updateDevicesTable();
updateStats();