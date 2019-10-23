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

$(BUILD)/sro-model.js: sro.model.ts $(BUILD)/wordlist.tsv
	$(KMLMC) $< -o $@

$(BUILD)/wordlist.tsv: $(SRC) mgs-to-wordlist.py $(BUILD)
	./mgs-to-wordlist.py > $@

# Create the build directory.
$(BUILD):
	mkdir -p $@
