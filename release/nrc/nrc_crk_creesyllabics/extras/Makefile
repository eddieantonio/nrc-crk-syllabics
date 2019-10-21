PATH := $(PATH):./node_modules/.bin

nrc_crk_syllabics.js: nrc_crk_syllabics.model.ts
	kmlmc $< -o $@

trie.json: sro-model.js ./extract-model-to-json.js
	node ./extract-model-to-json.js $< > $@

wordlist.tsv: WolfartAhenakew_GS170515_170528cg.vrt ./mgs-to-wordlist.py
	./mgs-to-wordlist.py > $@

sro-model.js: sro.model.ts wordlist.tsv
	kmlmc $< -o $@
