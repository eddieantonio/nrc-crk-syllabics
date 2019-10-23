#!/usr/bin/env python3
# -*- coding: UTF-8 -*-

import unittest
from subprocess import check_output
from pathlib import Path

HERE = Path(__file__).parent

MODEL_PATH = HERE / ".." / "build" / "nrc.crk.syllabics.model.js"


class TestModel(unittest.TestCase):
    def test_basic(self):
        self.assertIn("ᐁᑿ", predict("ᐁᐠᐤ"))


def predict(text: str) -> dict:
    raw_output = check_output(["lmlayer-cli", "-f", MODEL_PATH, "-p", text])
    return raw_output.decode("UTF-8").split("\n")[0].split("\t")[1:]


if __name__ == "__main__":
    assert MODEL_PATH.exists(), MODEL_PATH
    unittest.main()
