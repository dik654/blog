import type { CodeRef } from '@/components/code/types';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function GrpcServer({ onCodeRef }: Props) {
  return (
    <section id="grpc-server" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">gRPC 서버</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-2 mb-3">서버 초기화</h3>
        <p className="leading-7">
          <code>Service.Start()</code> — TCP 리스너 바인딩 → gRPC 서버 생성 → 인터셉터 체인 설정.<br />
          Unary/Stream 인터셉터로 모든 호출에 로깅과 에러 복구를 적용한다.
        </p>
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton onClick={() => onCodeRef('register-services', codeRefs['register-services'])} />
          <span className="text-[10px] text-muted-foreground self-center">registerServices()</span>
        </div>

        {/* ── gRPC Server 초기화 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">gRPC Server 초기화 흐름</h3>
        <div className="not-prose grid gap-3 my-4">
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2"><code>Service.Start()</code> 초기화 흐름</h4>
            <div className="grid gap-2 text-xs">
              <div className="flex items-start gap-2 rounded bg-muted/50 p-2">
                <span className="font-mono font-medium shrink-0 w-6 text-center">1</span>
                <div><code>net.Listen("tcp", host:port)</code> — TCP listener 생성</div>
              </div>
              <div className="flex items-start gap-2 rounded bg-muted/50 p-2">
                <span className="font-mono font-medium shrink-0 w-6 text-center">2</span>
                <div>gRPC ServerOption 설정 — <code>ChainUnaryInterceptor</code> (logging, recovery, auth, metrics) + <code>ChainStreamInterceptor</code> + <code>MaxRecvMsgSize</code> (20 MB) + KeepaliveParams</div>
              </div>
              <div className="flex items-start gap-2 rounded bg-muted/50 p-2">
                <span className="font-mono font-medium shrink-0 w-6 text-center">3</span>
                <div><code>grpc.NewServer(opts...)</code> — gRPC 서버 생성</div>
              </div>
              <div className="flex items-start gap-2 rounded bg-muted/50 p-2">
                <span className="font-mono font-medium shrink-0 w-6 text-center">4</span>
                <div><code>registerServices()</code> — 서비스 등록</div>
              </div>
              <div className="flex items-start gap-2 rounded bg-muted/50 p-2">
                <span className="font-mono font-medium shrink-0 w-6 text-center">5</span>
                <div><code>reflection.Register()</code> — 디버깅용 Reflection 등록</div>
              </div>
              <div className="flex items-start gap-2 rounded bg-muted/50 p-2">
                <span className="font-mono font-medium shrink-0 w-6 text-center">6</span>
                <div><code>go grpcServer.Serve(listener)</code> — 백그라운드 서버 실행</div>
              </div>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">등록 서비스 (registerServices)</h4>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="rounded bg-muted px-2 py-1">BeaconChainService</span>
              <span className="rounded bg-muted px-2 py-1">ValidatorService</span>
              <span className="rounded bg-muted px-2 py-1">NodeService</span>
              <span className="rounded bg-muted px-2 py-1">DebugService</span>
              <span className="rounded bg-muted px-2 py-1">HealthService</span>
            </div>
          </div>
        </div>
        <p className="leading-7">
          gRPC Server는 <strong>4단계 초기화</strong>.<br />
          Listener → Interceptors → Server → Services 등록.<br />
          Unary/Stream 인터셉터로 공통 로직 (로깅/인증/metrics) 분리.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">서비스 도메인</h3>
        <ul>
          <li><strong>BeaconChainServer</strong> — 블록, 상태, 검증자 조회</li>
          <li><strong>ValidatorServer</strong> — 의무 할당, 블록 제안, 어테스테이션</li>
          <li><strong>NodeServer</strong> — 피어 정보, 동기화 상태</li>
          <li><strong>DebugServer</strong> — 포크 선택 덤프, 상태 디버그</li>
        </ul>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 인터셉터 체인</strong> — 요청 → 로깅 → 인증(JWT) → 메트릭 → 핸들러 → 에러 복구 → 응답.<br />
          각 관심사를 미들웨어로 분리해 핸들러가 비즈니스 로직에만 집중.<br />
          gRPC의 UnaryInterceptor 체인으로 구현.
        </p>
      </div>
    </section>
  );
}
