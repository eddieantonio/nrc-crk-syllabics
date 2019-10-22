#!/usr/bin/env python3
# -*- coding: UTF-8 -*-

with open('trie.json') as triefile:
    json_text = triefile.read().strip()

print(f"""
function createTrieModel() {{
    return new models.TrieModel(JSON.parse({json_text!r}), {{
        searchTermToKey: function(text) {{
            return text
                .replace('ê', 'e')
                .replace('î', 'i')
                .replace('ô', 'o')
                .replace('â', 'a')
                .replace('-', '');
        }},
        wordBreaker: function (text: string) {{
           return [{{ start: 0, end: text.length, length: text.length, text: text }}];
        }}
    }});
}}
""")
