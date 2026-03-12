export default function CRC32ENR() {
  return (
    <section id="crc32-enr" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">CRC32와 ENR 구조</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-4 mb-3">CRC32를 선택한 이유</h3>
        <p>
          Fork ID의 해시로 CRC32를 사용하는 이유는 ENR의 300바이트 크기 제한 때문입니다.
          SHA256(32바이트) 대신 CRC32(4바이트)를 사용하여 공간을 절약합니다.
          Fork ID는 보안 목적이 아닌 호환성 체크용이므로 충돌 저항성보다 컴팩트함이 중요합니다.
        </p>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`fork_hash 계산:
CRC32(genesis_hash) XOR CRC32(fork_block_1) XOR CRC32(fork_block_2) ...

예: Mainnet Shanghai 이후
CRC32(genesis) ⊕ CRC32(1150000) ⊕ ... ⊕ CRC32(17034870)
= 0xdce96c2d`}</code>
        </pre>
        <h3 className="text-xl font-semibold mt-6 mb-3">ENR (Ethereum Node Record)</h3>
        <p>
          ENR은 P2P 네트워크에서 노드를 식별하기 위한 표준 포맷입니다.
          EIP-2124 이후 Fork ID가 ENR에 포함되어, DHT와 Bootnode에서
          TCP 연결 전에 피어 호환성을 확인할 수 있습니다.
        </p>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`ENR v4 구조:
├─ Node ID (공개키 기반)   : ~40 bytes
├─ IP 주소                : ~8 bytes
├─ 포트                   : 4 bytes
├─ Fork-ID (EIP-2124)     : 12 bytes
├─ SeqNum (시퀀스 번호)    : 8 bytes
├─ 기타 메타데이터          : ~100 bytes
└─ 총 크기 제한: 300 bytes`}</code>
        </pre>
      </div>
    </section>
  );
}
