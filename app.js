let teamA = JSON.parse(localStorage.getItem("teamA")) || []
let teamB = JSON.parse(localStorage.getItem("teamB")) || []

let teamAName = localStorage.getItem("teamAName") || "Team A"
let teamBName = localStorage.getItem("teamBName") || "Team B"

const minTeamSize = 3;
const maxTeamSize = 7;

function getTeamWarning(team) {
    if (team.length < minTeamSize) {
        return `<div style="color:red;">Min. ${minTeamSize} players needed</div>`;
    }
    return "";
}

function save() {

    localStorage.setItem("teamA", JSON.stringify(teamA))
    localStorage.setItem("teamB", JSON.stringify(teamB))

    localStorage.setItem("teamAName", teamAName)
    localStorage.setItem("teamBName", teamBName)

}

function renameTeam(team) {

    if (team === "A") {
        const val = document.getElementById("teamAInput").value
        if (val) teamAName = val
    }
    if (team === "B") {
        const val = document.getElementById("teamBInput").value
        if (val) teamBName = val
    }
    save()
    renderHome()
}

function renderHome(searchQuery = "") {
    const teamANameEl = document.getElementById("teamAName");
    const teamBNameEl = document.getElementById("teamBName");
    const listA = document.getElementById("teamAList");
    const listB = document.getElementById("teamBList");
    const statistik = document.querySelector('.statistik');
    const statistik2 = document.querySelector('.statistik2');

    if (!listA || !listB) return;

    const dataTeamA = JSON.parse(localStorage.getItem('teamA')) || [];
    const dataTeamB = JSON.parse(localStorage.getItem('teamB')) || [];

    function avgAge(spelare) {
        if (spelare.length === 0) return 0;
        let total = spelare.reduce((sum, s) => sum + Number(s.age), 0);
        return (total / spelare.length).toFixed(0);
    }

    const rankNumber = {
        "Iron": 1,
        "Bronze": 2,
        "Silver": 3,
        "Gold": 4,
        "Diamond": 5
    };
    const numberToRank = ["Iron", "Bronze", "Silver", "Gold", "Diamond"];
    function getAverageRank(spelare) {
        if (spelare.length === 0) return "Ingen";
        const total = spelare.reduce((sum, p) => sum + (rankNumber[p.ranking] || 1), 0);
        const avgNum = total / spelare.length;
        const rounded = Math.round(avgNum);
        return numberToRank[rounded - 1];
    }

    if (teamANameEl) teamANameEl.textContent = teamAName;
    if (teamBNameEl) teamBNameEl.textContent = teamBName;

    listA.innerHTML = "";
    listB.innerHTML = "";

    const filteredA = teamA.filter(p =>
        p.username.toLowerCase().includes(searchQuery) ||
        (p.firstname && p.firstname.toLowerCase().includes(searchQuery)) ||
        (p.lastname && p.lastname.toLowerCase().includes(searchQuery))
    );

    const filteredB = teamB.filter(p =>
        p.username.toLowerCase().includes(searchQuery) ||
        (p.firstname && p.firstname.toLowerCase().includes(searchQuery)) ||
        (p.lastname && p.lastname.toLowerCase().includes(searchQuery))
    );

    filteredA.forEach(p => {
        const li = document.createElement("li");
        li.className = "player";
        li.innerHTML = `
            <span onclick="goToPlayer('${p.username}')">${p.username} - ${p.ranking}</span>
            <img src="${p.imageUrl}" alt="">
            <button onclick="changeTeam('${p.username}', 'A')">Change team</button>
            <button onclick="removePlayer('A','${p.username}')">Remove</button>
        `;
        listA.appendChild(li);
    });

    filteredB.forEach(p => {
        const li = document.createElement("li");
        li.className = "player";
        li.innerHTML = `
            <span onclick="goToPlayer('${p.username}')">${p.username} - ${p.ranking}</span>
            <img src="${p.imageUrl}" alt="">
            <button onclick="changeTeam('${p.username}', 'B')">Change team</button>
            <button onclick="removePlayer('B','${p.username}')">Remove</button>
        `;
        listB.appendChild(li);
    });

    if (statistik) {
        statistik.innerHTML = `<div>Players: ${teamA.length}</div> 
            ${getTeamWarning(teamA)}
            <div>Avg. age: ${avgAge(dataTeamA)}</div>   
            <div>Avg. rank: ${getAverageRank(dataTeamA)}</div>`;
    }

    if (statistik2) {
        statistik2.innerHTML = `<div>Players: ${teamB.length}</div>
            ${getTeamWarning(teamB)}
            <div>Avg. age: ${avgAge(dataTeamB)}</div>   
            <div>Avg. rank: ${getAverageRank(dataTeamB)}</div>`;
    }
}

