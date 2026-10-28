// Reth v2.8.1 · crates/net/eth-wire/src/capability.rs
// Source excerpt from commit d763342fa185e4e90ee79dc65f6a5706168b0bcb.
pub fn shared_capability_offsets(
    local_protocols: Vec<Protocol>,
    peer_capabilities: Vec<Capability>,
) -> Result<Vec<SharedCapability>, P2PStreamError> {
    let our_capabilities =
        local_protocols.into_iter().map(|p| (p.cap, p.messages)).collect::<HashMap<_, _>>();
    let mut shared_capabilities: HashMap<_, ProtoVersion> = HashMap::default();
    let mut shared_capability_names = BTreeSet::new();

    for peer_capability in peer_capabilities {
        if let Some(messages) = our_capabilities.get(&peer_capability).copied() {
            // If multiple versions are shared for one name, the highest version wins.
            if shared_capabilities
                .get(&peer_capability.name)
                .is_none_or(|v| peer_capability.version > v.version)
            {
                shared_capabilities.insert(
                    peer_capability.name.clone(),
                    ProtoVersion { version: peer_capability.version, messages },
                );
                shared_capability_names.insert(peer_capability.name);
            }
        }
    }

    if shared_capabilities.is_empty() {
        return Err(P2PStreamError::HandshakeError(P2PHandshakeError::NoSharedCapabilities))
    }

    let mut offset = MAX_RESERVED_MESSAGE_ID + 1;
    let mut shared_with_offsets = Vec::with_capacity(shared_capabilities.len());
    for name in shared_capability_names {
        let proto_version = &shared_capabilities[&name];
        let shared_capability = SharedCapability::new(
            &name,
            proto_version.version as u8,
            offset,
            proto_version.messages,
        )?;
        offset += shared_capability.num_messages();
        shared_with_offsets.push(shared_capability);
    }

    if shared_with_offsets.is_empty() {
        return Err(P2PStreamError::HandshakeError(P2PHandshakeError::NoSharedCapabilities))
    }
    Ok(shared_with_offsets)
}
