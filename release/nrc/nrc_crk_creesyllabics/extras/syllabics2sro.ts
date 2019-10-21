/*
 * Copyright (C) 2018 Eddie Antonio Santos <easantos@ualberta.ca>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

'use strict'

let syllabics2sro = (function () {

// ============================ Constants ============================ \\

// Since JavaScript engines I want to support (e.g., Safari, IE11) don't
// support negative lookbehind, I caputre the "lookbehind" in the word
// pattern, only to glue it together again later.
const finalDotPattern = /([\u1401\u1403\u1404\u1405\u1406\u140A\u140B\u142F\u1431\u1432\u1433\u1434\u1438\u1439\u144C\u144E\u144F\u1450\u1451\u1455\u1456\u146B\u146D\u146E\u146F\u1470\u1472\u1473\u1489\u148B\u148C\u148D\u148E\u1490\u1491\u14A3\u14A5\u14A6\u14A7\u14A8\u14AA\u14AB\u14C0\u14C7\u14C8\u14ED\u14EF\u14F0\u14F1\u14F2\u14F4\u14F5\u1526\u1528\u1529\u152A\u152B\u152D\u152E])\u1427/g

// Lookup tables:
const sro2syllabicsLookup = { 'ê': 'ᐁ', 'i': 'ᐃ', 'î': 'ᐄ', 'o': 'ᐅ', 'ô': 'ᐆ', 'a': 'ᐊ', 'â': 'ᐋ', 'wê': 'ᐍ', 'wi': 'ᐏ', 'wî': 'ᐑ', 'wo': 'ᐓ', 'wô': 'ᐕ', 'wa': 'ᐘ', 'wâ': 'ᐚ', 'w': 'ᐤ', 'p': 'ᑊ', 'pê': 'ᐯ', 'pi': 'ᐱ', 'pî': 'ᐲ', 'po': 'ᐳ', 'pô': 'ᐴ', 'pa': 'ᐸ', 'pâ': 'ᐹ', 'pwê': 'ᐻ', 'pwi': 'ᐽ', 'pwî': 'ᐿ', 'pwo': 'ᑁ', 'pwô': 'ᑃ', 'pwa': 'ᑅ', 'pwâ': 'ᑇ', 't': 'ᐟ', 'tê': 'ᑌ', 'ti': 'ᑎ', 'tî': 'ᑏ', 'to': 'ᑐ', 'tô': 'ᑑ', 'ta': 'ᑕ', 'tâ': 'ᑖ', 'twê': 'ᑘ', 'twi': 'ᑚ', 'twî': 'ᑜ', 'two': 'ᑞ', 'twô': 'ᑠ', 'twa': 'ᑢ', 'twâ': 'ᑤ', 'k': 'ᐠ', 'kê': 'ᑫ', 'ki': 'ᑭ', 'kî': 'ᑮ', 'ko': 'ᑯ', 'kô': 'ᑰ', 'ka': 'ᑲ', 'kâ': 'ᑳ', 'kwê': 'ᑵ', 'kwi': 'ᑷ', 'kwî': 'ᑹ', 'kwo': 'ᑻ', 'kwô': 'ᑽ', 'kwa': 'ᑿ', 'kwâ': 'ᒁ', 'c': 'ᐨ', 'cê': 'ᒉ', 'ci': 'ᒋ', 'cî': 'ᒌ', 'co': 'ᒍ', 'cô': 'ᒎ', 'ca': 'ᒐ', 'câ': 'ᒑ', 'cwê': 'ᒓ', 'cwi': 'ᒕ', 'cwî': 'ᒗ', 'cwo': 'ᒙ', 'cwô': 'ᒛ', 'cwa': 'ᒝ', 'cwâ': 'ᒟ', 'm': 'ᒼ', 'mê': 'ᒣ', 'mi': 'ᒥ', 'mî': 'ᒦ', 'mo': 'ᒧ', 'mô': 'ᒨ', 'ma': 'ᒪ', 'mâ': 'ᒫ', 'mwê': 'ᒭ', 'mwi': 'ᒯ', 'mwî': 'ᒱ', 'mwo': 'ᒳ', 'mwô': 'ᒵ', 'mwa': 'ᒷ', 'mwâ': 'ᒹ', 'n': 'ᐣ', 'nê': 'ᓀ', 'ni': 'ᓂ', 'nî': 'ᓃ', 'no': 'ᓄ', 'nô': 'ᓅ', 'na': 'ᓇ', 'nâ': 'ᓈ', 'nwê': 'ᓊ', 'nwa': 'ᓌ', 'nwâ': 'ᓎ', 's': 'ᐢ', 'sê': 'ᓭ', 'si': 'ᓯ', 'sî': 'ᓰ', 'so': 'ᓱ', 'sô': 'ᓲ', 'sa': 'ᓴ', 'sâ': 'ᓵ', 'swê': 'ᓷ', 'swi': 'ᓹ', 'swî': 'ᓻ', 'swo': 'ᓽ', 'swô': 'ᓿ', 'swa': 'ᔁ', 'swâ': 'ᔃ', 'y': 'ᕀ', 'yê': 'ᔦ', 'yi': 'ᔨ', 'yî': 'ᔩ', 'yo': 'ᔪ', 'yô': 'ᔫ', 'ya': 'ᔭ', 'yâ': 'ᔮ', 'ywê': 'ᔰ', 'ywi': 'ᔲ', 'ywî': 'ᔴ', 'ywo': 'ᔶ', 'ywô': 'ᔸ', 'ywa': 'ᔺ', 'ywâ': 'ᔼ', 'th': 'ᖮ', 'thê': 'ᖧ', 'thi': 'ᖨ', 'thî': 'ᖩ', 'tho': 'ᖪ', 'thô': 'ᖫ', 'tha': 'ᖬ', 'thâ': 'ᖭ', 'thwê': '\u1677', 'thwi': '\u1678', 'thwî': '\u1679', 'thwo': '\u167A', 'thwô': '\u167B', 'thwa': '\u167C', 'thwâ': '\u167D', 'l': 'ᓬ', 'r': 'ᕒ', 'h': 'ᐦ', 'hk': 'ᕽ' }
// Create the syllabics2sroLookup as the inverse of sro2syllabicsLookup
const syllabics2sroLookup = (function () {
  var syl: string // IE11 doesn't handle `let` in for-loops properly :(
  let lookup = {}
  // IE11 also doesn't do for-of, so I need for-in, with the
  // ritual .hasOwnProperty() check :C
  for (var sro in sro2syllabicsLookup) {
    /* istanbul ignore if */
    if (!sro2syllabicsLookup.hasOwnProperty(sro)) {
      continue
    }
    syl = sro2syllabicsLookup[sro]

    lookup[syl] = sro
  }
  // Add a few alternate and lookalike characters to the lookup, as well as
  // the syllabics "hyphen".
  let alternates = {
    'ᐝ': 'y', '᙮': '.', 'ᑦ': 'm', 'ᕁ': 'hk', 'ᐩ': 'y', '\u202f': '-'
  }
  // Use for-in and .hasOwnProperty() check for IE11 compatibility 😡
  for (syl in alternates) {
    if (alternates.hasOwnProperty(syl)) {
      lookup[syl] = alternates[syl]
    }
  }
  return lookup
})()
// Convert SYLLABIC + FINAL DOT into SYLLABIC WITH DOT
const SYLLABIC_WITH_DOT = { 'ᐁ': 'ᐍ', 'ᐃ': 'ᐏ', 'ᐄ': 'ᐑ', 'ᐅ': 'ᐓ', 'ᐆ': 'ᐕ', 'ᐊ': 'ᐘ', 'ᐋ': 'ᐚ', 'ᐯ': 'ᐻ', 'ᐱ': 'ᐽ', 'ᐲ': 'ᐿ', 'ᐳ': 'ᑁ', 'ᐴ': 'ᑃ', 'ᐸ': 'ᑅ', 'ᐹ': 'ᑇ', 'ᑌ': 'ᑘ', 'ᑎ': 'ᑚ', 'ᑏ': 'ᑜ', 'ᑐ': 'ᑞ', 'ᑑ': 'ᑠ', 'ᑕ': 'ᑢ', 'ᑖ': 'ᑤ', 'ᑫ': 'ᑵ', 'ᑭ': 'ᑷ', 'ᑮ': 'ᑹ', 'ᑯ': 'ᑻ', 'ᑰ': 'ᑽ', 'ᑲ': 'ᑿ', 'ᑳ': 'ᒁ', 'ᒉ': 'ᒓ', 'ᒋ': 'ᒕ', 'ᒌ': 'ᒗ', 'ᒍ': 'ᒙ', 'ᒎ': 'ᒛ', 'ᒐ': 'ᒝ', 'ᒑ': 'ᒟ', 'ᒣ': 'ᒭ', 'ᒥ': 'ᒯ', 'ᒦ': 'ᒱ', 'ᒧ': 'ᒳ', 'ᒨ': 'ᒵ', 'ᒪ': 'ᒷ', 'ᒫ': 'ᒹ', 'ᓀ': 'ᓊ', 'ᓇ': 'ᓌ', 'ᓈ': 'ᓎ', 'ᓭ': 'ᓷ', 'ᓯ': 'ᓹ', 'ᓰ': 'ᓻ', 'ᓱ': 'ᓽ', 'ᓲ': 'ᓿ', 'ᓴ': 'ᔁ', 'ᓵ': 'ᔃ', 'ᔦ': 'ᔰ', 'ᔨ': 'ᔲ', 'ᔩ': 'ᔴ', 'ᔪ': 'ᔶ', 'ᔫ': 'ᔸ', 'ᔭ': 'ᔺ', 'ᔮ': 'ᔼ' }

