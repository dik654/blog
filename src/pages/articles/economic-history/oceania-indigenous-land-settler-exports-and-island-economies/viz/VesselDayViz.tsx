import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #comparison 2문단 — PNA 선박조업일제도(VDS).
 * 2021년 TAE 44,033일 + 토켈라우 몫 1,000일 = 전체 VDS TAE 45,033일.
 * 상한을 나라별 몫으로 배분 → 몫을 다 쓴 나라는 남은 날이 있는 나라와 날을 거래.
 * 조업일 = 항구 밖에 머문 달력상의 하루 또는 그 일부. 출항·귀항 시각은 설명용 가정:
 * 1일 18:00 출항 → 3일 06:00 귀항 = 6 + 24 + 6 = 36시간, 달력 날짜 3개를 걸쳐 조업일 3일.
 */
const PNA_TAE = 44033;
const TOKELAU = 1000;
const TOTAL_TAE = PNA_TAE + TOKELAU;
const fmt = (value: number) => value.toLocaleString("en-US");

const COUNTRIES = ["나라 A", "나라 B", "나라 C", "나라 D"] as const;

const SCENES = [
  {
    label: "한 해 상한을 날 수로",
    summary: `${fmt(PNA_TAE)} + ${fmt(TOKELAU)} = ${fmt(TOTAL_TAE)}일`,
    note: "총허용노력(TAE)은 선망 어선이 PNA 회원국 배타적경제수역에서 한 해에 조업 허가를 받을 수 있는 날 수의 상한입니다. 2020년 5월 제25차 연례회의가 정한 2021년 값 44,033일에 토켈라우 몫 1,000일을 더하면 전체 45,033일입니다.",
  },
  {
    label: "상한을 나라별 몫으로",
    summary: "각 나라는 자기 몫을 자기 수역에서",
    note: "상한을 나라마다 나눠 주고 각자 자기 수역에서 쓰게 합니다. 나라별 배분 기준은 글에서 확인하지 않았으므로 칸은 같은 크기로 그렸고, 나라 수와 이름도 설명용입니다(가정).",
  },
  {
    label: "다 쓴 나라와 남은 나라",
    summary: "남은 날을 나라 사이에 거래",
    note: "한 나라가 몫을 다 썼는데 다른 나라에 남은 날이 있으면 두 나라가 날을 거래할 수 있습니다. 어느 나라가 얼마나 남겼는지, 하루 가격이 얼마인지는 글에 없어 칸의 채움 정도는 설명용입니다(가정).",
  },
  {
    label: "조업일 하루를 세는 법",
    summary: "36시간, 하루 반이어도 3일",
    note: "2012년 개정 관리요강은 조업일을 당사국 수역 안에서 항구 밖에 머문 달력상의 하루 또는 그 일부로 정의합니다. 1일 저녁 6시에 나가 3일 아침 6시에 돌아오면(가정) 바다에 있던 시간은 36시간, 하루 반이지만 달력 날짜 세 개에 걸쳐 조업일 3일로 셉니다.",
  },
] as const;

function CapBar() {
  return (
    <div className="space-y-2">
      <div className="flex h-9 min-w-0 overflow-hidden rounded-sm border border-border/60">
        <div className="flex h-full items-center justify-center font-mono text-xs font-bold text-white" style={{ width: `${(PNA_TAE / TOTAL_TAE) * 100}%`, backgroundColor: "#2563eb" }}>
          {fmt(PNA_TAE)}일
        </div>
        <div className="h-full" style={{ width: `${(TOKELAU / TOTAL_TAE) * 100}%`, backgroundColor: "#d97706" }} />
      </div>
      <div className="flex flex-wrap justify-between gap-x-3 gap-y-1 text-xs">
        <span className="flex items-center gap-2"><span className="inline-block h-3 w-3 rounded-sm" style={{ backgroundColor: "#2563eb" }} />2021년 PNA TAE</span>
        <span className="flex items-center gap-2"><span className="inline-block h-3 w-3 rounded-sm" style={{ backgroundColor: "#d97706" }} />토켈라우 몫 {fmt(TOKELAU)}일</span>
      </div>
      <p className="text-xs leading-5 text-muted-foreground">막대 전체 폭 = 전체 VDS TAE {fmt(TOTAL_TAE)}일. 토켈라우 몫은 전체의 약 2%입니다.</p>
    </div>
  );
}

