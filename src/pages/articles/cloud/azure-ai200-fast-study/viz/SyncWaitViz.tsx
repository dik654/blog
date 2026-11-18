import SceneShell from "./SceneShell";

/**
 * 본문 대응: #overview — 모델 API는 3초에 답했지만 같은 요청 안에서 벡터 검색 재시도와 긴 후처리를 기다려 40초 뒤 timeout.
 * 1·2장면: 0~40초 축(8px = 1초). 모델 3초, 모델 밖 40 − 3 = 37초. 37초 안의 나눔과 호출 순서는 본문에 없으므로 칸을 나누지 않는다.
 * 3·4장면: 2문단의 고친 경로. 시간 축이 아니라 순서 그림이며, 줄어든 응답 시간은 본문에 숫자가 없어 적지 않는다.
 */
const TOTAL_S = 40;
const MODEL_S = 3;
const OTHER_S = TOTAL_S - MODEL_S;
const X0 = 24;
const X1 = 336;
const sx = (seconds: number) => X0 + (seconds / TOTAL_S) * (X1 - X0);

const SCENES = [
  {
    label: "사용자가 기다린 시간",
    summary: `${TOTAL_S}초 뒤 timeout`,
    note: "timeout은 정해 둔 시간 안에 답이 오지 않아 요청을 끊는 것입니다. 모델 API는 3초 만에 답했는데도 사용자는 40초 동안 빈 화면을 봤습니다. 모델 막대는 길이만 비교하려고 0초에 붙여 그렸고, 실제 호출 시점은 본문에 없습니다.",
  },
  {
    label: "모델 밖에서 쓴 37초",
    summary: `${TOTAL_S} − ${MODEL_S} = ${OTHER_S}초 · 구간 모름`,
    note: "애플리케이션은 벡터 검색 재시도와 긴 후처리를 같은 요청 안에서 기다렸습니다. 어느 쪽이 몇 초였는지는 본문에 없습니다. 구간마다 시간을 남기는 trace가 없었기 때문입니다. 그래서 37초를 한 칸으로 두었습니다.",
  },
  {
    label: "오래 걸리는 일은 메시지로 넘김",
    summary: "응답과 후처리를 분리",
    note: "메시지 큐는 할 일을 적어 두면 다른 작업자가 나중에 꺼내 처리하는 줄입니다. 요청은 자료를 찾아 답하고, 긴 후처리는 큐에 넘겨 기다리지 않습니다. 응답이 몇 초로 줄어드는지는 본문에 숫자가 없어 적지 않았습니다.",
  },
  {
    label: "비밀·설정·권한과 추적을 붙임",
    summary: "이미지 밖 비밀 + 구간별 trace",
    note: "비밀은 이미지에서 빼서 따로 관리하는 설정·권한으로 읽습니다(2절의 Key Vault·App Configuration). 같은 trace ID가 컨테이너·자료·큐 구간을 이어 주므로 다음에 느려지면 어느 구간인지 보입니다.",
  },
] as const;

const ROW_LABEL = "#475569";
const ACCENT = "#2563eb";
const RED = "#dc2626";
const MUTED = "#94a3b8";

function Box({ x, y, w, h, title, sub, color, dim = false }: { x: number; y: number; w: number; h: number; title: string; sub?: string; color: string; dim?: boolean }) {
  return (
    <g opacity={dim ? 0.3 : 1}>
      <rect x={x} y={y} width={w} height={h} rx={8} fill="none" stroke={color} strokeWidth={1} />
      <text x={x + w / 2} y={sub ? y + h / 2 - 3 : y + h / 2 + 4} textAnchor="middle" fontSize={11.5} fontWeight={700} fill="currentColor">
        {title}
      </text>
      {sub ? (
        <text x={x + w / 2} y={y + h / 2 + 12} textAnchor="middle" fontSize={10} fill={ROW_LABEL}>
          {sub}
        </text>
      ) : null}
    </g>
  );
}

function TimeScene({ showOther }: { showOther: boolean }) {
  return (
    <>
      <text x={X0} y={26} fontSize={11} fontWeight={700} fill={ROW_LABEL}>사용자 대기</text>
      <rect x={X0} y={32} width={sx(TOTAL_S) - X0} height={18} rx={3} fill={MUTED} opacity={0.55} />
      <line x1={sx(TOTAL_S)} x2={sx(TOTAL_S)} y1={26} y2={56} stroke={RED} strokeWidth={1.25} />
      <text x={sx(TOTAL_S)} y={20} textAnchor="end" fontSize={11} fontWeight={700} fill={RED}>40초 · timeout</text>

      <text x={X0} y={82} fontSize={11} fontWeight={700} fill={ROW_LABEL}>모델 API 응답(길이만 비교)</text>
      <rect x={X0} y={88} width={sx(MODEL_S) - X0} height={18} rx={3} fill={ACCENT} />
      <text x={sx(MODEL_S) + 6} y={101} fontSize={11} fontWeight={700} fill={ACCENT}>3초</text>

      <g opacity={showOther ? 1 : 0}>
        <text x={X0} y={136} fontSize={11} fontWeight={700} fill={ROW_LABEL}>모델 밖에서 쓴 시간(길이만 비교)</text>
        <rect x={X0} y={142} width={sx(OTHER_S) - X0} height={18} rx={3} fill="none" stroke={RED} strokeWidth={1} strokeDasharray="4 3" />
        <text x={X0 + (sx(OTHER_S) - X0) / 2} y={155} textAnchor="middle" fontSize={10.5} fill="currentColor">
          37초 · 검색 재시도 + 후처리 · 나눔 ?
        </text>
      </g>

      <line x1={X0} x2={X1} y1={180} y2={180} stroke={MUTED} strokeWidth={1} />
      {[0, 10, 20, 30, 40].map((tick) => (
        <g key={tick}>
          <line x1={sx(tick)} x2={sx(tick)} y1={177} y2={183} stroke={MUTED} strokeWidth={1} />
          <text x={sx(tick)} y={196} textAnchor="middle" fontSize={10} fill={ROW_LABEL}>{tick}초</text>
        </g>
      ))}
    </>
  );
}

