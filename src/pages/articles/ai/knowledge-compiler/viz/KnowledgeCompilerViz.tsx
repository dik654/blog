import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

function Arrow({ x1, y1, x2, y2, color = 'var(--muted-foreground)', markerId = 'kc-arrow' }: { x1: number; y1: number; x2: number; y2: number; color?: string; markerId?: string }) {
  return (
    <motion.line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1.5} markerEnd={`url(#${markerId})`}
      initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.8 }} transition={{ duration: 0.35 }} />
  );
}

function Node({ x, y, w, h, title, sub, color, active = true }: {
  x: number; y: number; w: number; h: number; title: string; sub?: string; color: string; active?: boolean;
}) {
  return (
    <motion.g initial={{ opacity: 0, y: 7 }} animate={{ opacity: active ? 1 : 0.3, y: 0 }}>
      <rect x={x} y={y} width={w} height={h} rx={7} fill="var(--card)" stroke={active ? color : 'var(--border)'} />
      <rect x={x} y={y} width={w} height={4} rx={2} fill={active ? color : 'var(--border)'} />
      <text x={x + w / 2} y={y + h / 2 - (sub ? 3 : -4)} textAnchor="middle" fontSize="10.5" fontWeight="700" fill="var(--foreground)">{title}</text>
      {sub && <text x={x + w / 2} y={y + h / 2 + 13} textAnchor="middle" fontSize="8.8" fill="var(--muted-foreground)">{sub}</text>}
    </motion.g>
  );
}

function CompilerScene({ step }: { step: number }) {
  const inputs = [
    ['PDF', 'page · figure'], ['Video', 'time · frame'], ['HTML', 'DOM · link'], ['Git', 'file · symbol'],
  ];
  return (
    <svg viewBox="0 0 760 370" className="h-auto w-full" role="img" aria-label="PDF, video, HTML, GitHub을 normalized document와 Knowledge IR로 바꾸는 과정">
      <defs><marker id="kc-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 Z" fill="var(--muted-foreground)" /></marker></defs>
      <text x="380" y="28" textAnchor="middle" fontSize="14" fontWeight="800" fill="var(--foreground)">형식은 버리되 근거 위치는 버리지 않는다</text>
      {inputs.map(([title, sub], i) => (
        <Node key={title} x={22} y={60 + i * 70} w={105} h={48} title={title} sub={sub} color="#2563eb" active={step >= 0} />
      ))}
      <Node x={174} y={118} w={126} h={108} title="Modality parser" sub="text · OCR · STT · AST" color="#0f766e" active={step >= 1} />
      {step >= 1 && inputs.map((_, i) => <Arrow key={i} x1={127} y1={84 + i * 70} x2={166} y2={172} />)}
      <Node x={347} y={77} w={142} h={190} title="Normalized document" sub="ordered blocks" color="#7c3aed" active={step >= 2} />
      {step >= 2 && <Arrow x1={300} y1={172} x2={339} y2={172} color="#0f766e" />}
      {step >= 2 && [
        ['heading', 'p. 3'], ['paragraph', 'p. 3'], ['figure', 'p. 4'], ['code', 'file:line'], ['caption', '10:31'],
      ].map(([type, source], i) => (
        <motion.g key={type} initial={{ opacity: 0, x: -7 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}>
          <rect x={365} y={110 + i * 27} width={106} height={20} rx={4} fill="var(--background)" stroke="var(--border)" />
          <text x={373} y={124 + i * 27} fontSize="8.5" fontWeight="700" fill="var(--foreground)">{type}</text>
          <text x={462} y={124 + i * 27} textAnchor="end" fontSize="8" fill="#7c3aed">{source}</text>
        </motion.g>
      ))}
      <Node x={536} y={76} w={142} h={116} title="Knowledge IR" sub="concept · claim · evidence" color="#a16207" active={step >= 3} />
      {step >= 3 && <Arrow x1={489} y1={150} x2={528} y2={134} color="#7c3aed" />}
      {step >= 3 && (
        <g>
          <circle cx={566} cy={226} r={7} fill="#2563eb" />
          <circle cx={610} cy={250} r={7} fill="#a16207" />
          <circle cx={655} cy={220} r={7} fill="#0f766e" />
          <line x1={573} y1={230} x2={603} y2={246} stroke="var(--muted-foreground)" />
          <line x1={617} y1={246} x2={648} y2={224} stroke="var(--muted-foreground)" />
          <text x={610} y={278} textAnchor="middle" fontSize="8.5" fill="var(--muted-foreground)">relation + evidence edge</text>
        </g>
      )}
      {step >= 4 && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Arrow x1={607} y1={192} x2={607} y2={305} color="#a16207" />
          {['기술 리뷰', '구현 가이드', 'Concept graph'].map((label, i) => (
            <g key={label}>
              <rect x={470 + i * 92} y={312} width={82} height={32} rx={5} fill="var(--card)" stroke="var(--border)" />
              <text x={511 + i * 92} y={332} textAnchor="middle" fontSize="8.5" fontWeight="650" fill="var(--foreground)">{label}</text>
            </g>
          ))}
        </motion.g>
      )}
    </svg>
  );
}

