/*let teamName1= localStorage.getItem('teamAName')
let teamName2= localStorage.getItem('teamBName')

let rankOrdning = ['Iron', "Bronze", "Silver", "Gold", "Diamond"]
allTeams.sort((a,b)=>{
    return rankOrdning.indexOf(b.rank)-rankOrdning.indexOf(a.rank)
})
let renderLeaderboardTeams =()=>{
    let lista= document.querySelector('.lista')
    allTeams.forEach(renderInfo)
    function renderInfo(team, index){
        let li=document.createElement('li')
        li.innerHTML= `
        <div><h4>${team.name}</h4></div>
        <div><h4>${team.rank}</h4></div>` 
        lista.append(li)
    }
}*/

function renderLeaderboardTeams() {
    let teamName1 = localStorage.getItem('teamAName') || 'Team A'
    let teamName2 = localStorage.getItem('teamBName') || 'Team B'
    let teamAPlayers = JSON.parse(localStorage.getItem('teamA')) || []
    let teamBPlayers = JSON.parse(localStorage.getItem('teamB')) || []
    let rankOrdning = ['Iron', 'Bronze', 'Silver', 'Gold', 'Diamond']
    let rankToNumber = { 
        Iron: 1,
        Bronze: 2,
        Silver: 3, 
        Gold: 4, 
        Diamond: 5 
    }
    function getAverageRank(spelare) {
        if (spelare.length === 0) return 'Iron'
        let total = spelare.reduce((sum, p) => sum + rankToNumber[p.ranking], 0)
        let avg = Math.round(total / spelare.length)
        return rankOrdning[avg - 1]
    }
    const allTeams = [
        { name: teamName1, rank: getAverageRank(teamAPlayers) },
        { name: teamName2, rank: getAverageRank(teamBPlayers) }
    ]
    allTeams.sort((a, b) => rankOrdning.indexOf(b.rank) - rankOrdning.indexOf(a.rank))
    const lista = document.querySelector('.lista')
    allTeams.forEach(team => {
        const li = document.createElement('li')
        li.innerHTML = `
            <div><h4>${team.name}</h4></div>
            <div><h4>${team.rank}</h4></div>
        `
        lista.appendChild(li)
    });
}