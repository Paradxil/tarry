import fs from 'fs';

export function localize(name, local) {
    let file = fs.readFileSync("./src/resources/strings/" + name + ".json");
    let strings = JSON.parse(file)[local];
    return strings;
}