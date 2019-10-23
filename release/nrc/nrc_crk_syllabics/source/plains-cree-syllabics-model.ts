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

  /**
   * The actual work being done by an model whose inputs are in standard Roman
   * orthography (Latn), however it will always output in syllabics (Cans).
   */
  private readonly _underlyingLatnModel = createTrieModel();

  configure(capabilities: Capabilities): Configuration {
    return this._underlyingLatnModel.configure(capabilities);
  }

  /**
   * Takes the transform/context 
   * 
   * @param transform buffer transformation, in Cans
   * @param context buffer context, in Cans
   */
  predict(transform: Transform, context: Context): ProbabilityMass<Suggestion>[] {
    // Convert input from Cans to Latn
    let latnTransform: Transform = Object.assign({}, transform, {
      insert: syllabics2sro(transform.insert)
    });
    let latnContext: Context = Object.assign({}, context, {
      left: syllabics2sro(context.left)
    });

    return this._underlyingLatnModel.predict(latnTransform, latnContext);
  }

  wordbreak(context: Context): string {
    return this._underlyingLatnModel.wordbreak(context);
  }

  /**
   * I'm not super sure what punctuation to use for quotes, but I'm going to
   * explicitly define these punctuation.
   */
  punctuation: LexicalModelPunctuation = {
    insertAfterWord: ' ', // insert a simple space after words
    quotesForKeepSuggestion: {
      open: "“",
      close: "”"
    }
  }
}
