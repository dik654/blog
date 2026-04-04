export type { LineNote, CodeRef } from './codeRefsTypes';
import type { CodeRef } from './codeRefsTypes';
import { runnerCodeRef } from './codeRefsRunner';
import { spawnerCodeRef } from './codeRefsSpawner';
import { clockCodeRef } from './codeRefsClock';
import { networkCodeRef } from './codeRefsNetwork';
import { storageCodeRef } from './codeRefsStorage';
import { metricsCodeRef } from './codeRefsMetrics';
import { bridgeCodeRef } from './codeRefsBridge';

export const codeRefs: Record<string, CodeRef> = {
  ...runnerCodeRef,
  ...spawnerCodeRef,
  ...clockCodeRef,
  ...networkCodeRef,
  ...storageCodeRef,
  ...metricsCodeRef,
  ...bridgeCodeRef,
};
