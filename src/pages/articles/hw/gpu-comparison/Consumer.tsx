const specs = [
  { gpu: 'RTX 4090', cores: '16,384', vram: '24GB GDDR6X', bw: '1,008 GB/s', tdp: '450W', cool: '오픈에어' },
  { gpu: 'RTX 5090', cores: '21,760', vram: '32GB GDDR7', bw: '1,792 GB/s', tdp: '575W', cool: '오픈에어' },
];

export default function Consumer() {
  return (
    <section id="consumer" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">컨슈머 GPU (4090, 5090)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          컨슈머 GPU 는 가성비 ↑ 지만 <strong>open-air cooling + NVLink 부재</strong> 가 데이터센터 운영의 결정적 약점.
        </p>
        <div className="overflow-x-auto not-prose">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                {['GPU', 'CUDA 코어', 'VRAM', '대역폭', 'TDP', '냉각'].map(h => (
                  <th key={h} className="border border-border px-3 py-2 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {specs.map((s) => (
                <tr key={s.gpu}>
                  <td className="border border-border px-3 py-2 font-medium">{s.gpu}</td>
                  <td className="border border-border px-3 py-2">{s.cores}</td>
                  <td className="border border-border px-3 py-2">{s.vram}</td>
                  <td className="border border-border px-3 py-2">{s.bw}</td>
                  <td className="border border-border px-3 py-2">{s.tdp}</td>
                  <td className="border border-border px-3 py-2">{s.cool}</td>
                </tr>
              ))}
            </tbody>
          </table>

        <h3 className="text-xl font-semibold mt-8 mb-3">RTX 4090 — Ada Lovelace (2022~)</h3>
        <ul className="leading-7">
          <li><strong>제조</strong> — TSMC 4N · 16,384 CUDA core · 24 GB GDDR6X · 1008 GB/s · 450W TDP · PCIe 4.0 x16.</li>
          <li><strong>가격</strong> — $1,599 ~ $1,999 (지역별).</li>
          <li><strong>전원</strong> — 16-pin 커넥터 (또는 4× 8-pin 어댑터). PSU 850W 최소, 1000W+ 권장.</li>
          <li><strong>cooling</strong> — 3-fan open-air, 3-slot 폼 팩터, 케이스 358mm+.</li>
          <li><strong>워크로드 적합</strong> — 게이밍 4K · 작은 ML 학습 · Filecoin C2 (40~60 분, SupraSeal 25~40) · ZK proof.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">RTX 5090 — Blackwell (2025)</h3>
        <ul className="leading-7">
          <li><strong>제조</strong> — TSMC 4NP · 21,760 CUDA core (+33%) · 32 GB GDDR7 (+33%) · 1792 GB/s (+78%) · 575W TDP · PCIe 5.0 x16.</li>
          <li><strong>가격</strong> — ~$1,999 ~ $2,499.</li>
          <li><strong>핵심 개선</strong> — bandwidth +78%, VRAM 32 GB → 32 GiB Filecoin sector 처리 가능. Blackwell tensor core.</li>
          <li><strong>워크로드</strong> — 4090 의 모든 워크로드 + 더 큰 추론 모델 + 더 큰 sector.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">서버 운영 시 한계 3 가지</h3>
        <ul className="leading-7">
          <li><strong>open-air cooling</strong> — 서버 랙 부적합, stacking 불가, 커스텀 chassis + 강한 airflow 필요.</li>
          <li><strong>NVLink 부재</strong> — GPU-to-GPU 직접 연결 X. multi-GPU 추론 / 학습 시 PCIe 병목. LLM 클러스터 부적합.</li>
          <li><strong>데이터센터 EULA</strong> — NVIDIA 의 컨슈머 driver 는 데이터센터 사용 제한. 엔터프라이즈 지원 X. 신뢰성 보증 X.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">경제 현실</h3>
        <ul className="leading-7">
          <li>$2K GPU = great value 단일 노드 / 가정 / 작은 SP 에 최강.</li>
          <li>8 장 서버에 박으면 cooling 지옥 + 커스텀 chassis + 외부 enclosure (PCIe 확장 케이블).</li>
          <li>liquid cooling 또는 mining-style rack 으로 해결 가능하지만 엔지니어링 비용 발생.</li>
          <li>중규모+ 운영자는 결국 Pro / DC GPU 가 ROI 좋음.</li>
        </ul>
        </div>
      </div>
    </section>
  );
}
