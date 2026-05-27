let students = [
    { id: 1, name: "Aman", department: "IT", date: "2023-01-10" },
    { id: 2, name: "Ravi", department: "HR", date: "2022-05-12" },
    { id: 3, name: "Sita", department: "IT", date: "2023-03-15" },
    { id: 4, name: "John", department: "Finance", date: "2021-07-20" }
];


function displayData(data) {
    let table = document.getElementById("tableBody");
    table.innerHTML = "";

    data.forEach(s => {
        let row = `
            <tr>
                <td>${s.id}</td>
                <td>${s.name}</td>
                <td>${s.department}</td>
                <td>${s.date}</td>
            </tr>
        `;
        table.innerHTML += row;
    });
}


function showCount(data) {
    let counts = {};
    data.forEach(s => {
        counts[s.department] = (counts[s.department] || 0) + 1;
    });

    let list = document.getElementById("countList");
    list.innerHTML = "";

    for (let dept in counts) {
        list.innerHTML += `<li>${dept}: ${counts[dept]}</li>`;
    }
}


function applyFilters() {
    let dept = document.getElementById("department").value;
    let sort = document.getElementById("sort").value;

    let filtered = [...students];

    
    if (dept) {
        filtered = filtered.filter(s => s.department === dept);
    }

    
    if (sort === "name") {
        filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === "date") {
        filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    displayData(filtered);
    showCount(filtered);
}


displayData(students);
showCount(students);