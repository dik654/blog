import ContextViz from './viz/ContextViz';
import BeaconAPIViz from './viz/BeaconAPIViz';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">API 서버 아키텍처</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          이 아티클에서는 gRPC 서버 초기화, REST 게이트웨이 연결, 인터셉터 체인을 코드 수준으로 추적한다.
        </p>

        {/* ── Prysm API 계층 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Prysm API 계층 — gRPC + REST Gateway</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Prysm의 이중 API 구조:
//
// Layer 1: gRPC Server (port 4000 기본)
//   - Prysm 고유 API (proto 정의)
//   - Validator ↔ Beacon-chain 통신
//   - 내부 도구 (prysmctl)
//
// Layer 2: REST Gateway (port 3500 기본)
//   - Ethereum Beacon API 표준 (EIP-3075)
//   - 다른 CL 클라이언트와 호환
//   - 외부 도구 (dashboard, explorer)
//
// Layer 3: gRPC-gateway (port 3500 동일)
//   - REST 요청을 gRPC로 자동 변환
//   - proto 정의에 google.api.http 어노테이션 사용

// 아키텍처:
//
//   외부 도구          Validator Client
//      ↓                   ↓
//   [REST Gateway:3500]  [gRPC:4000]
//      ↓                   ↓
//   grpc-gateway        Direct gRPC
//      ↓                   ↓
//   [gRPC Service (internal)]
//      ↓
//   Beacon Chain Node

// 표준 Beacon API endpoints:
// GET /eth/v1/beacon/states/{state_id}/validators
// GET /eth/v2/beacon/blocks/{block_id}
// GET /eth/v1/validator/duties/attester/{epoch}
// POST /eth/v1/beacon/blocks
// GET /eth/v1/beacon/light_client/updates
// ... 50+ endpoints

// 인증:
// - gRPC: TLS optional, JWT optional
// - REST: 공개 (인증 없음)
// - 단, /eth/v1/admin/* 등 민감 endpoint는 제한`}
        </pre>
        <p className="leading-7">
          Prysm은 <strong>gRPC + REST 이중 API 제공</strong>.<br />
          gRPC는 내부(validator), REST는 외부(dashboard/explorer).<br />
          grpc-gateway로 단일 구현 → 양쪽 프로토콜 자동 지원.
        </p>
      </div>
      <div className="not-prose mt-6"><BeaconAPIViz /></div>
    </section>
  );
}
