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

// Fetch data when the page loads
window.onload = fetchData;
