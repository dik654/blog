package conn

import (
	"bufio"
	"net"
	"sync/atomic"
	"time"

	flow "github.com/cometbft/cometbft/libs/flowrate"
	"github.com/cometbft/cometbft/libs/service"
	"github.com/cometbft/cometbft/libs/timer"
	tmp2p "github.com/cometbft/cometbft/proto/tendermint/p2p"
)

const (
	defaultSendRate     = int64(512000) // 500KB/s
	defaultRecvRate     = int64(512000) // 500KB/s
	defaultPingInterval = 60 * time.Second
	defaultPongTimeout  = 45 * time.Second
)

// Each peer has one MConnection (multiplex connection) instance.
// Handles message transmission on multiple abstract Channels.
type MConnection struct {
	service.BaseService

	conn          net.Conn        // underlying TCP socket
	bufConnReader *bufio.Reader   // buffered reader over conn
	bufConnWriter *bufio.Writer   // buffered writer over conn
	sendMonitor   *flow.Monitor   // tracks send rate for throttling
	recvMonitor   *flow.Monitor   // tracks recv rate for throttling
	send          chan struct{}    // signal: new data ready to send
	pong          chan struct{}    // signal: respond pong to peer
	channels      []*Channel      // all registered channels
	channelsIdx   map[byte]*Channel // channel lookup by ID
	onReceive     receiveCbFunc   // callback on complete message
	onError       errorCbFunc     // callback on connection error

	quitSendRoutine chan struct{} // close to stop sendRoutine
	doneSendRoutine chan struct{} // closed when sendRoutine exits
	quitRecvRoutine chan struct{} // close to stop recvRoutine

	flushTimer   *timer.ThrottleTimer // flush writes throttled
	pingTimer    *time.Ticker         // send pings periodically
	pongTimer    *time.Timer          // timeout waiting for pong
	chStatsTimer *time.Ticker         // update channel stats
}

// OnStart — spawns sendRoutine and recvRoutine goroutines
func (c *MConnection) OnStart() error {
	c.flushTimer = timer.NewThrottleTimer("flush", c.config.FlushThrottle)
	c.pingTimer = time.NewTicker(c.config.PingInterval)
	c.chStatsTimer = time.NewTicker(updateStats)
	c.quitSendRoutine = make(chan struct{})
	c.doneSendRoutine = make(chan struct{})
	c.quitRecvRoutine = make(chan struct{})
	go c.sendRoutine()
	go c.recvRoutine()
	return nil
}

// sendRoutine polls for packets to send from channels.
func (c *MConnection) sendRoutine() {
	defer c._recover()
	protoWriter := protoio.NewDelimitedWriter(c.bufConnWriter)
	for {
		select {
		case <-c.flushTimer.Ch:
			c.flush()
		case <-c.chStatsTimer.C:
			for _, channel := range c.channels {
				channel.updateStats()
			}
		case <-c.pingTimer.C:
			protoWriter.WriteMsg(mustWrapPacket(&tmp2p.PacketPing{}))
			c.sendMonitor.Update(_n)
			c.pongTimer = time.AfterFunc(c.config.PongTimeout, func() {
				c.pongTimeoutCh <- true
			})
		case <-c.send:
			eof := c.sendSomePacketMsgs(protoWriter)
			if !eof {
				c.send <- struct{}{}
			}
		case <-c.quitSendRoutine:
			return
		}
	}
}

// selectChannelToGossipOn — priority-based channel selection
func selectChannelToGossipOn(channels []*Channel) *Channel {
	var leastRatio float32 = math.MaxFloat32
	var leastChannel *Channel
	for _, channel := range channels {
		if !channel.isSendPending() {
			continue
		}
		ratio := float32(channel.recentlySent) / float32(channel.desc.Priority)
		if ratio < leastRatio {
			leastRatio = ratio
			leastChannel = channel
		}
	}
	return leastChannel
}

// recvRoutine reads PacketMsgs and reconstructs messages.
func (c *MConnection) recvRoutine() {
	defer c._recover()
	protoReader := protoio.NewDelimitedReader(c.bufConnReader, c._maxPacketMsgSize)
	for {
		c.recvMonitor.Limit(c._maxPacketMsgSize, c.config.RecvRate, true)
		var packet tmp2p.Packet
		_n, err := protoReader.ReadMsg(&packet)
		c.recvMonitor.Update(_n)
		if err != nil {
			c.stopForError(err)
			return
		}
		switch pkt := packet.Sum.(type) {
		case *tmp2p.Packet_PacketPing:
			c.pong <- struct{}{}
		case *tmp2p.Packet_PacketPong:
			c.pongTimeoutCh <- false
		case *tmp2p.Packet_PacketMsg:
			channelID := byte(pkt.PacketMsg.ChannelID)
			channel := c.channelsIdx[channelID]
			msgBytes, _ := channel.recvPacketMsg(*pkt.PacketMsg)
			if msgBytes != nil {
				c.onReceive(channelID, msgBytes)
			}
		}
	}
}

// Channel — per-channel send/recv buffers within MConnection
type Channel struct {
	conn          *MConnection
	desc          ChannelDescriptor
	sendQueue     chan []byte  // outgoing message queue
	sendQueueSize int32       // atomic counter
	recving       []byte      // reassembly buffer
	sending       []byte      // current message being chunked
	recentlySent  int64       // exponential moving average
}
