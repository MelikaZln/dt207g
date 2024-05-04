// Funktion för att registrera en ny användare
function registerUser() {
    // Hämta användarnamn, lösenord och e-post från formuläret
    const username = document.getElementById("registerUsername").value;
    const password = document.getElementById("registerPassword").value;
    const email = document.getElementById("registerEmail").value;

    // Skicka en POST-begäran till /api/register med användaruppgifterna
    fetch('/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password, email })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Registreringen misslyckades.');
        }
        return response.json();
    })
    .then(data => {
        alert(data.message);
        // Rensa formuläret efter framgångsrik registrering
        document.getElementById("registerForm").reset();
    })
    .catch(error => {
        alert(error.message);
    });
}

// logga in en användare
function loginUser() {
    //användarnamn och lösenord hämtas från formuläret
    const username = document.getElementById("loginUsername").value;
    const password = document.getElementById("loginPassword").value;

    // Skicka en POST-begäran till /api/login med användaruppgifterna
    fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Inloggningen misslyckades.');
        }
        return response.json();
    })
    .then(data => {
        alert(data.message);
        localStorage.setItem('token', data.token); // Spara JWT-token i localStorage
        window.location.href = "minsida.html"; // Omdirigera till minsida.html vid lyckad inloggning
    })
    .catch(error => {
        alert(error.message);
    });
}

// hämta JWT-token från localStorage
function getToken() {
    return localStorage.getItem('token');
};