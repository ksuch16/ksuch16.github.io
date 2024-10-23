let allData = []; // To store all fetched data
let currentSort = { field: '', direction: 'asc' }; // To track current sort

async function fetchData() {
    try {
        const response = await fetch('https://compute.samford.edu/zohauth/clients/datajson');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        allData = await response.json(); // Store the fetched data
        populateTable(allData); // Populate table with initial data
        updateStatistics(allData); // Calculate and display statistics
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}

function populateTable(data) {
    const tableBody = document.querySelector('#data-table tbody');
    
    // Clear existing rows
    tableBody.innerHTML = '';

    data.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><a href="details.html?id=${item.id}">${item.id}</a></td>
            <td>${item.speed}</td>
            <td>${item.result || '--'}</td>
            <td>${new Date(item.datetime).toLocaleString()}</td>
        `;
        tableBody.appendChild(row);
    });
}

function filterData(event) {
    event.preventDefault(); // Prevent form submission
    const startDate = new Date(document.getElementById('startdate').value);
    const endDate = new Date(document.getElementById('enddate').value);

    // Filter data based on selected date range
    const filteredData = allData.filter(item => {
        const itemDate = new Date(item.datetime);
        return itemDate >= startDate && itemDate <= endDate;
    });

    // Reset sorting when filtering
    currentSort = { field: '', direction: 'asc' };
    populateTable(filteredData); // Populate table with filtered data
    updateStatistics(filteredData); // Update statistics for filtered data
}

function sortTable(field) {
    const direction = (currentSort.field === field && currentSort.direction === 'asc') ? 'desc' : 'asc';
    currentSort = { field, direction };

    // Sort data based on selected field
    const sortedData = [...allData].sort((a, b) => {
        let comparison = 0;

        if (field === 'speed') {
            comparison = a.speed - b.speed; // Numeric comparison for speed
        } else if (field === 'datetime') {
            comparison = new Date(a.datetime) - new Date(b.datetime); // Date comparison
        } else {
            // For ID and result, default to string comparison
            comparison = a[field].localeCompare(b[field]);
        }

        return direction === 'asc' ? comparison : -comparison;
    });

    // Populate table with sorted data
    populateTable(sortedData);
    highlightSortedColumn(field);
    updateStatistics(sortedData); // Update statistics for sorted data
}

function highlightSortedColumn(field) {
    const headers = document.querySelectorAll('#data-table th');
    headers.forEach(header => {
        header.classList.remove('sorted-asc', 'sorted-desc');
        if (header.id === `${field}-header`) {
            header.classList.add(currentSort.direction === 'asc' ? 'sorted-asc' : 'sorted-desc');
        }
    });
}

function updateStatistics(data) {
    const speeds = data.map(item => item.speed); // Extract speeds

    if (speeds.length > 0) {
        const mean = calculateMean(speeds);
        const median = calculateMedian(speeds);
        const mode = calculateMode(speeds);

        document.getElementById('mean-speed').textContent = mean.toFixed(2);
        document.getElementById('median-speed').textContent = median.toFixed(2);
        document.getElementById('mode-speed').textContent = mode.join(', ');
    } else {
        document.getElementById('mean-speed').textContent = 'N/A';
        document.getElementById('median-speed').textContent = 'N/A';
        document.getElementById('mode-speed').textContent = 'N/A';
    }
}

function calculateMean(arr) {
    const total = arr.reduce((sum, value) => sum + value, 0);
    return total / arr.length;
}

function calculateMedian(arr) {
    const sorted = arr.slice().sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);

    if (sorted.length % 2 === 0) {
        return (sorted[mid - 1] + sorted[mid]) / 2; // Average of two middle numbers
    } else {
        return sorted[mid]; // Middle number
    }
}

function calculateMode(arr) {
    const frequency = {};
    let maxFreq = 0;
    let modes = [];

    arr.forEach(value => {
        frequency[value] = (frequency[value] || 0) + 1;
        if (frequency[value] > maxFreq) {
            maxFreq = frequency[value];
        }
    });

    for (const key in frequency) {
        if (frequency[key] === maxFreq) {
            modes.push(Number(key));
        }
    }

    return modes.length === arr.length ? [] : modes; // Return empty array if no mode
}

// Fetch data when the page loads
window.onload = fetchData;
