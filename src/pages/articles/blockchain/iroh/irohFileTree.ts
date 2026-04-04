import type { FileNode } from '@/components/code/types';

export const irohTree: FileNode = {
  name: 'iroh', type: 'dir', children: [
    { name: 'src', type: 'dir', children: [
      { name: 'endpoint.rs', type: 'file', path: 'iroh/iroh/src/endpoint.rs', children: [
        { name: 'Endpoint struct', type: 'file', codeKey: 'endpoint-struct' },
        { name: 'connect()', type: 'file', codeKey: 'endpoint-connect' },
      ]},
      { name: 'endpoint/', type: 'dir', children: [
        { name: 'connection.rs', type: 'file', children: [
          { name: 'Connection<State>', type: 'file', codeKey: 'connection-struct' },
          { name: 'IncomingAddr', type: 'file', codeKey: 'incoming-addr' },
        ]},
      ]},
      { name: 'socket/', type: 'dir', children: [
        { name: 'transports.rs', type: 'file', children: [
          { name: 'Transports struct', type: 'file', codeKey: 'transports-struct' },
          { name: 'poll_recv fairness', type: 'file', codeKey: 'poll-recv-fairness' },
          { name: 'PathSelectionData', type: 'file', codeKey: 'path-selection' },
        ]},
        { name: 'remote_map.rs', type: 'file', children: [
          { name: 'RemoteMap', type: 'file', codeKey: 'remote-map' },
        ]},
      ]},
      { name: 'protocol.rs', type: 'file', children: [
        { name: 'ProtocolHandler', type: 'file', codeKey: 'protocol-handler' },
        { name: 'Router accept loop', type: 'file', codeKey: 'router-accept-loop' },
        { name: 'handle_connection', type: 'file', codeKey: 'handle-connection' },
      ]},
      { name: 'address_lookup.rs', type: 'file', children: [
        { name: 'AddressLookup trait', type: 'file', codeKey: 'address-lookup' },
      ]},
    ]},
  ],
};
