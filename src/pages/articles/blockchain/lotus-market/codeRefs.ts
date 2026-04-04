import type { CodeRef } from '@/components/code/types';
import providerGo from './codebase/lotus/markets/storageadapter/provider.go?raw';
import retrievalGo from './codebase/lotus/markets/retrievaladapter/provider.go?raw';

export const codeRefs: Record<string, CodeRef> = {
  'storage-deal': {
    path: 'lotus/markets/storageadapter/provider.go',
    code: providerGo,
    lang: 'go',
    highlight: [11, 36],
    desc: 'HandleDealProposal — 제안 검증 → 데이터 수신 → 봉인 → 온체인',
    annotations: [
      { lines: [11, 15], color: 'sky',
        note: 'Provider 구조체 — DealNetwork + DealStore + StorageProviderNode' },
      { lines: [21, 24], color: 'emerald',
        note: '1단계: validateProposal — 가격, 기간, 콜래터럴 검증' },
      { lines: [26, 28], color: 'violet',
        note: '2단계: transferData — GraphSync/HTTP로 클라이언트에서 수신' },
      { lines: [30, 33], color: 'amber',
        note: '3단계: AddPieceToSector — Sealing 파이프라인으로 전달' },
      { lines: [35, 36], color: 'rose',
        note: '4단계: PublishDeal — PublishStorageDeals 온체인 메시지' },
    ],
  },
  'retrieval': {
    path: 'lotus/markets/retrievaladapter/provider.go',
    code: retrievalGo,
    lang: 'go',
    highlight: [11, 35],
    desc: 'HandleQuery — PayloadCID로 데이터 존재 확인 + 가격 응답',
    annotations: [
      { lines: [11, 14], color: 'sky',
        note: 'Provider — PieceStore(CID→섹터 매핑) + Unsealer(봉인 해제)' },
      { lines: [20, 26], color: 'emerald',
        note: 'PayloadCID → PieceStore 조회, 없으면 Unavailable 응답' },
      { lines: [28, 35], color: 'amber',
        note: '💡 가격 구성: PricePerByte + UnsealPrice + PaymentInterval' },
    ],
  },
};
