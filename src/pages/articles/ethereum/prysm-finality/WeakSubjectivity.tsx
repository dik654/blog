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
        <div className="grid grid-cols-1 gap-3 not-prose mb-4">
          <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-4">
            <div className="text-xs font-semibold text-red-400 mb-2">Long-Range Attack 문제</div>
            <p className="text-sm">새 노드가 genesis부터 동기화 시 → 과거 attacker가 이미 exit한 validator의 서명으로 false chain 생성 가능. exit한 validator는 slashing 불가 (stake 환수됨).</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-muted-foreground mb-2">해결책 — Trusted Checkpoint</div>
            <p className="text-sm">새 노드는 최근(&lt; N epochs) checkpoint에서 시작. 이 checkpoint은 trust 기반 (subjective).</p>
            <div className="text-sm mt-2">
              <div className="text-muted-foreground">WS period = <code>MIN_VALIDATOR_WITHDRAWABILITY_DELAY + MAX_SAFETY_DECAY * CHURN_LIMIT_QUOTIENT / ...</code></div>
              <div className="mt-1">메인넷 (2025): 1M validators, churn 15/epoch → ws_period <strong>&ge; 256 epochs (~27시간)</strong>, 최대 수 주</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border bg-card p-4">
              <div className="text-xs font-semibold text-muted-foreground mb-2">왜 "Weak" Subjectivity?</div>
              <ul className="text-sm space-y-1">
                <li>trusted checkpoint 이후는 objective (수학적 검증)</li>
                <li>Bitcoin: genesis부터 검증 (strong objectivity)</li>
                <li>PoS: 최초 1 checkpoint만 trust → "약한" 주관성</li>
              </ul>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <div className="text-xs font-semibold text-muted-foreground mb-2">실질적 영향</div>
              <ul className="text-sm space-y-1">
                <li><strong>새 노드</strong> — 지난 ~2주 내 checkpoint 필요</li>
                <li><strong>기존 노드</strong> — 문제 없음 (계속 업데이트)</li>
                <li><strong>오프라인 N개월</strong> — 재시작 시 새 checkpoint 필요</li>
              </ul>
            </div>
          </div>
        </div>
        <p className="leading-7">
          <strong>Weak Subjectivity</strong>는 PoS의 고유 특성.<br />
          long-range attack 방어를 위해 trusted checkpoint 필요.<br />
          최근 ~2주 내 checkpoint면 충분 → 실용적 비용.
        </p>

        {/* ── Checkpoint Sync ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Checkpoint Sync — 새 노드 빠른 시작</h3>
        <div className="grid grid-cols-1 gap-3 not-prose mb-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-muted-foreground mb-2">Checkpoint Sync 흐름</div>
            <p className="text-sm mb-2"><code>prysm beacon-chain --checkpoint-sync-url=https://beaconstate.info</code></p>
            <ol className="text-sm space-y-1 list-decimal list-inside">
              <li>URL에서 finalized state + block 다운로드 (<code>GET /eth/v2/debug/beacon/states/finalized</code>)</li>
              <li>SSZ 검증 — <code>state.hash_tree_root() == root</code>, <code>block.signature</code> 검증</li>
              <li>Starting point 설정 — state로 <code>BeaconState</code> 초기화, block을 체인 tip으로 지정</li>
              <li>정상 sync 시작 — P2P 피어 찾기, 이후 블록 정상 수집</li>
            </ol>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border bg-card p-4">
              <div className="text-xs font-semibold text-muted-foreground mb-2">Trusted Providers</div>
              <ul className="text-sm space-y-1">
                <li>Checkpoint Sync URL (Prysm, Lighthouse)</li>
                <li>beaconstate.info (커뮤니티)</li>
                <li>beaconcha.in (explorer)</li>
                <li>공식 client 운영자</li>
              </ul>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <div className="text-xs font-semibold text-muted-foreground mb-2">신뢰 모델</div>
              <ul className="text-sm space-y-1">
                <li>URL 신뢰 가정 (TLS + reputation)</li>
                <li>다중 source 비교 권장</li>
                <li>대안: <code>--weak-subjectivity-checkpoint=root:epoch</code></li>
              </ul>
            </div>
          </div>
          <div className="rounded-lg border border-green-500/30 bg-green-500/5 p-4">
            <div className="text-xs font-semibold text-green-400 mb-2">시간 비교</div>
            <div className="text-sm grid grid-cols-3 gap-2">
              <div className="text-center">
                <div className="font-bold">Genesis Sync</div>
                <div className="text-muted-foreground">~24-48시간</div>
              </div>
              <div className="text-center">
                <div className="font-bold">Checkpoint Sync</div>
                <div className="text-muted-foreground">~수 분</div>
              </div>
              <div className="text-center">
                <div className="font-bold">차이</div>
                <div className="text-muted-foreground">500배+ 빠름</div>
              </div>
            </div>
            <p className="text-sm mt-2 text-muted-foreground">보안: 유효하지 않은 checkpoint → peer들과 불일치 → 즉시 발견</p>
          </div>
        </div>
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
