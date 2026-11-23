# Diagnostic: synthesizes sample words several ways and transcribes them with Whisper, to compare pronunciation.
import sys, os, json, wave, subprocess
import numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import arphon
from piper import PiperVoice, SynthesisConfig
import whisper

W = ['نَحْلَة', 'نُور', 'نُعَاس', 'نُزْهَة', 'نِعْنَاع', 'نِظَّارَة', 'نِصْف', 'نِدَاء', 'قَمَر', 'بَطَّة', 'كِتَاب', 'هَذِهِ وَرْدَةٌ.']
v = PiperVoice.load(sys.argv[1]); rate = v.config.sample_rate
cfg = SynthesisConfig(length_scale=1.15, noise_scale=0.5, noise_w_scale=0.6)

def to_vowel_stress(ph):   # move each stress mark from before the onset consonant to just before the vowel (espeak style)
    out = []; i = 0; p = [c for x in ph for c in x]
    while i < len(p):
        if p[i] == 'ˈ':
            j = i + 1
            while j < len(p) and p[j] not in 'aiu': j += 1
            out += p[i + 1:j] + ['ˈ']; i = j; continue
        out.append(p[i]); i += 1
    return out

def restress(ph):  # correct Arabic stress rule, mark placed just before the vowel
    p = [c for x in ph for c in x]
    words, cur = [], []
    for c in p:
        if c in ' ,.?!': words.append(cur); words.append([c]); cur = []
        elif c != 'ˈ': cur.append(c)
    words.append(cur); out = []
    for w in words:
        if not w or w[0] in ' ,.?!': out += w; continue
        V = [k for k, c in enumerate(w) if c in 'aiu']
        if not V: out += w; continue
        syl = []
        for n, k in enumerate(V):
            end = V[n + 1] if n + 1 < len(V) else len(w)
            coda = [c for c in w[k + 1:end] if c != 'ː']
            long_ = k + 1 < len(w) and w[k + 1] == 'ː'
            if n + 1 < len(V): coda = coda[:-1]          # last consonant before next vowel is its onset
            syl.append((k, long_, len(coda)))
        k, lg, cd = syl[-1]
        if len(syl) == 1 or (lg and cd >= 1) or cd >= 2: s = len(syl) - 1
        elif syl[-2][1] or syl[-2][2] >= 1 or len(syl) == 2: s = len(syl) - 2
        else: s = len(syl) - 3
        k = syl[s][0]; out += w[:k] + ['ˈ'] + w[k:]
    return out

def save(name, audio):
    pcm = (np.clip(np.asarray(audio, dtype=np.float32), -1, 1) * 32767).astype('<i2')
    with wave.open(name, 'wb') as f:
        f.setnchannels(1); f.setsampwidth(2); f.setframerate(rate); f.writeframes(pcm.tobytes())

def esp(t, tash):
    v.use_tashkeel = tash
    ph = v.phonemize(t); return [c for s in ph for c in s]

os.makedirs('/tmp/d', exist_ok=True)
asr = whisper.load_model('medium')
for t in W:
    A = [c for x in arphon.phonemize(t) for c in x]
    variants = {'A_ours': A, 'B_ours_vstress': to_vowel_stress(arphon.phonemize(t)), 'C_espeak': esp(t, False), 'D_espeak_tashkeel': esp(t, True), 'E_ours_fixed_stress': restress(arphon.phonemize(t))}
    print('\n==', t)
    for k, ph in variants.items():
        f = f'/tmp/d/{k}.wav'; save(f, v.phoneme_ids_to_audio(v.phonemes_to_ids(ph), cfg))
        r = asr.transcribe(f, language='ar', temperature=0, fp16=False)['text'].strip()
        print(f'  {k:18} {"".join(ph):28} -> {r}')
