export type Mod = {
  name: string; border: string; bg: string; title: string; inner: string;
  items: [string, string][];
};

export const vc: Mod = {
  name: 'Validator Client', border: 'border-violet-400', bg: 'bg-violet-50/50 dark:bg-violet-950/20',
  title: 'text-violet-600 dark:text-violet-400', inner: 'border-violet-300/60 dark:border-violet-600/30',
  items: [
    ['별도 바이너리', 'BN과 REST API 통신'],
    ['ValidatorStore', 'EIP-2335 키스토어'],
    ['BeaconNodeFallback', '다중 노드 failover'],
    ['DoppelgangerService', '중복 인스턴스 탐지'],
  ],
};

export const beacon: Mod = {
  name: 'BeaconChain', border: 'border-blue-400', bg: 'bg-blue-50/50 dark:bg-blue-950/20',
  title: 'text-blue-600 dark:text-blue-400', inner: 'border-blue-300/60 dark:border-blue-600/30',
  items: [
    ['상태 머신', '블록 검증, 상태 전이'],
    ['Fork Choice', 'LMD-GHOST + Casper FFG'],
    ['OperationPool', '어테스테이션·exits 수집'],
    ['Slasher', '이중 서명 탐지·증거 생성'],
  ],
};

export const store: Mod = {
  name: 'Storage (HotColdDB)', border: 'border-indigo-400', bg: 'bg-indigo-50/50 dark:bg-indigo-950/20',
  title: 'text-indigo-600 dark:text-indigo-400', inner: 'border-indigo-300/60 dark:border-indigo-600/30',
  items: [
    ['Hot DB (LevelDB/Redb)', '최근 상태'],
    ['Cold DB (Freezer)', '히스토리 아카이브'],
    ['Blobs DB', 'EIP-4844 블롭·데이터 컬럼'],
  ],
};

export const net: Mod = {
  name: 'Networking (libp2p)', border: 'border-cyan-400', bg: 'bg-cyan-50/50 dark:bg-cyan-950/20',
  title: 'text-cyan-600 dark:text-cyan-400', inner: 'border-cyan-300/60 dark:border-cyan-600/30',
  items: [
    ['Gossipsub', '블록·어테스테이션 전파'],
    ['Request/Response', '동기화 블록 룩업'],
    ['Discv5', 'ENR 기반 피어 디스커버리'],
    ['SyncManager', 'Range/Backfill/Lookup'],
  ],
};
