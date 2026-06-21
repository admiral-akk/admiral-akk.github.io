const intensity = Number(musicParams.intensity ?? 0.35);
const seedOffset = Number(musicParams.seed ?? 0) % 7;
const progress = Number(musicParams.progress ?? 0);
const root = ['c3', 'd3', 'e3', 'g2', 'a2', 'f3', 'g3'][seedOffset];
const bellGain = musicVolume * (0.12 + intensity * 0.16);
const padGain = musicVolume * (0.04 + intensity * 0.05);
const pulseGain = musicVolume * (0.06 + intensity * 0.08);
const sparkleGain = musicVolume * Math.max(0, intensity - 0.15) * 0.12;
const noteClip = 0.16;
const noteDecay = 0.08;
const noteRelease = 0.08;

stack(
  note(root + ' ~ ~ <g3 c4 e4>')
    .sound('triangle')
    .clip(noteClip)
    .attack(0.005)
    .decay(noteDecay)
    .sustain(0)
    .release(noteRelease)
    .slow(8)
    .lpf(1100 + progress * 120)
    .room(0.78)
    .delay(0.24)
    .gain(padGain),
  note('~ <c5 e5> ~ <g4 c5>')
    .sound('triangle')
    .clip(noteClip)
    .attack(0.005)
    .decay(noteDecay)
    .sustain(0)
    .release(noteRelease)
    .slow(4)
    .room(0.9)
    .delay(0.32)
    .gain(bellGain),
  note('~ ~ c3 ~')
    .sound('sine')
    .clip(0.12)
    .attack(0.005)
    .decay(0.06)
    .sustain(0)
    .release(0.05)
    .slow(2)
    .room(0.68)
    .gain(pulseGain),
  note('~ ~ e6 ~ g5 ~ c6 ~')
    .sound('triangle')
    .clip(0.12)
    .attack(0.005)
    .decay(0.06)
    .sustain(0)
    .release(0.06)
    .slow(4)
    .room(0.95)
    .delay(0.42)
    .gain(sparkleGain),
).fast(2);
