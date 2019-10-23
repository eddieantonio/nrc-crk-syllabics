# Generates the Syllabics (internally SRO) model.
#
#
# Requirements:
#  - Python 3.6+
#  - NodeJS 10.x+
#
# Required files (not included in this repository):
#  - ahenakew_wolfart_MGS_tab-sep-anls_freq-sorted.txt
#
# How files are generated:
#
#  ahenakew_wolfart_MGS_tab-sep-anls_freq-sorted.txt
#   -[ mgs-to-wordlist.py ]-> 		wordlist.txt
#   -[ kmlmc ]-> 					sro-model.js 			(an SRO trie model)
#   -[ extract-model-to-json.js ]-> trie.json 				(a trie data structure with SRO keys and syllabics values)
#   -[ json-to-trie-model.js ]-> 	create-trie-model.ts 	(a trie model used internally in the custom model)
#   -[ kmlmc ]-> 					nrc_crk_syllabics.js    (THE custom trie model!)
#   -[ kmlmp ]-> 					nrc_crk_syllabics.kpm   (distributable package)
#

KMLMC = npx kmlmc

# This is the file that is parsed to generated a wordlist.
SRC = ahenakew_wolfart_MGS_tab-sep-anls_freq-sorted.txt

# Yes, the destination is called source/...
DEST = ../source

BUILD = ../build

$(BUILD)/nrc_crk_syllabics.js: $(DEST)/nrc_crk_syllabics.model.ts $(DEST)/create-trie-model.ts $(DEST)/plains-cree-syllabics-model.ts $(DEST)/syllabics2sro.ts $(BUILD)
	$(KMLMC) $< -o $@

$(DEST)/create-trie-model.ts: $(BUILD)/trie.json json-to-trie-model.py
	./json-to-trie-model.py $< > $@

$(BUILD)/trie.json: $(BUILD)/sro-model.js extract-model-to-json.js
	node ./extract-model-to-json.js $< > $@

$(BUILD)/sro-model.js: sro.model.ts $(BUILD)/wordlist.tsv node_modules
	$(KMLMC) $< -o $@

$(BUILD)/wordlist.tsv: $(SRC) mgs-to-wordlist.py $(BUILD)
	./mgs-to-wordlist.py > $@

# Create the build directory.
$(BUILD):
	mkdir -p $@

node_modules: package.json
	npm install

# Phony rules:

get-deps: node_modules

clean:
	$(RM) $(BUILD)

.PHONY: clean get-deps
