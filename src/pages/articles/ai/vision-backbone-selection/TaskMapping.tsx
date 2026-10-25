import { Link } from "react-router-dom";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import MappingViz from "./viz/MappingViz";

const ROWS = [
  {
    task: "이미지로 이미지 찾기 · 중복 탐지",
    need: "장면 요약과 변형 견고성",
    fit: "자기지도·정렬 계열 모두 후보",
    note: "텍스트 정렬 자체는 필수가 아니므로 같은 데이터에서 직접 가릅니다.",
  },
  {
    task: "문장으로 이미지 찾기",
    need: "어휘로 접근 가능한 축",
    fit: "캡션 정렬 계열",
    note: "정렬 단계의 데이터가 성능을 좌우합니다.",
  },
  {
    task: "라벨이 적은 분류",
    need: "선형으로 분리 가능한 표현",
    fit: "둘 다 후보",
    note: "범주가 일상 어휘면 정렬 계열의 zero-shot이 기준선이 됩니다.",
  },
  {
    task: "분할 · 깊이 · 대응",
    need: "자리별 세밀한 표현",
    fit: "dense 표현 후보",
    note: "패치 특징을 고정하고 같은 얇은 head로 비교할 수 있습니다.",
  },
  {
    task: "개념 이름으로 인스턴스 잘라내기",
    need: "경계와 존재 판단",
    fit: "프롬프트 분할 시스템",
    note: "검색용 백본이 아니라 decoder까지 포함한 시스템을 쓰는 경우가 많습니다.",
  },
];

export default function TaskMapping() {
  return (
    <section id="task-mapping" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">과제가 요구하는 능력부터 한 문장으로 적습니다</h2>
      <MappingViz />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          선택이 어려워지는 이유는 대개 과제를 충분히 좁히지 않았기 때문입니다. "이미지 검색"이라고만 하면
          후보가 전부 남지만, "사용자가 올린 사진으로 같은 상품 식별자를 순위로 돌려준다"까지 적으면 마스크를
          내는 분할 시스템은 빠지고 이미지 인코더 후보만 남습니다.
        </p>

        <p className="leading-7">
          그래서 먼저 적을 것은 질의의 형태입니다. 입력이 이미지인지 문장인지, 출력이 순위인지 마스크인지,
          그리고 자리 정보가 필요한지입니다. 이번 요청은 이미지·순위·자리 불필요입니다. 자기지도와 정렬
          인코더가 모두 남고, 어느 쪽이 상품의 촬영 변형에 강한지는 다음 절에서 직접 잽니다.
        </p>
      </div>

      <div className="not-prose my-6 overflow-x-auto">
        <table className="w-full min-w-[720px] border border-border text-sm">
          <thead>
            <tr className="bg-muted/50">
              {["과제", "요구 능력", "1차 후보", "주의"].map((h) => (
                <th key={h} className="border border-border px-3 py-2 text-left font-semibold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r) => (
              <tr key={r.task}>
                <td className="border border-border px-3 py-2 font-medium">{r.task}</td>
                <td className="border border-border px-3 py-2">{r.need}</td>
                <td className="border border-border px-3 py-2">{r.fit}</td>
                <td className="border border-border px-3 py-2 text-muted-foreground">{r.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <p className="leading-7">
          이 표는 후보를 좁히는 도구이지 결론이 아닙니다. 같은 칸에 들어가는 과제라도 데이터 도메인이 다르면
          결과가 뒤집힐 수 있습니다. 의료 영상이나 위성 사진처럼 학습 분포에서 먼 도메인에서는 어떤 계열이든
          그대로 옮겨 쓸 수 없고, 다음 절의 실측이 더 중요해집니다.
        </p>
      </div>

      <div className="mt-6">
        <ProgressiveDetail
          title="두 가지 질의를 모두 받아야 하면 어떻게 하나요"
          preview="벡터를 두 벌 두거나 정렬 단계를 따로 붙입니다. 하나의 백본이 두 능력을 모두 최고로 갖기를 기대하지 않는 편이 낫습니다."
        >
          <p className="leading-7">
            가장 단순한 구성은 색인을 두 벌 만드는 것입니다. 이미지 질의는 자기지도 벡터로, 문장 질의는 정렬
            벡터로 받습니다. 저장과 운영 비용이 두 배가 되지만 각 경로가 자기 강점을 그대로 씁니다.
          </p>
          <p className="leading-7">
            다른 방법은 정렬 단계를 따로 붙이는 것입니다. 백본은 하나로 두고 텍스트 쪽만 맞추면 색인은 한 벌로
            끝나지만, 정렬 품질이 그 단계의 데이터에 달려 있어 별도 평가가 필요합니다.
          </p>
          <p className="leading-7">
            어느 쪽이든 두 벡터를 그냥 이어 붙이는 방식은 피하는 편이 낫습니다. 차원만 늘고 거리 계산에서 한쪽이
            지배하기 쉬우며, 각 부분의 스케일을 맞추는 일이 또 다른 조정 대상이 됩니다. 색인 설계 자체가
            바뀌는 문제는 <Link to="/cs/ai/vector-search-and-ann-indexes">벡터 검색과 ANN 색인</Link>에서 다룹니다.
          </p>
        </ProgressiveDetail>
      </div>
    </section>
  );
}
