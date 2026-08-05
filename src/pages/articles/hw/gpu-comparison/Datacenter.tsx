import { motion } from 'framer-motion';
import NvLinkEvolutionViz from './viz/NvLinkEvolutionViz';
import HbmStackViz from './viz/HbmStackViz';

const specs = [
  { gpu: 'A100 SXM', cores: '6,912', vram: '80GB HBM2e', bw: '2,039 GB/s', tdp: '400W', feat: 'NVLink 600GB/s' },
  { gpu: 'H100 SXM', cores: '16,896', vram: '80GB HBM3', bw: '3,350 GB/s', tdp: '700W', feat: 'NVLink 900GB/s' },
  { gpu: 'B200 SXM', cores: '~33,000 (dual)', vram: '192GB HBM3e', bw: '8,000 GB/s', tdp: '1000W', feat: 'NVLink 1.8TB/s' },
];

export default function Datacenter() {
  return (
    <section id="datacenter" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">데이터센터 GPU (A100 · H100 · B200)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          DC GPU 가 컨슈머와 결정적으로 다른 점은 <strong>HBM · ECC · NVLink · blower cooling · enterprise driver</strong> 다섯.
          <br />
          용어 풀이는 위의 &quot;사양에 나오는 용어&quot; 섹션 참고. 여기서는 각 GPU 의 의미를 풀어 본다.
        </p>
        <div className="overflow-x-auto not-prose">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                {['GPU', 'CUDA 코어', 'VRAM', '대역폭', 'TDP', '특수 기능'].map(h => (
                  <th key={h} className="border border-border px-3 py-2 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {specs.map((s) => (
                <motion.tr key={s.gpu} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <td className="border border-border px-3 py-2 font-medium">{s.gpu}</td>
                  <td className="border border-border px-3 py-2">{s.cores}</td>
                  <td className="border border-border px-3 py-2">{s.vram}</td>
                  <td className="border border-border px-3 py-2">{s.bw}</td>
                  <td className="border border-border px-3 py-2">{s.tdp}</td>
                  <td className="border border-border px-3 py-2">{s.feat}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-10 mb-3">A100 — Ampere (2020~)</h3>
        <p className="leading-7">
          AI 학습의 표준이 된 첫 세대. 같은 칩이 5 년 지난 지금도 production 다수 사용.
        </p>
        <ul className="leading-7">
          <li>
            <strong>제조 — TSMC 7nm · 6,912 CUDA core · 40/80 GB HBM2e</strong>
            <br />
            7nm 는 트랜지스터 한 개의 폭 단위. 작을수록 같은 면적에 더 많은 트랜지스터 + 전력 효율 ↑. HBM2e 는 1 stack 당 16 GB · ~410 GB/s, 5 stack = 80 GB · 2 TB/s. 이걸 알면 70B 모델 (FP16 = 140 GB) 이 단일 GPU 에 안 들어가는 이유가 명확 — 두 장 NVLink 필수.
          </li>
          <li>
            <strong>대역폭 1.55~2.04 TB/s</strong>
            <br />
            HBM2 = 1.55, HBM2e = 2.04. LLM 추론은 매 token 마다 weight 를 메모리에서 읽으므로 대역폭 = throughput 직결. A100 80GB 가 70B 모델 절반 (70 GB) 을 1 초에 ~28 회 읽음 = max ~28 token/s 단일 GPU.
          </li>
          <li>
            <strong>400W TDP (SXM) / 250W (PCIe)</strong>
            <br />
            SXM 모듈은 mezzanine socket 에 직결되어 700W 까지 power delivery 가능. PCIe 카드는 표준 슬롯의 power 한계 (300W) 로 250W 로 제한 + NVLink 도 제한. 같은 칩이지만 throughput 차이 ~30%.
          </li>
          <li>
            <strong>NVLink 3.0 — 600 GB/s</strong>
            <br />
            GPU 끼리 직접 통신. PCIe 4.0 (32 GB/s) 의 ~20x. multi-GPU 학습에서 model parallelism (한 모델을 여러 GPU 에 나눠 weight 동기화) 의 결정적. 컨슈머 GPU 에는 없음.
          </li>
          <li>
            <strong>가격 $10K~$15K</strong>
            <br />
            소비자 RTX 4090 ($2K) 의 5~7x. 차이는 HBM + NVLink + ECC + DC 보증 + MIG.
          </li>
          <li>
            <strong>폼팩터 — SXM4 / PCIe / HGX</strong>
            <br />
            SXM4 는 NVIDIA 의 socket 표준 (mezzanine). HGX 는 8 SXM 통합 baseboard. Supermicro · Dell 의 8-GPU 서버는 HGX baseboard 위에 디자인. PCIe 카드는 표준 슬롯에 꽂는 형태.
          </li>
          <li>
            <strong>MIG — 1 GPU → 7 instance 분할</strong>
            <br />
            한 물리 GPU 를 격리된 7 개 가상 GPU 로 분할. 메모리 / 컴퓨트 / 캐시 모두 격리. 클라우드 운영자가 한 H100 을 7 사용자에게 임대 가능 (CoreWeave · Lambda · 클라우드 제공자).
          </li>
          <li>
            <strong>3rd-gen Tensor Core + Structural Sparsity</strong>
            <br />
            Tensor Core = 행렬 곱 전용 가속기 (한 사이클에 4×4 행렬). 3 세대는 BF16 · TF32 추가. Sparsity = 행렬의 절반을 0 으로 만들면 연산 절반 생략 (잘 정렬된 모델 한정).
          </li>
          <li>
            <strong>FP16 / FP32 / TF32 / BF16 지원</strong>
            <br />
            FP32 = 정확하지만 느림 + 메모리 ↑. FP16 = 절반 메모리 + 2x 빠름, 정밀도 ↓. BF16 = exponent 8 bit (FP32 와 같은 range), mantissa 7 bit. TF32 = NVIDIA 만의 19 bit 형식 (학습에 충분 + FP32 호환). 학습 / 추론마다 적절한 정밀도 선택.
          </li>
        </ul>

        <h3 className="text-xl font-semibold mt-10 mb-3">H100 — Hopper (2022~)</h3>
        <p className="leading-7">
          AI 폭발기의 핵심 GPU. ChatGPT 이후 모든 frontier lab 이 사용.
        </p>
        <ul className="leading-7">
          <li>
            <strong>TSMC 4N · 16,896 CUDA core (+144%) · 80 GB HBM3</strong>
            <br />
            4N = TSMC 의 NVIDIA-customized 5nm 변형. 트랜지스터 밀도 2x. CUDA core 144% 증가 + Tensor Core 4 세대로 throughput 6x (FP16 기준).
          </li>
          <li>
            <strong>HBM3 도입 + 3.35 TB/s (+64%)</strong>
            <br />
            HBM3 는 stack 당 819 GB/s, 4 stack = 3.35 TB/s. 같은 70B 모델을 1 초에 ~48 회 read = ~48 token/s 단일 GPU. 추론 비용의 결정적 개선.
          </li>
          <li>
            <strong>700W TDP — air cooling 한계</strong>
            <br />
            8 GPU 노드 = 5.6 kW. 일반 air cooling rack 한계 (30 kW) 의 1/5. 한 rack 에 ~5 노드 (40 GPU) 가 max. 더 밀집하려면 DLC (Direct Liquid Cooling) 필수.
          </li>
          <li>
            <strong>NVLink 4.0 — 900 GB/s + NVLink Switch</strong>
            <br />
            9 NVLink 4 lane × 100 GB/s. NVLink Switch (별도 칩) 는 GPU 256 개를 single fabric 으로 연결 — DGX SuperPOD 의 표준. 큰 학습 클러스터의 노드 간 통신 부담 극감.
          </li>
          <li>
            <strong>Transformer Engine + FP8</strong>
            <br />
            FP8 (8 bit float) 자동 변환 + scale 동적 조정. 같은 학습을 절반 메모리 + 2x throughput. Llama / GPT 학습의 표준이 됨.
          </li>
          <li>
            <strong>DPX Instruction</strong>
            <br />
            동적 프로그래밍 (Dynamic Programming) 의 inner loop 가속. genome alignment (Smith-Waterman), shortest path, Filecoin SDR 같은 hash chain 일부.
          </li>
          <li>
            <strong>Confidential Computing</strong>
            <br />
            GPU 메모리도 TEE. CPU 의 SEV-SNP / TDX 와 결합해 host 도 GPU 메모리 못 봄. AI 추론의 사용자 데이터 보호 (Apple Private Cloud Compute 같은 모델).
          </li>
          <li>
            <strong>가격 $25K~$40K</strong>
            <br />
            공급 제약 + AI 폭증으로 프리미엄. 2024 까지 NVIDIA 가 사실상 가격 결정.
          </li>
        </ul>

        <h3 className="text-xl font-semibold mt-10 mb-3">B200 — Blackwell (2024~)</h3>
        <p className="leading-7">
          GPT-5 급 학습을 위한 차세대. dual-die 통합 + FP4 + 1.8 TB/s NVLink.
        </p>
        <ul className="leading-7">
          <li>
            <strong>208 억 트랜지스터 (H100 의 2x) · dual-die</strong>
            <br />
            한 칩 reticle limit 도달 → 두 die 를 NVLink-C2C (10 TB/s) 로 묶어 단일 GPU 처럼 작동. AMD MI300X 와 같은 chiplet 흐름.
          </li>
          <li>
            <strong>192 GB HBM3e · 8 TB/s</strong>
            <br />
            HBM3e = stack 당 1.2 TB/s. 192 GB 는 GPT-4 70B (FP16 140 GB) + KV cache 가 단일 GPU 에 들어감. multi-GPU 분할 부담 ↓.
          </li>
          <li>
            <strong>1000W TDP — DLC 의무화</strong>
            <br />
            air cooling 으로는 불가능. NVIDIA GB200 NVL72 (Grace + Blackwell × 72) 시스템은 100% liquid cooled.
          </li>
          <li>
            <strong>NVLink 5.0 — 1.8 TB/s</strong>
            <br />
            H100 의 2x. 72 GPU 한 fabric 의 GB200 NVL72 = 단일 거대 GPU 처럼 사용 가능.
          </li>
          <li>
            <strong>FP4 + 2 nd gen Transformer Engine</strong>
            <br />
            FP4 = 4 bit float. 추론 throughput H100 대비 4x (가능한 모델 한정). 학습은 여전히 FP8 / BF16.
          </li>
          <li>
            <strong>가격 $50K+ 예상</strong>
            <br />
            NVL72 단위 시스템은 $3M+. 큰 lab / hyperscaler 만 접근 가능.
          </li>
        </ul>

        </div>
        <NvLinkEvolutionViz />
        <div className="prose prose-neutral dark:prose-invert max-w-none mt-10">
        <h3 className="text-xl font-semibold mt-8 mb-3">왜 NVLink 가 결정적인가</h3>
        <p className="leading-7">
          큰 모델의 학습 / 추론은 단일 GPU 메모리에 안 들어가 여러 GPU 에 분산.
          <br />
          분산하면 각 GPU 의 forward / backward pass 마다 gradient · activation 을 동기화 (all-reduce).
          <br />
          이 동기화가 PCIe 32 GB/s 면 GPU 가 통신 대기로 50%+ 낭비. NVLink 900 GB/s 는 거의 통신 비용 0.
        </p>
        <ul className="leading-7">
          <li>NVLink 1.0 — 160 GB/s (P100, 2016)</li>
          <li>NVLink 2.0 — 300 GB/s (V100, 2017)</li>
          <li>NVLink 3.0 — 600 GB/s (A100, 2020)</li>
          <li>NVLink 4.0 — 900 GB/s (H100, 2022) + NVLink Switch (256 GPU fabric)</li>
          <li>NVLink 5.0 — 1.8 TB/s (B200, 2024)</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">HBM vs GDDR — 시각</h3>
        </div>
        <HbmStackViz />
        <div className="prose prose-neutral dark:prose-invert max-w-none mt-10">
        <ul className="leading-7">
          <li><strong>HBM (3D stack)</strong> — GPU die 옆 interposer 에 stack 배치. 1024-bit interface (per stack). 대역폭 4~8 TB/s. 가격 ↑↑.</li>
          <li><strong>GDDR (PCB trace)</strong> — graphics 카드 PCB 위 칩으로 분산. 32-bit × 8 칩 = 256-bit. 대역폭 1~1.8 TB/s. 가격 ↓.</li>
          <li><strong>제조사</strong> — HBM3/3e 는 SK Hynix 가 주 공급 (NVIDIA), Samsung 일부, Micron 진입 중. 한국 반도체의 점유율 ↑.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">DC GPU 가 컨슈머와 다른 5 가지</h3>
        <ul className="leading-7">
          <li><strong>HBM</strong> — GDDR 대비 2~5x 대역폭. AI 추론 throughput 의 결정적 차이.</li>
          <li><strong>ECC</strong> — 메모리 bit flip 자동 정정. 긴 학습 (수일) 에 필수, 컨슈머 GPU 는 X.</li>
          <li><strong>NVLink + NVSwitch</strong> — multi-GPU 학습 / 추론의 통신 병목 해결. 컨슈머 GPU 는 PCIe 만.</li>
          <li><strong>Blower cooling + rack-mount</strong> — front-to-back 직선 배기. 서버 랙 airflow 호환. 컨슈머는 open-air (랙 부적합).</li>
          <li><strong>Enterprise driver + DC EULA</strong> — 검증된 드라이버, NVIDIA 의 production 지원, 데이터센터 사용 합법. 컨슈머 driver 는 DC 사용 NVIDIA EULA 위반.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">DC 워크로드</h3>
        <ul className="leading-7">
          <li>AI 학습 (GPT 급 large model), LLM 추론 (vLLM · TGI cluster).</li>
          <li>Filecoin C2 (전문 SP 의 GPU 풀), ZK-rollup proving (zkSync · Scroll).</li>
          <li>HPC 시뮬레이션 (CFD · 분자 동역학).</li>
        </ul>
      </div>
    </section>
  );
}
