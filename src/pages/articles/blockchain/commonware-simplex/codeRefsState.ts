import type { CodeRef } from '@/components/code/types';
import stateRs from './codebase/commonware/simplex_state.rs?raw';
import roundRs from './codebase/commonware/simplex_round.rs?raw';

export const stateCodeRefs: Record<string, CodeRef> = {
  'simplex-state': {
    path: 'consensus/src/simplex/actors/voter/state.rs',
    code: stateRs, lang: 'rust', highlight: [6, 22],
    desc: 'State — 에폭 단위 상태 머신.\nview(현재 뷰), views(BTreeMap<View, Round>), last_finalized(최종 확정 뷰)가 핵심.\nBTreeMap 덕분에 과거 뷰 조회와 정리가 O(log n).',
    annotations: [
      { lines: [6, 10], color: 'sky', note: 'context·scheme·elector — 런타임(clock/rng), 서명 스킴, 리더 선출기 주입' },
      { lines: [14, 18], color: 'emerald', note: '타이머 3종 — leader_timeout(제안 대기), certification_timeout(인증 대기), timeout_retry(nullify 재시도)' },
      { lines: [19, 22], color: 'amber', note: 'view·last_finalized·views — 현재 뷰, 확정 뷰, 뷰별 Round 상태. 합의의 핵심 좌표' },
    ],
  },
  'round-struct': {
    path: 'consensus/src/simplex/actors/voter/round.rs',
    code: roundRs, lang: 'rust', highlight: [4, 30],
    desc: 'Round — 뷰 하나의 전체 상태.\nleader, proposal, 3종 인증서(notarization/nullification/finalization), 3종 broadcast 플래그를 추적.\nbroadcast 플래그로 중복 전송 방지 — 한 번 브로드캐스트하면 다시 보내지 않음.',
    annotations: [
      { lines: [4, 6], color: 'sky', note: 'start·scheme·round — 생성 시각, 서명 스킴, (epoch,view) 쌍' },
      { lines: [8, 14], color: 'emerald', note: 'leader·proposal·deadlines — 리더 정보, 제안 슬롯, 타이머 3종' },
      { lines: [17, 30], color: 'amber', note: '인증서 + broadcast 플래그 — notarization/nullification/finalization 각각 보유 여부와 전송 여부를 추적' },
    ],
  },
  'enter-view': {
    path: 'consensus/src/simplex/actors/voter/state.rs',
    code: stateRs, lang: 'rust', highlight: [33, 44],
    desc: 'enter_view() — 뷰 전환의 핵심.\n현재 뷰보다 높은 뷰만 진입 허용 → Round 생성 → 타이머 2종(leader, certification) 시작.\n기존 BFT의 2Δ 리더 대기가 없음 — view 진입 즉시 propose 가능.',
    annotations: [
      { lines: [34, 36], color: 'sky', note: 'view <= self.view → false: 이미 지나간 뷰로 후퇴 불가 (단조 증가 보장)' },
      { lines: [38, 40], color: 'emerald', note: 'leader_deadline + certification_deadline: 뷰 진입과 동시에 타이머 시작' },
      { lines: [42, 44], color: 'amber', note: 'self.view = view: 상태 머신의 현재 뷰를 전진. 이후 try_propose()가 이 뷰에서 동작' },
    ],
  },
};
