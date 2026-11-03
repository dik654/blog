import { motion } from "framer-motion";
import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import { DataBox, ModuleBox } from "@/components/viz/boxes";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #split-and-merge — token을 나눠 둔 rank 4장이 decode 한 층을 끝내는 순서.
 * 열 = rank. 위에서 아래로 query → 자기 token의 KV → 부분 결과 → 완성 출력. 가로 띠 = rank 사이 통신.
 * 한 mechanism: query를 모으고, 각자 자기 token만 읽고, lse로 분모를 맞춰 더한 뒤 head별로 되돌려 준다.
 * vLLM 대응: mla_attention.py query_gather → forward_mqa → dcp_manager.combine(cp_lse_ag_out_rs).
 */
const W = 360;
const RANKS = 4;
const COL_W = 74;
const GAP = (W - RANKS * COL_W) / (RANKS + 1);
const TOKENS = 8;
const H = 214;

const RANK_COLORS = ["#2563eb", "#16a34a", "#d97706", "#7c3aed"];

interface Scene {
  label: string;
  summary: string;
  band: string | null;
  bandY: number;
  query: (rank: number) => string;
  showTokens: boolean;
  partial: (rank: number) => string | null;
  final: (rank: number) => string | null;
  note: string;
}

const SCENES: readonly Scene[] = [
  {
    label: "query 모으기",
    summary: "통신 1 · query all-gather",
    band: "query 모으기 → 네 장 모두 q h0~h7",
    bandY: 52,
    query: () => "q h0~h7",
    showTokens: false,
    partial: () => null,
    final: () => null,
    note: "rank마다 query head 두 개씩만 계산해 두었습니다. 다른 rank의 token에도 모든 head의 점수가 필요하므로, 먼저 그룹 안에서 query를 모아 네 장 모두가 8개 head의 query를 갖게 합니다.",
  },
  {
    label: "자기 token만 읽기",
    summary: "통신 없음 · 부분 attention",
    band: null,
    bandY: 0,
    query: () => "q h0~h7",
    showTokens: true,
    partial: (r) => `o${r} · lse${r}`,
    final: () => null,
    note: "token t는 rank t mod 4에 있습니다. rank 0은 token 0과 4만 읽어 자기 몫의 softmax 가중합 o와, 그 분모의 로그인 lse를 head마다 하나씩 냅니다. 이 단계에는 통신이 없습니다.",
  },
  {
    label: "lse 모으기",
    summary: "통신 2 · lse all-gather",
    band: "lse 모으기",
    bandY: 140,
    query: () => "q h0~h7",
    showTokens: true,
    partial: () => "lse0~lse3",
    final: () => null,
    note: "각 rank의 o는 자기 token만으로 나눈 값이라 그대로 더하면 틀립니다. head마다 숫자 하나인 lse를 모두 모으면 전체 분모를 알 수 있습니다. 출력보다 훨씬 작은 통신입니다.",
  },
  {
    label: "보정해 더하고 나눠 받기",
    summary: "통신 3 · 출력 reduce-scatter",
    band: "더하며 head별로 나누기",
    bandY: 172,
    query: () => "q h0~h7",
    showTokens: true,
    partial: (r) => `o${r} × w${r}`,
    final: (r) => `출력 h${2 * r}·h${2 * r + 1}`,
    note: "rank r은 자기 o에 exp(lse_r − 전체 lse)를 곱합니다. 이렇게 맞춘 값을 더하면서 head 축으로 다시 나누면, 각 rank는 원래 맡던 head 두 개의 완성된 출력만 받습니다. 층마다 이 세 번의 통신이 붙습니다.",
  },
];

const colX = (r: number) => GAP + r * (COL_W + GAP);

