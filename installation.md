# Installationsanleitung
### Software Praktikum (WI7) - Gruppe 01 - Sommersemester 2024<br>

Dominik Wunderlich, Merve Birinci, Patrick Koch, Johnny Luu, Justin Ugwu, Michael Fezer

## Frontend/Client-Seite
Das Frontend baut auf JavaScript, dessen Framework "React" auf und liegt im Projekt-Verzeichnis "frontend".

### Voraussetzungen für das Frontend
1. Für das Frontend wird folgendes benötigt:<br>
Es müssen package dependencies installiert werden. Hierfür wird im Terminal "npm install" ausgeführt.<br>
2. Node.js
3. Diverse Komponenten aus Material-UI (MUI)

Um das Frontend starten zu können muss npm start ausgeführt werden.

## Backend/Service-Seite
Das Backend baut auf Python, Flask und RestX auf.
Es befindet sich im Projekt-Verzeichnis "src".

### Voraussetzungen für das Backend
Für Backend wird folgendes benötigt:<br>
1. Python<br>
2. Flask <br>
3. flask-restx<br>
4. flask-cors<br>
5. google-auth<br>
6. requests<br>

```
cd /src
pip install -r requirements.txt     
python main.py    
```

Um das Backend starten zu können muss die main.py ausgeführt werden. 

## Datenbank/MySQL
Um eine Datenbank erfolgreich mit der App zu verbinden wird die aktuelle Version des "MySQL Community Server"
und der "MySQL Workbench" benötigt. Mithilfe der Workbench kann eine "MySQL Connection" erstellt werden, welche 
man in PyCharm mit dem Projekt verbindet, um letztendlich die dump.sql auf dieser "MySQL Connection" auszuführen. <br>
Die dump.sql ist im Projekt-Verzeichnis "mysql" zu finden.


## Deployment auf der Google Cloud Plattform (GCP)
### Voraussetzungen für das Deployment auf GCP
Ein Google-Benutzerkonto und das Hinterlegen einer Kreditkarte sind innerhalb der Google Cloud Console notwendig, um die teilweise kostenpflichtigen Funktionen der 
GCP nutzen zu können. Das Anmelden auf der GCP ist hingegen kostenlos. <br>
Ein erstelltes Projekt in der GCP wird für das Deployment ebenfalls vorausgesetzt. Andernfalls 
muss ein neues Projekt erstellt werden.

### APIs
Je nach art des Deployments, werden verschiedene APIs benötigt (in unserem Fall "Cloud SQL API" und "App Engine API"), 
um eine Datenbank zu erstellen und das Projekt in der "Cloud" anlegen zu können. <br>

### MySQL
Sind alle benötigten APIs installiert, kann nun ein (1) Bucket unter dem Verzeichnis "Cloud Storage" erstellt werden und 
anschließend eine (2) dump.sql in den Bucket importiert werden. Folgend muss eine (3) SQL-Instanz unter dem Verzeichnis 
"SQL" erstellt werden. Hier muss jetzt noch eine (4) Datenbank erstellt und die (5) dump.sql aus dem
Bucket in die Datenbank importiert werden.

### Google App Engine (GAE)
Der letzte Schritt innerhalb der GCP ist das Erstellen einer GAE. Hierfür wird unter dem Verzeichnis 
"App Engine" > "Einstellungen" eine GAE für das ausgewählte Projekt angelegt.

### Anpassung des Python-Projekts
Nachdem alle Schritte auf der GCP erfüllt wurden, gilt es das Projekt auf die GCP anzupassen.<br>

#### Deployment Backend (app.yaml, requirements.txt, .gcloudignore)
Im Backend Ordner (hier "src") wird eine app.yaml, requirements.txt und .gcloudignore Datei
benötigt. <br>
Die app.yaml gibt die zu verwendende Python-Version an, die requirements.txt gibt alle
python-packages, welche für den Start der App benötigt werden an und die .gcloudignore legt fest, welche Dateien nich
in die Cloud transferiert werden sollen.<br>

#### Deployment Frontend
Um auch das Frontend deployen zu können, muss im Projektverzeichnis "Frontend" mit dem Befehl npm run build
ein Build-Ordner erstellt werden, welcher anschließend in das Projektverzeichnis "src" kopiert werden muss.
```
npm run build  
```

### SDK
Um auf dem lokalen Terminal (z.b: PyCharm Terminal) mit dem Programm gcloud arbeiten zu können muss das Google Cloud SDK installiert werden.<br>
Die SDK Shell und die Google Cloud Shell können ebenfalls verwendet werden.

## Finales Deployment der App
Um die App mit all ihren Komponenten starten zu können, navigiert man in das Projekt-Verzeichnis "src". <br>
Hier führt man im lokalen Terminal die Befehle "gcloud components install app-engine-python" und "gcloud init" aus und folgt den Anweisungen. <br>
Anschließend führt man den Befehl "gcloud app deploy" aus, um die App in der Cloud verfügbar zu machen.
```
gcloud init
gcloud components install app-engine-python
gcloud app deploy  
```