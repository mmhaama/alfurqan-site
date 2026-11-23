# Creates audio/tts/<key>.mp3 for every text in said.json that has no file yet.
# Voice: Piper "ar_JO-kareem-medium"; pronunciation from our own harakat (arphon.py), never auto-diacritized.
import json, os, subprocess, sys
import numpy as np
from piper import PiperVoice, SynthesisConfig
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from arphon import phonemize, vocalized

ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))
OUT = os.environ.get('TTS_OUT', os.path.join(ROOT, 'audio', 'tts')); os.makedirs(OUT, exist_ok=True)

def norm(t): return ' '.join(t.replace('ـ', '').split())
def key(t):  # FNV-1a 32-bit over UTF-8 of the normalized text — identical to ttsKey() in lang.js
    h = 0x811c9dc5
    for b in norm(t).encode('utf-8'): h = ((h ^ b) * 0x01000193) & 0xffffffff
    return '%08x' % h

texts = [t for t in json.load(open(sys.argv[1])) if '_' not in t]
todo = [t for t in texts if not os.path.exists(os.path.join(OUT, key(t) + '.mp3'))]
print(len(texts), 'texts,', len(todo), 'to generate')
if len(sys.argv) > 2 and sys.argv[2] == '--check':
    for t in todo: print('MISSING', key(t), t)
    sys.exit(1 if todo else 0)
if todo:
    v = PiperVoice.load(sys.argv[2])
    cfg = SynthesisConfig(length_scale=1.15, noise_scale=0.5, noise_w_scale=0.6)
    rate = v.config.sample_rate
    for t in todo:
        if vocalized(t):
            ph = [c for p in phonemize(t) for c in p]
            audio = v.phoneme_ids_to_audio(v.phonemes_to_ids(ph), cfg)
        else:
            audio = np.concatenate([c.audio_float_array for c in v.synthesize(t, cfg)])
        pcm = (np.clip(np.asarray(audio, dtype=np.float32), -1, 1) * 32767).astype('<i2').tobytes()
        pad = b'\x00\x00' * int(rate * 0.12)
        subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-f', 's16le', '-ar', str(rate), '-ac', '1', '-i', '-',
                        '-b:a', '48k', os.path.join(OUT, key(t) + '.mp3')], input=pad + pcm + pad, check=True)
        print(key(t), t)
