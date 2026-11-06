import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism — 초기 가맹비 하나가 아니라 개점·운영·갱신·양도·종료의 비용을 날짜별로 놓는다.
 * 금액을 본문이 정하지 않았으므로 칸은 크기가 아니라 순서만 나타낸다.
 */
const STAGES = [
  {
    label: "개점",
    summary: "한 번에 나가는 돈",
    money: ["가맹·교육·장비 비용"],
    ask: ["가맹금(가맹 대가로 내는 돈)을 예치기관(돈을 맡아 두는 곳)에 맡기는지"],
    note: "문을 열 때의 돈부터 놓습니다. 글의 앞 사례에 있던 150만 원은 다음 칸의 돈이고, 이 칸의 금액은 정하지 않았습니다.",
  },
  {
    label: "운영",
    summary: "운영 중 되풀이되는 돈",
    money: ["로열티", "광고분담(광고비 중 점포가 나눠 내는 몫)"],
    ask: ["지정품목 가격이 바뀔 때 통지와 협의", "광고비 집행 내역을 보는 문서", "영업지역과 온라인·배달 주문의 배분"],
    note: "사례의 본부 지급액 150만 원이 놓이는 칸입니다. 다만 사례의 값은 가정이고 자기 계약의 계산 기준은 따로 확인합니다.",
  },
  {
    label: "갱신",
    summary: "계약을 잇는 때의 돈",
    money: ["시설 교체"],
    ask: ["계약 기간과 갱신 조건"],
    note: "갱신 때의 시설 교체는 계약 전에 미리 날짜 위에 놓을 항목입니다. 누가 얼마를 내는지는 이 그림 뒤의 문단에서 다룹니다.",
  },
  {
    label: "양도",
    summary: "가게를 넘길 때의 돈",
    money: ["승인·교육 비용"],
    ask: ["양도한 점주가 실제로 낸 비용"],
    note: "본부의 최근 점포 증가만 보지 않고, 이미 가게를 넘긴 점주에게 실제 비용을 물어봅니다.",
  },
  {
    label: "종료",
    summary: "끝낼 때 남는 책임",
    money: ["간판 제거", "재고 처분", "장비 리스"],
    ask: ["임대차가 먼저 끝나면 각 항목이 어떻게 남는지", "본부 계약이 해지되면 각 항목이 어떻게 남는지", "폐점한 점주가 실제로 낸 비용"],
    note: "끝나는 경우마다 세 항목이 각각 어떻게 남는지 확인합니다. 이 글은 이 항목들의 금액을 정하지 않습니다.",
  },
] as const;

const SCENES = STAGES.map((stage) => ({ label: stage.label, summary: stage.summary, note: stage.note }));

export default function ContractTimelineViz() {
  return (
    <SceneShell
      eyebrow="계약 전체의 달력"
      title="돈이 나가는 때를 다섯 칸에 나눠 봅니다"
      description="칸의 간격은 실제 기간이 아니고 칸의 크기는 금액이 아닙니다. 본문이 말한 순서만 나타내며, 질문을 어느 칸에 둘지는 읽기 쉽게 묶은 것입니다(가정). 한 점포가 다섯 칸을 모두 거친다는 뜻도 아닙니다."
      ariaLabel="개점, 운영, 갱신, 양도, 종료 때 점포가 낼 돈과 확인할 질문"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0">
          <ol className="grid grid-cols-5 gap-1">
            {STAGES.map((stage, index) => (
              <li
                key={stage.label}
                className={`rounded-md border px-1 py-2 text-center text-xs font-semibold sm:text-sm ${index === active ? "border-primary text-primary" : "border-border text-muted-foreground"}`}
                style={index === active ? { borderWidth: 1.25 } : undefined}
              >
                {stage.label}
              </li>
            ))}
          </ol>
          <StableSceneStack
            active={active}
            className="mt-4"
            scenes={STAGES.map((stage) => (
              <div key={stage.label} className="grid gap-4 text-sm leading-6 sm:grid-cols-2 sm:gap-6">
                <div className="min-w-0">
                  <p className="text-xs font-bold text-muted-foreground">날짜 위에 놓을 돈</p>
                  <ul className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
                    {stage.money.map((item) => <li key={item} className="font-semibold">{item}</li>)}
                  </ul>
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-muted-foreground">함께 물을 것</p>
                  <ul className="mt-1 space-y-1">
                    {stage.ask.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </div>
              </div>
            ))}
          />
        </div>
      )}
    />
  );
}