export default function DcpDecodeStepViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4600, { loop: false });
  const scene = SCENES[scenes.active];
  const reduced = scenes.reducedMotion;
  const cellW = (COL_W - 6) / 2;

  return (
    <VizFrame
      eyebrow="token을 나눈 decode 한 층"
      title="각자 자기 token만 읽고, 분모를 맞춘 뒤 더합니다"
      description="열은 rank 4장입니다. 위에서부터 query, 그 rank가 든 token의 기록, 부분 결과, 완성된 출력 순서이고 가로 띠는 rank 사이의 통신입니다."
      note="rank 4장과 query head 8개, token 8개는 그리기 위한 가정입니다. Kimi K2.5 TP8·DCP8에서는 rank 8장, query head 64개입니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="token을 나눠 둔 rank들이 decode 한 층을 계산하는 순서"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col">
          <StableSceneStack
            active={scenes.active}
            scenes={SCENES.map((s) => (
              <div key={s.label} className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <h4 className="text-base font-bold">{s.label}</h4>
                <span className="font-mono text-sm font-bold text-primary">{s.summary}</span>
              </div>
            ))}
          />
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto mt-3 h-auto w-full max-w-[24rem]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            {scene.band ? (
              <motion.g key={`band-${scenes.active}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: reduced ? 0 : 0.35 }}>
                <rect x={4} y={scene.bandY} width={W - 8} height={14} rx={3} fill="#dc2626" fillOpacity={0.08} stroke="#dc2626" strokeWidth={0.75} strokeDasharray="3 2" />
                <text x={W / 2} y={scene.bandY + 10} textAnchor="middle" fontSize={8} fontWeight={700} fill="#dc2626">
                  {scene.band}
                </text>
              </motion.g>
            ) : null}
            {Array.from({ length: RANKS }, (_, r) => {
              const x = colX(r);
              const partial = scene.partial(r);
              const final = scene.final(r);
              const query = scene.query(r);
              return (
                <g key={`rank${r}`}>
                  <ModuleBox x={x} y={2} w={COL_W} h={20} label={`rank ${r}`} color={RANK_COLORS[r]} />
                  <DataBox x={x} y={28} w={COL_W} h={20} label={scenes.active === 0 ? `q h${2 * r}·h${2 * r + 1}` : query} color={RANK_COLORS[r]} />
                  {Array.from({ length: TOKENS }, (_, t) => {
                    const row = Math.floor(t / 2);
                    const col = t % 2;
                    const cx = x + 2 + col * (cellW + 2);
                    const cy = 70 + row * 16;
                    const mine = t % RANKS === r;
                    return (
                      <g key={`t${r}-${t}`}>
                        <rect x={cx} y={cy} width={cellW} height={13} rx={2} fill="none" stroke="#94a3b8" strokeWidth={0.75} strokeDasharray="2 2" />
                        <motion.rect
                          key={`fill-${scenes.active}-${r}-${t}`}
                          x={cx}
                          y={cy}
                          width={cellW}
                          height={13}
                          rx={2}
                          fill={RANK_COLORS[r]}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: mine ? (scene.showTokens ? 0.75 : 0.25) : 0 }}
                          transition={{ duration: reduced ? 0 : 0.3, delay: reduced ? 0 : t * 0.03 }}
                        />
                        {mine ? (
                          <text x={cx + cellW / 2} y={cy + 10} textAnchor="middle" fontSize={8} fontWeight={700} fill={scene.showTokens ? "#ffffff" : "#64748b"}>
                            {`t${t}`}
                          </text>
                        ) : null}
                      </g>
                    );
                  })}
                  {partial ? (
                    <motion.g key={`p-${scenes.active}-${r}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: reduced ? 0 : 0.3, delay: reduced ? 0 : r * 0.05 }}>
                      <DataBox x={x} y={157} w={COL_W} h={12} label={partial} color={RANK_COLORS[r]} />
                    </motion.g>
                  ) : null}
                  {final ? (
                    <motion.g key={`f-${scenes.active}-${r}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: reduced ? 0 : 0.3, delay: reduced ? 0 : 0.2 + r * 0.05 }}>
                      <ModuleBox x={x} y={190} w={COL_W} h={22} label={final} color={RANK_COLORS[r]} />
                    </motion.g>
                  ) : null}
                </g>
              );
            })}
          </svg>
          <StableSceneStack
            active={scenes.active}
            className="mt-2"
            scenes={SCENES.map((s) => (
              <p key={s.label} className="border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
                {s.note}
              </p>
            ))}
          />
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES.map((s) => s.label)} />
        <StaticSceneList labels={SCENES.map((s) => s.label)} notes={SCENES.map((s) => s.note)} />
      </div>
    </VizFrame>
  );
}
