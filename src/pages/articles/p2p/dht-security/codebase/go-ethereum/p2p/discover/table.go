package discover

// IP address limits.
const (
	bucketIPLimit, bucketSubnet = 2, 24  // 같은 /24에서 버킷당 최대 2개
	tableIPLimit, tableSubnet   = 10, 24 // 같은 /24에서 테이블 전체 최대 10개
)

func (tab *Table) addIP(b *bucket, ip netip.Addr) bool {
	if !ip.IsValid() || ip.IsUnspecified() {
		return false
	}
	if netutil.AddrIsLAN(ip) {
		return true // LAN 주소는 제한 없음 (테스트넷용)
	}
	if !tab.ips.AddAddr(ip) { // 1) 테이블 전역 한도 초과
		return false
	}
	if !b.ips.AddAddr(ip) { // 2) 버킷별 한도 초과
		tab.ips.RemoveAddr(ip) // 전역에서도 롤백
		return false
	}
	return true
}

func (tab *Table) addFoundNode(n *enode.Node, isInbound bool) bool {
	b := tab.bucket(n.ID())
	if _, exists := tab.bumpInBucket(b, n, isInbound); exists {
		return false // 이미 버킷에 존재
	}
	if len(b.entries) >= bucketSize {
		// 버킷 가득 참 → 기존 노드 보호, 교체 목록에 대기
		tab.addReplacement(b, n)
		return false
	}
	if !tab.addIP(b, n.IPAddr()) {
		return false // IP 쿼터 초과
	}
	b.entries = append(b.entries, &tableNode{Node: n})
	tab.nodeAdded(b, n)
	return true
}

func (tab *Table) addVerifiedNode(n *enode.Node) {
	b := tab.bucket(n.ID())
	if existing, ok := tab.bumpInBucket(b, n, false); ok {
		existing.livenessChecks++
		return // 기존 노드 liveness 갱신
	}
	if len(b.entries) >= bucketSize {
		tab.addReplacement(b, n)
		return
	}
	if !tab.addIP(b, n.IPAddr()) {
		return
	}
	entry := &tableNode{Node: n, livenessChecks: 1}
	b.entries = append(b.entries, entry)
	tab.nodeAdded(b, n)
}
