/**
 * In dieser Datei befinden sich grundlegende Funktionen, die in allen Frontend Komponenten verwendet werden können.
 */

/**
 * Diese Funktion wandelt alle Eingabe Werte in LowerCases und entfernt die Leerzeichen am Anfang und Ende eines Strings
 * @param entry ist der Eingabewert z.B. ein String
 * @constructor
 */
function TrimAndLowerCase (entry){
    // console.log("Untrimmed and lowercased entry:", entry)
    entry = entry.trim().toLowerCase()
    // console.log("Lowercase and trimmed entry:", entry)
    return entry
}

export default TrimAndLowerCase;


