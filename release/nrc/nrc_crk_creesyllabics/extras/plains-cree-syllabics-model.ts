import "@keymanapp/lexical-model-types";

declare namespace models {
  export class TrieModel implements LexicalModel {
    constructor(weights: object);
    configure(capabilities: Capabilities): Configuration;
    predict(transform: Transform, context: Context): ProbabilityMass<Suggestion>[];
    wordbreak(context: Context): string;
    punctuation?: LexicalModelPunctuation;
  }
}

declare function syllabics2sro(syllabics: string): string;
declare function createTrieModel(): models.TrieModel;

class PlainsCreeSyllabicsModel implements LexicalModel {
  private _underlyingModel: models.TrieModel;
  constructor() {
    this._underlyingModel = createTrieModel();
  }

  configure(capabilities: Capabilities): Configuration {
    return this._underlyingModel.configure(capabilities);
  }

  predict(transform: Transform, context: Context): ProbabilityMass<Suggestion>[] {
    throw new Error("Method not implemented.");
  }

  wordbreak(context: Context): string {
    return this._underlyingModel.wordbreak(context);
  }

  punctuation: LexicalModelPunctuation = {
    insertAfterWord: ' ',
    quotesForKeepSuggestion: {
      open: "“",
      close: "”"
    }
  }
}
