import DevToolsViz from './viz/DevToolsViz';

export default function DeveloperTools() {
  return (
    <section id="developer-tools" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">개발자 도구</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-3">Oasis CLI</h3>
        <p>
          <strong>oasis CLI</strong>: Go + Cobra 기반 계층적 명령줄 도구<br />
          <strong>네트워크 관리</strong>, 지갑 생성, 계정 관리, 런타임 상호작용<br />
          <strong>@oasisprotocol/cli</strong> npm 패키지로 배포 (docker, brew, binary)<br />
          macOS/Linux/Windows 전부 지원
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">주요 명령 카테고리</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`# 네트워크 관리
oasis network add testnet wss://testnet.grpc.oasis.io
oasis network list
oasis network set-default mainnet

# 지갑 관리
oasis wallet create alice --algorithm ed25519
oasis wallet list
oasis wallet import-bip39 alice
oasis wallet export alice   # ⚠ 프라이빗 키 출력

# 계정 조회
oasis account show alice
oasis account balance alice --network mainnet
oasis account nonce alice

# 트랜잭션
oasis account transfer 100.0 oasis1qq... alice
oasis account delegate 50.0 oasis1qq... alice  # 스테이킹
oasis account undelegate 50.0 oasis1qq... alice

# ParaTime 상호작용 (Sapphire)
oasis paratime list
oasis paratime show sapphire
oasis paratime deposit 10.0 --paratime sapphire alice
oasis paratime withdraw 5.0 --paratime sapphire alice

# 컨트랙트 배포 & 호출 (Sapphire EVM)
oasis contracts deploy ./build/MyContract.json alice
oasis contracts call 0x1234... "myMethod(uint256)" 42 alice`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Hardhat/Foundry 통합</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// hardhat.config.ts
import "@oasisprotocol/sapphire-hardhat";

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  networks: {
    sapphire: {
      url: "https://sapphire.oasis.io",
      chainId: 0x5afe,
      accounts: [PRIVATE_KEY],
    },
    "sapphire-testnet": {
      url: "https://testnet.sapphire.oasis.io",
      chainId: 0x5aff,
      accounts: [PRIVATE_KEY],
    },
  },
};

// 플러그인이 자동으로
// - ethers.js provider wrapping
// - 기밀 tx 암호화
// - 서명된 query 생성

// Foundry
// foundry.toml
[profile.sapphire]
eth_rpc_url = "https://sapphire.oasis.io"
chain_id = 23294
private_key = "${PRIVATE_KEY}"

// 기본 forge/cast 명령 그대로 작동
forge script script/Deploy.s.sol --profile sapphire --broadcast
cast call 0x1234 "balanceOf(address)" 0xabcd --profile sapphire`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Sapphire 클라이언트 SDK</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// JavaScript/TypeScript — @oasisprotocol/sapphire-paratime

import * as sapphire from '@oasisprotocol/sapphire-paratime';
import { ethers } from 'ethers';

// 1) Provider wrapping (모든 tx 자동 암호화)
const rawProvider = new ethers.JsonRpcProvider("https://sapphire.oasis.io");
const provider = sapphire.wrap(rawProvider);

const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const signer = sapphire.wrap(wallet);

// 2) 컨트랙트 호출 (자동 encrypted envelope)
const contract = new ethers.Contract(addr, abi, signer);
const result = await contract.secretMethod(42);
// → calldata 자동 암호화
// → KM 공개키 자동 조회 & 캐싱

// Python — oasis-sdk
import asyncio
from oasis_sdk import paratime, signature

async def main():
    pt = paratime.Paratime.sapphire_mainnet()
    signer = signature.Signer.from_seed(SEED)
    balance = await pt.accounts_balance(signer.address())

asyncio.run(main())

// Rust — client-sdk crate
use oasis_client_sdk::{paratime::sapphire, transaction};

let conn = sapphire::mainnet().await?;
let tx = transaction::Builder::new()
    .method("evm.Call")
    .body(EvmCallBody { address, data, value })
    .sign(&signer)?;
conn.submit_tx(tx).await?;`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">ROFL App 개발</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Oasis CLI로 ROFL 앱 생성
oasis rofl init my-oracle --tee sgx
cd my-oracle

# Cargo.toml
[package]
name = "my-oracle"
[dependencies]
oasis-runtime-sdk = { version = "0.10" }
oasis-rofl-utils = { version = "0.1" }
tokio = { version = "1", features = ["full"] }
reqwest = "0.11"

# src/main.rs
use oasis_runtime_sdk::modules::rofl::prelude::*;

#[rofl_app(id = "my-oracle-v1")]
async fn handle_query(ctx: &Context, query: Vec<u8>) -> Result<Vec<u8>> {
    let symbol: String = cbor::from_slice(&query)?;
    let url = format!("https://api.coingecko.com/..{}", symbol);
    let response = reqwest::get(&url).await?.json::<PriceResponse>().await?;
    Ok(cbor::to_vec(&response.price))
}

// 빌드 & 배포
oasis rofl build --tee sgx
oasis rofl deploy --paratime sapphire my-oracle

# Registry에 등록 후 컨트랙트에서 호출 가능`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">CLI 명령어 & 설정 시스템</h3>
      </div>
      <DevToolsViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">설정 파일 구조</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// ~/.config/oasis/cli.toml

[networks.mainnet]
chain_context = "b11b369e0da5bb230b220127f5e7b242d385ef8c6f54906243f30af63c815535"
rpc = "grpc.oasis.io:443"

[networks.testnet]
chain_context = "50304f98ddb656620ea817cc1446c401752a05a249b36c9b90dba4616829977a"
rpc = "testnet.grpc.oasis.io:443"

[networks.mainnet.paratimes.sapphire]
description = "Sapphire ParaTime"
id = "000000000000000000000000000000000000000000000000f80306c9858e7279"
denomination_info = { base_units = 18, symbol = "ROSE" }

[wallets.alice]
kind = "file"
path = "alice.kpriv"`}</pre>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: Sapphire의 Ethereum 호환성 수준</p>
          <p>
            <strong>완벽 호환</strong>:<br />
            ✓ Solidity 0.4 ~ 0.8.x 그대로<br />
            ✓ Hardhat, Foundry, Remix, Truffle<br />
            ✓ Metamask, WalletConnect, OpenZeppelin<br />
            ✓ 표준 EVM opcodes (Shanghai 기준)
          </p>
          <p className="mt-2">
            <strong>Sapphire 전용 기능</strong>:<br />
            ✗ 기밀 calldata → wrapper 필수<br />
            ✗ view function 서명 → signed query<br />
            ✗ KM 공개키 의존 → 온라인 조회 필요<br />
            ✗ Precompile은 Sapphire 전용 주소
          </p>
          <p className="mt-2">
            <strong>마이그레이션 전략</strong>:<br />
            - 1단계: 기존 컨트랙트 그대로 배포 (public 모드)<br />
            - 2단계: 민감한 state 변수만 private 키워드 추가<br />
            - 3단계: 클라이언트 SDK 교체<br />
            - 전체 재작성 불필요
          </p>
        </div>

      </div>
    </section>
  );
}
