const CATEGORIES = [
  ['ReadOnly', 'ls · cat · grep · find', '관찰 후보'],
  ['Write', 'cp · mv · mkdir · sed -i', '상태 변경'],
  ['Destructive', 'rm · shred · wipefs', '데이터 손실 신호'],
  ['Network', 'curl · wget · ssh · nc', '외부 통신 신호'],
  ['ProcessManagement', 'kill · nohup · jobs', 'process 제어'],
  ['PackageManagement', 'apt · pip · npm · cargo', '환경 변경'],
  ['SystemAdmin', 'sudo · mount · systemctl', '시스템 변경'],
  ['Unknown', '목록에 없는 첫 command', '추가 판정 필요'],
];

export default function IntentCategoriesViz() {
  return (
    <figure
      aria-label="첫 command를 기준으로 나누는 여덟 intent category"
      className="not-prose my-7 overflow-hidden rounded-md border border-border"
    >
      <figcaption className="border-b border-border px-4 py-3">
        <p className="text-sm font-semibold">Intent는 실행 효과가 아니라 첫 command의 label이다</p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          redirect, substitution, pipeline의 뒤쪽 command는 이 category 하나로 완전히 설명되지 않는다.
        </p>
      </figcaption>
      <div className="grid grid-cols-2 gap-px bg-border md:grid-cols-4">
        {CATEGORIES.map(([name, commands, role]) => (
          <div key={name} className="min-w-0 bg-background p-4">
            <code className="break-words text-[13px] font-semibold">{name}</code>
            <p className="mt-3 break-words text-xs leading-relaxed">{commands}</p>
            <p className="mt-2 text-xs text-muted-foreground">{role}</p>
          </div>
        ))}
      </div>
    </figure>
  );
}
