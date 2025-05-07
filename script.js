// API endpoint for NFL teams
const API_URL = 'http://localhost:3000/teams';

// Get references to DOM elements
const teamForm = document.getElementById('teamForm');
const teamList = document.getElementById('teamList');

/**
 * Fetches all NFL teams from the API
 * Uses async/await for clean asynchronous code
 * Displays teams in the DOM after fetching
 */
async function fetchTeams() {
    try {
        const response = await fetch(API_URL);
        const teams = await response.json();
        displayTeams(teams);
    } catch (error) {
        console.error('Error fetching teams:', error);
    }
}

/**
 * Creates a new NFL team
 * @param {Object} team - The team object containing name, conference, division, and city
 * @returns {Promise<Object>} The newly created team
 */
async function createTeam(team) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(team),
        });
        const newTeam = await response.json();
        fetchTeams(); // Refresh the team list to show the new team
        return newTeam;
    } catch (error) {
        console.error('Error creating team:', error);
    }
}

/**
 * Deletes a team by its ID
 * @param {number} id - The ID of the team to delete
 */
async function deleteTeam(id) {
    try {
        await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
        });
        fetchTeams(); // Refresh the team list after deletion
    } catch (error) {
        console.error('Error deleting team:', error);
    }
}

/**
 * Displays the teams in the DOM
 * Creates HTML elements for each team with their details
 * @param {Array} teams - Array of team objects to display
 */
function displayTeams(teams) {
    teamList.innerHTML = ''; // Clear existing teams
    teams.forEach(team => {
        const teamElement = document.createElement('div');
        teamElement.className = 'list-group-item team-item d-flex justify-content-between align-items-center';
        teamElement.innerHTML = `
            <div>
                <h5 class="team-name">${team.name}</h5>
                <p class="team-info mb-0">
                    ${team.conference} ${team.division} | ${team.city}
                </p>
            </div>
            <button class="btn btn-danger btn-sm delete-btn" data-id="${team.id}">
                Delete
            </button>
        `;
        teamList.appendChild(teamElement);
    });
}

// Event Listeners

/**
 * Handles form submission for creating new teams
 * Prevents default form submission
 * Collects form data and creates a new team
 */
teamForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const conference = document.getElementById('conference').value;
    const division = document.getElementById('division').value;
    const city = document.getElementById('city').value;
    
    const newTeam = {
        name,
        conference,
        division,
        city
    };
    
    await createTeam(newTeam);
    teamForm.reset(); // Clear the form after submission
});

/**
 * Handles click events on the team list
 * Specifically handles delete button clicks
 * Uses event delegation for dynamic elements
 */
teamList.addEventListener('click', async (e) => {
    if (e.target.classList.contains('delete-btn')) {
        const teamId = e.target.dataset.id;
        await deleteTeam(teamId);
    }
});

// Load teams when the page loads
fetchTeams(); 