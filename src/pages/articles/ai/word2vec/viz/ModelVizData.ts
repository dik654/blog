export type Mode = 'cbow' | 'skipgram';

export const SENTENCE = ['나는', '빠른', '갈색', '여우를', '보았다'];
export const CENTER = 2; // "갈색"
export const CONTEXT_IDXS = [0, 1, 3, 4]; // window=2 around index 2
