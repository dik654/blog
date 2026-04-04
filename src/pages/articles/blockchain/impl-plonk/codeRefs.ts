import type { CodeRef } from '@/components/code/types';
import { gateCodeRefs } from './codeRefsGate';
import { domainCodeRefs } from './codeRefsDomain';
import { kzgCodeRefs } from './codeRefsKzg';
import { permCodeRefs } from './codeRefsPerm';
import { lookupCodeRefs } from './codeRefsLookup';
import { proverCodeRefs } from './codeRefsProver';

export const codeRefs: Record<string, CodeRef> = {
  ...gateCodeRefs,
  ...domainCodeRefs,
  ...kzgCodeRefs,
  ...permCodeRefs,
  ...lookupCodeRefs,
  ...proverCodeRefs,
};
