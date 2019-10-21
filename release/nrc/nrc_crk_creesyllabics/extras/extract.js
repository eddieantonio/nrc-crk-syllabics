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


let contents = fs.readFileSync('nrc_crk_cans.js', 'utf8');
let doit = new Function('LMLayerWorker', 'models', contents);

doit(LMLayerWorker, models);
console.log(JSON.stringify(dataStructure, (key, value) => {
  if (key === 'content') {
    return sro2syllabics(value);
  }
  return value;
}, 2));
