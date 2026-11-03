import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import { codeRefs } from "./codeRefs";

export default function PeerDiscovery({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="peer-discovery" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 break-keep text-2xl font-bold">
        Discv5는 연결을 만드는 장치가 아니라, 연결해 볼 후보를 찾는 장치입니다
      </h2>
      <div className="not-prose my-5 flex flex-wrap gap-2">
        <CodeViewButton
          onClick={() =>
            onCodeRef("discovery-filter", codeRefs["discovery-filter"])
          }
        />
        <span className="self-center text-xs text-muted-foreground">
          Prysm v7.3.1의 실제 filterPeer 조건
        </span>
      </div>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          N42의 ENR를 받았다고 가정하겠습니다. ENR의 서명이 맞으면 “N42의
          discovery key 소유자가 이 내용을 광고했다”는 것은 확인됩니다. 하지만
          그 주소가 지금 열려 있는지, libp2p PeerId가 예상과 같은지, 실제
          Status도 같은 fork인지까지 확인된 것은 아닙니다. 그래서 이 시점의
          N42는 <strong>candidate, 즉 연결 후보</strong>입니다.
        </p>

        <h3>Prysm은 후보에서 무엇을 거릅니까?</h3>
        <ol>
          <li>
            IP와 TCP 또는 QUIC port를 실제 multiaddr로 바꿀 수 있어야 합니다.
          </li>
          <li>이전에 bad peer로 판정된 PeerId가 아니어야 합니다.</li>
          <li>
            이미 active이거나 libp2p에서 connected인 중복 후보가 아니어야
            합니다.
          </li>
          <li>backoff가 끝나 다시 dial할 준비가 된 피어여야 합니다.</li>
          <li>local ENR와 후보 ENR의 fork digest가 맞아야 합니다.</li>
        </ol>
        <p>
          조건을 모두 통과하면 Prysm은 ENR, PeerId와 multiaddr를 peer store에
          더합니다. 이 <code>Add</code>는 후보 정보를 기억하는 일이지 socket이
          열린 상태가 아닙니다. QUIC와 TCP 주소가 함께 있으면 현재 source는 먼저
          놓인 QUIC 주소를 고릅니다.
        </p>

        <h3>같은 node ID의 ENR가 두 개면 무엇을 남깁니까?</h3>
        <p>
          discovery 반복자는 node ID별로 더 큰 sequence number의 ENR를 남깁니다.
          예를 들어 N42의 sequence 11과 12가 함께 보이면 12가 최신 후보입니다.
          다만 sequence가 크다는 것은 안내문이 새롭다는 뜻이지 상대가 더
          정직하거나 빠르다는 뜻은 아닙니다. 연결과 Status 결과가 뒤에서 이
          주장을 다시 확인합니다.
        </p>
        <p>
          따라서 “discovery에 보였다”, “peer store에 추가됐다”, “socket이
          연결됐다”, “합의 protocol을 쓸 수 있다”는 서로 다른 상태입니다. 이
          구분이 없으면 주소 탐색 성공률을 실제 usable peer 수로 잘못 읽게
          됩니다.
        </p>
      </div>
    </section>
  );
}
