async function fetchData() {
    try {
        const response = await fetch('https://compute.samford.edu/zohauth/clients/datajson');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        populateTable(data);
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}

function populateTable(data) {
    const table = document.getElementById('data-table');
    
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

// Fetch the data when the page loads
window.onload = fetchData;
