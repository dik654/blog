import type { FlowNode } from './FlowDiagram';

/* ── validator-0: poll_beacon_proposers ───────────────────────── */
/* ── validator-3: sign_block ──────────────────────────────────── */
export const validatorFlowData: Record<string, FlowNode[]> = {
  'validator-0': [
    {
      id: 'v0-1', fn: 'poll_beacon_proposers()', desc: '매 epoch 시작 시 타이머로 호출 — 현재 슬롯과 epoch 계산',
      color: 'sky', codeRefKey: 'validator-0',
      detail: '슬롯 클락이 epoch 경계를 감지하면 호출됩니다. 현재 epoch를 계산하고 타이밍을 기록합니다.',
      children: [
        {
          id: 'v0-1-1', fn: 'first_success(beacon_nodes)', desc: '비콘 노드 폴백 조회 — 첫 번째 성공 응답 사용',
          color: 'emerald', codeRefKey: 'validator-0',
          detail: '복수의 비콘 노드(Beacon Node)를 순회하며 첫 번째 성공 응답을 반환합니다. 주 노드 장애 시 자동으로 폴백합니다.',
          children: [
            {
              id: 'v0-1-1-1', fn: 'GET /eth/v1/validator/duties/proposer/{epoch}',
              desc: '비콘 노드 REST API — epoch 전체의 제안자 목록을 한 번에 수신',
              color: 'sky',
              detail: '응답에는 { validator_index, pubkey, slot } 객체 목록이 담깁니다. epoch당 최대 32 슬롯이므로 최대 32개 항목입니다.',
            },
          ],
        },
        {
          id: 'v0-1-2', fn: 'filter(|d| local_pubkeys.contains(d.pubkey))',
          desc: '내가 관리하는 pubkey만 필터링 — 타 검증자 정보 제거',
          color: 'amber', codeRefKey: 'validator-0',
          detail: '수백 명의 검증자를 운영하는 풀(pool)에서는 응답 전체를 처리하지 않고, 내 pubkey 집합과 교집합만 남깁니다.',
          children: [
            {
              id: 'v0-1-2-1', fn: 'proposers.insert(slot, pubkey)',
              desc: '슬롯 → pubkey 맵에 캐싱 — 해당 슬롯이 오면 즉시 참조',
              color: 'amber', codeRefKey: 'validator-0',
            },
            {
              id: 'v0-1-2-2', fn: 'beacon_proposer_notifier.send(slot)',
              desc: 'BlockService에 알림 전송 — 슬롯 준비 완료',
              color: 'violet', codeRefKey: 'validator-0',
              detail: 'tokio mpsc 채널로 BlockService에 슬롯 번호를 전달합니다. BlockService는 알림을 받으면 블록 생성 타이머를 설정합니다.',
            },
          ],
        },
      ],
    },
  ],

  'validator-3': [
    {
      id: 'v3-1', fn: 'ValidatorStore::sign_block(slot, block)', desc: '슬래싱 보호를 포함한 블록 서명 트레이트 진입점',
      color: 'sky', codeRefKey: 'validator-3',
      detail: 'BlockService가 블록을 조립하면 이 메서드를 호출합니다. 서명 전에 반드시 슬래싱 보호 DB를 거쳐야 합니다.',
      children: [
        {
          id: 'v3-1-1', fn: 'slashing_protection.check_and_insert_block()',
          desc: '슬래싱 보호 DB 조회 — 동일 슬롯 이전 서명 이력 확인',
          color: 'rose', codeRefKey: 'validator-3',
          detail: '로컬 SQLite DB에서 이 검증자가 이 슬롯에 이미 서명했는지 확인합니다. 충돌이 없으면 이번 서명 이력을 삽입합니다. 원자적(atomic) 연산입니다.',
          children: [
            {
              id: 'v3-1-1-1', fn: 'doppelganger_check(pubkey)',
              desc: '이중 실행 탐지 — 동일 키가 다른 노드에서 실행 중인지 확인',
              color: 'amber', codeRefKey: 'validator-3',
              detail: '다른 노드에서 같은 키가 실행 중이면 어테스테이션 주변 슬롯에서 이상 패턴이 감지됩니다. Lighthouse는 시작 후 몇 epoch 동안 서명을 보류하고 이를 확인합니다.',
            },
          ],
        },
        {
          id: 'v3-1-2', fn: 'keystore.sign(signing_root)',
          desc: 'BLS12-381 서명 실행 — 블록 루트에 대한 개인키 서명',
          color: 'violet', codeRefKey: 'validator-3',
          detail: 'signing_root은 블록 내용의 해시입니다. BLS12-381 곡선 위에서 개인키로 서명하면 48바이트 서명이 생성됩니다. 이 서명은 어떤 공개키로도 검증 가능합니다.',
          children: [
            {
              id: 'v3-1-2-1', fn: 'SecretKey::sign(signing_root)',
              desc: '실제 BLS 서명 계산 — 48바이트 Signature 반환',
              color: 'emerald', codeRefKey: 'validator-3',
              detail: 'BLS12-381의 핵심 특성: 여러 서명자의 서명을 Signature.aggregate()로 하나로 합칠 수 있습니다. 비콘 체인이 수천 개의 어테스테이션을 1개의 집계 서명으로 처리하는 원리입니다.',
            },
          ],
        },
      ],
    },
  ],
};
