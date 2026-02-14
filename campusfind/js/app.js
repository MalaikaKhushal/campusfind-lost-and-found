// ===============================
// INITIAL DATA SETUP
// ===============================

let defaultItems = [
    {
        id: 1,
        name: "Student ID Card - Ali",
        category: "ID Card",
        location: "Library",
        date: "2026-02-05",
        desc: "Blue university ID card",
        type: "Lost",
        status: "Open"
    },
    {
        id: 2,
        name: "Black Wallet",
        category: "Accessories",
        location: "Cafeteria",
        date: "2026-02-07",
        desc: "Contains CNIC and cash",
        type: "Lost",
        status: "Open"
    },
    {
        id: 3,
        name: "Scientific Calculator",
        category: "Electronics",
        location: "Room B12",
        date: "2026-02-06",
        desc: "Casio FX-991EX",
        type: "Found",
        status: "Open"
    },
    {
        id: 4,
        name: "USB Drive 32GB",
        category: "Electronics",
        location: "Computer Lab",
        date: "2026-02-08",
        desc: "Silver Kingston USB",
        type: "Found",
        status: "Open"
    }
];

// Load from localStorage OR set default data first time
let items = JSON.parse(localStorage.getItem("items"));
if (!items || items.length === 0) {
    items = defaultItems;
    localStorage.setItem("items", JSON.stringify(items));
}

let claims = JSON.parse(localStorage.getItem("claims")) || [];

function saveData() {
    localStorage.setItem("items", JSON.stringify(items));
    localStorage.setItem("claims", JSON.stringify(claims));
}

// ===============================
// DOM LOADED
// ===============================

document.addEventListener("DOMContentLoaded", () => {

    const lostForm = document.getElementById("lostForm");
    const foundForm = document.getElementById("foundForm");

    // LOST FORM
    if (lostForm) {
        lostForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const data = [...lostForm.elements].map(el => el.value);

            items.push({
                id: Date.now(),
                name: data[0],
                category: data[1],
                location: data[2],
                date: data[3],
                desc: data[4],
                type: "Lost",
                status: "Open"
            });

            saveData();
            alert("Lost Item Reported!");
            lostForm.reset();
        });
    }

    // FOUND FORM
    if (foundForm) {
        foundForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const data = [...foundForm.elements].map(el => el.value);

            items.push({
                id: Date.now(),
                name: data[0],
                category: data[1],
                location: data[2],
                date: data[3],
                desc: data[4],
                type: "Found",
                status: "Open"
            });

            saveData();
            alert("Found Item Reported!");
            foundForm.reset();
        });
    }

    // ===============================
    // BROWSE PAGE
    // ===============================

    const list = document.getElementById("itemsList");
    if (list) {
        displayItems(items);

        document.getElementById("search").addEventListener("input", (e) => {
            const value = e.target.value.toLowerCase();
            const filtered = items.filter(i =>
                i.name.toLowerCase().includes(value)
            );
            displayItems(filtered);
        });

        document.getElementById("filter").addEventListener("change", (e) => {
            if (e.target.value === "all") {
                displayItems(items);
            } else {
                displayItems(items.filter(i => i.type === e.target.value));
            }
        });
    }

    // ===============================
    // HOME PAGE COUNTS
    // ===============================

    const lostCount = document.getElementById("lostCount");
    const foundCount = document.getElementById("foundCount");

    if (lostCount && foundCount) {
        lostCount.innerText = items.filter(i => i.type === "Lost").length;
        foundCount.innerText = items.filter(i => i.type === "Found").length;
    }

    // ===============================
    // ADMIN PAGE
    // ===============================

    const claimsList = document.getElementById("claimsList");
    if (claimsList) {
        claimsList.innerHTML = "";

        claims.forEach(c => {
            const div = document.createElement("div");
            div.className = "item-card";
            div.innerHTML = `
                <p><strong>${c.itemName}</strong></p>
                <p>Claimed by: ${c.claimer}</p>
                <button onclick="approveClaim(${c.id})">Approve</button>
                <button onclick="rejectClaim(${c.id})">Reject</button>
            `;
            claimsList.appendChild(div);
        });
    }

});

// ===============================
// DISPLAY ITEMS
// ===============================

function displayItems(data) {
    const list = document.getElementById("itemsList");
    list.innerHTML = "";

    data.forEach(item => {
        const div = document.createElement("div");
        div.className = "item-card";
        div.innerHTML = `
            <h4>${item.name}</h4>
            <p>${item.type} | ${item.location}</p>
            <p>Date: ${item.date}</p>
            <p>Status: ${item.status}</p>
            <button onclick="claimItem(${item.id})">Claim</button>
        `;
        list.appendChild(div);
    });
}

// ===============================
// CLAIM SYSTEM
// ===============================

function claimItem(id) {
    const name = prompt("Enter your name:");
    if (!name) return;

    const item = items.find(i => i.id === id);

    claims.push({
        id: Date.now(),
        itemId: id,
        itemName: item.name,
        claimer: name
    });

    saveData();
    alert("Claim Request Sent to Admin!");
}

function approveClaim(id) {
    const claim = claims.find(c => c.id === id);
    const item = items.find(i => i.id === claim.itemId);

    item.status = "Returned";
    claims = claims.filter(c => c.id !== id);

    saveData();
    location.reload();
}

function rejectClaim(id) {
    claims = claims.filter(c => c.id !== id);
    saveData();
    location.reload();
}
