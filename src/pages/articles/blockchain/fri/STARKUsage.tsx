import Math from '@/components/ui/math';

export default function STARKUsage() {
  const systems: { name: string; desc: string; color: string }[] = [
    { name: 'StarkWare (Cairo / Stwo)', desc: 'Circle STARK에 FRI 사용. 가장 오래된 상용 STARK 시스템이다', color: 'indigo' },
    { name: 'Plonky2 (Polygon)', desc: 'Goldilocks 필드(64비트) + FRI. 재귀 증명에 최적화했다', color: 'emerald' },
    { name: 'Plonky3 (Polygon)', desc: 'BabyBear 필드(31비트) + FRI. 모듈형 STARK 프레임워크다', color: 'amber' },
    { name: 'RISC Zero', desc: 'RISC-V 범용 zkVM. BabyBear + FRI로 임의 프로그램을 증명한다', color: 'indigo' },
  ];

  return (
    <section id="stark-usage" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">STARK에서의 FRI</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          STARK(Scalable Transparent ARgument of Knowledge)는 FRI를 핵심 서브프로토콜로 사용한다.
          <br />
          전체 증명 파이프라인에서 FRI가 어떻게 동작하는지 살펴보자
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">STARK 증명 흐름</h3>
        <div className="not-prose grid grid-cols-1 gap-3 my-4">
          {[
            {
              step: '1. 실행 트레이스 → 다항식',
              desc: '프로그램 실행 결과를 행렬로 기록하고, 각 열을 다항식으로 보간한다',
              color: 'indigo',
            },
            {
              step: '2. RS 확장 (LDE)',
              desc: '차수-d 다항식을 ρ·d개 점에서 평가한다 (ρ: blowup factor, 보통 4~8배). 이것이 Reed-Solomon 인코딩이다',
              color: 'emerald',
            },
            {
              step: '3. Merkle 커밋',
              desc: '확장된 평가값을 Merkle 트리로 커밋한다. 루트 해시가 다항식의 커밋먼트다',
              color: 'amber',
            },
            {
              step: '4. FRI로 차수 바운드 증명',
              desc: '커밋된 함수가 차수-d 다항식에 가까움을 FRI로 증명한다. 검증자는 O(log d) 쿼리만 한다',
              color: 'indigo',
            },
          ].map(p => (
            <div key={p.step} className={`rounded-lg border border-${p.color}-500/20 bg-${p.color}-500/5 p-4`}>
              <p className={`font-semibold text-sm text-${p.color}-400`}>{p.step}</p>
              <p className="text-sm mt-1.5 text-foreground/75">{p.desc}</p>
            </div>
          ))}
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">FRI와 Reed-Solomon의 관계</h3>
        <p>
          <a href="/crypto/reed-solomon" className="text-indigo-400 hover:underline">Reed-Solomon 부호</a>는
          차수 <Math>{'< d'}</Math> 다항식의 평가값 집합이다.
          <br />
          FRI는 "주어진 함수가 RS 부호어에 가까운가?"를 묻는 proximity test다.
          <br />
          가깝다면 원래 다항식의 차수가 <Math>{'d'}</Math> 미만이라는 뜻이다.
          <br />
          평가 도메인은{' '}
          <a href="/crypto/fft" className="text-indigo-400 hover:underline">FFT/NTT</a>와
          동일한 곱셈 부분군(multiplicative subgroup)을 사용한다
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">증명 크기 vs 검증 시간</h3>
        <p>
          FRI 기반 STARK의 특성을 KZG 기반 SNARK와 비교하면:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>증명 크기: <Math>{'O(\\log^2 d)'}</Math> — KZG의 <Math>{'O(1)'}</Math>보다 크다</li>
          <li>검증 시간: <Math>{'O(\\log d)'}</Math> — KZG의 <Math>{'O(1)'}</Math> 페어링보다 느리다</li>
          <li>증명 시간: <Math>{'O(d \\log d)'}</Math> — KZG MSM과 비슷하다</li>
          <li><strong>trusted setup 불필요</strong> — 해시 함수만 있으면 된다 (투명 셋업)</li>
          <li><strong>양자 내성</strong> — 타원곡선/페어링에 의존하지 않는다</li>
        </ul>
        <p>
          증명 크기가 커지는 대가로 신뢰 가정을 완전히 제거한다.
          <br />
          실제 STARK 증명은 수십~수백 KB로 SNARK(256B)보다 크지만, 재귀 증명으로 압축 가능하다
        </p>
      </div>

      <h3 className="text-lg font-semibold mt-8 mb-3">FRI를 사용하는 시스템</h3>
      <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3">
        {systems.map(p => (
          <div key={p.name} className={`rounded-lg border border-${p.color}-500/20 bg-${p.color}-500/5 p-4`}>
            <p className={`font-semibold text-sm text-${p.color}-400`}>{p.name}</p>
            <p className="text-sm mt-1.5 text-foreground/75">{p.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