export function CompilerPipelineViz() {
  return (
    <StepViz steps={[
      { label: '1. 원본은 text만이 아니라 위치와 형식을 함께 가진다.', body: 'PDF page, video timestamp, HTML URL, code symbol이 나중에 근거를 다시 찾는 주소가 된다.' },
      { label: '2. 형식별 parser가 구조를 추출한다.', body: 'PDF layout, OCR, STT, DOM, Markdown AST, code AST는 같은 도구로 처리할 수 없다. 각 parser가 강한 영역을 맡는다.' },
      { label: '3. 결과를 ordered block schema로 정규화한다.', body: 'heading, paragraph, figure, table, equation, code block을 공통 block으로 바꾸되 source span을 계속 붙여 둔다.' },
      { label: '4. LLM은 block에서 concept, claim, relation, evidence를 뽑는다.', body: 'Knowledge IR은 모델 머릿속의 latent space가 아니라 제품이 실제로 저장하고 검증하는 명시적 데이터 구조다.' },
      { label: '5. Renderer가 같은 IR을 여러 결과물로 바꾼다.', body: '한국어 기술 리뷰, 구현 가이드, flash card, concept graph가 같은 근거 graph에서 파생된다.' },
    ]}>
      {(step) => <CompilerScene step={step} />}
    </StepViz>
  );
}

function LanguageScene({ step }: { step: number }) {
  const inputs = [
    ['sparse attention', 'en'], ['희소 어텐션', 'ko'], ['稀疏注意力', 'zh'], ['疎なAttention', 'ja'],
  ];
  return (
    <svg viewBox="0 0 760 330" className="h-auto w-full" role="img" aria-label="여러 언어의 표현이 하나의 concept id에 연결되고 선택한 언어로 렌더링되는 과정">
      <defs><marker id="lang-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 Z" fill="var(--muted-foreground)" /></marker></defs>
      {inputs.map(([label, lang], i) => (
        <motion.g key={lang} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}>
          <rect x={34} y={46 + i * 63} width={190} height={42} rx={6} fill="var(--card)" stroke="#2563eb" />
          <text x={48} y={70 + i * 63} fontSize="10" fontWeight="650" fill="var(--foreground)">{label}</text>
          <text x={210} y={70 + i * 63} textAnchor="end" fontSize="9" fill="var(--muted-foreground)">{lang}</text>
          {step >= 1 && <line x1={224} y1={67 + i * 63} x2={326} y2={161} stroke="var(--muted-foreground)" markerEnd="url(#lang-arrow)" />}
        </motion.g>
      ))}
      <Node x={334} y={112} w={144} h={96} title="concept:attention.sparse" sub="language-neutral id" color="#7c3aed" active={step >= 1} />
      {step >= 2 && (
        <g>
          <Arrow x1={478} y1={160} x2={544} y2={160} color="#7c3aed" markerId="lang-arrow" />
          <Node x={552} y={84} w={170} h={58} title="Korean renderer" sub="용어집 + 문체 규칙" color="#0f766e" />
          <Node x={552} y={184} w={170} h={58} title="English renderer" sub="same claims, same evidence" color="#a16207" />
        </g>
      )}
      {step >= 3 && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <rect x={315} y={246} width={194} height={54} rx={6} fill="var(--card)" stroke="#b42318" strokeDasharray="5 4" />
          <text x="412" y="268" textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#b42318">source text is never discarded</text>
          <text x="412" y="286" textAnchor="middle" fontSize="8.5" fill="var(--muted-foreground)">번역 오류를 원문 span으로 역추적</text>
        </motion.g>
      )}
    </svg>
  );
}

