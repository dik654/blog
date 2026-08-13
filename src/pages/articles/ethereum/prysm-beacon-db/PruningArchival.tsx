import type { CodeRef } from "@/components/code/types";

interface Props {
  onCodeRef: (key: string, ref: CodeRef) => void;
}

export default function PruningArchival({ onCodeRef: _ }: Props) {
  return (
    <section id="pruning-archival" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">프루닝 & 아카이벌</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          Finalized 체크포인트가 갱신되면 그 이전의 비-캐노니컬 데이터를
          정리한다. Finality 이후 되돌아갈 필요가 없는 fork 데이터를 제거해
          디스크 사용량을 제어하는 메커니즘이다.
        </p>

        {/* ── Pruning 흐름 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          Pruning 프로세스 — finalized 이후
        </h3>
        <div className="not-prose grid gap-3 my-4">
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">
              <code>pruneFinalized</code> 흐름
            </h4>
            <div className="grid gap-2 text-xs">
              <div className="flex items-start gap-2 rounded bg-muted/50 p-2">
                <span className="font-mono font-medium shrink-0 w-6 text-center">
                  1
                </span>
                <div>
                  <code>collectCanonicalChain(finalizedSlot)</code> — 캐노니컬
                  체인 블록 루트 수집
                </div>
              </div>
              <div className="flex items-start gap-2 rounded bg-muted/50 p-2">
                <span className="font-mono font-medium shrink-0 w-6 text-center">
                  2
                </span>
                <div>
                  <code>blocksBucket.Cursor()</code> 순회 — slot &lt;
                  finalizedSlot + non-canonical → <code>cur.Delete()</code>
                </div>
              </div>
              <div className="flex items-start gap-2 rounded bg-muted/50 p-2">
                <span className="font-mono font-medium shrink-0 w-6 text-center">
                  3
                </span>
                <div>
                  관련 인덱스 정리 — <code>parent_root_indices</code>,{" "}
                  <code>slot_indices</code>, 참조된 state
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-lg border bg-card p-4">
              <h4 className="font-semibold text-sm mb-2">Pruning 주기</h4>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li>Finalized checkpoint 변경 시 트리거</li>
                <li>현재 구현의 finalized 처리 경로에서 실행</li>
                <li>소요 시간은 삭제량과 DB 상태에 따라 측정</li>
              </ul>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <h4 className="font-semibold text-sm mb-2">
                주의: bbolt 공간 관리
              </h4>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li>공간 즉시 반환 안 함 (free page 재사용 대기)</li>
                <li>
                  실제 디스크 반환은 <code>db.Compact()</code> 수동 필요
                </li>
              </ul>
            </div>
          </div>
        </div>
        <p className="leading-7">
          Pruning은 <strong>finalized checkpoint 갱신을 기준</strong>으로
          non-canonical block과 관련 state를 정리한다. bbolt 파일은 레코드를
          지웠다고 즉시 작아지는 것이 아니라 내부 free page를 이후 write에서
          재사용하므로, 논리적 정리와 파일 크기를 구분해서 관찰해야 한다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">프루닝 대상</h3>
        <ul>
          <li>
            <strong>비-캐노니컬 블록</strong> — Finalized 이전, 캐노니컬 체인에
            포함되지 않은 블록
          </li>
          <li>
            <strong>고아 상태</strong> — 참조하는 블록이 삭제된 상태
          </li>
          <li>
            <strong>만료된 어테스테이션</strong> — 이미 Finalized된 에폭의
            미포함 어테스테이션
          </li>
        </ul>

        {/* ── Retention policy ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          보존 정책 — 운영 목적에서 결정
        </h3>
        <div className="not-prose grid gap-3 my-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-lg border bg-card p-4">
              <h4 className="font-semibold text-sm mb-2">장기 이력 조회</h4>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li>필요한 과거 상태 범위를 먼저 정의</li>
                <li>노드 DB와 외부 인덱서·백업의 역할 분리</li>
                <li>업그레이드 전 현재 지원 옵션 확인</li>
                <li>복원 시간과 용량을 함께 측정</li>
              </ul>
            </div>
            <div className="rounded-lg border bg-card p-4 border-blue-500/30 bg-blue-500/5">
              <h4 className="font-semibold text-sm mb-2">일반 검증 노드</h4>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li>finality 이후 불필요한 분기 정리</li>
                <li>동기화·validator 운영에 필요한 범위 유지</li>
                <li>기본 보존 정책을 우선 사용</li>
                <li>디스크 증가율과 compaction 관찰</li>
              </ul>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <h4 className="font-semibold text-sm mb-2">분석·감사 인프라</h4>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li>요청 가능한 historical 범위를 명시</li>
                <li>체인 데이터와 색인 데이터를 별도 관리</li>
                <li>스냅샷·백업·재구축 절차 검증</li>
                <li>API SLA에 맞춰 계층화</li>
              </ul>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-lg border bg-card p-4">
              <h4 className="font-semibold text-sm mb-2">선택 기준</h4>
              <div className="grid grid-cols-2 gap-1 text-xs text-muted-foreground">
                <span>Validator → 기본 보존 정책</span>
                <span>Staking 운영 → 복제 + 복구 시험</span>
                <span>RPC → 조회 범위별 데이터 계층</span>
                <span>분석 → 전용 인덱서·백업 병행</span>
              </div>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <h4 className="font-semibold text-sm mb-2">Pruning 주의점</h4>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li>합의·P2P가 요구하는 최소 가용 범위보다 먼저 지우지 않음</li>
                <li>DB 파일 크기와 내부 free page는 같은 지표가 아님</li>
                <li>compaction은 현재 Prysm 문서와 운영 절차를 확인</li>
              </ul>
            </div>
          </div>
        </div>
        <p className="leading-7">
          보존 정책은 단순한 세 가지 고정 모드보다{" "}
          <strong>필요한 조회 범위·복구 목표·현재 버전의 지원 옵션</strong>으로
          결정하는 편이 안전하다. 특히
          과거 데이터를 오래 제공해야 한다면 consensus DB 하나에 모든 책임을
          몰지 않고 인덱서와 백업을 함께 설계한다.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>운영 체크</strong> — 보존 관련 CLI 이름과 기본값은 릴리스
          사이에 바뀔 수 있으므로,
          블록 탐색기나 분석 인프라는 배포 중인 Prysm 버전의 공식 도움말을
          기준으로 옵션을 확인하고, 실제 데이터 증가율로 용량을 산정한다.
        </p>
      </div>
    </section>
  );
}
