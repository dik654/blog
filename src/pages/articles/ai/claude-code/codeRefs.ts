import type { CodeRef } from '@/components/code/types';
import { hooksCodeRefs } from './codeRefsHooks';
import { permissionsCodeRefs } from './codeRefsPermissions';
import { agentCodeRefs } from './codeRefsAgent';

export const codeRefs: Record<string, CodeRef> = {
  ...hooksCodeRefs,
  ...permissionsCodeRefs,
  ...agentCodeRefs,
};
