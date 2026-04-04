export const KEEPER_CODE = `// Keeper 패턴 심층 분석
// 이더리움의 StateDB와 비교

type BankKeeper struct {
    storeService  corestore.KVStoreService // 전용 저장소
    cdc           codec.Codec              // 직렬화
    addressCodec  address.Codec            // 주소 인코딩
    authority     []byte                   // 거버넌스 권한
    ak            types.AccountKeeper      // 인터페이스 의존성
}

// 의존성 주입: 인터페이스로 느슨한 결합
type AccountKeeper interface {
    GetAccount(ctx context.Context, addr sdk.AccAddress) sdk.AccountI
    SetAccount(ctx context.Context, acc sdk.AccountI)
}

// BankKeeper는 AccountKeeper 인터페이스만 알면 됨
// → 테스트 시 mock 주입 가능
// → 이더리움의 컨트랙트 간 CALL과 달리 컴파일 타임 검증`;

export const KEEPER_ANNOTATIONS = [
  { lines: [4, 10] as [number, number], color: 'sky' as const, note: 'BankKeeper 구조체 (필드별 역할)' },
  { lines: [12, 16] as [number, number], color: 'emerald' as const, note: '인터페이스 기반 의존성' },
  { lines: [18, 21] as [number, number], color: 'amber' as const, note: '느슨한 결합의 장점' },
];
