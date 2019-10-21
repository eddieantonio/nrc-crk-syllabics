#!/usr/bin/env python3
# -*- coding: UTF-8 -*-

import sys
from collections import Counter
from unicodedata import normalize
from functools import partial

VALID_POS = [
    "V",
    "N",
    "Ipc",
    "PUNCT",
    "CLB",
    "Eng",
    "Lat",
    "Pron",
    "Num",
    "?",
    "Err/Frag",
    "Verb",
    "Noun",
    "Adj",
    "Morph",
    "Ord",
    "Prop",
    "Code",
]

ALLOWED_POS = [
    "V",
    "N",
    "Ipc",
    "Pron",
]

alphabet = 'êioaîôâ-ptkcshmnywlr'

class Analysis:
    def __init__(self, text):
        if text.startswith("+") and "+" not in text[1:]:
            self.prefixes = ()
            self.suffixes = (text.lstrip("+"),)
            self.lemma = ""
        else:
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


class InvalidAnalysisError(Exception):
    pass


def get_lemma_pos(analysis):
    for pos, tag in enumerate(analysis):
        if tag.startswith(("PV/", "Rdpl", "*Rdpl", "*PV/")):
            continue
        return pos
    raise NoPosError(f"Could not determine pos of: {analysis}")


nfc = partial(normalize, "NFC")


word_count = Counter()


def add_from_line(line):
    line = line.strip()

    if not line:
        return

    try:
        count_string, wordform, *raw_analyses = line.split()
    except ValueError:
        raise InvalidAnalysisError

    good_analyses = []
    for text in raw_analyses:
        if "Frag" in text or "Err/" in text:
            continue

        try:
            analysis = Analysis(text)
        except NoPosError:
            raise InvalidAnalysisError

        if analysis.pos not in VALID_POS:
            raise InvalidAnalysisError

        if analysis.pos not in ALLOWED_POS:
            continue

        if 'Prop' in analysis.suffixes:
            continue

        if analysis.is_english:
            continue

        good_analyses.append(analysis)

    if not good_analyses:
        return

    wordform = nfc(wordform)

    if not all(letter in alphabet for letter in wordform):
        print(f"{wordform}: invalid character", file=sys.stderr)
        return

    word_count[wordform] += int(count_string)


with open("ahenakew_wolfart_MGS_tab-sep-anls_freq-sorted.txt", encoding="UTF-8") as mgs:
    for lineno, line in enumerate(mgs):
        try:
            add_from_line(line)
        except InvalidAnalysisError:
            print("Invalid line:", line.strip(), file=sys.stderr)


print("#word\tcount")
for lemma, count in word_count.most_common():
    print(lemma, count, sep="\t")
