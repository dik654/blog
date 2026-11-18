import SceneShell from "./SceneShell";

/**
 * 본문 대응: #picture — 부도 선언 뒤 청산소가 밟는 결정을 순서대로 놓는다.
 * 고객계정(이전 가능성 확인 → 별도 확인 뒤 이전)과 회원 고유 포트폴리오(분석 → 헤지 → 분할 → 입찰 → 장부 반영)를
 * 두 줄로 나눈다. 6·9절: 경매가 성공해도 고객계정 이전이 자동으로 끝나지는 않는다.
 * 시간 간격은 본문에 없어 칸 너비를 같게 둡니다.
 */
const HOUSE = [
  { name: "포트폴리오 분석", detail: "전문가 그룹·권한 체계" },
  { name: "긴급 헤지 승인", detail: "+80 → +20" },
  { name: "경매 묶음 분할", detail: "잔여 +20·비선형 위험 표시" },
  { name: "자료 제공·입찰", detail: "적격 참여자" },
  { name: "장부 반영·확인", detail: "다시 균형 잡힌 포지션인가" },
] as const;

const CLIENT = [
  { name: "이전 가능성 확인", detail: "계정 구조" },
  { name: "따로 확인", detail: "계정 자료·담보 구분·받을 회원·법률상 효력" },
  { name: "포지션·담보 이전", detail: "받을 회원의 동의·능력 필요" },
] as const;

/** 장면마다 각 줄에서 몇 칸까지 왔는지. 고객 줄의 진행 시점은 본문에 없어 회원 줄과 맞추지 않습니다. */
const SCENES = [
  { label: "부도 선언과 통제", summary: "지급·포지션 변화를 멈춤", house: 0, client: 0, note: "청산소는 부도 절차를 열고 지급과 포지션 변화를 통제합니다. 고객계정과 회원 고유 포트폴리오는 이후 따로 다룹니다." },
  { label: "두 갈래로 나눕니다", summary: "고객계정 ↔ 회원 고유 포트폴리오", house: 1, client: 1, note: "고객 포지션과 담보는 이전할 수 있는 계정 구조인지 먼저 확인합니다. 회원 고유 포트폴리오는 전문가 그룹이 정해진 권한 체계 안에서 분석합니다." },
  { label: "회원 줄: 헤지와 분할", summary: "+80 → +20 → 경매 묶음", house: 3, client: 1, note: "긴급 헤지를 승인해 민감도를 +20으로 줄이고, 남은 위험을 경매 묶음으로 나눠 표시합니다. 고객 줄은 이 진행과 별개로 확인을 이어 갑니다." },
  { label: "회원 줄: 입찰과 장부 반영", summary: "균형 장부 회복 확인", house: 5, client: 1, note: "적격 참여자에게 자료를 주고 입찰을 받은 뒤, 낙찰 거래와 손실을 장부에 반영해 청산소가 다시 균형 잡힌 포지션인지 확인합니다." },
  { label: "고객 줄은 따로 끝냅니다", summary: "경매 성공 ≠ 이전 완료", house: 5, client: 3, note: "경매가 성공해도 고객계정 이전이 자동으로 끝나지는 않습니다. 계정 자료, 담보 구분, 받을 회원과 법률상 효력을 따로 확인하고, 옮기려면 받을 회원의 동의와 능력도 필요합니다. 이 장면을 마지막에 둔 것은 두 줄을 따로 보이려는 것이며, 이전이 경매 뒤에야 이뤄진다는 뜻은 아닙니다." },
] as const;

function Step({ index, name, detail, done, current }: { index: number; name: string; detail: string; done: boolean; current: boolean }) {
  return (
    <li
      className={`grid min-w-0 grid-cols-[1rem_minmax(0,1fr)] items-baseline gap-x-2 rounded-lg border px-2 py-1.5 text-xs leading-5 sm:block sm:py-2 ${current ? "border-blue-600 bg-background" : done ? "border-border bg-background" : "border-dashed border-border/60 opacity-45"}`}
    >
      <span className={`font-mono text-[11px] sm:block ${current ? "text-blue-700 dark:text-blue-300" : "text-muted-foreground"}`}>{index + 1}</span>
      <span className="block font-semibold">{name}</span>
      <span className="hidden text-muted-foreground sm:block">{detail}</span>
    </li>
  );
}

function Lane({ title, steps, reached, cols }: { title: string; steps: readonly { name: string; detail: string }[]; reached: number; cols: string }) {
  return (
    <div className="min-w-0">
      <p className="mb-2 text-xs font-bold text-foreground">{title}</p>
      <ol className={`grid grid-cols-2 gap-1.5 sm:gap-2 ${cols}`}>
        {steps.map((step, index) => (
          <Step key={step.name} index={index} name={step.name} detail={step.detail} done={index < reached} current={index === reached - 1} />
        ))}
      </ol>
    </div>
  );
}

export default function DefaultTracksViz() {
  return (
    <SceneShell
      eyebrow="부도관리 순서"
      title="부도 선언 뒤 장부는 고객계정과 회원 포트폴리오 두 줄로 갈립니다"
      description="번호 순서대로 진행합니다. 칸 너비는 시간이 아니며, 두 줄의 같은 위치가 같은 시각이라는 뜻도 아닙니다. 고객 포지션 이전은 부도 회원 고객의 포지션과 담보를 다른 회원에게 옮기는 절차이고, 경매는 회원 고유 포트폴리오를 비부도 회원에게 넘기는 절차입니다."
      ariaLabel="부도 선언 뒤 고객계정 이전 줄과 회원 고유 포트폴리오의 헤지·분할·입찰·장부 반영 줄이 따로 진행되는 순서"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="space-y-4">
            <div className="rounded-lg border border-red-600/70 px-3 py-2 text-xs leading-5">
              <span className="font-bold text-red-700 dark:text-red-400">부도 선언</span>
              <span className="text-muted-foreground"> · 지급·포지션 변화 통제</span>
            </div>
            <Lane title="회원 고유 포트폴리오 → 부도 경매" steps={HOUSE} reached={scene.house} cols="sm:grid-cols-5" />
            <Lane title="고객계정 → 고객 포지션 이전" steps={CLIENT} reached={scene.client} cols="sm:grid-cols-3" />
          </div>
        );
      }}
    />
  );
}
