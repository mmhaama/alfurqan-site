# Fully-vocalized Arabic -> IPA phonemes in the symbol set the Piper ar_JO voice was trained on.
# Reads exactly the harakat we wrote (no automatic re-diacritization), so vowels are never guessed.
FATHA, DAMMA, KASRA, SUKUN, SHADDA = 'َ', 'ُ', 'ِ', 'ْ', 'ّ'
TAN = {'ً': 'an', 'ٌ': 'un', 'ٍ': 'in'}
HAR = {FATHA: 'a', DAMMA: 'u', KASRA: 'i'}
C = {'ب': 'b', 'ت': 't', 'ث': 'θ', 'ج': 'dʒ', 'ح': 'ħ', 'خ': 'χ', 'د': 'd', 'ذ': 'ð', 'ر': 'r', 'ز': 'z', 'س': 's',
     'ش': 'ʃ', 'ص': 's̪', 'ض': 'dˤ', 'ط': 't̪', 'ظ': 'ðˤ', 'ع': 'ʕ', 'غ': 'ɣ', 'ف': 'f', 'ق': 'q', 'ك': 'k', 'ل': 'l',
     'م': 'm', 'ن': 'n', 'ه': 'h', 'و': 'w', 'ي': 'j', 'ء': 'ʔ', 'أ': 'ʔ', 'إ': 'ʔ', 'ؤ': 'ʔ', 'ئ': 'ʔ', 'ة': 't'}
SUN = set('تثدذرزسشصضطظلن')
MARKS = set(HAR) | set(TAN) | {SUKUN, SHADDA, 'ٰ'}
NAMES = dict(zip('ابتثجحخدذرزسشصضطظعغفقكلمنهوي', ['أَلِف','بَاء','تَاء','ثَاء','جِيم','حَاء','خَاء','دَال','ذَال','رَاء','زَاي','سِين','شِين','صَاد','ضَاد','طَاء','ظَاء','عَيْن','غَيْن','فَاء','قَاف','كَاف','لَام','مِيم','نُون','هَاء','وَاو','يَاء']))

def letters(w):
    """[(base, marks)] for one word."""
    out = []
    for ch in w:
        if ch in MARKS and out: out[-1][1].append(ch)
        elif ch == 'ـ': continue
        else: out.append([ch, []])
    return out

def word(w, first, last):
    L = letters(w); ph = []
    i = 0
    if len(L) >= 2 and L[0][0] == 'ا' and L[1][0] == 'ل' and not L[0][1]:   # definite article
        nxt = L[2][0] if len(L) > 2 else ''
        if first: ph += ['ʔ', 'a']
        if nxt in SUN: i = 2           # lam assimilated (next letter carries shadda)
        else: ph += ['l']; i = 2
    elif L and L[0][0] == 'ا' and not L[0][1]:                            # hamzat wasl
        i = 1
        if first: ph += ['ʔ', 'i']
    while i < len(L):
        b, m = L[i]; nb = L[i + 1] if i + 1 < len(L) else None
        vow = next((HAR[x] for x in m if x in HAR), None)
        tan = next((TAN[x] for x in m if x in TAN), None)
        if b == 'آ': ph += ['ʔ', 'a', 'ː']; i += 1; continue
        if b in 'اى':                                                         # long a / seat of tanween
            if ph and ph[-1] == 'a': ph.append('ː')
            elif tan: pass
            i += 1; continue
        if b in 'وي' and not m and ph and ph[-1] == ('u' if b == 'و' else 'i'):
            ph.append('ː'); i += 1; continue                                  # long u / i
        if b == 'ة' and not vow and not tan:                                  # pausal taa marbuta
            i += 1; continue
        if b not in C: i += 1; continue
        c = C[b]
        if b in 'وي' and SUKUN in m and ph and ph[-1] == 'a':                # diphthong
            ph.append('u' if b == 'و' else 'i'); i += 1; continue
        if SHADDA in m: ph += [c, c]
        else: ph.append(c)
        if vow: ph.append(vow)
        if tan:
            if last and tan != 'an': ph.append(tan[0])                        # pause: -un/-in -> -u/-i
            else: ph += list(tan) if not last else ['a', 'ː']
        i += 1
    return ph

def stress(ph):
    V = set('aiu')
    idx = [k for k, p in enumerate(ph) if p in V]
    if not idx: return ph
    syl = []
    for k in idx:
        long_ = k + 1 < len(ph) and ph[k + 1] == 'ː'
        j = k + (2 if long_ else 1)
        closed = j < len(ph) and ph[j] not in V and (j + 1 >= len(ph) or ph[j + 1] not in V)
        syl.append((k, long_ or closed))
    if len(syl) == 1: s = 0
    else:
        k, heavy = syl[-1]
        tail = ph[k + 1:]
        if heavy and len([p for p in tail if p not in 'ː']) >= 2: s = len(syl) - 1   # superheavy final
        elif syl[-2][1] or len(syl) == 2: s = len(syl) - 2
        else: s = len(syl) - 3
    k = syl[s][0]
    on = k - 1 if k > 0 and ph[k - 1] not in V and ph[k - 1] != 'ː' else k
    return ph[:on] + ['ˈ'] + ph[on:]

def phonemize(text):
    t = ' '.join(text.replace('...', '،').split()).strip()
    if len(t) == 1 and t in NAMES: t = NAMES[t]
    if len(letters(t)) == 1 and t[0] in C and SUKUN in t: t = 'أَ' + t   # "بْ" -> "أَبْ"
    out = []
    parts = t.replace('،', ' , ').replace(',', ' , ').replace('.', ' . ').replace('؟', ' ? ').replace('!', ' ! ').split()
    words = [p for p in parts]
    for n, p in enumerate(words):
        if p in ',.?!': out.append(p); continue
        first = n == 0 or words[n - 1] in ',.?!'
        last = n == len(words) - 1 or words[n + 1] in ',.?!'
        if out and out[-1] not in ',.?!': out.append(' ')
        elif out: out.append(' ')
        out += stress(word(p, first, last))
    return out

def vocalized(text):
    return any(ch in MARKS for ch in text)
