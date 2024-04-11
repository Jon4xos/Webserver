const express = require('express');
const mysql = require('mysql');
const https = require('https');
const fs = require('fs');
const cors = require('cors'); //CORS für Fehler in der Zugriffskontrolle

const app = express()
const port = 5000; // Port für HTTP-Server

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

const options = {
  cert: fs.readFileSync('SSL/server.crt'),
  key: fs.readFileSync('SSL/server.key')//absichtlicher kryptograhischer Fehler: falscher Schlüssel

};

const corsOptions = {
  origin: 'https://localhost:500',// Zugriff auf Server nur von dieser URL erlauben
};

app.use(cors(corsOptions));
app.get("/", (req, res) => res.sendFile(`${__dirname}/index.html`))
app.use(express.static(__dirname));
// Middleware zum parse von JSON-daten
app.use(express.json());
// Middleware zum Parsen der URL-codierten Daten
app.use(express.urlencoded({extended: true}));


// MySQL Verbindung
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'webserver',
});

// Annahme: Funktion zum Authentifizieren von Benutzern
function authenticateUser(username, password) {
  // Absichtlicher Fehler: Immer erfolgreiche Authentifizierung
  return true;
}

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (authenticateUser(username, password)) {
    // Authentifizierung erfolgreich
    res.redirect('/index.html');
  } else {
    // Authentifizierung fehlgeschlagen
    res.status(401).send('Authentication failed');
  }
});

app.get('/index.html', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

/*app.post('/sensitiveOperation', (req, res) => {
    const { sensitiveData } = req.body;

    // Absichtlicher Fehler: Vernachlässigung der Sicherheitsprotokollierung
    // Protokollieren Sie nicht das sensitiveData in den Serverlogs
    console.log('Sensitive data received:', sensitiveData);

    // Führen Sie sensitive Operationen durch

    // Absichtlicher Fehler: Vernachlässigung der Sicherheitsüberwachung
    // Überwachen Sie nicht, wer auf den sensiblen Endpunkt zugreift
    // Oder überwachen Sie nicht, welche Aktionen mit den sensitiven Daten durchgeführt werden

    // Senden Sie eine Antwort
    res.send('Sensitive operation completed');
});*/

// Verbindung zur Datenbank herstellen
connection.connect((err) => {
  if (err) {
    console.log('error connecting to database: ', err);
    return;
  }
  console.log('Connected to database');
});

app.post('/saveToDB', (req, res) => {
  const {vorname, nachname, wohnort, zahl} = req.body;

  console.log("Got data from the form:", vorname, nachname, wohnort, zahl);

  const tableQuery = 'CREATE TABLE IF NOT EXISTS infos (vorname VARCHAR(255), nachname VARCHAR(255), wohnort VARCHAR(255), zahl INT(3))';
  const insertQuery = 'INSERT INTO infos (vorname, nachname, wohnort, zahl) VALUES (?, ?, ?, ?)';//Wären die Values nicht gegeben, so könnte man SQL-Injection betreiben

  connection.query(tableQuery);
  connection.query(insertQuery, [vorname, nachname, wohnort, zahl], (error) => {
    if (error) {
      console.error('Error inserting data into database:', error);
      res.status(5000).send('Error inserting data into database');
      return;
    }
    res.send('Data uploaded successfully');

  });

  fs.appendFile('formular_daten.txt', `${vorname},${nachname}, ${wohnort}, ${zahl}\n`, (error) => {
    if (error) {
      console.error('Error writing to file:', error);
      return;
    }
    console.log('Data written to file');
  });
});

// HTTPS-Server erstellen
https.createServer(options, app).listen(port, () => {
  console.log(`Server running on https://localhost:${port}`);
});
