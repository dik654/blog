import type { CodeRef } from '@/components/code/types';
import { derivationPipelineRefs } from './codeRefsDerivationPipeline';
import { derivationStageRefs } from './codeRefsDerivationStages';

export const derivationCodeRefs: Record<string, CodeRef> = {
  ...derivationPipelineRefs,
  ...derivationStageRefs,
};
