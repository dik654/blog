import ContextViz from './viz/ContextViz';
import GpuSpecMatrixViz from './viz/GpuSpecMatrixViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">왜 GPU를 비교해야 하는가</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <GpuSpecMatrixViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none mt-10">
        <p className="leading-7">
          컨슈머 (RTX 4090/5090) vs 데이터센터 (A100/H100) GPU 의 결정은 <strong>워크로드 + VRAM + cooling + 예산</strong> 4 축.
          <br />
          블록체인 / Filecoin / AI 워크로드별 병목이 달라 같은 GPU 가 모든 시나리오에 답이 아니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">결정의 4 축</h3>
        <ul className="leading-7">
          <li><strong>워크로드 종류</strong> — MSM / pairing 은 메모리 bandwidth bound · NTT/FFT 는 compute bound · SHA256 은 compute + power · AI 는 tensor operation. GPU 마다 강점이 다름.</li>
          <li><strong>VRAM 요구</strong> — Filecoin sealing 최소 24 GB · ZK 큰 회로 32~80 GB · LLM 추론 80 GB+ · 작은 잡 16 GB OK.</li>
          <li><strong>폼 팩터 (cooling)</strong> — 컨슈머 open-air (가정용 케이스) · 데이터센터 blower (서버 랙). 혼용하면 cooling mismatch → thermal throttle.</li>
          <li><strong>예산</strong> — 컨슈머 $1.5K~2K · 데이터센터 $10K~40K. 총비용은 GPU + 전력 + 냉각.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">시나리오별 권장 구성</h3>
        <ul className="leading-7">
          <li><strong>개인 마이너 (가정)</strong> — RTX 4090 × 1~2 · 예산 ~$4K · Filecoin sealing 가능, SP scale 작음.</li>
          <li><strong>작은 SP (랙)</strong> — A6000 × 4~8 · 예산 $25~40K · 10~50 TiB capacity · production 급.</li>
          <li><strong>엔터프라이즈 SP (데이터센터)</strong> — A100/H100 × 50+ · 예산 $500K+ · 1 PiB+ · 24/7 운영.</li>
          <li><strong>AI/ML 랩</strong> — H100 × 8~64 · NVLink 클러스터 · 학습 + 추론 · 예산 $1M+.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">C2 (Filecoin Groth16 prove) 시간 비교</h3>
        <ul className="leading-7">
          <li>RTX 4090 — 40~60 분</li>
          <li>RTX A6000 — 30~45 분</li>
          <li>A100 80GB — 20~30 분</li>
          <li>H100 SXM5 — 15~25 분</li>
          <li>B200 (2024 신) — &lt; 15 분</li>
        </ul>
      </div>
    </section>
  );
}
