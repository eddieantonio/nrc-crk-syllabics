KMLMC = npx kmlmc

nrc_crk_syllabics.js: nrc_crk_syllabics.model.ts create-trie-model.ts plains-cree-syllabics-model.ts syllabics2sro.ts
	$(KMLMC) $< -o $@

trie.json: sro-model.js ./extract-model-to-json.js
	node ./extract-model-to-json.js $< > $@

wordlist.tsv: WolfartAhenakew_GS170515_170528cg.vrt ./mgs-to-wordlist.py
	./mgs-to-wordlist.py > $@

create-trie-model.ts: trie.json json-to-trie-model.py
	./json-to-trie-model.py trie.json > $@

sro-model.js: sro.model.ts wordlist.tsv
	$(KMLMC) $< -o $@
