export interface GoPattern {
  id: string;
  title: string;
  desc: string;
  example: string;
  why: string;
  color: string;
}

export const GO_PATTERNS: GoPattern[] = [
  {
    id: 'struct-embed',
    title: 'Struct Embedding (구조체 임베딩)',
    desc: 'BatchSubmitter에 DriverSetup이 직접 포함된다. 상속이 아니라 합성(composition) — DriverSetup의 필드와 메서드를 BatchSubmitter가 그대로 사용한다.',
    example: 'type BatchSubmitter struct {\n    DriverSetup          // 임베딩: 상속이 아닌 합성\n    channelMgr *channelManager\n}',
    why: 'Go에는 클래스 상속이 없다. 대신 구조체를 "임베딩"하여 코드 재사용을 달성한다.',
    color: '#6366f1',
  },
  {
    id: 'channel',
    title: 'Channel (채널 통신)',
    desc: 'publishSignal chan pubInfo — 고루틴 간 데이터 전달 통로. op-batcher는 이 채널로 "지금 배치를 제출하라"는 신호를 보낸다.',
    example: 'publishSignal chan pubInfo  // 버퍼 없는 채널\ngo func() {\n    sig := <-publishSignal  // 블로킹 수신\n    submit(sig)\n}()',
    why: '"메모리를 공유하지 말고, 통신으로 메모리를 공유하라" — Go의 동시성 철학.',
    color: '#10b981',
  },
  {
    id: 'context',
    title: 'context.Context (취소/타임아웃 전파)',
    desc: 'shutdownCtx context.Context — 부모가 취소하면 모든 자식 고루틴이 종료된다. 파이프라인의 Step()도 ctx를 받아 중단 가능하다.',
    example: 'func (dp *Pipeline) Step(\n    ctx context.Context,\n) error {\n    // ctx.Done()이면 즉시 반환\n    select {\n    case <-ctx.Done(): return ctx.Err()\n    default: /* 계속 실행 */\n    }\n}',
    why: '서버가 종료될 때 모든 진행 중인 작업을 안전하게 중단하는 표준 패턴.',
    color: '#f59e0b',
  },
  {
    id: 'error',
    title: 'error 인터페이스 (에러 처리)',
    desc: 'Go 에러는 값(value)이다. errors.As()로 에러 타입을 검사하고, io.EOF는 "더 이상 데이터 없음"을 뜻하는 센티널 에러(sentinel error)다.',
    example: 'if errors.As(err, &_chFullErr) {\n    break  // 채널이 가득 참\n}\nif err == io.EOF {\n    return  // 새 L1 데이터 대기 중\n}',
    why: 'try/catch 대신 명시적 에러 반환. 모든 에러 경로가 코드에 드러난다.',
    color: '#ec4899',
  },
  {
    id: 'pointer-recv',
    title: 'Pointer Receiver (포인터 리시버)',
    desc: 's *channelManager — 메서드가 구조체를 수정하려면 포인터 리시버가 필요하다. 값 리시버(s channelManager)는 복사본을 수정하므로 원본에 영향을 주지 않는다.',
    example: '// 포인터 리시버: 원본 수정\nfunc (s *channelManager) AddL2Block(\n    block *types.Block,\n) error {\n    s.blocks.Enqueue(block)  // s를 직접 수정\n    s.tip = block.Hash()\n}',
    why: '대부분의 OP Stack 메서드가 포인터 리시버를 쓴다. 상태를 가진 구조체는 항상 포인터로 전달.',
    color: '#0ea5e9',
  },
];
