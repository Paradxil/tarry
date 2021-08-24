const {types} = require('@marko/compiler');
const utils = require('@marko/babel-utils');
const fs = require('fs');
const path = require('path');

let lastImport = null;

const Visitor = {
    Program: {
        enter(path, state) {
            //Get the last import statement if it exists
            lastImport = path.get("body").filter(p => p.isImportDeclaration()).pop()||path.get("body").pop();
        },
        exit(path, state) {
            let resources = buildResourceObject();
            let _resources = objectToPropertiesArray(resources);
        
            let resourcesExp = types.objectExpression(_resources);
            let objDeclaration = types.variableDeclaration('const', [types.variableDeclarator(types.identifier('r'), resourcesExp)]);
            lastImport.insertBefore(objDeclaration);
        }
    }
};

function buildResourceObject(dir="./src/resources/", res={}) {
    let files = fs.readdirSync(dir, { withFileTypes: true });

    for(let file of files) {
        if(file.isDirectory()) {
            res[file.name] = buildResourceObject(path.join(dir, file.name));
        }
        else if(file.isFile()) {
            if(file.name.endsWith('.json')) {
                let r = fs.readFileSync(path.join(dir, file.name));
                res[file.name.split('.')[0]] = JSON.parse(r);
            }
        }
    }

    return res;
}

function objectToPropertiesArray(obj, arr=[]) {
    for(key in obj) {    
        let prop = {
            "type": "ObjectProperty",
            "key": {
              "type": "StringLiteral",
              "value": key.toString()
            },
            "value": {
              "type": "StringLiteral",
              "value": obj[key].toString()
            }
        }

        if(typeof obj[key] === 'object' && obj[key] !== null) {
            prop.value.type = "ObjectExpression";
            prop.value.properties = objectToPropertiesArray(obj[key]);
        }

        arr.push(prop);
    }

    return arr;
}

module.exports = Visitor;