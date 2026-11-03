// SaveAggregatedAttestation saves an aggregated attestation in cache.
func (c *AttCaches) SaveAggregatedAttestation(att ethpb.Att) error {
	if err := helpers.ValidateNilAttestation(att); err != nil {
		return err
	}
	if !att.IsAggregated() {
		return errors.New("attestation is not aggregated")
	}
	has, err := c.HasAggregatedAttestation(att)
	if err != nil {
		return err
	}
	if has {
		return nil
	}

	seen, err := c.hasSeenBit(att)
	if err != nil {
		return err
	}
	if seen {
		return nil
	}

	id, err := attestation.NewId(att, attestation.Data)
	if err != nil {
		return errors.Wrap(err, "could not create attestation ID")
	}
	copiedAtt := att.Clone()

	c.aggregatedAttLock.Lock()
	defer c.aggregatedAttLock.Unlock()
	atts, ok := c.aggregatedAtt[id]
	if !ok {
		atts := []ethpb.Att{copiedAtt}
		c.aggregatedAtt[id] = atts
		return nil
	}

	atts, err = attaggregation.Aggregate(append(atts, copiedAtt))
	if err != nil {
		return err
	}
	c.aggregatedAtt[id] = atts

	return nil
}

// SaveAggregatedAttestations saves a list of aggregated attestations in cache.
func (c *AttCaches) SaveAggregatedAttestations(atts []ethpb.Att) error {
	for _, att := range atts {
		if err := c.SaveAggregatedAttestation(att); err != nil {
			log.WithError(err).Debug("Could not save aggregated attestation")
			if err := c.DeleteAggregatedAttestation(att); err != nil {
				log.WithError(err).Debug("Could not delete aggregated attestation")
			}
		}
	}
	return nil
}

// AggregatedAttestations returns the aggregated attestations in cache.
func (c *AttCaches) AggregatedAttestations() []ethpb.Att {
	c.aggregatedAttLock.RLock()
	defer c.aggregatedAttLock.RUnlock()

	atts := make([]ethpb.Att, 0)

	for _, a := range c.aggregatedAtt {
		atts = append(atts, a...)
	}

	return atts
}
