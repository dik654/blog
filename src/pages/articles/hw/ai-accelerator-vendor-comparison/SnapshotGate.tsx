import { Link } from "react-router-dom";
import { CitationBlock } from "@/components/ui/citation";
import GateViz from "./viz/GateViz";

const SNAPSHOT = [
  {
    name: "NVIDIA B200",
    memory: "180~192GB HBM3e",
    link: "NVLink 5 · 전용 스위치",
    form: "SXM 모듈 (벤더 규격)",
  },
  {
    name: "AMD Instinct MI355X",
    memory: "288GB HBM3E · 8TB/s",
    link: "Infinity Fabric 7링크 메시",
    form: "OAM 모듈 (공개 규격) · 액랭 1,400W",
  },
  {
    name: "Intel Gaudi 3",
    memory: "128GB HBM2e · 3.7TB/s",
    link: "패키지 내장 200GbE 24포트",
    form: "OAM 모듈 900W · PCIe 카드 600W",
  },
];

export default function SnapshotGate() {
  return (
    <section id="snapshot-gate" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">스냅샷은 기준일과 함께 읽습니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          아래 표는 2026년 9월 11일 기준으로 각 벤더가 공개한 스펙에서 네 축에 해당하는 항목만 뽑은 것입니다.
          숫자를 외우는 것이 목적이 아니라, 앞에서 본 축이 실제 제품에서 어떻게 나타나는지 확인하는 것이
          목적입니다.
        </p>
      </div>

      <div className="not-prose my-6 overflow-x-auto">
        <table className="w-full min-w-[720px] border border-border text-sm">
          <thead>
            <tr className="bg-muted/50">
              {["제품", "메모리", "가속기 간 링크", "폼팩터와 전력"].map((h) => (
                <th key={h} className="border border-border px-3 py-2 text-left font-semibold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SNAPSHOT.map((r) => (
              <tr key={r.name}>
                <td className="border border-border px-3 py-2 font-medium">{r.name}</td>
                <td className="border border-border px-3 py-2">{r.memory}</td>
                <td className="border border-border px-3 py-2">{r.link}</td>
                <td className="border border-border px-3 py-2 text-muted-foreground">{r.form}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-sm leading-6 text-muted-foreground">
          기준일 2026-09-11. 각 항목은 해당 벤더의 공개 제품 페이지와 기술 문서 기준이며, 같은 계열 안에서도
          공랭·액랭 변형에 따라 전력이 다릅니다. 연산 성능 수치는 정밀도 정의와 측정 조건이 벤더마다 달라 이
          표에 넣지 않았습니다.
        </p>

        <p className="leading-7">
          표에서 읽어야 할 것은 세 회사가 서로 다른 축을 밀고 있다는 사실입니다. 한쪽은 노드 안 균일한 대역폭,
          다른 쪽은 카드 한 장의 용량, 또 다른 쪽은 표준 이더넷으로 노드 안팎을 통일하는 것입니다. 내 워크로드가
          어느 축에 민감한지가 곧 선택 기준입니다.
        </p>
      </div>

      <GateViz />

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <p className="leading-7">
          판단 순서는 이렇습니다. 먼저 모델과 실행 상태가 카드 한 장에 들어가는지 봅니다. 들어가면 링크 축의
          비중이 크게 줄고 메모리 대역폭과 소프트웨어 축이 결정적이 됩니다. 들어가지 않으면 링크 구조와
          통신 패턴의 궁합을 먼저 보고, 그다음 폼팩터가 요구하는 전력·냉각을 현장이 감당할 수 있는지 확인합니다.
        </p>

        <p className="leading-7">
          마지막 관문은 소프트웨어입니다. 앞의 세 축에서 아무리 유리해도 지금 스택이 그 위에서 같은 기능으로
          돌지 않으면 그 차이는 실현되지 않습니다. 그래서 최종 후보는 문서가 아니라 실제 워크로드를 한 번
          띄워 보고 정합니다.
        </p>

        <p className="leading-7">
          이 글이 주장하지 않는 것도 분명합니다. 어느 제품이 더 빠른지 순위를 매기지 않았고, 연산 성능 수치를
          비교하지 않았습니다. 정밀도 정의와 측정 조건이 벤더마다 달라 같은 표에 놓으면 오해를 만들기 때문이며,
          그 비교가 필요하면 <Link to="/cs/ai/serving-benchmark-methodology">같은 조건에서 직접 재는 방법</Link>을
          따라야 합니다.
        </p>
      </div>

      <CitationBlock
        source="AMD · Intel · NVIDIA 공개 제품 문서 (2026-09-11 확인)"
        citeKey={1}
        href="https://instinct.docs.amd.com/projects/system-acceptance/en/latest/gpus/mi355x.html"
      >
        표의 메모리·링크·폼팩터 항목은 각 벤더가 공개한 제품 페이지와 기술 문서에서 가져온 값입니다. 제품 계열이
        갱신되면 값이 바뀌므로 기준일과 함께 읽어야 하며, 이 표로 성능 우열을 판정하지 않습니다.
      </CitationBlock>
    </section>
  );
}
