import M from '@/components/ui/math';
import PerformanceViz from './viz/PerformanceViz';

export default function Performance() {
  return (
    <section id="performance" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">성능 최적화</h2>
      <div className="not-prose mb-8"><PerformanceViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Groth16 증명 시간의 <strong>78%가 MSM</strong>입니다.<br />
          Pippenger 알고리즘, 멀티스레드 병렬화, 메모리 최적화를 통해 성능을 극대화합니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">Pippenger MSM</h3>
        <div className="rounded-lg border p-4 not-prose text-sm space-y-3">
          <h4 className="font-semibold text-base mb-2">O(n/log n) MSM 알고리즘</h4>
          <p className="text-xs text-muted-foreground">
            입력: n개 스칼라 <M>{'s_i'}</M>, n개 포인트 <M>{'P_i'}</M> → 출력: <M>{'\\sum s_i \\cdot P_i'}</M>
          </p>
          <div className="bg-sky-50 dark:bg-sky-950/30 rounded p-3 space-y-1">
            <p className="text-xs font-medium mb-1">최적 윈도우 크기</p>
            <M display>{'w = \\lceil \\log_2(n) \\rceil + 2'}</M>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded p-3">
            <p className="text-xs font-medium mb-1">버킷 분류 + 시프트 누적</p>
            <ol className="space-y-1 text-xs list-decimal list-inside text-muted-foreground">
              <li>스칼라를 w비트 윈도우로 분할</li>
              <li>각 윈도우에서 2^w개 버킷에 분류</li>
              <li>버킷 합산 → 윈도우 결과</li>
              <li>윈도우 결과를 시프트-누적</li>
            </ol>
          </div>
          <p className="text-xs text-muted-foreground">
            복잡도: <M>{'O(n / \\log n)'}</M> — 나이브 O(n) 대비 log n배 개선
          </p>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-4">병렬 처리 전략</h3>
        <div className="rounded-lg border p-4 not-prose text-sm space-y-3">
          <h4 className="font-semibold text-base mb-2">rayon 기반 멀티스레드</h4>
          <div className="bg-sky-50 dark:bg-sky-950/30 rounded p-3 space-y-1">
            <p className="text-xs font-medium mb-1">A/B + B_g2/B_g1 병렬</p>
            <ol className="space-y-1 text-xs list-decimal list-inside text-muted-foreground">
              <li>A, B MSM → <code>rayon::join</code>으로 병렬 실행</li>
              <li>B_g2, B_g1 → <code>rayon::join</code>으로 병렬 실행</li>
              <li>각 MSM 내부: 윈도우별 <code>rayon::scope</code> 병렬</li>
              <li>FFT/IFFT: 버터플라이 연산 병렬화</li>
            </ol>
          </div>
          <div className="bg-amber-50 dark:bg-amber-950/30 rounded p-3">
            <p className="text-xs font-medium">스레드 수 ≈ CPU 코어 수 (자동 감지)</p>
            <p className="text-xs text-muted-foreground">→ 8코어 기준 약 5~7배 속도 향상</p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-4">벤치마크 비교</h3>
        <div className="rounded-lg border p-4 not-prose text-sm">
          <h4 className="font-semibold text-base mb-3">BN254, 2^16 제약 기준</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-1.5 pr-4 font-medium">단계</th>
                  <th className="text-right py-1.5 px-4 font-medium">시간</th>
                  <th className="text-right py-1.5 pl-4 font-medium">비중</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-b"><td className="py-1.5 pr-4">Setup</td><td className="text-right px-4">~2.5s</td><td className="text-right pl-4">1회성</td></tr>
                <tr className="border-b font-medium text-foreground"><td className="py-1.5 pr-4">Prove</td><td className="text-right px-4">~1.8s</td><td className="text-right pl-4">매번</td></tr>
                <tr className="border-b"><td className="py-1.5 pr-4 pl-4">witness</td><td className="text-right px-4">~0.1s</td><td className="text-right pl-4">5%</td></tr>
                <tr className="border-b"><td className="py-1.5 pr-4 pl-4">FFT(h)</td><td className="text-right px-4">~0.3s</td><td className="text-right pl-4">17%</td></tr>
                <tr className="border-b"><td className="py-1.5 pr-4 pl-4">MSM(A,B,C)</td><td className="text-right px-4">~1.4s</td><td className="text-right pl-4 font-medium text-foreground">78%</td></tr>
                <tr><td className="py-1.5 pr-4">Verify</td><td className="text-right px-4">~4ms</td><td className="text-right pl-4">O(1)</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground mt-3 border-t pt-2">
            GPU 가속 시 Prove ~0.3s (6배 개선)
          </p>
        </div>
      </div>
    </section>
  );
}
