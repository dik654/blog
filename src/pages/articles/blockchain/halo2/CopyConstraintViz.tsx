import SceneShell from "./Halo2SceneShell";

/**
 * 본문 대응: #columns-regions — 다른 region에서 만든 a·b를 multiplication region에 다시 써도 자동으로 같지 않다.
 * copy_advice가 두 cell의 equality를, constrain_instance가 output cell과 instance row 0의 equality를 만든다.
 * 누락 반례는 #failure-boundaries 표: copy 누락 → 한 region 4, 다른 region 5 / instance 누락 → output cell을 다른 값으로.
 * gate(02절, s·(lhs·rhs−out)=0)는 계속 켜져 있으므로 out은 항상 lhs·rhs이다: copy 누락은 3·5=15,
 * instance 누락은 copy가 지켜지니 private advice a·b 자체를 3·5로 바꿔야 out=15가 된다.
 * 열·행 위치는 그림용 배치이며 공식 예제의 실제 offset이 아니다.
 */
const SCENES = [
  { label: "값만 다시 쓰기", summary: "3·4·12를 두 region에 씀", note: "load region에서 만든 a=3, b=4를 multiplication region의 lhs·rhs에 같은 숫자로 다시 썼습니다. 아직 두 곳을 묶는 식이 없어서 숫자가 같은 것은 prover가 그렇게 썼기 때문일 뿐입니다." },
  { label: "copy_advice", summary: "a = lhs · b = rhs 강제", note: "equality-enabled column에서 copy_advice를 쓰면 두 cell이 같아야 한다는 equality relation이 생깁니다. 이제 lhs·rhs는 load region의 a·b와 다른 값일 수 없습니다." },
  { label: "copy 누락", summary: "load b=4 · mul rhs=5도 막지 못함", note: "copy constraint가 빠지면 malicious prover는 한 region에 4, 다른 region에 5를 넣을 수 있습니다. 두 cell을 비교하는 식이 없으니 이 차이는 검사되지 않고, gate는 rhs=5로 out=3·5=15를 확인할 뿐입니다." },
  { label: "constrain_instance", summary: "out cell = instance row 0 (12)", note: "output cell도 공개 instance의 row 0과 자동으로 같아지지 않습니다. 공식 예제는 constrain_instance로 둘을 연결합니다." },
  { label: "instance 누락", summary: "public 12와 proof의 out=15가 갈라짐", note: "copy와 gate가 모두 있어도 a·b는 prover가 채우는 advice라 3·5로 바꿀 수 있고, 그러면 out=15입니다. out을 instance row 0과 잇는 식이 없으니 화면에 public 12를 표시해도 증명된 output cell은 15입니다." },
] as const;

const BLUE = "#2563eb";
const TEAL = "#0f766e";
const RED = "#dc2626";
const GREEN = "#16a34a";
const MUTED = "#64748b";
const LINE = "#94a3b8";

const COL_A = 20;
const COL_B = 110;
const COL_I = 270;
const CELL_W = 76;
const CELL_H = 30;
const LOAD_Y = 52;
const MUL_Y0 = 156;
const MUL_Y1 = 196;
const ELBOW_X = 228;
const INST_PATH = [
  [COL_A + CELL_W, MUL_Y1 + CELL_H / 2],
  [ELBOW_X, MUL_Y1 + CELL_H / 2],
  [ELBOW_X, LOAD_Y + CELL_H / 2],
  [COL_I, LOAD_Y + CELL_H / 2],
] as const;

function Cell({ x, y, text, color, dashed = false }: { x: number; y: number; text: string; color: string; dashed?: boolean }) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={CELL_W}
        height={CELL_H}
        rx={4}
        fill={dashed ? "none" : color}
        stroke={color}
        strokeWidth={1}
        strokeDasharray={dashed ? "4 3" : undefined}
      />
      <text x={x + CELL_W / 2} y={y + 20} textAnchor="middle" fontSize={13} fontWeight={700} fill={dashed ? color : "#ffffff"} fontFamily="ui-monospace, monospace">
        {text}
      </text>
    </g>
  );
}

function Link({ points, ok, label }: { points: readonly (readonly [number, number])[]; ok: boolean; label: string }) {
  const [lx, ly] = points[Math.floor(points.length / 2)];
  const [px, py] = points[Math.floor(points.length / 2) - 1];
  return (
    <g>
      <polyline
        points={points.map(([x, y]) => `${x},${y}`).join(" ")}
        fill="none"
        stroke={ok ? GREEN : RED}
        strokeWidth={1.25}
        strokeDasharray={ok ? undefined : "4 4"}
      />
      <text x={(lx + px) / 2 + 6} y={(ly + py) / 2 + 4} fontSize={12} fontWeight={700} fill={ok ? GREEN : RED}>
        {label}
      </text>
    </g>
  );
}

