const model = {
  format: 'trie-1.0',
  sources: ['wordlist.tsv'],
  // TODO: there's something wrong when this is provided as a es6 function
  searchTermToKey: function(term: string): string {
    return term.replace(/[êîôâ]|-/g, (m: string) => ({
      ê: 'e', î: 'i', ô: 'o', â: 'a', '-': ''
    }[m]));
  },
};
export default model;
