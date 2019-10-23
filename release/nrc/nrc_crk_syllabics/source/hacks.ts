/**
 * The TypeScript compiler generates the following code:
 *
 *  Object.defineProperty(exports, "__esModule", { value: true });
 *  require("@keymanapp/lexical-model-types");
 *
 * To get around this code, we need to define `exports` and `require`.
 */

let exports = {};
function require(name) {
    if (name === "@keymanapp/lexical-model-types") return;
    throw new Error(`Cannot import a module inside a lexical model. Tried importing ${name}`);
}
