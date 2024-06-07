// This file is a set of own fucntions which are used in all possible components

/**
 * This function converts all entry values into lowercase and trims the start and end of each string
 * @param entry is the input value e.g. a string
 * @constructor
 */
function TrimAndLowerCase (entry){
    console.log("Untrimmed and lowercased entry:", entry)
    entry = entry.trim().toLowerCase()
    console.log("Lowercase and trimmed entry:", entry)
    return entry
}

export default TrimAndLowerCase;


