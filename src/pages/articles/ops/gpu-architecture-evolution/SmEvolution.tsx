import SmStructureViz from './viz/SmStructureViz';

export default function SmEvolution() {
  return (
    <section id="sm" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">1. SM (Streaming Multiprocessor) — GPU 의 가장 작은 컴퓨트 단위</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          GPU 는 SM 의 모음이다. H100 = 132 SM. 한 SM 안에서 warp (32 thread) 가 실행되고 register / L1 / shared memory 를 공유.
          <br />
          아키텍처 진화의 본질은 SM 의 변화 — partition 수, 연산 unit, cache 크기, 새 가속기 추가.
        </p>
      </div>

      <SmStructureViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-10">
        <h3 className="text-xl font-semibold mt-8 mb-3">1-1. SM 의 구성 요소</h3>
        <ul className="leading-7">
          <li><strong>SM partition</strong> — SM 안의 sub-block (보통 4 개). 각 partition 이 자체 warp scheduler + register file + 연산 unit.</li>
          <li><strong>CUDA core (FP32 unit)</strong> — 한 사이클에 1 FP32 연산. SM 당 64 / 128 개.</li>
          <li><strong>FP64 unit</strong> — DC GPU 만 충분. consumer 는 1/32 비율로 거의 없음.</li>
          <li><strong>Tensor Core</strong> — 행렬 곱 전용. partition 당 1 개. 사이클당 4×4 행렬 (256 FMA).</li>
          <li><strong>Special Function Unit (SFU)</strong> — sin / cos / sqrt / log 같은 transcendental.</li>
          <li><strong>Load/Store unit</strong> — 메모리 access 발행.</li>
          <li><strong>Warp Scheduler</strong> — 매 cycle 32 thread 의 명령 dispatch. partition 당 1 개.</li>
          <li><strong>Register file</strong> — 64K × 32-bit register / SM. thread 당 ~32~64 register 일반.</li>
          <li><strong>L1 cache + shared memory</strong> — partition 통합. 사용자 코드가 비율 조정 가능 (configurable).</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">1-2. 세대별 SM 개수와 효율</h3>
        <ul className="leading-7">
          <li><strong>V100 (Volta)</strong> — 80 SM, partition 당 16 FP32. 첫 Tensor Core (FP16).</li>
          <li><strong>A100 (Ampere)</strong> — 108 SM, partition 당 16 FP32 + 새 INT/FP path. 3 gen Tensor Core (TF32 추가).</li>
          <li><strong>H100 (Hopper)</strong> — 132 SM, partition 당 32 FP32 (2x). 4 gen Tensor Core (FP8) + Transformer Engine + TMA.</li>
          <li><strong>B200 (Blackwell)</strong> — 144 SM × 2 die. 5 gen Tensor Core (FP4).</li>
          <li><strong>같은 clock 인데도</strong> — H100 의 단일 SM 이 V100 SM 의 ~3x throughput. partition 효율 + 큰 cache + Tensor Core 4 gen.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">1-3. SM occupancy — 효율의 핵심</h3>
        <ul className="leading-7">
          <li><strong>Occupancy</strong> — 한 SM 에 동시 활성 warp 비율 (max 64 warp / SM).</li>
          <li><strong>제한 요인</strong> — register / 시간 / shared memory / block size.</li>
          <li><strong>레지스터 한계</strong> — kernel 이 thread 당 64 register 쓰면 max 32 warp 만 활성. 512 register / thread = max 4 warp.</li>
          <li><strong>shared memory 한계</strong> — block 당 16 KB 쓰면 SM 당 6 block 만 활성 (96 KB / 16).</li>
          <li><strong>실 영향</strong> — Filecoin Montgomery 곱셈 (4-limb CIOS) ≈ 40 register / thread. occupancy 50% 정도. tuning 가치 큼.</li>
          <li><strong>도구</strong> — NVIDIA Nsight Compute 의 occupancy calculator.</li>
        </ul>
      </div>
    </section>
  );
}
