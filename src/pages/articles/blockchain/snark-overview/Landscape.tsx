import { coreSystems, implProjects, type ProofSystem } from './LandscapeData';

function Card({ s }: { s: ProofSystem }) {
  return (
    <div className={`rounded-lg border-2 ${s.color} p-4`}>
      <h4 className="font-semibold text-sm mb-2">
        {s.href ? (
          <a href={s.href} className="text-indigo-400 hover:underline">{s.name}</a>
        ) : s.name}
      </h4>
      <p className="text-xs text-muted-foreground mb-3"
        dangerouslySetInnerHTML={{ __html: s.property }} />
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
        <span>증명: <strong>{s.proofSize}</strong></span>
        <span>검증: <strong>{s.verify}</strong></span>
        <span>Setup:{' '}
          <strong className={s.setup ? 'text-amber-400' : 'text-emerald-400'}>
            {s.setup ? '필요' : '불필요'}
          </strong>
        </span>
      </div>
    </div>
  );
}

export default function Landscape() {
  return (
    <section id="landscape" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">증명 시스템 지도</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-4">
        <p>
          증명 시스템(프로토콜)과 이를 기반으로 만든 프로젝트(구현체)를 구분해서 정리한다
        </p>
        <h3>증명 시스템 (프로토콜)</h3>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 not-prose mb-8">
        {coreSystems.map(s => <Card key={s.name} s={s} />)}
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-4">
        <h3>프로젝트 / 구현체</h3>
        <p>위 시스템들을 조합하여 만든 실제 구현체</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 not-prose mb-8">
        {implProjects.map(s => <Card key={s.name} s={s} />)}
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>선택 기준</h3>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 not-prose mt-3">
        {[
          { t: '온체인 검증 최적화', d: '가스 비용이 가장 중요하면 Groth16 또는 FFLONK' },
          { t: '개발 유연성', d: '회로를 자주 변경하면 PLONK 계열 (universal setup)' },
          { t: '신뢰 최소화', d: 'trusted setup을 피하려면 STARK 또는 Bulletproofs' },
          { t: '범용 프로그래밍', d: '임의의 프로그램 증명이면 zkVM (RISC Zero, SP1, Jolt)' },
        ].map(c => (
          <div key={c.t} className="rounded-lg border p-4">
            <h4 className="font-medium text-sm mb-1">{c.t}</h4>
            <p className="text-sm text-muted-foreground">{c.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
