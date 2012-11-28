/*
 * #%L
 * Eureka Services
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
package edu.emory.cci.aiw.cvrg.eureka.services.translation;

import com.google.inject.Inject;

import edu.emory.cci.aiw.cvrg.eureka.common.comm.CategoricalElement;
import edu.emory.cci.aiw.cvrg.eureka.common.comm.DataElementVisitor;
import edu.emory.cci.aiw.cvrg.eureka.common.comm.Sequence;
import edu.emory.cci.aiw.cvrg.eureka.common.comm.SystemElement;
import edu.emory.cci.aiw.cvrg.eureka.common.entity.Proposition;

public final class DataElementTranslatorVisitor implements DataElementVisitor {

	private final SystemPropositionTranslator systemPropositionTranslator;
	private final SequenceTranslator sequenceTranslator;
	private final CategorizationTranslator categorizationTranslator;
	private Proposition proposition;
	private Long userId;

	@Inject
	public DataElementTranslatorVisitor(SystemPropositionTranslator
		inSystemPropositionTranslator, SequenceTranslator
		inSequenceTranslator, CategorizationTranslator
		inCategorizationTranslator) {
		this.systemPropositionTranslator = inSystemPropositionTranslator;
		this.sequenceTranslator = inSequenceTranslator;
		this.categorizationTranslator = inCategorizationTranslator;
	}

	public Proposition getProposition() {
		return proposition;
	}

	public void setUserId (Long inUserId) {
		this.userId = inUserId;
	}

	@Override
	public void visit(SystemElement systemElement) {
		proposition = this.systemPropositionTranslator.translateFromElement
			(systemElement);
	}

	@Override
	public void visit(CategoricalElement categoricalElement) {
		proposition = this.categorizationTranslator.translateFromElement
			(categoricalElement);
	}

	@Override
	public void visit(Sequence sequence) {
		proposition = this.sequenceTranslator.translateFromElement(sequence);
	}

}
