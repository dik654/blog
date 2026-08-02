import RaidLevelsViz from './viz/RaidLevelsViz';

export default function RaidLevels() {
  return (
    <section id="raid-levels" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">1. RAID 레벨 — capacity 와 내구성의 trade-off</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          모든 RAID 결정은 <strong>capacity · throughput · 내구성</strong> 셋 중 무엇을 양보하느냐로 정해진다.
          <br />
          쓸 수 있는 용량 ↑ → 내구성 ↓, parity 추가 ↑ → write 속도 ↓ + 용량 ↓.
        </p>
      </div>
      <RaidLevelsViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-10">
        <h3 className="text-xl font-semibold mt-8 mb-3">1-1. RAID 0 (stripe)</h3>
        <ul className="leading-7">
          <li><strong>구조</strong> — N 디스크에 데이터 분산. 한 디스크 fail = 모든 데이터 손실.</li>
          <li><strong>장점</strong> — capacity 100% (N × disk), throughput N 배.</li>
          <li><strong>적합</strong> — sealing scratch · 임시 cache · re-buildable 데이터.</li>
          <li><strong>금기</strong> — production 데이터, OS 디스크.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">1-2. RAID 1 (mirror)</h3>
        <ul className="leading-7">
          <li><strong>구조</strong> — 2 디스크에 동일 복제. capacity 50%.</li>
          <li><strong>장점</strong> — read 빠름 (둘에서 동시), write 1 디스크 속도, 1 디스크 fail OK.</li>
          <li><strong>적합</strong> — OS 부팅 디스크 · DB redo log · 작은 capacity 의 critical data.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">1-3. RAID 5 (single parity) — 종료된 시대</h3>
        <ul className="leading-7">
          <li><strong>구조</strong> — N 디스크 중 1 parity. capacity (N-1)/N.</li>
          <li><strong>장점</strong> — capacity 효율 ↑.</li>
          <li><strong>치명적 약점</strong> — 1 디스크 fail 후 rebuild 중 다른 디스크 URE 만나면 array 전체 손실. 18 TB 디스크의 URE 10^14 → array rebuild 중 만날 확률 ~수십%.</li>
          <li><strong>현재 권고</strong> — 18 TB+ HDD 에 RAID5 사용 금지. 작은 SSD 에만 한정.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">1-4. RAID 6 / RAIDZ2 (double parity) — 표준</h3>
        <ul className="leading-7">
          <li><strong>구조</strong> — N 디스크 중 2 parity. capacity (N-2)/N.</li>
          <li><strong>장점</strong> — 2 디스크 동시 fail OK. URE 위험 거의 0.</li>
          <li><strong>약점</strong> — write 시 parity 2 개 계산 → write 속도 ~30% 손실 (RAID5 대비).</li>
          <li><strong>적합</strong> — Filecoin sealed sector · 대용량 archive · NAS · 일반 영구 보관 풀.</li>
          <li><strong>ZFS 의 RAIDZ2</strong> — checksum + scrub + self-healing 추가. silent corruption 방어. 표준 선택.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">1-5. RAIDZ3 (triple parity)</h3>
        <ul className="leading-7">
          <li><strong>구조</strong> — N 디스크 중 3 parity. capacity (N-3)/N.</li>
          <li><strong>적합</strong> — 22 TB+ HDD 의 극대용량 풀. rebuild 시간이 며칠 걸리는 경우.</li>
          <li><strong>비용</strong> — 디스크 1 개 더 희생. 대신 사고 시 3 disk 동시 fail 까지 살아남음.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">1-6. RAID 10 (stripe + mirror)</h3>
        <ul className="leading-7">
          <li><strong>구조</strong> — 2-disk mirror 페어를 stripe. capacity 50%.</li>
          <li><strong>장점</strong> — 가장 빠른 write (parity 계산 X) + 같은 mirror 가 아닌 디스크 동시 fail OK.</li>
          <li><strong>적합</strong> — DB · VM · 고성능 + 안정성 둘 다 필요.</li>
          <li><strong>약점</strong> — capacity 효율 50% (RAID6 의 (N-2)/N 보다 낮음).</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">1-7. Erasure Coding (Ceph · MinIO)</h3>
        <ul className="leading-7">
          <li><strong>구조</strong> — Reed-Solomon 같은 분산 parity. k 데이터 + m parity (예: 4+2).</li>
          <li><strong>장점</strong> — 노드 (디스크가 아닌) 단위 fault tolerance. 분산 객체 스토리지의 표준.</li>
          <li><strong>적합</strong> — Ceph 클러스터 · MinIO · S3 호환 자가 호스팅.</li>
          <li><strong>오버헤드</strong> — 인코딩 / 디코딩 CPU 비용. 큰 객체에 적합 (작은 파일은 RAID 가 효율).</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">1-8. URE — RAID5 종료의 결정적 이유</h3>
        <ul className="leading-7">
          <li><strong>URE</strong> — Unrecoverable Read Error. 일반 HDD 사양 10^14 bit (~12 TB read 마다 1 번).</li>
          <li><strong>18 TB array rebuild</strong> — 18 TB × N 디스크 read 필요. 여러 차례 URE 만날 확률 ↑.</li>
          <li><strong>엔터프라이즈 HDD</strong> — URE 10^15 (10 배 개선). 그래도 100 TB array 면 위험.</li>
          <li><strong>해결</strong> — RAID6 / Z2 (2 parity 가 single URE 도 정정), enterprise HDD, scrub 자동화.</li>
        </ul>
      </div>
    </section>
  );
}
