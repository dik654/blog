import type { CodeRef } from "@/components/code/types";

interface Props {
  onCodeRef: (key: string, ref: CodeRef) => void;
}

export default function ColdArchive({ onCodeRef: _onCodeRef }: Props) {
  return (
    <section id="cold-archive" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Historical 상태 보존</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          최근 상태가 hot cache에서 빠지는 것과 DB의 과거 상태가 삭제되는 것은
          다른 사건이다. 전자는 메모리 재사용 정책이고 후자는
          동기화·P2P·RPC·복구 요구를 만족해야 하는 영속 보존 정책이다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">
          저장 anchor를 선택하는 기준
        </h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">재생 거리</h4>
            <p className="text-xs text-muted-foreground">
              anchor가 성기면 저장량은 줄지만 historical 요청이 적용해야 할
              블록과 빈 슬롯이 늘어난다.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">조회 수요</h4>
            <p className="text-xs text-muted-foreground">
              validator 운영과 분석 API는 요구하는 과거 범위와 지연 목표가
              다르다.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">finality·backfill</h4>
            <p className="text-xs text-muted-foreground">
              확정 경계와 역사 데이터 backfill 상태를 고려해 필요한 데이터를
              먼저 지우지 않는다.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">복구 목표</h4>
            <p className="text-xs text-muted-foreground">
              스냅샷·체크포인트 동기화·백업에서 실제로 복구 가능한 경로를 운영
              전에 시험한다.
            </p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">운영 프로파일</h3>
        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">목적</th>
                <th className="text-left p-2">우선순위</th>
                <th className="text-left p-2">추가 계층</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b">
                <td className="p-2">Validator</td>
                <td className="p-2">안정적 동기화와 제한된 디스크</td>
                <td className="p-2">checkpoint·백업</td>
              </tr>
              <tr className="border-b">
                <td className="p-2">RPC</td>
                <td className="p-2">명시한 historical 조회 범위</td>
                <td className="p-2">인덱서·읽기 복제본</td>
              </tr>
              <tr>
                <td className="p-2">분석·감사</td>
                <td className="p-2">재현 가능한 장기 이력</td>
                <td className="p-2">별도 데이터 레이크·스냅샷</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          보존 간격, CLI flag, 기본 용량을 고정값으로 문서화하면 릴리스 변경 때
          바로 낡는다. 배포 중인 Prysm의 help와 릴리스 문서를 확인하고 실제 DB
          증가율·재생 지연으로 설정을 검증한다.
        </p>
      </div>
    </section>
  );
}
