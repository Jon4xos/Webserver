document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('Formular');

    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        const data = {
            vorname: form.elements['vorname'].value,
            nachname: form.elements['nachname'].value,
            email: form.elements['email'].value,
            nachricht: form.elements['nachricht'].value,
            zahl: form.elements['zahl'].value,
        };

        // Ajax Anfrage um Formular-Daten an den server zu senden
        await fetch('/saveToDB', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),

        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text(); // Antwort als text zurückgeben
            })
            .then(data => {
                console.log(data); // zeige die Antwort in der Konsole
                document.getElementById('responseMessage').innerText = data;
                clearFields(); // Felder leeren
            })
            .catch(error => {
                console.error('There has been a problem with your fetch operation:', error);
            });
    });

    const clearFields = () => {
        form.reset(); // Form zurücssetzen
        console.log('Fields cleared');
    };
});