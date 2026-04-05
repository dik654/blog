import type { CodeRef } from '@/components/code/types';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function WeakSubjectivity({ onCodeRef }: Props) {
  return (
    <section id="weak-subjectivity" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Weak Subjectivity</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('weak-subjectivity', codeRefs['weak-subjectivity'])} />
          <span className="text-[10px] text-muted-foreground self-center">ProcessJustificationAndFinalization()</span>
        </div>

        {/* ── Weak Subjectivity 개념 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Weak Subjectivity — PoS 고유 도전</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Weak Subjectivity (Vitalik, 2014):
// "PoS 새 노드는 최근 trusted checkpoint 필요"

// 문제:
// 새 노드가 genesis부터 동기화 시
// - 과거 attacker가 지금은 exit한 validator의 서명으로 false chain 생성 가능
// - long-range attack 가능성
// - "이미 exit한 validator는 slashing 불가" (stake 환수됨)

// 해결책:
// 새 노드는 최근(< N epochs) checkpoint에서 시작
// 이 checkpoint은 "trust 기반" (subjective)

// Weak Subjectivity Period:
// ws_period = MIN_VALIDATOR_WITHDRAWABILITY_DELAY +
//             MAX_SAFETY_DECAY * CHURN_LIMIT_QUOTIENT / ...
//
// 계산 (단순화):
// t = t_{min} + P × N/n
// where:
// - P: safety decay (0.333)
// - N: total validators
// - n: churn per epoch
//
// 메인넷 수치 (2025):
// - 1M validators, churn 15/epoch
// - ws_period ≈ 최소 256 epochs (~27시간)
// - 최대 수 주 (safety margin)

// 왜 "weak"인가:
// - 믿는 checkpoint만 있으면 그 후는 objective (수학적)
// - Bitcoin처럼 genesis부터 계산 필요 없음 (strong)
// - → "약한" 주관성 (최초 1 checkpoint만)

// 실질적 영향:
// - 새 노드: 지난 2주 내 checkpoint 필요
// - 기존 노드: 문제 없음 (계속 업데이트)
// - 오프라인 N개월 노드: 재시작 시 새 checkpoint 필요`}
        </pre>
        <p className="leading-7">
          <strong>Weak Subjectivity</strong>는 PoS의 고유 특성.<br />
          long-range attack 방어를 위해 trusted checkpoint 필요.<br />
          최근 ~2주 내 checkpoint면 충분 → 실용적 비용.
        </p>

        {/* ── Checkpoint Sync ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Checkpoint Sync — 새 노드 빠른 시작</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Prysm의 checkpoint sync
// genesis부터 동기화 대신 최근 trusted checkpoint에서 시작

// 시작 방법:
// prysm beacon-chain --checkpoint-sync-url=https://beaconstate.info

// 흐름:
// 1. URL에서 finalized state + block 다운로드
//    GET /eth/v2/debug/beacon/states/finalized
//    GET /eth/v2/beacon/blocks/finalized
//
// 2. SSZ 검증 (roots 일치 확인)
//    - state.hash_tree_root() == root
//    - block.signature 검증
//
// 3. Starting point 설정
//    state로 BeaconState 초기화
//    block을 체인 tip으로 설정
//
// 4. 정상 sync 시작
//    - P2P 피어 찾기
//    - 이후 블록 정상 수집

// trusted checkpoint providers:
// - Checkpoint Sync URL (Prysm, Lighthouse 등)
// - beaconstate.info (커뮤니티)
// - beaconcha.in (explorer)
// - 공식 client 운영자

// 신뢰 모델:
// - URL 신뢰 가정 (TLS + community reputation)
// - 다중 source 비교 권장
// - checkpoint hash를 다른 곳에서 확인

// 대안: 수동 checkpoint
// prysm beacon-chain --weak-subjectivity-checkpoint=root:epoch

// 시간 비교:
// - Genesis sync: ~24-48시간
// - Checkpoint sync: ~수 분 (state 다운로드만)
// - 500배 이상 빠름

// 보안:
// - checkpoint가 유효하지 않으면 이후 모든 검증 실패
// - 가짜 checkpoint → peer들과 불일치 → 즉시 발견`}
        </pre>
        <p className="leading-7">
          <strong>Checkpoint Sync</strong>로 새 노드 빠른 시작.<br />
          Genesis sync(수일) vs Checkpoint sync(수 분) → 500배 가속.<br />
          신뢰 모델: trusted URL + 다중 source 비교.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 체크포인트 싱크</strong> — --checkpoint-sync-url로 신뢰할 수 있는 체크포인트 지정.<br />
          genesis부터 전부 검증할 필요 없이 최근 finalized부터 시작.<br />
          약 58만 검증자 기준 Weak Subjectivity Period ≈ 2주.
        </p>
      </div>
    </section>
  );
}
