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
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// beacon-chain/rpc/service.go

func (s *Service) Start() {
    // 1. TCP listener 생성
    listener, err := net.Listen("tcp", s.cfg.Host + ":" + s.cfg.Port)
    if err != nil { log.Fatalf("failed to listen: %v", err) }

    // 2. gRPC 서버 옵션
    opts := []grpc.ServerOption{
        // Interceptor 체인
        grpc.ChainUnaryInterceptor(
            logging.UnaryServerInterceptor(),     // 로깅
            recovery.UnaryServerInterceptor(),    // panic 복구
            auth.UnaryServerInterceptor(authFunc),// 인증
            metrics.UnaryServerInterceptor(),     // Prometheus metrics
        ),
        grpc.ChainStreamInterceptor(
            logging.StreamServerInterceptor(),
            recovery.StreamServerInterceptor(),
        ),
        grpc.MaxRecvMsgSize(s.cfg.MaxMsgSize),    // 기본 20 MB
        grpc.KeepaliveParams(keepalive.ServerParameters{
            MaxConnectionIdle: 2 * time.Hour,
        }),
    }

    // 3. gRPC 서버 생성
    s.grpcServer = grpc.NewServer(opts...)

    // 4. 서비스 등록
    s.registerServices()

    // 5. Reflection 등록 (디버깅용)
    reflection.Register(s.grpcServer)

    // 6. 백그라운드에서 서버 실행
    go func() {
        if err := s.grpcServer.Serve(listener); err != nil {
            log.Errorf("gRPC server failed: %v", err)
        }
    }()
}

// registerServices:
// - BeaconChainService
// - ValidatorService
// - NodeService
// - DebugService
// - HealthService`}
        </pre>
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
