import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import type { CodeRef } from "@/components/code/types";
import ContextViz from "./viz/ContextViz";
import NetworkStackViz from "./viz/NetworkStackViz";
import ExecutionClientLocator from "../shared/ExecutionClientLocator";

export default function Overview({
  onCodeRef: _onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">발견한 주소는 언제 블록을 주고받는 피어가 될까요?</h2>
      <p className="mb-5 text-lg leading-8">
        <Link to="/cs/blockchain/node-architecture#case">전체 지도의 A→B 10 ETH 송금</Link>이 지갑에서 한 실행 클라이언트로 들어오면, 다른 실행 클라이언트는 실행 P2P를 통해 이 거래를 전파받을 수 있습니다. 그 전에 상대 주소를 찾고 실제 통신 상대가 될 수 있는지 확인해야 합니다. 주소 하나를 안다는 사실만으로 블록과 거래를 믿고 받을 수는 없습니다.
      </p>
      <ExecutionClientLocator current="p2p" path={["p2p"]} question="발견한 상대는 어떤 연결·호환성 검사를 통과해야 실행 자료를 주고받는 피어가 될까요?" />
      <p className="mb-5 text-sm leading-7 text-muted-foreground">아래의 transaction은 이 송금이고, block은 이 송금을 담은 후보입니다. 후보 주소를 active peer로 바꾸는 연결 절차만 확대합니다.</p>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          실행 클라이언트는 bootnode·DNS·discovery에서 endpoint를 얻고 transport를 열어 RLPx identity와 encrypted frame을 설정한 뒤
          공통 devp2p capability와 ETH Status compatibility를 확인합니다. 이 네 단계를 모두 통과하기 전까지 상대는 후보 또는 pending
          session입니다. block·transaction을 신뢰해 받을 active peer는 아직 아닙니다.
        </p>
        <p>
          이 글은{" "}
          <strong>
            candidate→transport→RLPx→capability/status→data path→failure cleanup
          </strong>{" "}
          순서로 진행합니다.
          <Link to="/cs/blockchain/reth">Reth 구조</Link>의 block lifecycle과
          <Link to="/cs/blockchain/reth-chainspec"> ChainSpec</Link>의 fork
          compatibility를 재사용하고, 여기서는 peer lifecycle과 bounded message
          flow를 소유합니다.
        </p>
      </div>

      <ContentBoundary article="reth-net" />
      <ContextViz />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>먼저 알아둘 최소 개념</h3>
        <p>
          <strong>Discovery record</strong>는 node identity와 endpoint를 담은
          dial 후보 정보이고,
          <strong>RLPx</strong>는 Ethereum devp2p의 authenticated encrypted
          transport와 framing 경계입니다.
          <strong>Capability</strong>는 <code>eth</code> 같은 subprotocol 이름과
          version의 조합이며, <strong>Status</strong>는 선택된 ETH protocol에서
          network·genesis·fork·head context를 비교하는 compatibility gate입니다.
          Address를 찾았거나 TCP가 연결됐다는 사실만으로 이 뒤의 gate가
          통과되지는 않습니다.
        </p>
        <h3>Phase별 receipt가 있어야 실패 원인을 구분할 수 있습니다</h3>
        <p>
          Connection receipt에는 candidate source와 record sequence·age를 남깁니다. local/remote endpoint와
          inbound/outbound direction, handshake peer identity, negotiated capabilities도 함께 남기고 ETH
          version·fork ID·head와 channel limit, close reason까지 붙입니다. 그래야 stale record와 timeout, identity
          mismatch, no shared capability, wrong genesis, malformed message, local overload를 같은 “connection
          failed” counter로 뭉개지 않습니다.
        </p>
      </div>

      <NetworkStackViz />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Reth 2.x라는 범위도 version receipt가 필요합니다</h3>
        <p>
          2026-08-14에 확인한 공식 repository layout은 network core가 ingress/egress, peer와 session management를 소유하고
          discovery·eth-wire/RLPx·downloaders를 별도 crate 책임으로 나눕니다. 그러나 crate path와 default는 release에서 바뀝니다. 예를
          들어 v2.2.0 release note의 Discv5 default change를 이전 version이나 custom build에 일반화하지 않고 semver·SHA와 Cargo
          feature, network config digest, 실제 enabled discovery protocol을 함께 기록합니다.
        </p>
      </div>

      <div
        id="paper-reth-network-layout"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">
          공식 source guide 읽기 · network ownership
        </p>
        <p className="mt-2 text-sm font-semibold">
          Reth Project Layout — Networking
        </p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          문제는 peer·session·discovery·wire·downloader의 실제 source owner를 찾는 것입니다. 공식 layout은 current repository의
          crate 책임을 설명합니다. 특정 release의 path가 영구 API이거나 모든 protocol feature가 default-enabled라는 뜻은 아닙니다.
        </p>
        <a
          className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
          href="https://github.com/paradigmxyz/reth/blob/main/docs/repo/layout.md"
          target="_blank"
          rel="noreferrer"
        >
          공식 layout 보기
        </a>
      </div>
    </section>
  );
}
