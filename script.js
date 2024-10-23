let allData = []; // To store all fetched data

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
    const table = document.getElementById('data-table');
    
    // Clear existing rows except for the header
    table.innerHTML = `
        <tr>
            <th>ID</th>
            <th>Speed</th>
            <th>Result</th>
            <th>Datetime</th>
        </tr>
    `;

    data.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><a href="details.html?id=${item.id}">${item.id}</a></td>
            <td>${item.speed}</td>
            <td>${item.result || '--'}</td>
            <td>${new Date(item.datetime).toLocaleString()}</td>
        `;
        table.appendChild(row);
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

    populateTable(filteredData); // Populate table with filtered data
}

// Fetch data when the page loads
window.onload = fetchData;
