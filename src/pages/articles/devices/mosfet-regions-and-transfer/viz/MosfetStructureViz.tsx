import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #terminals — 표의 네 단자가 소자 단면 어디에 붙는지와 두 방향(전자, 양의 관습 전류).
 * 전압은 3절의 가정값이며 크기는 비례가 아닌 개념도입니다.
 */
export default function MosfetStructureViz() {
  return (
    <VizFrame
      documentFlow
      eyebrow="소자 단면"
      title="네 단자는 단면의 어디에 붙고 전자는 어느 쪽으로 갈까요"
      description="소자를 옆에서 자른 개념도입니다. 전압은 3절의 가정값이고 크기는 실제 치수 비율이 아닙니다."
      note="절연층이 사이에 있으므로 게이트는 전자를 직접 통과시키는 공급 단자가 아닙니다. 드레인 전류를 양수로 세는 방향은 전자 이동의 반대입니다."
    >
      <svg viewBox="0 0 360 234" className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-label="MOSFET 단면. 위에 게이트와 절연층, 양쪽에 n형 영역과 소스 드레인, 아래에 p형 바디와 바디 단자. 전자는 소스에서 드레인으로, 양의 관습 전류는 드레인에서 소스로 향합니다.">
        <defs>
          <marker id="mosfet-arrow-blue" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0 0L7 3.5L0 7Z" fill="#2563eb" /></marker>
          <marker id="mosfet-arrow-amber" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0 0L7 3.5L0 7Z" fill="#d97706" /></marker>
        </defs>
        <rect x="16" y="66" width="328" height="136" rx="4" fill="#64748b" fillOpacity={0.12} stroke="#64748b" strokeWidth={1} />
        <rect x="16" y="66" width="82" height="58" rx="4" fill="#2563eb" fillOpacity={0.14} stroke="#2563eb" strokeWidth={1} />
        <rect x="262" y="66" width="82" height="58" rx="4" fill="#2563eb" fillOpacity={0.14} stroke="#2563eb" strokeWidth={1} />
        <rect x="98" y="56" width="164" height="10" fill="#94a3b8" fillOpacity={0.45} stroke="#64748b" strokeWidth={1} />
        <rect x="98" y="30" width="164" height="26" rx="3" fill="#64748b" fillOpacity={0.28} stroke="#64748b" strokeWidth={1} />
        <text x="180" y="47" textAnchor="middle" fontSize={12} fontWeight={700} fill="currentColor">게이트 1.5 V</text>
        <text x="180" y="22" textAnchor="middle" fontSize={11} fill="currentColor">그 아래 얇은 층이 절연층</text>
        <line x1="57" y1="42" x2="57" y2="66" stroke="#64748b" strokeWidth={1} />
        <line x1="303" y1="42" x2="303" y2="66" stroke="#64748b" strokeWidth={1} />
        <text x="57" y="22" textAnchor="middle" fontSize={12} fontWeight={700} fill="currentColor">소스</text>
        <text x="57" y="36" textAnchor="middle" fontSize={11} fill="currentColor">0 V</text>
        <text x="303" y="22" textAnchor="middle" fontSize={12} fontWeight={700} fill="currentColor">드레인</text>
        <text x="303" y="36" textAnchor="middle" fontSize={11} fill="currentColor">0.2→1.0→1.5 V</text>
        <text x="57" y="100" textAnchor="middle" fontSize={11} fill="currentColor">n형 영역</text>
        <text x="303" y="100" textAnchor="middle" fontSize={11} fill="currentColor">n형 영역</text>
        <line x1="104" y1="82" x2="256" y2="82" stroke="#2563eb" strokeWidth={1.25} markerEnd="url(#mosfet-arrow-blue)" />
        <text x="180" y="78" textAnchor="middle" fontSize={11} fontWeight={700} fill="#2563eb">전자 이동</text>
        <line x1="256" y1="112" x2="104" y2="112" stroke="#d97706" strokeWidth={1.25} markerEnd="url(#mosfet-arrow-amber)" />
        <text x="180" y="107" textAnchor="middle" fontSize={11} fontWeight={700} fill="#d97706">양의 관습 전류</text>
        <text x="180" y="172" textAnchor="middle" fontSize={12} fontWeight={700} fill="currentColor">바디: p형 실리콘 바탕</text>
        <line x1="180" y1="202" x2="180" y2="216" stroke="#64748b" strokeWidth={1} />
        <text x="180" y="229" textAnchor="middle" fontSize={11} fill="currentColor">바디 단자: 소스와 같은 0 V</text>
      </svg>
    </VizFrame>
  );
}
