/*
 * #%L
 * Eureka Common
 * %%
 * Copyright (C) 2012 Emory University
 * %%
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *      http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * #L%
 */
package edu.emory.cci.aiw.cvrg.eureka.common.entity;

import edu.emory.cci.aiw.cvrg.eureka.common.entity.CategoryEntity.CategorizationType;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;

/**
 * Contains attributes which describe a Protempa high level abstraction.
 *
 * @author hrathod
 */
@Entity
@Table(name = "sequences")
public class SequenceEntity extends DataElementEntity {

	@OneToOne(cascade = CascadeType.ALL)
	private ExtendedProposition primaryProposition;

	@OneToMany(cascade = CascadeType.ALL)
	@JoinColumn(name = "highLevelAbstractionId")
	private List<Relation> relations;

	/**
	 * The propositions that the current proposition is abstracted from.
	 */
	@ManyToMany(cascade = { CascadeType.MERGE, CascadeType.REFRESH,
	        CascadeType.PERSIST })
	@JoinTable(name = "hla_abstracted_from", 
			joinColumns = { @JoinColumn(name = "target_proposition_id") })
	private List<DataElementEntity> abstractedFrom;
	
	public SequenceEntity() {
		super(CategorizationType.HIGH_LEVEL_ABSTRACTION);
	}

	public ExtendedProposition getPrimaryProposition() {
		return primaryProposition;
	}

	public void setPrimaryProposition(ExtendedProposition inExtendedProposition) {
		primaryProposition = inExtendedProposition;
	}

	public List<Relation> getRelations() {
		return relations;
	}

	public void setRelations(List<Relation> inRelations) {
		relations = inRelations;
	}

	/**
	 * Gets the list of propositions the current proposition is abstracted from.
	 *
	 * @return The list of propositions the current proposition is abstracted
	 *         from.
	 */
	public List<DataElementEntity> getAbstractedFrom() {
		return abstractedFrom;
	}

	/**
	 * Sets the list of propositions the current proposition is abstracted from.
	 *
	 * @param abstractedFrom
	 *            The list of propositions the current proposition is abstracted
	 *            from.
	 */
	public void setAbstractedFrom(List<DataElementEntity> abstractedFrom) {
		this.abstractedFrom = abstractedFrom;
	}

	@Override
	public void accept(PropositionEntityVisitor visitor) {
		visitor.visit(this);
	}
}