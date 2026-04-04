export type { LineNote, CodeRef } from './codeRefsTypes';
import type { CodeRef } from './codeRefsTypes';
import { kzgCodeRefs } from './codeRefsKZG';
import { kzgVerifyCodeRefs } from './codeRefsKZGVerify';
import { plonkishCodeRefs } from './codeRefsPLONKish';
import { proverCodeRefs } from './codeRefsProver';
import { verifierCodeRefs } from './codeRefsVerifier';

export const codeRefs: Record<string, CodeRef> = {
  ...kzgCodeRefs,
  ...kzgVerifyCodeRefs,
  ...plonkishCodeRefs,
  ...proverCodeRefs,
  ...verifierCodeRefs,
};
