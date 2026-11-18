import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 전시 조달 35 + 40 + 15 + 10 = 100, 전후 예산 40 + 30 + 20 + 10 = 100.
 * 세금 35는 지금 걷고, 국내·해외 부채 55(40 + 15)에는 앞으로의 이자·원금이 붙으며,
 * 화폐·신용 10은 물가·환율·자산가격에 부담을 줄 수 있다. 전후 예산의 전쟁부채 이자 20이 그 55에서 온다.
 * 55와 20 사이의 금리나 상환 기간은 글이 정하지 않고, 두 100(전쟁비 전체·전후 한 해 예산)도 같은 금액이라는 보장이 없으므로 숫자로 잇지 않는다.
 */
interface Part {
  name: string;
  value: number;
  color: string;
}

const WAR: readonly Part[] = [
  { name: "현재 세금", value: 35, color: "#64748b" },
  { name: "국내 국채", value: 40, color: "#2563eb" },
  { name: "해외차입", value: 15, color: "#7c3aed" },
  { name: "중앙은행 화폐·신용", value: 10, color: "#d97706" },
];

const POST: readonly Part[] = [
  { name: "일반 서비스", value: 40, color: "#64748b" },
  { name: "사회급여", value: 30, color: "#16a34a" },
  { name: "전쟁부채 이자", value: 20, color: "#2563eb" },
  { name: "재건", value: 10, color: "#0f766e" },
];

interface Scene {
  label: string;
  summary: string;
  war: readonly number[];
  post: readonly number[];
  groups: boolean;
  link: boolean;
  note: string;
}

const SCENES: readonly Scene[] = [
  { label: "전쟁 중: 100을 네 갈래로", summary: "35 + 40 + 15 + 10 = 100", war: [0, 1, 2, 3], post: [], groups: false, link: false, note: "전쟁에 필요한 100을 현재 세금 35, 국내 국채 40, 해외차입 15, 중앙은행 화폐·신용 10으로 조달한다고 가정합니다. 실제 국가 통계가 아니라 설명용 장부입니다. 아래 전후 장부는 아직 오지 않은 시점이라 비워 두었습니다." },
  { label: "지금 끝나는 몫과 남는 몫", summary: "부채 55 = 40 + 15", war: [0, 1, 2, 3], post: [], groups: true, link: false, note: "현재 세금 35는 지금 걷습니다. 국내 국채 40과 해외차입 15를 더한 부채 55에는 앞으로의 이자와 원금이 붙습니다. 화폐·신용 10도 무상 자원이 아니라 물가·환율·자산가격에 다른 부담을 줄 수 있습니다." },
  { label: "전후 한 해 예산 100", summary: "40 + 30 + 20 + 10 = 100", war: [1, 2], post: [0, 1, 2, 3], groups: false, link: true, note: "전후 연간 예산 100을 일반 서비스 40, 사회급여 30, 전쟁부채 이자 20, 재건 10으로 쓴다고 가정합니다. 이자 20은 전쟁 중 진 부채 55에서 이어진 몫입니다. 다만 위의 100은 전쟁비 전체, 아래의 100은 전후 한 해 예산이라 같은 금액이라는 보장이 없습니다. 그래서 20 ÷ 55로 금리를 구할 수 없고, 글도 금리를 정하지 않아 두 숫자를 계산으로 잇지 않았습니다." },
  { label: "이자 20 곁에서 급여와 재건을 유지하려면", summary: "이자 20 · 급여 30 · 재건 10", war: [1, 2], post: [1, 2, 3], groups: false, link: true, note: "이자 20을 내면서 사회급여 30과 재건 10을 유지하려면 세금 기반·성장·금리·만기와 채권자 구성이 중요하다고 글은 씁니다. 한 번의 전쟁 지출이 여러 해의 예산 선택으로 남는 자리입니다." },
];

const L = 12;
const W = 296;
const unit = W / 100;
const startOf = (parts: readonly Part[], index: number) => L + parts.slice(0, index).reduce<number>((sum, part) => sum + part.value, 0) * unit;
const WAR_Y = 30;
const POST_Y = 150;
const H = 26;

function Strip({ parts, y, focus, empty }: { parts: readonly Part[]; y: number; focus: readonly number[]; empty: boolean }) {
  if (empty) return <rect x={L + 0.5} y={y + 0.5} width={W - 1} height={H - 1} rx={4} fill="none" stroke="#94a3b8" strokeWidth={1} strokeDasharray="4 3" />;
  return (
    <g>
      {parts.map((part, index) => {
        const x = startOf(parts, index);
        const on = focus.includes(index);
        return (
          <g key={part.name} opacity={on ? 1 : 0.35}>
            <rect x={x + 0.5} y={y + 0.5} width={part.value * unit - 1} height={H - 1} rx={3} fill={part.color} fillOpacity={0.25} stroke={part.color} strokeWidth={1} />
            <text x={x + (part.value * unit) / 2} y={y + H / 2 + 5} textAnchor="middle" fontSize={14} fontWeight={700} fill="currentColor">{part.value}</text>
          </g>
        );
      })}
    </g>
  );
}

