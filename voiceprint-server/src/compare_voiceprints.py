#!/usr/bin/python3
import sys
import json
import warnings
warnings.filterwarnings("ignore")


import logging
from pathlib import Path
from resemblyzer import VoiceEncoder, preprocess_wav
from numpy import dot, linalg
import contextlib
import os

logging.getLogger().setLevel(logging.ERROR)

if len(sys.argv) < 3:
    sys.exit(1)

file1, file2 = sys.argv[1], sys.argv[2]

if not Path(file1).exists() or not Path(file2).exists():
    sys.exit(1)

try:
    # Suppress stdout temporarily while initializing VoiceEncoder
    with open(os.devnull, 'w') as fnull, contextlib.redirect_stdout(fnull):
        encoder = VoiceEncoder()

    wav1 = preprocess_wav(Path(file1))
    wav2 = preprocess_wav(Path(file2))

    embed1 = encoder.embed_utterance(wav1)
    embed2 = encoder.embed_utterance(wav2)

    similarity = dot(embed1, embed2) / (linalg.norm(embed1) * linalg.norm(embed2))
    output = {"result": round(float(similarity), 3)}
    print(json.dumps(output), flush=True)

except Exception as e:
    print(json.dumps({"error": str(e)}), file=sys.stderr, flush=True)
    sys.exit(1)
