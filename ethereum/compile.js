import path from "path";
import fs from "fs-extra";
import solc from "solc";

const __dirname = path.resolve();
const build_path = path.join(__dirname, 'build');
fs.removeSync(build_path);

const contract_path = path.join(__dirname, 'contracts', 'Campaign.sol');

const source = fs.readFileSync(contract_path, 'utf8');

const output = solc.compile(source, 1).contracts;

fs.ensureDirSync(build_path);

for(let contract in output) {
    fs.outputJsonSync(
        path.join(build_path, contract.replace(':', '') + '.json'),    //create the file
        output[contract]                                               //write the output of that contract in that file
    )
};