export default function CopyConstraintViz() {
  return (
    <SceneShell
      eyebrow="Gate 밖의 연결"
      title="같은 숫자를 두 번 써도 copy·instance 제약이 있어야 같은 값이 됩니다"
      description="사각형 하나가 cell 하나입니다. 초록 실선은 등록된 equality, 빨간 점선은 빠진 연결입니다. 열과 행의 위치는 설명용 배치(가정)입니다."
      ariaLabel="load region과 multiplication region, instance column 사이의 copy constraint와 instance constraint"
      scenes={SCENES}
      render={(active) => {
        const copyA = active === 1 || active === 2 || active === 3 || active === 4;
        const copyB = active === 1 || active === 3 || active === 4;
        const missingB = active === 2;
        const inst = active === 3;
        const missingInst = active === 4;
        // instance 누락 장면: copy·gate가 지켜지므로 out을 바꾸려면 private a·b 자체를 바꿔야 한다(3·5=15).
        const b = missingInst ? "b=5" : "b=4";
        const rhs = missingB || missingInst ? "rhs=5" : "rhs=4";
        const out = missingB || missingInst ? "out=15" : "out=12";
        return (
          <svg viewBox="0 0 356 250" className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <text x={COL_A + CELL_W / 2} y={18} textAnchor="middle" fontSize={12} fill={MUTED}>advice A</text>
            <text x={COL_B + CELL_W / 2} y={18} textAnchor="middle" fontSize={12} fill={MUTED}>advice B</text>
            <text x={COL_I + CELL_W / 2} y={18} textAnchor="middle" fontSize={12} fill={MUTED}>instance</text>

            <rect x={COL_A - 14} y={LOAD_Y - 18} width={COL_B + CELL_W - COL_A + 28} height={CELL_H + 30} rx={8} fill="none" stroke={LINE} strokeWidth={1} />
            <text x={COL_A - 8} y={LOAD_Y - 6} fontSize={12} fill={MUTED}>load region</text>
            <rect x={COL_A - 14} y={MUL_Y0 - 18} width={COL_B + CELL_W - COL_A + 28} height={MUL_Y1 - MUL_Y0 + CELL_H + 30} rx={8} fill="none" stroke={LINE} strokeWidth={1} />
            <text x={COL_A - 8} y={MUL_Y0 - 6} fontSize={12} fill={MUTED}>multiplication region</text>

            {copyA && <Link points={[[COL_A + CELL_W / 2, LOAD_Y + CELL_H], [COL_A + CELL_W / 2, MUL_Y0]]} ok label="=" />}
            {copyB && <Link points={[[COL_B + CELL_W / 2, LOAD_Y + CELL_H], [COL_B + CELL_W / 2, MUL_Y0]]} ok label="=" />}
            {missingB && <Link points={[[COL_B + CELL_W / 2, LOAD_Y + CELL_H], [COL_B + CELL_W / 2, MUL_Y0]]} ok={false} label="검사 없음" />}
            {inst && <Link points={INST_PATH} ok label="=" />}
            {missingInst && <Link points={INST_PATH} ok={false} label="연결 없음" />}

            <Cell x={COL_A} y={LOAD_Y} text="a=3" color={BLUE} />
            <Cell x={COL_B} y={LOAD_Y} text={b} color={missingInst ? RED : BLUE} />
            <Cell x={COL_A} y={MUL_Y0} text="lhs=3" color={BLUE} />
            <Cell x={COL_B} y={MUL_Y0} text={rhs} color={missingB || missingInst ? RED : BLUE} />
            <Cell x={COL_A} y={MUL_Y1} text={out} color={missingInst ? RED : BLUE} />
            <Cell x={COL_I} y={LOAD_Y} text="12" color={TEAL} />
            <text x={COL_I + CELL_W / 2} y={LOAD_Y + CELL_H + 16} textAnchor="middle" fontSize={12} fill={MUTED}>row 0 · public</text>
            {missingB && <text x={COL_B + 4} y={MUL_Y1 + 20} fontSize={12} fill={MUTED}>b 두 칸만 봄</text>}
          </svg>
        );
      }}
    />
  );
}
