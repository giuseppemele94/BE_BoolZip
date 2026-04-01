# BE_BoolZip

Backend del progetto Boolzip, sviluppato con Node.js ed Express.

---

## 📌 Descrizione

Questo progetto rappresenta il backend dell'applicazione Boolzip.

Il server si occupa di:
- Gestire le rotte API
- Interagire con un database MySQL
- Gestire l'invio di email (newsletter)
- Fornire dati al frontend

Non è presente un sistema di autenticazione utenti.

---

## 🚀 Tecnologie utilizzate

- Node.js
- Express
- MySQL
- mysql2
- dotenv
- cors
- nodemailer

---

## ⚙️ Installazione

Clonare il repository con il seguente comando:

```bash
git clone <URL_REPOSITORY> # sostituire con il link reale del repository
```


Entrare nella directory del progetto:

```bash
cd be_boolzip
```


Installare le dipendenze:

```bash
npm install
```

## ▶️ Avvio del server

Avviare il server:

```bash
npm start
```


Oppure in modalità sviluppo (watch):

```bash
npm run watch
```


Il server sarà disponibile su: [http://localhost:3000](http://localhost:3000)


---

## 🧱 Struttura del progetto

```bash
be_boolzip/
 ├── controllers/   # Logica delle rotte
 ├── db/            # Connessione al database
 ├── middlewares/   # Middleware personalizzati
 ├── public/        # File statici
 ├── routers/       # Definizione delle rotte
 ├── utils/         # Funzioni di utilità
 ├── .env           # Variabili d'ambiente
 ├── .gitignore
 ├── index.js       # Entry point del server
 ├── package.json
 └── package-lock.json
 ```

---


## 🗄️  Database

Per utilizzare correttamente il progetto è necessario configurare il database MySQL.



### ▶️ 1. Creazione del database

Accedere a MySQL (tramite terminale o tool come phpMyAdmin) e creare il database:

```sql
CREATE DATABASE nome_database;
```



### 📥 2. Importazione del database

All’interno del progetto è presente un file database.sql contenente struttura e dati iniziali.

Per importarlo eseguire:

```bash
mysql -u root -p nome_database < db/database.sql
```



### ⚙️ 3. Configurazione variabili d'ambiente

Creare un file `.env` nella root del progetto e inserire le seguenti variabili di configurazione per database ed email:

```bash
PORT=3000

# Database MySQL
DB_HOST=localhost
DB_USER=YOUR_DB_USER_HERE
DB_PASSWORD=YOUR_PASSWORD_HERE
DB_NAME=YOUR_DB_NAME_HERE

# Configurazione SMTP (es. Mailtrap)
MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=YOUR_MAIL_PORT_HERE
MAIL_USER=YOUR_MAIL_USER_HERE
MAIL_PASS=YOUR_MAIL_PASSWORD_HERE
```

## ⚠️ Importante

I valori presenti nel file `.env` sono dei placeholder.

Devono essere sostituiti con le proprie credenziali reali:

- Le credenziali del database MySQL (DB_USER, DB_PASSWORD, DB_NAME)
- Le credenziali SMTP fornite da Mailtrap (MAIL_HOST, MAIL_PORT, MAIL_USER, MAIL_PASS)

Senza queste configurazioni il server non funzionerà correttamente.


---

## 📌 Funzionalità principali

- Gestione API REST
- Connessione a database MySQL
- Invio email (newsletter)
- Struttura modulare con controllers e routers


---


## 📌 Note importanti

- Assicurarsi che MySQL sia attivo prima di eseguire il progetto
- Il file `database.sql` deve essere presente nella cartella `db/`
- Il nome del database deve coincidere con quello indicato nel file `.env`
- Non includere dati sensibili o reali nel file SQL
- Se si verificano errori, controllare credenziali e connessione al database


---


## ⚠️ Requisiti di utilizzo

- Node.js >= versione 18
- MySQL attivo
- Questo backend è progettato per funzionare insieme al frontend del progetto Boolzip.
- Alcune funzionalità potrebbero non essere completamente utilizzabili senza il frontend, in quanto le rotte API sono pensate per essere consumate dall'interfaccia client.
- Per testare il progetto in modo completo è quindi consigliato avviare anche il frontend associato.


---


## 👤 Autori

- Salvatore Scalise ([GitHub](https://github.com/salvatorescalise1999))
- Giuseppe Mele ([GitHub](https://github.com/giuseppemele94))
- Paolo Mucedero ([GitHub](https://github.com/PaoloMucedero))
- Luca Fiore ([GitHub](https://github.com/LucaFiore01))