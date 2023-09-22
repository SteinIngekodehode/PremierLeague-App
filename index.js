// Function to fetch fixtures and populate dropdown
document.addEventListener('DOMContentLoaded', () => {
  // Add an event listener to the "Fetch Fixtures" button
  getTeamsAndPopulateDropdown();
  fetchAndDisplayLeagueTable();

  const fetchFixturesButton = document.getElementById('fetch-fixtures');
  fetchFixturesButton.addEventListener('click', () => {
    const teamNameInput = document.getElementById('team-name');
    const selectedTeamName = teamNameInput.value;
    
    if (selectedTeamName.trim() !== '') {
      // If a team name is provided, fetch and display fixtures
      displayFixturesForTeam(selectedTeamName);
    } else {
      // Handle the case when no team name is provided
      alert('Please enter a team name.');
    }
  });
});

let allFixtures = []; // Store fixtures globally

// Function to fetch fixtures and populate dropdown
async function getTeamsAndPopulateDropdown() {
  try {
  const url = 'https://api-football-v1.p.rapidapi.com/v3/fixtures?league=39&season=2023&from=2023-08-11&to=2024-05-19';
  const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': 'dde975a14fmsh9d79f42848f2e02p1cdd86jsn23a116f7f2d7',
		'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
	}
};

try {
	const response = await fetch(url, options);
	const result = await response.json();
	console.log(result);
} catch (error) {
	console.error(error);
}
  const response = await fetch(url, options);  

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('API response:', data);
    
allFixtures = data.response; // Store fixtures globally


  } catch (error) {
    console.error(error);
  }
}
// Function to display fixtures for the selected team
function displayFixturesForTeam(selectedTeamName) {
  const matchInfo = document.querySelector('.match-info');
  // Clear previous fixtures
  while (matchInfo.firstChild) {
    matchInfo.removeChild(matchInfo.firstChild);
  }
// Filter fixtures for the selected team by comparing team names
  const fixturesForSelectedTeam = allFixtures.filter((fixture) => {
    return (
      fixture.teams.home.name.toLowerCase() === selectedTeamName.toLowerCase() ||
      fixture.teams.away.name.toLowerCase() === selectedTeamName.toLowerCase()
    );
  });

  if (fixturesForSelectedTeam.length > 0) {
    fixturesForSelectedTeam.forEach((fixture) => {
      const fixtureCard = createFixtureCard(fixture);
      matchInfo.appendChild(fixtureCard);
    });
  } else {
    const noFixturesMessage = document.createElement('p');
    noFixturesMessage.textContent = 'No fixtures found.';
    matchInfo.appendChild(noFixturesMessage);
  }
}
// Function to create a fixture card

function createFixtureCard(fixture) {
  const card = document.createElement('div');
  card.classList.add('fixture-card');
// Defining
  const homeTeam = fixture.teams.home.name;
  const awayTeam = fixture.teams.away.name;
  const date = fixture.fixture.date.slice(0,10);
  
  // Access the logos direct from the fixture data
  const homeLogo = fixture.teams.home.logo;
  const awayLogo = fixture.teams.away.logo;

// container to make it possible to place them 
  const logosContainer = document.createElement('div');
  logosContainer.style.display = 'flex';
  logosContainer.style.flexDirection = 'column';
  logosContainer.style.justifyContent = 'space-around';
  logosContainer.style.height = '100%';
  logosContainer.style.order = '2';

// Create image elements for the logos
  const homeLogoImg = document.createElement('img');
  homeLogoImg.src = homeLogo;
  homeLogoImg.style.width = '20px';
  homeLogoImg.style.height = 'auto';

  const awayLogoImg = document.createElement('img');
  awayLogoImg.src = awayLogo;
  awayLogoImg.style.width = '20px';
  awayLogoImg.style.height = 'auto';

  

// check if there is any goal information
  const goals = document.createElement('p');
  
if (fixture.fixture.status.short === 'FT' && fixture.goals) {
    // Displaying the score if fixture is finished and goal info is availble
  const homeGoals = fixture.goals.home;
  const awayGoals = fixture.goals.away;
  goals.innerText = ` ${homeGoals} \n ${awayGoals}`;
} else {
  goals.textContent = '-';
}
  
  const title = document.createElement('h3');
  title.innerText = `${homeTeam} \n ${awayTeam}`;
  
// check if there is any goal information
  const datePara = document.createElement('span');
  datePara.textContent = `Date: ${date}`;
  
  card.appendChild(logosContainer);
  logosContainer.appendChild(homeLogoImg);
  logosContainer.appendChild(awayLogoImg);
  card.appendChild(title);
  card.appendChild(goals);
  card.appendChild(datePara);

  return card;
}
// Global variable to store the result
let leagueTableResult = ''

