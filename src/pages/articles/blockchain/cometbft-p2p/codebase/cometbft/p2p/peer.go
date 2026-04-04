package p2p

import (
	"fmt"
	"net"

	"github.com/cometbft/cometbft/libs/service"
	conn "github.com/cometbft/cometbft/p2p/conn"
)

// Peer is an interface representing a peer connected to the Switch.
type Peer interface {
	service.Service
	FlushStop()

	ID() ID                   // peer's unique ID (derived from pubkey)
	RemoteIP() net.IP         // peer's remote IP
	RemoteAddr() net.Addr     // peer's remote address
	IsOutbound() bool         // did we dial the peer?
	IsPersistent() bool       // do we redial on disconnect?
	CloseConn() error         // close original connection

	NodeInfo() NodeInfo       // peer's node info
	Status() conn.ConnectionStatus
	SocketAddr() *NetAddress  // actual dial address

	// Send sends an envelope on the given channel.
	// Blocks until the message is queued or timeout.
	Send(Envelope) bool

	// TrySend is non-blocking: returns false if queue is full.
	TrySend(Envelope) bool

	Set(key string, value any)
	Get(key string) any
}

// peer implements Peer.
type peer struct {
	service.BaseService

	outbound bool
	conn     net.Conn
	mconn    *conn.MConnection // multiplex connection
	nodeInfo NodeInfo
	channels []byte            // channels the peer supports

	// Stores arbitrary data keyed by string.
	// Used e.g. by ConsensusReactor to store PeerState.
	Data *cmap.CMap
}

// Send delegates to MConnection.Send, which queues the message
// to the appropriate channel's send buffer.
// The channel ID is determined by Envelope.ChannelID.
func (p *peer) Send(e Envelope) bool {
	if !p.IsRunning() {
		return false
	}
	msg, err := proto.Marshal(e.Message)
	if err != nil {
		panic(fmt.Sprintf("marshaling message: %v", err))
	}
	return p.mconn.Send(e.ChannelID, msg)
}

// TrySend is non-blocking: returns false if the channel's queue is full.
func (p *peer) TrySend(e Envelope) bool {
	if !p.IsRunning() {
		return false
	}
	msg, err := proto.Marshal(e.Message)
	if err != nil {
		panic(fmt.Sprintf("marshaling message: %v", err))
	}
	return p.mconn.TrySend(e.ChannelID, msg)
}

// OnStart starts the MConnection, which spawns sendRoutine() and recvRoutine().
func (p *peer) OnStart() error {
	if err := p.BaseService.OnStart(); err != nil {
		return err
	}
	if err := p.mconn.Start(); err != nil {
		return err
	}
	return nil
}

// ID returns the peer's ID (derived from public key).
func (p *peer) ID() ID {
	return p.nodeInfo.ID()
}
