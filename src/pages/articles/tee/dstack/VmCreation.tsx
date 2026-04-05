import VmFlowViz from './viz/VmFlowViz';
import TDXProvisionFlowViz from './viz/TDXProvisionFlowViz';
import VmCreationStepViz from './viz/VmCreationStepViz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function VmCreation({ title, onCodeRef }: { title?: string; onCodeRef?: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="vm-creation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? 'VM 생성 & 프로비저닝'}</h2>
      <div className="not-prose mb-8"><VmFlowViz /></div>
      <div className="not-prose mb-8">
        <h3 className="text-lg font-semibold mb-3">TDX VM 프로비저닝 시퀀스</h3>
        <TDXProvisionFlowViz />
      </div>
      {onCodeRef && (
        <div className="not-prose flex flex-wrap gap-2 mb-6">
          <CodeViewButton onClick={() => onCodeRef('td-create', codeRefs['td-create'])} />
          <span className="text-[10px] text-muted-foreground self-center">TdVm::new()</span>
          <CodeViewButton onClick={() => onCodeRef('manifest-flow', codeRefs['manifest-flow'])} />
          <span className="text-[10px] text-muted-foreground self-center">create_vm() 흐름</span>
        </div>
      )}
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-3">dstack VM 생성 흐름</h3>
        <p>
          <strong>사용자 입력</strong>: Docker Compose 파일 + 간단한 manifest<br />
          <strong>VMM 자동화</strong>: TDX 활성화, 포트 매핑, attestation, 키 발급<br />
          <strong>핵심 혁신</strong>: 개발자가 TEE 디테일 몰라도 기밀 VM 배포 가능<br />
          <strong>바탕</strong>: dstack-tdx (Phala Network) — Kata Containers + Intel TDX
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Docker Compose → Confidential VM</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 사용자 작성 docker-compose.yaml (평범한 docker-compose)
version: '3.8'
services:
  app:
    image: ghcr.io/myorg/confidential-app:v1.0
    ports:
      - "8080:8080"
    environment:
      - API_KEY=\${API_KEY}  # KMS에서 주입
    volumes:
      - encrypted:/data

volumes:
  encrypted:

// dstack CLI가 이를 TDX VM으로 변환
$ dstack deploy docker-compose.yaml --tdx

// 뒤에서 일어나는 일
// 1) VM Manifest 생성
// 2) TDX TD 이미지 빌드
//    - Kernel + initramfs + rootfs
//    - Docker 레이어를 rootfs에 통합
// 3) Measurement 계산
//    - MRTD: 이미지 hash
//    - 결정적 빌드 (reproducible)
// 4) TD 생성 (KVM-TDX)
//    - Virtio device 설정
//    - Port forwarding
//    - Network bridge
// 5) TD 시작
//    - Linux boot
//    - Docker daemon
//    - 앱 실행
// 6) KMS에 attestation 제출
//    - MRTD + RTMR
//    - 정책 매치 시 키·secrets 반환
// 7) 앱이 secrets 받아 사용`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">dstack 아키텍처</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// dstack 주요 컴포넌트

// Host 측 (Privileged)
// ┌─────────────────────────────────┐
// │  dstack-vmm                     │
// │  - VM lifecycle 관리            │
// │  - QEMU + KVM-TDX 조작          │
// │  - Manifest 처리                │
// │  - Port forwarding              │
// └─────────────────────────────────┘
//          │
//          ▼
// ┌─────────────────────────────────┐
// │  Host Kernel (KVM-TDX)          │
// │  - TD 생성·실행                 │
// │  - TDX Module 호출              │
// └─────────────────────────────────┘

// Guest 측 (TD VM)
// ┌─────────────────────────────────┐
// │  dstack-guest-agent             │
// │  - TDX attestation 요청         │
// │  - KMS에 Quote 제출             │
// │  - Secrets 수령 & injection     │
// └─────────────────────────────────┘
//          │
//          ▼
// ┌─────────────────────────────────┐
// │  Docker Compose                 │
// │  - 사용자 앱 컨테이너           │
// │  - Secrets를 env/volume으로     │
// └─────────────────────────────────┘

// KMS (Key Management Service)
// ┌─────────────────────────────────┐
// │  dstack-kms                     │
// │  - Attestation 검증             │
// │  - 정책 매치 확인               │
// │  - 암호키 발급                  │
// └─────────────────────────────────┘`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">TD Measurement 계산</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// dstack이 사용하는 결정적 빌드

// Reproducible build 요건
// 1) Fixed base image hash
// 2) Deterministic file ordering
// 3) Stripped timestamps
// 4) Pinned dependencies

// MRTD 계산 (TDX Module이 수행)
// - TD Launch 시 initial image의 hash
// - 사용자 이미지 + kernel + initrd + cmdline

// RTMR 계산 (Runtime Extended)
// RTMR[0]: UEFI 측정
// RTMR[1]: Linux kernel 측정
// RTMR[2]: OS rootfs 측정
// RTMR[3]: 사용자 앱 측정 (dynamic)

// 확장 기록
rtmr_extend(index=3, sha384(compose_yaml))
rtmr_extend(index=3, sha384(container_image_A))
rtmr_extend(index=3, sha384(container_image_B))

// 검증 시 동일 체인 재계산
// → 의도한 앱이 실제 실행 중인지 확인

// dstack tool로 측정값 계산
$ dstack verify docker-compose.yaml --show-measurements
MRTD: 0x3a7f2c1e9d8b...
RTMR[0]: 0x89f01a2b...
RTMR[3]: 0xabc123...`}</pre>

      </div>
      <div className="not-prose mt-6">
        <VmCreationStepViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: dstack의 혁신점</p>
          <p>
            <strong>UX 혁신</strong>:<br />
            - Docker Compose 표준 사용 (새 개념 없음)<br />
            - 개발자가 TEE 몰라도 사용 가능<br />
            - CI/CD 통합 간단
          </p>
          <p className="mt-2">
            <strong>기술적 기여</strong>:<br />
            - Reproducible TDX image builds<br />
            - KMS 자동 통합 (attestation → secrets)<br />
            - Kata Containers 기반 (검증된 프레임워크)
          </p>
          <p className="mt-2">
            <strong>생태계</strong>:<br />
            - Phala Network 주도 개발<br />
            - Confidential Containers 프로젝트와 협력<br />
            - 오픈소스 (github.com/Dstack-TEE)
          </p>
        </div>

      </div>
    </section>
  );
}
