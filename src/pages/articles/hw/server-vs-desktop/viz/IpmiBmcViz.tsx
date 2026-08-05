/**
 * IPMI / BMC — out-of-band 관리 채널 시각화.
 */
export default function IpmiBmcViz() {
  const W = 720;
  const H = 340;

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" style={{ maxWidth: 880 }}>
        <text x={W / 2} y={22} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">IPMI / BMC — out-of-band 관리 (CPU 꺼져도 접근)</text>

        {/* 서버 박스 */}
        <g>
          <rect x={210} y={60} width={300} height={240} rx={10}
            fill="#3b82f6" fillOpacity={0.04} stroke="#3b82f6" strokeWidth={1.4} />
          <text x={360} y={80} textAnchor="middle" fontSize={11} fontWeight={700} fill="#3b82f6">서버 (Supermicro · Dell · HPE)</text>

          {/* CPU + OS */}
          <rect x={230} y={100} width={260} height={70} rx={6}
            fill="#3b82f6" fillOpacity={0.10} stroke="#3b82f6" strokeWidth={1} />
          <text x={360} y={120} textAnchor="middle" fontSize={10} fontWeight={700} fill="#3b82f6">main system</text>
          <text x={360} y={138} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">CPU · DRAM · OS · NIC (eth0)</text>
          <text x={360} y={155} textAnchor="middle" fontSize={9} fontStyle="italic" fill="var(--muted-foreground)">전원 OFF / OS hang 시 무용</text>

          {/* BMC */}
          <rect x={230} y={185} width={260} height={70} rx={6}
            fill="#10b981" fillOpacity={0.18} stroke="#10b981" strokeWidth={1.4} />
          <text x={360} y={205} textAnchor="middle" fontSize={10} fontWeight={700} fill="#10b981">BMC (별도 마이크로컨트롤러)</text>
          <text x={360} y={222} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">자체 CPU · 자체 DRAM · 별도 NIC</text>
          <text x={360} y={238} textAnchor="middle" fontSize={9} fontStyle="italic" fill="#10b981">대기 전력만 들어와도 작동</text>

          <text x={360} y={278} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">main 과 PCIe / I2C 로 연결</text>
        </g>

        {/* 데이터센터 운영자 */}
        <g>
          <rect x={20} y={100} width={140} height={60} rx={6}
            fill="#f59e0b" fillOpacity={0.10} stroke="#f59e0b" strokeWidth={1.2} />
          <text x={90} y={120} textAnchor="middle" fontSize={10} fontWeight={700} fill="#f59e0b">운영자 (원격)</text>
          <text x={90} y={138} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">SSH · KVM · Web UI</text>
          <text x={90} y={152} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">REST · Redfish API</text>

          {/* 정상 채널 */}
          <line x1={160} y1={130} x2={210} y2={130} stroke="#3b82f6" strokeWidth={1.4} />
          <polygon points="210,130 204,127 204,133" fill="#3b82f6" />
          <text x={185} y={123} textAnchor="middle" fontSize={8} fill="#3b82f6">SSH eth0</text>

          {/* OOB 채널 */}
          <line x1={160} y1={215} x2={210} y2={215} stroke="#10b981" strokeWidth={1.4} />
          <polygon points="210,215 204,212 204,218" fill="#10b981" />
          <text x={185} y={208} textAnchor="middle" fontSize={8} fill="#10b981">BMC out-of-band</text>
        </g>

        {/* BMC 기능 */}
        <g>
          <rect x={550} y={100} width={150} height={155} rx={6}
            fill="#10b981" fillOpacity={0.06} stroke="#10b981" strokeWidth={1} strokeDasharray="3 2" />
          <text x={625} y={120} textAnchor="middle" fontSize={10} fontWeight={700} fill="#10b981">BMC 기능</text>
          <text x={560} y={140} fontSize={9} fill="var(--muted-foreground)">• 원격 power on/off</text>
          <text x={560} y={156} fontSize={9} fill="var(--muted-foreground)">• 원격 BIOS 진입</text>
          <text x={560} y={172} fontSize={9} fill="var(--muted-foreground)">• KVM-over-IP (콘솔)</text>
          <text x={560} y={188} fontSize={9} fill="var(--muted-foreground)">• 온도 / 팬 / 전압 센서</text>
          <text x={560} y={204} fontSize={9} fill="var(--muted-foreground)">• 이벤트 로그</text>
          <text x={560} y={220} fontSize={9} fill="var(--muted-foreground)">• 펌웨어 업데이트</text>
          <text x={560} y={236} fontSize={9} fill="var(--muted-foreground)">• 가상 미디어 부팅</text>
        </g>

        <text x={W / 2} y={325} textAnchor="middle" fontSize={9} fontStyle="italic" fill="var(--muted-foreground)">
          벤더별 — Intel IPMI 표준 · HPE iLO · Dell iDRAC · Lenovo XCC · Supermicro IPMI
        </text>
      </svg>
    </div>
  );
}
