import Overview from './filecoin-gpu-proofs/Overview';
import GPUAcceleration from './filecoin-gpu-proofs/GPUAcceleration';

function References() {
  return (
    <section id="references" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">참고 자료 & 출처</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <ul className="space-y-2 text-sm">
          <li>
            <strong>[rust-fil-proofs]</strong> github.com/filecoin-project/rust-fil-proofs
            — 봉인 파이프라인, 크레이트 구조, GPU 환경 변수
          </li>
          <li>
            <strong>[rust-fil-proofs DeepWiki]</strong> deepwiki.com/filecoin-project/rust-fil-proofs
            — SDR 인코딩, PC1/PC2/C1/C2 단계별 분석
          </li>
          <li>
            <strong>[bellperson]</strong> github.com/filecoin-project/bellperson
            — GPU Groth16 구현, OpenCL/CUDA 백엔드
          </li>
          <li>
            <strong>[bellperson DeepWiki]</strong> deepwiki.com/filecoin-project/bellperson
            — MSM/NTT GPU 가속, 회로 빌더
          </li>
          <li>
            <strong>[sppark]</strong> github.com/supranational/sppark
            — CUDA MSM/NTT 구현, BLS12-381 최적화
          </li>
          <li>
            <strong>[sppark DeepWiki]</strong> deepwiki.com/supranational/sppark
            — Pippenger CUDA 구현, 성능 벤치마크
          </li>
          <li>
            <strong>[Neptune]</strong> github.com/filecoin-project/neptune
            — Poseidon 해시 GPU 배치 처리
          </li>
          <li>
            <strong>[Filecoin Spec: PoRep]</strong> spec.filecoin.io
            — SDR 인코딩 설계 (순차 의존성으로 GPU 불가), Groth16 회로
          </li>
          <li>
            <strong>[Groth16]</strong> Groth, &quot;On the Size of Pairing-based Non-interactive Arguments&quot;, EUROCRYPT 2016
            — Groth16 증명 시스템 원문
          </li>
          <li>
            <strong>[SDR Spec]</strong> spec.filecoin.io/algorithms/sdr/
            — 11 레이어, d_drg=6, d_exp=8, Poseidon₁₁ Column Hash (공식 사양)
          </li>
          <li>
            <strong>[Lotus HW 요구사항]</strong> lotus.filecoin.io/storage-providers/get-started/hardware-requirements/
            — PC2 최소 5GiB VRAM, C2 최소 11GiB, PoSt 10GiB + 3500 CUDA 코어
          </li>
          <li>
            <strong>[pc2_cuda]</strong> github.com/supranational/pc2_cuda
            — RTX 3090에서 PC2 ~150초 (2.5분) 달성
          </li>
          <li>
            <strong>[SupraSeal]</strong> github.com/supranational/supra_seal
            — 통합 봉인, SPDK NVMe, 128 섹터 동시 PC1
          </li>
          <li>
            <strong>[Lotus CUDA 설정]</strong> lotus.filecoin.io/tutorials/lotus-miner/cuda/
            — FFI_USE_CUDA=1, CUDA 11.x+ 권장
          </li>
          <li>
            <strong>[NTT 연구]</strong> eprint.iacr.org/2023/1410
            — GPU NTT가 증명 런타임 최대 91% 차지, ~50x CPU 대비 가속
          </li>
          <li>
            <strong>[ec-gpu]</strong> github.com/filecoin-project/ec-gpu
            — GPU 유한체/타원곡선 코드 생성기, bellperson + Neptune에서 사용
          </li>
        </ul>
      </div>
    </section>
  );
}

export default function FilecoinGPUProofsArticle() {
  return (
    <>
      <Overview />
      <GPUAcceleration />
      <References />
    </>
  );
}
