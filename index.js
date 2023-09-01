// Program sekvens
const apiKey = 'dde975a14fmsh9d79f42848f2e02p1cdd86jsn23a116f7f2d7';
async function callAPI(endpoint) {
const url = `https://api-football-v1.p.rapidapi.com/v3/${endpoint}`;
  

const url = 'https://api-football-v1.p.rapidapi.com/v3/leagues?name=Premier%20League&country=England&season=2023&type=league&last=2023';
const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': 'dde975a14fmsh9d79f42848f2e02p1cdd86jsn23a116f7f2d7',
		'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
	}
};

try {
	const response = await fetch(url, options);
	const result = await response.text();
	console.log(result);
} catch (error) {
	console.error(error);
}

function createFixtureCard(fixture) {
  const card = document.createElement('div');
  card.classList.add('fixture-card');

  const homeTeam = fixture.teams.home.name;
  const awayTeam = fixture.teams.away.name;
  const date = fixture.fixture.date;
  const venue = fixture.fixture.venue.name;
  
  const title = document.createElement('h3')
  title.textContent = `${homeTeam} vs${awayTeam}`;

  const datePara = document.createElement('p');
  datePara.textContent = `Date: ${date}`;

  const venuePara = document.createElement('p');
  venuePara.textContent = `Venue: ${venue}`;

  card.appendChild(title);
  card.appendChild(datePara);
  card.appendChild(venuePara);
 
  return card;
}

async function getFixturesForTeam(teamName) {
  
try {
    const fixtures = await callAPI(`fixtures?league=${premierLeagueID}&team=${teamName}`);
    return fixtures;
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function displayFixturesForTeam(teamName) {
  const fixturesContainer = document.querySelector('.match-info');

  try {
    const fixtures = await getFixturesForTeam(teamName);

    if (fixtures && fixtures.length > 0) {
      fixturesContainer.textContent = '';
      fixtures.forEach(fixture => {
        const fixtureCard = createFixtureCard(fixture);
        fixturesContainer.appendChild(fixtureCard);
      });
    } else {
      fixturesContainer.textContent = 'No fixtures found.';
    }
  } catch (error) {
    console.error(error);
    fixturesContainer.textContent = 'Failed to get fixtures';
  }
}

const teamForm = document.getElementById('fixtures-team');
teamForm.addEventListener('submit', (event) => {
  event.preventDefault(); 
  const selectedTeam = document.getElementById('team-input').value;
  displayFixturesForTeam(selectedTeam)
});

//displayFixtures();

//document.addEventListener('DOMContentLoaded', () => {
  // Your JavaScript code here, including the displayFixtures function.
  //displayFixtures();
//});