function PathScene({ ops }: { ops: boolean }) {
  return (
    <>
      <Box x={6} y={24} w={70} h={40} title="사용자" color={MUTED} />
      <Box x={112} y={24} w={100} h={40} title="컨테이너" sub="요청 받음" color={ACCENT} />
      <Box x={248} y={24} w={104} h={40} title="자료 찾기" sub="캐시·벡터 검색" color={ACCENT} />
      <line x1={76} x2={110} y1={38} y2={38} stroke={ACCENT} strokeWidth={1} markerEnd="url(#sw-arrow)" />
      <line x1={110} x2={78} y1={52} y2={52} stroke="#16a34a" strokeWidth={1.25} markerEnd="url(#sw-arrow-green)" />
      <text x={94} y={76} textAnchor="middle" fontSize={10} fontWeight={700} fill="#15803d">응답</text>
      <line x1={212} x2={246} y1={44} y2={44} stroke={ACCENT} strokeWidth={1} markerEnd="url(#sw-arrow)" />

      <line x1={162} x2={162} y1={64} y2={110} stroke="#d97706" strokeWidth={1} strokeDasharray="4 3" markerEnd="url(#sw-arrow-amber)" />
      <text x={168} y={92} fontSize={10} fill="#b45309">긴 일만 넘김</text>
      <Box x={112} y={112} w={100} h={40} title="메시지 큐" sub="할 일 보관" color="#d97706" />
      <Box x={248} y={112} w={104} h={40} title="작업자" sub="긴 후처리" color="#d97706" />
      <line x1={212} x2={246} y1={132} y2={132} stroke="#d97706" strokeWidth={1} markerEnd="url(#sw-arrow-amber)" />

      <Box x={6} y={112} w={70} h={40} title="비밀·설정" sub="이미지 밖" color="#7c3aed" dim={!ops} />
      <line x1={76} x2={110} y1={124} y2={60} stroke="#7c3aed" strokeWidth={1} strokeDasharray="2 3" opacity={ops ? 1 : 0.3} />

      <g opacity={ops ? 1 : 0.15}>
        <line x1={20} x2={348} y1={176} y2={176} stroke="#7c3aed" strokeWidth={1} strokeDasharray="1 3" />
        <polyline points="212,58 230,58 230,176" fill="none" stroke="#7c3aed" strokeWidth={1} strokeDasharray="1 3" />
        {[162, 300].map((x) => (
          <line key={x} x1={x} x2={x} y1={152} y2={176} stroke="#7c3aed" strokeWidth={1} strokeDasharray="1 3" />
        ))}
        <line x1={300} x2={300} y1={64} y2={112} stroke="#7c3aed" strokeWidth={1} strokeDasharray="1 3" />
        <text x={20} y={192} fontSize={10.5} fontWeight={700} fill="#6d28d9">같은 trace ID로 구간마다 시간 기록</text>
      </g>
    </>
  );
}

export default function SyncWaitViz() {
  return (
    <SceneShell
      eyebrow="40초 빈 화면"
      title="모델은 3초에 답했는데 사용자는 왜 40초를 기다렸나"
      description="1절 사건(가정)을 그렸습니다. 앞의 두 장면은 0~40초 시간 축이고, 뒤의 두 장면은 2문단의 고친 경로를 순서대로 놓은 그림이라 시간 축이 아닙니다."
      ariaLabel="같은 요청 안에서 기다린 40초와, 긴 일을 메시지 큐로 넘기고 비밀과 추적을 붙인 경로"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 204" className="mx-auto h-auto w-full max-w-[560px] text-foreground" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <defs>
            <marker id="sw-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto">
              <path d="M0 0 L8 4 L0 8 z" fill={ACCENT} />
            </marker>
            <marker id="sw-arrow-green" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto">
              <path d="M0 0 L8 4 L0 8 z" fill="#16a34a" />
            </marker>
            <marker id="sw-arrow-amber" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto">
              <path d="M0 0 L8 4 L0 8 z" fill="#d97706" />
            </marker>
          </defs>
          {active < 2 ? <TimeScene showOther={active === 1} /> : <PathScene ops={active === 3} />}
        </svg>
      )}
    />
  );
}
