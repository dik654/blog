import type { Annotation } from '@/components/ui/code-panel';

export interface CodeRef {
  id: string;
  title: string;
  file: string;
  startLine: number;
  code: string;
  lang?: string;
  annotations: Annotation[];
}

export { routerInitRef, routerCompletionRef, routingStrategyRef } from './codeRefsRouter';
export { proxyHandlerRef, fallbackRef, cooldownRef } from './codeRefsProxy';
export { deploymentSelectRef, latencyStrategyRef } from './codeRefsLatency';
