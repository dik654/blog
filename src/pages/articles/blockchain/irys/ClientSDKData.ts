export const setupCode = `// Cargo.toml 의존성
[dependencies]
irys-api-client = "0.1.0"
irys-types = "0.1.0"
tokio = { version = "1.0", features = ["full"] }

// 클라이언트 & 서명자 초기화
use irys_api_client::{ApiClient, ApiClientExt, IrysApiClient};
use irys_types::{IrysSigner, ConsensusConfig, DataLedger};

#[tokio::main]
async fn main() -> eyre::Result<()> {
    let client = IrysApiClient::new();
    let config = ConsensusConfig::testing();
    let signer = IrysSigner::random_signer(&config);
    println!("Signer address: {:?}", signer.address());
    Ok(())
}`;

export const setupAnnotations = [
  { lines: [2, 5] as [number, number], color: 'sky' as const, note: '필수 크레이트 의존성' },
  { lines: [8, 9] as [number, number], color: 'emerald' as const, note: '핵심 타입 임포트' },
  { lines: [13, 15] as [number, number], color: 'amber' as const, note: '클라이언트 + 서명자 생성' },
];

export const txCode = `// 데이터 트랜잭션 워크플로우
// 1. 저장 가격 조회
let price_info = client
    .get_data_price(node_addr, DataLedger::Publish, data_size)
    .await?;

// 2. 트랜잭션 생성 & 서명
let tx = signer.create_transaction(data.clone(), anchor)?;
// 또는 수수료를 명시적으로 설정
let tx = signer.create_transaction_with_fees(
    data, anchor,
    DataLedger::Publish,
    price_info.perm_fee,   // 영구 저장 수수료
    price_info.term_fee,   // 기간 수수료
)?;

// 3. 노드에 전송 (청킹 자동 처리)
let receipt = client
    .post_transaction(node_addr, &tx)
    .await?;
println!("TX ID: {:?}", receipt.tx_id);`;

export const txAnnotations = [
  { lines: [2, 5] as [number, number], color: 'sky' as const, note: '저장 가격 조회 (Publish 원장)' },
  { lines: [8, 15] as [number, number], color: 'emerald' as const, note: 'TX 생성 + ECDSA 서명' },
  { lines: [18, 21] as [number, number], color: 'amber' as const, note: '노드 전송 & 영수증 수신' },
];
