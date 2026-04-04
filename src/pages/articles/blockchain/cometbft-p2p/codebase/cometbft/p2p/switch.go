package p2p

import (
	"fmt"
	"net"
	"sync"
	"time"

	"github.com/cometbft/cometbft/libs/service"
)

// Switch handles peer connections and exposes an API to receive incoming messages
// on `Reactors`. Each `Reactor` is responsible for handling incoming messages of one
// or more `Channels`. So while sending outgoing messages is typically performed on the peer,
// incoming messages are received on the reactor.
type Switch struct {
	service.BaseService

	config       *config.P2PConfig
	reactors     map[string]Reactor
	chDescs      []*conn.ChannelDescriptor
	reactorsByCh map[byte]Reactor
	peers        *PeerSet
	dialing      *cmap.CMap
	nodeInfo     NodeInfo
	nodeKey      *NodeKey
	addrBook     AddrBook
	transport    Transport

	filterTimeout time.Duration
	peerFilters   []PeerFilterFunc

	rng *rand.Rand // same implementation as determine a network

	metrics *Metrics
}

// NewSwitch creates a new Switch with the given config.
func NewSwitch(cfg *config.P2PConfig, transport Transport, options ...SwitchOption) *Switch {
	sw := &Switch{
		config:       cfg,
		reactors:     make(map[string]Reactor),
		chDescs:      make([]*conn.ChannelDescriptor, 0),
		reactorsByCh: make(map[byte]Reactor),
		peers:        NewPeerSet(),
		dialing:      cmap.NewCMap(),
		metrics:      NopMetrics(),
		transport:    transport,
	}
	sw.BaseService = *service.NewBaseService(nil, "P2P Switch", sw)
	for _, option := range options {
		option(sw)
	}
	return sw
}

// AddReactor adds the given reactor to the switch.
// It also maps each Channel in the reactor to the reactor itself.
// NOTE: Not goroutine safe.
func (sw *Switch) AddReactor(name string, reactor Reactor) Reactor {
	reactorChannels := reactor.GetChannels()
	for _, chDesc := range reactorChannels {
		chID := chDesc.ID
		if sw.reactorsByCh[chID] != nil {
			panic(fmt.Sprintf("channel %X already registered", chID))
		}
		sw.chDescs = append(sw.chDescs, chDesc)
		sw.reactorsByCh[chID] = reactor
	}
	sw.reactors[name] = reactor
	reactor.SetSwitch(sw)
	return reactor
}

// OnStart implements BaseService. It starts all reactors and begins accepting.
func (sw *Switch) OnStart() error {
	// Start reactors
	for _, reactor := range sw.reactors {
		if err := reactor.Start(); err != nil {
			return fmt.Errorf("failed to start %v: %w", reactor, err)
		}
	}
	// Start accepting peers
	go sw.acceptRoutine()
	return nil
}

// DialPeersAsync dials a list of peers asynchronously in random order.
// Used during startup to connect to persistent/seed peers.
func (sw *Switch) DialPeersAsync(peers []string) error {
	netAddrs, errs := NewNetAddressStrings(peers)
	for _, err := range errs {
		sw.Logger.Error("error in peer address", "err", err)
	}
	// Shuffle to prevent always dialing in the same order
	sw.rng.Shuffle(len(netAddrs), func(i, j int) {
		netAddrs[i], netAddrs[j] = netAddrs[j], netAddrs[i]
	})
	for _, addr := range netAddrs {
		go func(addr *NetAddress) {
			err := sw.DialPeerWithAddress(addr)
			if err != nil {
				sw.Logger.Debug("error dialing peer", "addr", addr, "err", err)
			}
		}(addr)
	}
	return nil
}

// Broadcast sends msg to all connected peers on the given channel.
func (sw *Switch) Broadcast(e Envelope) {
	sw.peers.ForEach(func(peer Peer) {
		peer.Send(e)
	})
}
