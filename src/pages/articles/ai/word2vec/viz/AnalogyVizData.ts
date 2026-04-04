export const EMBEDDINGS: Record<string, [number, number]> = {
  'king':   [0.7, 0.8],
  'queen':  [0.7, 0.2],
  'man':    [0.2, 0.75],
  'woman':  [0.2, 0.25],
  'dog':    [-0.6, 0.6],
  'cat':    [-0.6, 0.3],
  'Paris':  [0.5, 0.9],
  'France': [0.1, 0.85],
  'Berlin': [0.5, 0.55],
  'Germany':[0.1, 0.5],
};

export const ANALOGIES = [
  { a: 'king', b: 'man', c: 'woman', d: 'queen', label: 'king - man + woman ≈ queen' },
  { a: 'Paris', b: 'France', c: 'Germany', d: 'Berlin', label: 'Paris - France + Germany ≈ Berlin' },
  { a: 'dog', b: 'cat', c: 'woman', d: 'man', label: 'dog - cat + woman ≈ man' },
];

export const W = 400, H = 280;

export function toSVG(v: [number, number]): [number, number] {
  return [(v[0] + 1) * W / 2.4 + 30, (1 - v[1]) * H / 1.4 + 20];
}