function setupSearch() {
    const searchInput = document.getElementById("playerSearchInput");
    if (!searchInput) return;
    searchInput.addEventListener("input", () => {
        renderHome(searchInput.value.toLowerCase());
    });
}

function goToPlayer(username) {
    localStorage.setItem("selectedPlayer", username)
    window.location.href = "playerinfo.html"
}

function changeTeam(username, currentTeam) {
    if (currentTeam === "A") {
        if (teamB.length >= maxTeamSize) {
            alert("Team B is full!");
            return;
        }
        const index = teamA.findIndex(p => p.username === username);
        if (index !== -1) {
            const [player] = teamA.splice(index, 1);
            teamB.push(player);
        }
    } else {
        if (teamA.length >= maxTeamSize) {
            alert("Team A is full!");
            return;
        }
        const index = teamB.findIndex(p => p.username === username);
        if (index !== -1) {
            const [player] = teamB.splice(index, 1);
            teamA.push(player);
        }
    }
    save();
    renderHome();
}

function removePlayer(team, username) {
    if (team === "A") {
        teamA = teamA.filter(p => p.username !== username)
    } else {
        teamB = teamB.filter(p => p.username !== username)
    }
    save()
    renderHome()
}

function usernameExists(username) {
    return teamA.some(p => p.username === username) || teamB.some(p => p.username === username);
}

function setupHamburger() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    if (!hamburger || !navLinks) return; 
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('show');
    });
}

function renderTeamSelect() {
    const teamSelect = document.getElementById("teamSelect");
    teamSelect.innerHTML = "";

    const spotsA = maxTeamSize - teamA.length;
    const optA = document.createElement("option");
    optA.value = "A";
    optA.textContent = `${teamAName} (${spotsA} ${spotsA === 1 ? 'spot' : 'spots'} left)`;
    if (teamA.length >= maxTeamSize) optA.disabled = true;
    teamSelect.appendChild(optA);

    const spotsB = maxTeamSize - teamB.length;
    const optB = document.createElement("option");
    optB.value = "B";
    optB.textContent = `${teamBName} (${spotsB} ${spotsB === 1 ? 'spot' : 'spots'} left)`;
    if (teamB.length >= maxTeamSize) optB.disabled = true;
    teamSelect.appendChild(optB);
}


async function renderAddPlayer() {
    const countryDropdown = document.querySelector("#country");
    try {
        let response = await axios.get("https://restcountries.com/v3.1/region/europe");
        for(let i = 0; i < response.data.length; i++){
            countryDropdown.innerHTML += `
            <option data-image="${response.data[i].flags.svg}" value="${response.data[i].name.common}">${response.data[i].name.common}</option>
            `
        }
    } catch (err) {
        console.log(err);
    }
    renderTeamSelect()
    document.getElementById("playerForm").addEventListener("submit", e => {
        e.preventDefault()
        const username = document.getElementById("username").value
        if (usernameExists(username)|| username.length <3) {
            document.getElementById("error").textContent = "Try another username, more than 3 digits";
            return
        }
        let age= document.getElementById("age").value
        if (isNaN(age)||age <13 || age >50){
            document.getElementById("error").textContent = "Choose age between 13 and 50 only";
            return
        }
        const select = document.getElementById("country");
        const selectedOption = select.options[select.selectedIndex];
        const imageUrl = selectedOption.dataset.image;
        let rankValue = returnRankNumber(document.getElementById("ranking").value);
        const player = {
            username,
            firstname: document.getElementById("firstname").value,
            lastname: document.getElementById("lastname").value,
            age,
            country: document.getElementById("country").value,
            imageUrl: imageUrl,
            ranking: document.getElementById("ranking").value,
            rankValue
        }
        const team = document.getElementById("teamSelect").value
        if (teamA.length >= maxTeamSize && teamB.length >= maxTeamSize) {
        alert("Both teams are full!");
        return;
    }
    if (team === "A" && teamA.length >= maxTeamSize) {
        alert(`${teamAName} is full!`);
        return;
    }
    if (team === "B" && teamB.length >= maxTeamSize) {
        alert(`${teamBName} is full!`);
        return;
    }
        if (team === "A") {
            teamA.push(player)
        }
        if (team === "B") {
            teamB.push(player)
        }
        save()
        window.location.href = "index.html"
    })
}

