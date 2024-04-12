document.getElementById('registerForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const formData = new FormData(this);
    const username = formData.get('username');
    const password = formData.get('password');

    const response = await fetch('//localhost:5000/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({username, password})
    });

    const data = await response.text();

    if (response.ok) {
        // Erfolgreich registriert, leite weiter
        window.location.href = '/index.html';
    } else {
        // Zeige die Fehlermeldung
        document.getElementById('errorMessage').innerText = data;
    }
});