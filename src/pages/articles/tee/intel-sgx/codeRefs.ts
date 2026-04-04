export type { LineNote, CodeRef } from './codeRefsTypes';
import type { CodeRef } from './codeRefsTypes';
import { ecallRefs } from './codeRefsEcall';
import { ocallRefs } from './codeRefsOcall';
import { ocallRefs2 } from './codeRefsOcall2';
import { sealingRefs } from './codeRefsSealing';
import { sealingRefs2 } from './codeRefsSealing2';
import { attestationRefs } from './codeRefsAttestation';
import { attestationRefs2 } from './codeRefsAttestation2';

export const codeRefs: Record<string, CodeRef> = {
  ...ecallRefs,
  ...ocallRefs,
  ...ocallRefs2,
  ...sealingRefs,
  ...sealingRefs2,
  ...attestationRefs,
  ...attestationRefs2,
};
