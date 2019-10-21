#!/usr/bin/env python3
# -*- coding: UTF-8 -*-

from collections import Counter

import sys


# We'll be modifying the last item on the stack
most_likely_analyses = []
previous_lemma = None
previous_lineno = None

DISALLOWED_LIST = ['PUNCT', 'CLB', '^excl', 'Num', 'Lat', 'Err/Frag']
APPROVED_POS = ['V', 'N', 'Ipc', 'Pron']

class NoPosError(Exception):
    pass


def get_pos(analysis):
    for tag in analysis:
        if tag.startswith(('PV/', 'Rdpl')):
            continue
        return tag
    raise NoPosError(f"Could not determine pos of: {analysis}")


with open("WolfartAhenakew_GS170515_170528cg.vrt", encoding="UTF-8") as mgs:
    for lineno, line in enumerate(mgs):
        if not line.startswith("\t"):
            continue

        lemma, *analysis = line.split()
        assert lemma.startswith('"') and lemma.endswith('"')
        # Get rid of quotes
        lemma = lemma[1:-1]

        # Some things have no analysis (???)
        if not analysis:
            continue

        try:
            pos = get_pos(analysis)
        except NoPosError:
            print(f"Error here on line {lineno}:", line)
            raise

        # remove English lemmata:
        if 'Eng' in analysis:
            continue

        if pos in DISALLOWED_LIST:
            continue

        assert pos in APPROVED_POS, f"{lineno}: \"{lemma}\" ({pos})"

        full_analysis = (lemma, *analysis)

        if lemma == previous_lemma and lineno - 1 == previous_lineno:
            competing_analyses = (full_analysis, most_likely_analyses[-1])
            # This is one of several analyses. Choose the shortest.
            most_likely_analyses[-1] = min(competing_analyses, key=len)
        else:
            most_likely_analyses.append(full_analysis)

        previous_lemma = lemma
        previous_lineno = lineno

# TODO: analyze with hfstol

word_count = Counter(most_likely_analyses)

print("#word\tcount")
for lemma, count in word_count.most_common():
    print(lemma, count, sep="\t")