function Shares({ trade }: { trade: boolean }) {
  const fill = trade ? [1, 0.4, 0.7, 0.6] : [0, 0, 0, 0];
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-4 gap-2">
        {COUNTRIES.map((name, index) => (
          <div key={name} className="space-y-1 text-center">
            <div className="relative h-16 overflow-hidden rounded-md border" style={{ borderColor: "#2563eb" }}>
              <div className="absolute inset-x-0 bottom-0 transition-[height] duration-300 motion-reduce:transition-none" style={{ height: `${fill[index] * 100}%`, backgroundColor: "#93c5fd" }} />
              <span className="relative block pt-1 text-[11px] font-semibold leading-4">
                {trade ? (fill[index] >= 1 ? "다 씀" : "남음") : "몫"}
              </span>
            </div>
            <span className="block text-xs">{name}</span>
          </div>
        ))}
      </div>
      <div className={`grid grid-cols-4 gap-2 text-[11px] ${trade ? "" : "invisible"}`} aria-hidden={!trade}>
        <div className="col-span-2 rounded-md border border-dashed px-1 py-1 text-center leading-5" style={{ borderColor: "#d97706" }}>
          A ← B 남은 날 거래
        </div>
      </div>
      <p className="text-xs leading-5 text-muted-foreground">칸 하나 = 한 나라의 몫(크기는 설명용으로 같게 그림). 연한 파랑 = 이미 쓴 날.</p>
    </div>
  );
}

const DAY_W = 100 / 3;
/** 출항 18시, 귀항 6시(가정)를 0~72시간 축의 비율로 */
const DEPART = 18 / 72;
const RETURN = (48 + 6) / 72;

function DayCount() {
  return (
    <div className="space-y-2">
      <div className="relative h-16 min-w-0">
        {[0, 1, 2].map((day) => (
          <div key={day} className="absolute inset-y-0 rounded-sm border border-border/70 bg-background" style={{ left: `${day * DAY_W}%`, width: `calc(${DAY_W}% - 4px)` }}>
            <span className="block pt-1 text-center text-xs">{day + 1}일</span>
            <span className="absolute inset-x-0 bottom-1 text-center font-mono text-[11px] font-bold" style={{ color: "#2563eb" }}>조업일 +1</span>
          </div>
        ))}
        <div className="absolute top-7 h-3 rounded-sm" style={{ left: `${DEPART * 100}%`, width: `${(RETURN - DEPART) * 100}%`, backgroundColor: "#2563eb" }} />
      </div>
      <div className="relative h-4 text-[11px] text-muted-foreground">
        <span className="absolute -translate-x-1/2" style={{ left: `${DEPART * 100}%` }}>18시 출항</span>
        <span className="absolute -translate-x-1/2" style={{ left: `${RETURN * 100}%` }}>6시 귀항</span>
      </div>
      <p className="text-xs leading-5 text-muted-foreground">파란 띠 = 항구 밖에 머문 36시간(6 + 24 + 6). 하루의 일부만 걸쳐도 그날을 조업일 하루로 셉니다.</p>
    </div>
  );
}

export default function VesselDayViz() {
  return (
    <SceneShell
      eyebrow="선박조업일제도"
      title="어업 허가 수입은 상한을 나눈 '날'을 파는 장부입니다"
      description="나우루협정 당사국(PNA)이 쓰는 선박조업일제도를 한 해 상한 → 나라별 몫 → 나라 사이 거래 → 하루를 세는 규칙 순서로 봅니다. 숫자는 글에 적힌 2021년 총허용노력(TAE)이고, 나라 칸과 출항 시각은 설명용입니다."
      ariaLabel="선박조업일제도의 총허용노력 상한, 나라별 몫, 날 거래, 조업일 계산 규칙"
      scenes={SCENES}
      render={(active) => (
        <StableSceneStack
          active={active}
          scenes={[<CapBar key="cap" />, <Shares key="shares" trade={false} />, <Shares key="trade" trade />, <DayCount key="day" />]}
        />
      )}
    />
  );
}