function Bracket({ from, to, label, y }: { from: number; to: number; label: string; y: number }) {
  return (
    <g>
      <path d={`M${from + 1},${y} V${y + 6} H${to - 1} V${y}`} fill="none" stroke="currentColor" strokeOpacity={0.6} strokeWidth={1} />
      <text x={(from + to) / 2} y={y + 22} textAnchor="middle" fontSize={13} fill="currentColor">{label}</text>
    </g>
  );
}

function Legend({ parts, focus, empty }: { parts: readonly Part[]; focus: readonly number[]; empty: boolean }) {
  return (
    <ul className="min-w-0 space-y-1 text-sm">
      {parts.map((part, index) => (
        <li key={part.name} className={`flex items-center gap-2 ${empty ? "opacity-30" : focus.includes(index) ? "" : "opacity-50"}`}>
          <span className="inline-block h-3 w-3 shrink-0 rounded-sm border" style={{ backgroundColor: `${part.color}40`, borderColor: part.color }} />
          <span className="min-w-0 flex-1 leading-5">{part.name}</span>
          <span className="font-mono font-bold">{part.value}</span>
        </li>
      ))}
    </ul>
  );
}

function Body({ scene }: { scene: Scene }) {
  const postEmpty = scene.post.length === 0;
  const debtFrom = startOf(WAR, 1);
  const debtTo = startOf(WAR, 3);
  const interestMid = startOf(POST, 2) + (POST[2].value * unit) / 2;
  return (
    <div className="min-w-0 space-y-4">
      <svg viewBox="0 0 320 186" className="mx-auto h-auto w-full max-w-[520px] text-foreground" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
        <text x={L} y={WAR_Y - 9} fontSize={13} fontWeight={700} fill="currentColor">전쟁 중 조달 100</text>
        <Strip parts={WAR} y={WAR_Y} focus={scene.war} empty={false} />
        {scene.groups && (
          <>
            <Bracket from={L} to={debtFrom} label="지금 걷음" y={WAR_Y + H + 4} />
            <Bracket from={debtFrom} to={debtTo} label="부채 55: 이자·원금이 남음" y={WAR_Y + H + 4} />
            <Bracket from={debtTo} to={L + W} label="물가 등" y={WAR_Y + H + 4} />
          </>
        )}
        {scene.link && (
          <g>
            <path d={`M${(debtFrom + debtTo) / 2},${WAR_Y + H + 2} C${(debtFrom + debtTo) / 2},${WAR_Y + H + 50} ${interestMid},${POST_Y - 50} ${interestMid},${POST_Y - 6}`} fill="none" stroke="#2563eb" strokeWidth={1.25} strokeDasharray="5 3" />
            <path d={`M${interestMid - 4},${POST_Y - 11} L${interestMid},${POST_Y - 4} L${interestMid + 4},${POST_Y - 11}`} fill="none" stroke="#2563eb" strokeWidth={1.25} />
            <text x={(debtFrom + debtTo) / 2 - 8} y={(WAR_Y + POST_Y) / 2 + 4} textAnchor="end" fontSize={12} fill="#2563eb">부채 55의 이자</text>
          </g>
        )}
        <text x={L} y={POST_Y - 9} fontSize={13} fontWeight={700} fill="currentColor" opacity={postEmpty ? 0.45 : 1}>전후 한 해 예산 100</text>
        <Strip parts={POST} y={POST_Y} focus={scene.post} empty={postEmpty} />
      </svg>
      <div className="grid min-w-0 gap-4 sm:grid-cols-2">
        <Legend parts={WAR} focus={scene.war} empty={false} />
        <Legend parts={POST} focus={scene.post} empty={postEmpty} />
      </div>
    </div>
  );
}

export default function WarLedgerTimeViz() {
  return (
    <SceneShell
      eyebrow="두 시점의 장부"
      title="전쟁 중 진 빚 55가 전후 예산의 이자 20으로 남습니다"
      description="위 띠는 전쟁 중 조달 100, 아래 띠는 전후 한 해 예산 100입니다. 띠 안 숫자는 각 장부의 100 가운데 몫이고, 두 100이 같은 금액이라는 뜻은 아닙니다. 두 장부 모두 1·3절의 설명용 가정입니다. 흐린 칸은 그 장면의 초점이 아닌 몫입니다."
      ariaLabel="전시 조달 100의 네 갈래와, 그중 부채 55가 전후 예산 100의 전쟁부채 이자 20으로 이어지는 관계"
      scenes={SCENES}
      render={(active) => <StableSceneStack active={active} scenes={SCENES.map((scene) => <Body key={scene.label} scene={scene} />)} />}
    />
  );
}