export function MultilingualIrViz() {
  return (
    <StepViz steps={[
      { label: '1. 다른 문자열이 같은 개념을 가리킬 수 있다.', body: '다국어 LLM은 여러 언어 표현을 의미적으로 연결할 수 있지만, 제품 데이터에는 원문 언어와 source span을 따로 보존해야 한다.' },
      { label: '2. Knowledge IR은 언어 중립 concept id로 관계를 묶는다.', body: 'concept id가 같아도 원문의 전문 용어, 문장, 수식은 evidence로 그대로 남는다.' },
      { label: '3. 출력 언어는 마지막 renderer에서 고른다.', body: '같은 claim graph를 한국어와 영어로 렌더링한다. 언어별 glossary와 문체 규칙은 renderer의 책임이다.' },
      { label: '4. 원문을 보존해야 번역과 요약 오류를 되돌릴 수 있다.', body: '내부 의미 표현만 믿으면 틀린 해석이 어디서 생겼는지 찾기 어렵다. provenance가 회귀 검사의 기준점이다.' },
    ]}>
      {(step) => <LanguageScene step={step} />}
    </StepViz>
  );
}

function ReliabilityScene({ step }: { step: number }) {
  return (
    <svg viewBox="0 0 760 340" className="h-auto w-full" role="img" aria-label="규칙 기반 parser, agent fallback, evidence validator의 신뢰성 흐름">
      <defs><marker id="reliability-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 Z" fill="var(--muted-foreground)" /></marker></defs>
      <Node x={38} y={122} w={118} h={70} title="Raw page" sub="DOM + screenshot" color="#2563eb" />
      <Arrow x1={156} y1={157} x2={206} y2={157} markerId="reliability-arrow" />
      <Node x={214} y={86} w={148} h={70} title="Deterministic parser" sub="API · selector · AST" color="#0f766e" active={step >= 0} />
      <Node x={214} y={204} w={148} h={70} title="Browser agent" sub="only uncertain region" color="#7c3aed" active={step >= 1} />
      {step >= 1 && (
        <g>
          <path d="M188 157 C190 228 198 238 206 238" fill="none" stroke="#7c3aed" strokeWidth={1.5} strokeDasharray="5 4" markerEnd="url(#reliability-arrow)" />
          <text x="116" y="254" fontSize="9" fill="#7c3aed">low confidence / dynamic UI</text>
        </g>
      )}
      <Node x={426} y={122} w={130} h={70} title="Evidence validator" sub="span · schema · tests" color="#a16207" active={step >= 2} />
      {step >= 2 && <><Arrow x1={362} y1={121} x2={418} y2={146} color="#0f766e" markerId="reliability-arrow" /><Arrow x1={362} y1={239} x2={418} y2={172} color="#7c3aed" markerId="reliability-arrow" /></>}
      <Node x={616} y={76} w={108} h={58} title="Accept" sub="claim + source" color="#0f766e" active={step >= 3} />
      <Node x={616} y={218} w={108} h={58} title="Review queue" sub="conflict / missing" color="#b42318" active={step >= 3} />
      {step >= 3 && <><Arrow x1={556} y1={145} x2={608} y2={110} color="#0f766e" markerId="reliability-arrow" /><Arrow x1={556} y1={178} x2={608} y2={238} color="#b42318" markerId="reliability-arrow" /></>}
    </svg>
  );
}

export function ReliabilityBoundaryViz() {
  return (
    <StepViz steps={[
      { label: '1. API와 구조 parser가 먼저 처리한다.', body: '같은 입력에 같은 결과가 나와야 대량 처리, cache, regression test가 가능하다.' },
      { label: '2. Agent는 구조가 깨진 구간에만 fallback한다.', body: '동적 UI, 예상하지 못한 layout, 로그인 흐름처럼 규칙이 불확실한 영역에 browser agent 비용을 집중한다.' },
      { label: '3. 어느 경로로 왔든 evidence validator를 통과한다.', body: 'schema validation, source span 존재, code execution, 표 셀 수 같은 기계적 검사를 LLM 판단과 분리한다.' },
      { label: '4. 근거가 맞으면 저장하고 충돌은 review queue로 보낸다.', body: '모든 결과를 억지로 확정하지 않는다. unknown과 contradiction을 데이터 상태로 남겨야 다시 처리할 수 있다.' },
    ]}>
      {(step) => <ReliabilityScene step={step} />}
    </StepViz>
  );
}