// A few character translation functions.
const circumflexToMacrons = makeTranslation('êîôâ', 'ēīōā')
const translateAltForms = makeTranslation("eē'’īōā", 'êêiiîôâ')
const syllabicToSRO = makeTranslation(Object.keys(syllabics2sroLookup), (function values () {
  // Work around for lack of Object.values() on some platforms.
  var a: string[] = []
  var syl: string
  for (syl in syllabics2sroLookup) {
    if (syllabics2sroLookup.hasOwnProperty(syl)) {
      a.push(syllabics2sroLookup[syl])
    }
  }
  return a
}()))

// ========================= Primary Exports ========================= \\

// EXPORT: Convert syllabics to SRO:
function syllabics2sro (syllabics: string): string {
  var normalized = syllabics.replace(finalDotPattern, fixFinalDot)
  return syllabicToSRO(normalized)
}

// ========================= Helper functions ========================= \\

/**
 * Converts a syllabic into its w-dotted equivilent.
 */
function fixFinalDot (match: string): string {
  return SYLLABIC_WITH_DOT[match[0]]
}

/**
 * Returns a function that translates cooresponding code units from string 1
 * to string 2.
 * Like Unix tr(1).
 */
function makeTranslation (original: string | string[], replacement: string | string[]) {
  let translation = new Map()
  Array.prototype.forEach.call(original, function setMap (source, index) {
    translation.set(source, replacement[index] || '')
  })

  return function (s: string) {
    return Array.prototype.map.call(s, function replace (ch: string) {
      return translation.has(ch) ? translation.get(ch) : ch
    }).join('')
  }
}
  return syllabics2sro;
})();