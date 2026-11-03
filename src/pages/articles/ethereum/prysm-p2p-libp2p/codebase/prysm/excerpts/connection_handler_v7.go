				// Defensive check in the event we still get a bad peer.
				if err := s.peers.IsBad(remotePeer); err != nil {
					s.disconnectFromPeerOnError(conn, goodByeFunc, err)
					return
				}

				if direction != network.DirInbound {
					s.peers.SetConnectionState(conn.RemotePeer(), peers.Connecting)
					if err := reqFunc(context.TODO(), conn.RemotePeer()); err != nil && !errors.Is(err, io.EOF) {
						s.disconnectFromPeerOnError(conn, goodByeFunc, err)
						return
					}

					s.connectToPeer(conn)
					return
				}

				// The connection is inbound.
				_, err = s.peers.ChainState(remotePeer)
				peerExists := err == nil
				currentTime := prysmTime.Now()

				// Wait for peer to initiate handshake
				time.Sleep(timeForStatus)

				// Exit if we are disconnected with the peer.
				if s.host.Network().Connectedness(remotePeer) != network.Connected {
					return
				}

				// If peer hasn't sent a status request, we disconnect with them
				if _, err := s.peers.ChainState(remotePeer); errors.Is(err, peerdata.ErrPeerUnknown) || errors.Is(err, peerdata.ErrNoPeerStatus) {
					statusMessageMissing.Inc()
					s.disconnectFromPeerOnError(conn, goodByeFunc, errors.Wrap(err, "chain state"))
					return
				}