//Function to fetch/display table

async function fetchAndDisplayLeagueTable() {
  const url = 'https://api-football-v1.p.rapidapi.com/v3/standings?season=2023&league=39';

  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': 'dde975a14fmsh9d79f42848f2e02p1cdd86jsn23a116f7f2d7',
      'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
    }
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    console.log(result);

    // Check the actual structure of the API response and adjust accordingly
    const standingsData = result.response[0].league.standings[0];

    if (Array.isArray(standingsData)) {
    //OK console.log(standingsData);
      const teamName = standingsData[0].team.name;
      console.log(`Team Name: ${teamName}`);

      // Call a function to display the league table using 'standingsData'
      displayLeagueTable(standingsData);
    } else {
      console.error("Invalid data format: standingsData is undefined or not an array");
    }
  } catch (error) {
    console.error(error);
  }
}
// Function to display the league table based on API response data
function displayLeagueTable(standingsData) {
  try {
    if (Array.isArray(standingsData)) {
      // Select the table and its body
      const table = document.querySelector('.football-table');
      const tableBody = table.querySelector('tbody');

      // Clear previous table rows
      tableBody.innerHTML = '';

      // Loop through the standingsData array and create table rows
      standingsData.forEach((teamStanding) => {
      const row = document.createElement('tr');

      // Create and populate the position cell
      const positionCell = document.createElement('td');
      positionCell.textContent = teamStanding.rank;
      
      const teamLogoCell = document.createElement('td');
      const teamLogoImg = document.createElement('img');
      teamLogoImg.src = teamStanding.team.logo;
      teamLogoImg.alt = `${teamStanding.team.name}Logo`;
      teamLogoImg.style.width = '20px';
      teamLogoImg.style.height = 'auto';
      teamLogoImg.style.alignSelf = 'center';
      teamLogoCell.appendChild(teamLogoImg);
        // Create the team cell
      const teamCell = document.createElement('td');

      // Check if team name is available and populate the team cell
      if (teamStanding.team && teamStanding.team.name) {
          teamCell.textContent = teamStanding.team.name;
      } else {
          console.error('Invalid data format: Team info missing');
      }

      //Create and populate played games cell
      const playedCell = document.createElement('td');
      playedCell.textContent = teamStanding.all.played; 

      const winCell = document.createElement('td');
      winCell.textContent = teamStanding.all.win; 

      const drawCell = document.createElement('td');
      drawCell.textContent = teamStanding.all.draw; 

      const loseCell = document.createElement('td');
      loseCell.textContent = teamStanding.all.lose; 

      const goalDifferenceCell = document.createElement('td');
      goalDifferenceCell.textContent = teamStanding.goalsDiff; 
        
      const goalsCell = document.createElement('td');
      goalsCell.textContent = teamStanding.all.goals.for + " - " + teamStanding.all.goals.against;

      const pointsCell = document.createElement('td');
      pointsCell.textContent = teamStanding.points;

     // Append all cells to the table row
      row.appendChild(positionCell);
      row.appendChild(teamLogoCell);
      row.appendChild(teamCell);
      row.appendChild(playedCell); 
      row.appendChild(winCell); 
      row.appendChild(drawCell);
      row.appendChild(loseCell)
      row.appendChild(goalsCell)
      row.appendChild(goalDifferenceCell);
      row.appendChild(pointsCell);

      // Append the row to the table body
      tableBody.appendChild(row);
      });
    } else {
      console.error("Invalid data format: standingsData is undefined or not an array");
    }
  } catch (error) {
    console.error(error);
  }
}