function renderPlayerInfo() {

    const username = localStorage.getItem("selectedPlayer")
    const player = teamA.find(p => p.username === username)||teamB.find(p => p.username === username)
    const profile = document.getElementById("profile")
    profile.innerHTML = `
<div class="profile">
<h2>${player?.username}</h2>
<p><b>Name:</b> ${player?.firstname} ${player?.lastname}</p>
<p><b>Age:</b> ${player?.age}</p>
<p><b>Country:</b> ${player?.country}</p>
<img src="${player?.imageUrl}" alt="">
<p><b>Ranking:</b> ${player?.ranking} - ${player?.rankValue}</p>
<br>
<button onclick="window.location='index.html'">Back</button>
<button id="editBtn">Edit</button>
</div>

`

const editBtn = document.getElementById("editBtn");
    editBtn.addEventListener("click", () => enableEdit(profile, player));
}

function enableEdit(profileDiv, player) {
    profileDiv.innerHTML = `
        <div class="profile">
        <h2>${player?.username}</h2>
        <p><b>First name:</b> <input type="text" value="${player?.firstname}" class="edit-fname"></p>
        <p><b>Last name:</b> <input type="text" value="${player?.lastname}" class="edit-lname"></p>
        <p><b>Age:</b> <input type="number" value="${player?.age}" class="edit-age"></p>
        <p><b>Country:</b> <input type="text" value="${player?.country}" class="edit-country"></p>
        <p><b>Ranking:</b> 
        <select class="edit-ranking" id="ranking" value="${player?.ranking}">
            <option>Iron</option>
            <option>Bronze</option>
            <option>Silver</option>
            <option>Gold</option>
            <option>Diamond</option>
        </select>
        </p>
        <button class="saveBtn">Save</button>
        <button class="cancelBtn">Cancel</button>
        </div>
    `;
    
    profileDiv.querySelector(".saveBtn").addEventListener("click", () => {
        const newAge = parseInt(profileDiv.querySelector(".edit-age").value)
        if (isNaN(newAge) || newAge < 13 || newAge > 50) {
            document.getElementById("error").textContent = "Choose age between 13 and 50 only"
            return
        }
        document.getElementById("error").textContent = ""
        player.firstname = profileDiv.querySelector(".edit-fname")?.value;
        player.lastname = profileDiv.querySelector(".edit-lname")?.value;
        player.age= newAge
        player.country = profileDiv.querySelector(".edit-country")?.value;
        player.ranking = profileDiv.querySelector(".edit-ranking")?.value;
        player.rankValue = returnRankNumber(profileDiv.querySelector(".edit-ranking")?.value);
        save();
        renderPlayerInfo();
    });
    profileDiv.querySelector(".cancelBtn").addEventListener("click", () => {
        renderPlayerInfo();
    });
}

function sortPlayers() {
    let sortingArr = ['Diamond', 'Gold', 'Silver', 'Bronze', 'Iron']

    let sortDropdown = document.querySelector("#sort");
    if (sortDropdown.value === "age") {
        teamA.sort((a, b) => a.age - b.age);
        teamB.sort((a, b) => a.age - b.age);
    } else if (sortDropdown.value === "username") {
        teamA.sort((a, b) => a.username.localeCompare(b.firstname));
        teamB.sort((a, b) => a.username.localeCompare(b.firstname));
    } else if (sortDropdown.value === "ranking") {
        teamA.sort((a, b) => sortingArr.indexOf(a.ranking) - sortingArr.indexOf(b.ranking));
        teamB.sort((a, b) => sortingArr.indexOf(a.ranking) - sortingArr.indexOf(b.ranking));
    }
    renderHome();
}

function init() {
    setupHamburger();

    const listA = document.getElementById("teamAList");
    const listB = document.getElementById("teamBList");
    if (listA && listB) {
        renderHome();
    }

    const searchInput = document.getElementById("playerSearchInput");
    if (searchInput) {
        setupSearch();
    }

    const playerForm = document.getElementById("playerForm");
    if (playerForm) {
        renderAddPlayer();
    }
}

document.addEventListener('DOMContentLoaded', init);

function returnRankNumber(rank) {
    switch (rank) {
    case "Iron":
    return (Math.floor(Math.random() * (20 - 1) ) + 1).toString();
    case "Bronze":
    return (Math.floor(Math.random() * (40 - 20) ) + 20).toString();
    case "Silver":
    return (Math.floor(Math.random() * (60 - 40) ) + 40).toString();
    case "Gold":
    return (Math.floor(Math.random() * (80 - 60) ) + 60).toString();
    case "Diamond":
    return (Math.floor(Math.random() * (101 - 80) ) + 80).toString();
    default:
    return `Error at function "returnRankNumber()"`
    }
}