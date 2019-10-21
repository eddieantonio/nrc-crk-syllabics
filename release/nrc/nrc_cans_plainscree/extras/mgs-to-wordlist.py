#!/usr/bin/env python3
# -*- coding: UTF-8 -*-

"""
	"yêkawiskâwikamâhk"  N Prop
	"."  CLB
	"["  PUNCT LEFT
	"51"  Num Arab
	"]"  PUNCT RIGHT
	"êkosi"  Ipc
	"["  PUNCT LEFT
	"Noun" laughter  Eng
	"]"  PUNCT RIGHT
	"."  CLB
"""

from collections import Counter

import sys


word_count = Counter()

with open("WolfartAhenakew_GS170515_170528cg.vrt", encoding="UTF-8") as mgs:
    for line in mgs:
        if not line.startswith("\t"):
            continue
        lemma, *analysis = line.split()

        assert lemma.startswith('"') and lemma.endswith('"')
        word_count[lemma] += 1

print("#word\tcount")
for lemma, count in word_count.most_common():
    print(lemma, count, sep="\t")
