import type { FlowNode } from './FlowDiagram';

/* ── storage-0: insert_block ──────────────────────────────────── */
export const storageFlowData: Record<string, FlowNode[]> = {
  'storage-0': [
    {
      id: 'st0-1', fn: 'DatabaseProvider::insert_block(block)',
      desc: '블록을 MDBX에 저장하는 진입점',
      color: 'sky', codeRefKey: 'storage-0',
      detail: '동기화 도중 대량으로 호출됩니다. BlocksOnly 모드는 EVM 실행 결과(영수증·상태)를 건너뜁니다.',
      children: [
        {
          id: 'st0-1-1', fn: 'block.number()',
          desc: '블록 번호 추출 — body indices 조회에 사용',
          color: 'slate', codeRefKey: 'storage-0',
        },
        {
          id: 'st0-1-2', fn: 'ExecutedBlock::new(block, receipts=[], state=[])',
          desc: 'save_blocks가 요구하는 형식으로 래핑 (영수증·상태 비어있음)',
          color: 'emerald', codeRefKey: 'storage-0',
        },
        {
          id: 'st0-1-3', fn: 'save_blocks(BlocksOnly)',
          desc: '헤더·바디만 MDBX에 기록 — EVM 계산 건너뜀',
          color: 'amber', codeRefKey: 'storage-0',
          children: [
            {
              id: 'st0-1-3-1', fn: 'write_headers(tx, header)',
              desc: 'Headers 테이블에 블록 헤더 삽입',
              color: 'emerald', codeRefKey: 'storage-0',
              detail: 'MDBX 테이블: Headers(block_number → header), CanonicalHeaders(block_number → hash), HeaderNumbers(hash → number)',
            },
            {
              id: 'st0-1-3-2', fn: 'write_transactions(tx, body)',
              desc: 'StaticFiles에 tx 데이터 기록 + BlockBodyIndices 갱신',
              color: 'amber', codeRefKey: 'storage-0',
              detail: 'tx 실제 데이터는 MDBX 외부의 StaticFiles(순차 파일)에 저장됩니다. BlockBodyIndices(block_number → tx_range)로 조회합니다.',
            },
          ],
        },
        {
          id: 'st0-1-4', fn: 'block_body_indices(block_number)',
          desc: '저장된 tx 범위 인덱스 조회 — 성공 확인 및 반환',
          color: 'violet', codeRefKey: 'storage-0',
          detail: 'BlockBodyIndices가 없으면 BlockBodyIndicesNotFound 오류를 반환합니다.',
        },
      ],
    },
  ],
};
