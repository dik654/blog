import type { Annotation } from '@/components/ui/code-panel';

export interface CodeRef {
  id: string;
  title: string;
  file: string;
  startLine: number;
  code: string;
  annotations: Annotation[];
}

export { overviewRefs, engineCoreInit } from './codeRefsOverview';
export { pagedAttentionRefs } from './codeRefsPagedAttn';
export { servingArchRefs } from './codeRefsServing';
