# Creates audio/g/<key>.mp3 for every text in said.json that has no file yet,
# using Google Cloud Text-to-Speech (Arabic WaveNet voice). Needs env GOOGLE_TTS_KEY.
import base64, json, os, sys, urllib.request

ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))
OUT = os.environ.get('TTS_OUT', os.path.join(ROOT, 'audio', 'g')); os.makedirs(OUT, exist_ok=True)
VOICE = os.environ.get('TTS_VOICE', 'ar-XA-Wavenet-B')
NAMES = dict(zip('ابتثجحخدذرزسشصضطظعغفقكلمنهوي', ['أَلِف', 'بَاء', 'تَاء', 'ثَاء', 'جِيم', 'حَاء', 'خَاء', 'دَال', 'ذَال', 'رَاء', 'زَاي', 'سِين', 'شِين', 'صَاد', 'ضَاد', 'طَاء', 'ظَاء', 'عَيْن', 'غَيْن', 'فَاء', 'قَاف', 'كَاف', 'لَام', 'مِيم', 'نُون', 'هَاء', 'وَاو', 'يَاء']))

def norm(t): return ' '.join(t.replace('ـ', '').split())
def key(t):  # FNV-1a 32-bit over UTF-8 of the normalized text — identical to ttsKey() in lang.js
    h = 0x811c9dc5
    for b in norm(t).encode('utf-8'): h = ((h ^ b) * 0x01000193) & 0xffffffff
    return '%08x' % h
def speakable(t):
    t = norm(t).replace('...', '،')
    if t in NAMES: return NAMES[t]                                  # a bare letter is read by its name
    if len(t) == 2 and t[0] in NAMES and t[1] == 'ْ': return 'أَ' + t   # "بْ" -> "أَبْ"
    return t

texts = [t for t in json.load(open(sys.argv[1])) if '_' not in t and norm(t)]
todo = [t for t in texts if not os.path.exists(os.path.join(OUT, key(t) + '.mp3'))]
print(len(texts), 'texts,', len(todo), 'to generate')
if '--check' in sys.argv:
    for t in todo: print('MISSING', key(t), t)
    sys.exit(1 if todo else 0)
K = os.environ.get('GOOGLE_TTS_KEY', '')
if todo and not K:
    print('::warning::GOOGLE_TTS_KEY is not set yet - no recordings generated'); sys.exit(0)
for t in todo:
    body = {'input': {'text': speakable(t)}, 'voice': {'languageCode': 'ar-XA', 'name': VOICE},
            'audioConfig': {'audioEncoding': 'MP3', 'speakingRate': 0.85, 'sampleRateHertz': 24000}}
    req = urllib.request.Request('https://texttospeech.googleapis.com/v1/text:synthesize?key=' + K,
                                 data=json.dumps(body).encode(), headers={'Content-Type': 'application/json'})
    with urllib.request.urlopen(req, timeout=60) as r:
        open(os.path.join(OUT, key(t) + '.mp3'), 'wb').write(base64.b64decode(json.load(r)['audioContent']))
    print(key(t), t)
