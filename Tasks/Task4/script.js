const orders = [
    {name:"Aman", product:"Laptop", quantity:1, total:50000, date:"2026-03-01"},
    {name:"Rahul", product:"Headphones", quantity:3, total:6000, date:"2026-03-07"}
];

let table = document.querySelector("#orderTable tbody");

orders.forEach(order => {
    let row = `
        <tr>
            <td>${order.name}</td>
            <td>${order.product}</td>
            <td>${order.quantity}</td>
            <td>${order.total}</td>
            <td>${order.date}</td>
        </tr>
    `;
    table.innerHTML += row;
});