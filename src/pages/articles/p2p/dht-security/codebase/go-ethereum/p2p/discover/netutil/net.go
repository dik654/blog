package netutil

// DistinctNetSet tracks per-subnet IP counts.
type DistinctNetSet struct {
	Subnet  uint              // 공통 프리픽스 비트 수 (24)
	Limit   uint              // 서브넷당 최대 IP 수
	members map[netip.Prefix]uint
}

// AddAddr checks the subnet quota and adds if under limit.
func (s *DistinctNetSet) AddAddr(ip netip.Addr) bool {
	key := s.key(ip) // IP → /24 프리픽스 변환
	n := s.members[key]
	if n < s.Limit {
		s.members[key] = n + 1
		return true // 한도 이내: 추가 성공
	}
	return false // 한도 초과: 거부
}

func (s *DistinctNetSet) RemoveAddr(ip netip.Addr) {
	key := s.key(ip)
	if n, ok := s.members[key]; ok && n > 0 {
		s.members[key] = n - 1
	}
}

func (s *DistinctNetSet) key(ip netip.Addr) netip.Prefix {
	prefix, _ := ip.Prefix(int(s.Subnet))
	return prefix
}
