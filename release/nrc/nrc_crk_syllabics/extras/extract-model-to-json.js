const fs = require('fs');
const {sro2syllabics} = require('cree-sro-syllabics');

let dataStructure = null;

const LMLayerWorker = {
  loadModel() {
    // Intentionally not implemented
  }
};

const models = {
  TrieModel: class TrieModel {
    constructor(ds) {
      dataStructure = ds;
    }
  }
};


let filename = process.argv[2];

let contents = fs.readFileSync(filename, 'utf8');
let doit = new Function('LMLayerWorker', 'models', contents);

doit(LMLayerWorker, models);
console.log(JSON.stringify(dataStructure, (key, value) => {
  // Convert content to syllabics.
  if (key === 'content') {
    return sro2syllabics(value);
  }
  return value;
}));
