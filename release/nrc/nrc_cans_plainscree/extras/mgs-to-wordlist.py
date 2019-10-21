#!/usr/bin/env python3
# -*- coding: UTF-8 -*-

import sys
from collections import Counter
from unicodedata import normalize
from functools import partial

# These are mostly mistakes in tagging:
BANNED_LEMMATA = ["IC", "V", "N"]
DISALLOWED_LIST = [
    "PUNCT",
    "CLB",
    "^excl",
    "Num",
    "Lat",
    "Err/Frag",
    "?",
    "Art",
    "Err/Orth",
    "Code",
    "Frag",
    "Morph",
    "Lemma",
    # This one is a mistake: ignore
    "wêpinam",
    # This is also a mistake:
    "AI",
    # Mistake:
    "PV/aya",
    None,
]
# Cnj is a typo, but whatever
APPROVED_POS = ["V", "N", "Ipc", "Pron", "Cnj"]


class Analysis:
    def __init__(self, text):
        full_analysis = [tag for tag in text.split("+") if tag.strip()]
        lemma_pos = get_lemma_pos(full_analysis)
        self.prefixes = full_analysis[:lemma_pos]
        self.lemma = full_analysis[lemma_pos]
        self.suffixes = full_analysis[lemma_pos + 1 :]

    @property
    def pos(self):
        try:
            return self.suffixes[0]
        except IndexError:
            return None

    @property
    def is_english(self):
        return "Eng" in self.suffixes

    def __repr__(self):
        return f"<Analysis lemma={self.lemma!r} pos={self.pos!r} prefixes={self.prefixes} suffixes={self.suffixes}>"


class NoPosError(Exception):
    pass


def get_lemma_pos(analysis):
    for pos, tag in enumerate(analysis):
        if tag.startswith(("PV/", "Rdpl", "*Rdpl", "*PV/")):
            continue
        return pos
    raise NoPosError(f"Could not determine pos of: {analysis}")


nfc = partial(normalize, "NFC")


word_count = Counter()

with open("ahenakew_wolfart_MGS_tab-sep-anls_freq-sorted.txt", encoding="UTF-8") as mgs:
    for line in mgs:
        line = line.strip()

        try:
            count_string, wordform, *raw_analyses = line.split()
        except ValueError:
            # Malformed line... :/
            continue

        good_analyses = []
        for text in raw_analyses:
            try:
                analysis = Analysis(text)
            except NoPosError:
                # A mistake, probably
                continue

            if analysis.lemma in BANNED_LEMMATA:
                continue
            if analysis.pos in DISALLOWED_LIST:
                continue
            if analysis.is_english:
                continue
            assert analysis.pos in APPROVED_POS, f"{line!r}: {analysis!r}"
            good_analyses.append(analysis)

        if not good_analyses:
            continue

        word_count[nfc(wordform)] += int(count_string)


print("#word\tcount")
for lemma, count in word_count.most_common():
    print(lemma, count, sep="\t")
