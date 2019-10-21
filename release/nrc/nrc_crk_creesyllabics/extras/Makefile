PATH := $(PATH):./node_modules/.bin

all: nrc_crk_cans.js

wordlist.tsv: WolfartAhenakew_GS170515_170528cg.vrt
	./mgs-to-wordlist.py > $@

nrc_crk_cans.js: nrc_crk_cans.model.ts wordlist.tsv
	kmlmc $< -o $@
