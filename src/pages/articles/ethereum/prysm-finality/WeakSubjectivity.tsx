import type { CodeRef } from "@/components/code/types";
import { CodeViewButton } from "@/components/code";
import { codeRefs } from "./codeRefs";

interface Props {
  onCodeRef: (key: string, ref: CodeRef) => void;
}

export default function WeakSubjectivity({ onCodeRef }: Props) {
  return (
    <section id="weak-subjectivity" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Weak Subjectivity</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton
            onClick={() =>
              onCodeRef("weak-subjectivity", codeRefs["weak-subjectivity"])
            }
          />
          <span className="text-xs text-muted-foreground self-center">
            ProcessJustificationAndFinalization()
          </span>
        </div>

        {/* ── Weak Subjectivity 개념 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          Weak Subjectivity — PoS 고유 도전
        </h3>
        <div className="grid grid-cols-1 gap-3 not-prose mb-4">
          <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-4">
            <div className="text-xs font-semibold text-red-400 mb-2">
              Long-Range Attack 문제
            </div>
            <p className="text-sm">
              오랫동안 오프라인이던 노드는 이미 출금한 과거 검증자들이 만든 경쟁
              이력을 현재 체인과 체인 데이터만으로 구분하기 어렵다. 과거 키의
              경제적 담보가 더는 남아 있지 않기 때문이다.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-muted-foreground mb-2">
              해결책 — Trusted Checkpoint
            </div>
            <p className="text-sm">
              새 노드는 신뢰할 수 있는 경로에서 충분히 최근의 finalized
              checkpoint root를 얻어 이를 시작 anchor로 사용한다.
            </p>
            <div className="text-sm mt-2">
              <div className="text-muted-foreground">
                WS period는 활성 검증자 집합, churn, 출금 지연, 안전 여유와 현재
                fork 규칙으로 계산한다.
              </div>
              <div className="mt-1">
                따라서 특정 연도의 검증자 수나 “항상 2주” 같은 값으로 고정하지
                않고 최신 상태를 기준으로 산출해야 한다.
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border bg-card p-4">
              <div className="text-xs font-semibold text-muted-foreground mb-2">
                왜 "Weak" Subjectivity?
              </div>
              <ul className="text-sm space-y-1">
                <li>trusted checkpoint 이후는 objective (수학적 검증)</li>
                <li>Bitcoin: genesis부터 검증 (strong objectivity)</li>
                <li>PoS: 최초 1 checkpoint만 trust → "약한" 주관성</li>
              </ul>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <div className="text-xs font-semibold text-muted-foreground mb-2">
                실질적 영향
              </div>
              <ul className="text-sm space-y-1">
                <li>
                  <strong>새 노드</strong> — 현재 WS period 안의 checkpoint 필요
                </li>
                <li>
                  <strong>기존 노드</strong> — 문제 없음 (계속 업데이트)
                </li>
                <li>
                  <strong>오프라인 N개월</strong> — 재시작 시 새 checkpoint 필요
                </li>
              </ul>
            </div>
          </div>
        </div>
        <p>
          <strong>Weak subjectivity</strong>는 오래 offline이었던 PoS node가 local signature history만으로는 old validator가 만든 long-range chain을 구분할 수 없다는 trust model입니다. 그래서 recent checkpoint를 social·operationally trusted source에서 받아야 하며, 허용할 checkpoint age는 현재 validator-set churn과 specification formula로 계산합니다.
        </p>

        {/* ── Checkpoint Sync ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          Checkpoint Sync — 새 노드 빠른 시작
        </h3>
        <div className="grid grid-cols-1 gap-3 not-prose mb-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-muted-foreground mb-2">
              Checkpoint Sync 흐름
            </div>
            <p className="text-sm mb-2">
              <code>
                prysm beacon-chain
                --checkpoint-sync-url=&lt;trusted-provider&gt;
              </code>
            </p>
            <ol className="text-sm space-y-1 list-decimal list-inside">
              <li>
                URL에서 finalized state + block 다운로드 (
                <code>GET /eth/v2/debug/beacon/states/finalized</code>)
              </li>
              <li>
                응답의 SSZ 구조·state/block 연결을 검증하고, 별도로 확보한
                checkpoint root와 대조
              </li>
              <li>
                Starting point 설정 — state로 <code>BeaconState</code> 초기화,
                block을 체인 tip으로 지정
              </li>
              <li>정상 sync 시작 — P2P 피어 찾기, 이후 블록 정상 수집</li>
            </ol>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border bg-card p-4">
              <div className="text-xs font-semibold text-muted-foreground mb-2">
                Trusted Providers
              </div>
              <ul className="text-sm space-y-1">
                <li>Checkpoint Sync URL (Prysm, Lighthouse)</li>
                <li>직접 운영하는 기존 beacon node</li>
                <li>서로 독립적인 커뮤니티 제공자</li>
                <li>합의된 checkpoint를 게시하는 신뢰 채널</li>
              </ul>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <div className="text-xs font-semibold text-muted-foreground mb-2">
                신뢰 모델
              </div>
              <ul className="text-sm space-y-1">
                <li>URL 신뢰 가정 (TLS + reputation)</li>
                <li>다중 source 비교 권장</li>
                <li>
                  대안: <code>--weak-subjectivity-checkpoint=root:epoch</code>
                </li>
              </ul>
            </div>
          </div>
          <div className="rounded-lg border border-green-500/30 bg-green-500/5 p-4">
            <div className="text-xs font-semibold text-green-400 mb-2">
              작업량 비교
            </div>
            <div className="text-sm grid grid-cols-3 gap-2">
              <div className="text-center">
                <div className="font-bold">Genesis Sync</div>
                <div className="text-muted-foreground">오랜 이력 재실행</div>
              </div>
              <div className="text-center">
                <div className="font-bold">Checkpoint Sync</div>
                <div className="text-muted-foreground">
                  최근 finalized 상태에서 시작
                </div>
              </div>
              <div className="text-center">
                <div className="font-bold">실제 시간</div>
                <div className="text-muted-foreground">
                  상태 크기·네트워크·디스크 의존
                </div>
              </div>
            </div>
            <p className="text-sm mt-2 text-muted-foreground">
              해시와 서명 검증은 데이터 무결성을 보지만 long-range history 중
              어느 쪽을 신뢰할지는 해결하지 않는다. checkpoint root의 출처가
              보안 경계다.
            </p>
          </div>
        </div>
        <p>
          <strong>Checkpoint sync</strong>는 trusted finalized state에서 시작해 genesis 이후의 모든 transition replay를 생략합니다. 작업량을 크게 줄이는 대신 그 checkpoint root를 trust anchor로 받아들이므로 authenticated delivery와 독립 source 비교를 함께 운영해야 합니다.
        </p>

        <p className="mt-4 border-l-2 border-amber-500/50 pl-3 text-sm">
          <strong>💡 체크포인트 싱크</strong> — --checkpoint-sync-url로 신뢰할
          수 있는 checkpoint endpoint를 지정합니다. Recent finalized state부터 시작하는 대신 해당 root를 명시적으로 신뢰한다는 의미이며, weak-subjectivity period는 current validator set과 active fork rule로 다시 계산해야 합니다.
        </p>
      </div>
    </section>
  );
}
