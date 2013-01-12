package edu.emory.cci.aiw.cvrg.eureka.services.translation;

import java.util.ArrayList;
import java.util.List;

import com.google.inject.Inject;

import edu.emory.cci.aiw.cvrg.eureka.common.comm.ValueThreshold;
import edu.emory.cci.aiw.cvrg.eureka.common.comm.ValueThresholds;
import edu.emory.cci.aiw.cvrg.eureka.common.entity.ValueThresholdEntity;
import edu.emory.cci.aiw.cvrg.eureka.common.entity.ValueThresholdGroupEntity;
import edu.emory.cci.aiw.cvrg.eureka.common.exception.DataElementHandlingException;
import edu.emory.cci.aiw.cvrg.eureka.services.dao.PropositionDao;
import edu.emory.cci.aiw.cvrg.eureka.services.dao.ThresholdsOperatorDao;
import edu.emory.cci.aiw.cvrg.eureka.services.dao.ValueComparatorDao;
import edu.emory.cci.aiw.cvrg.eureka.services.finder.SystemPropositionFinder;

public final class ValueThresholdsTranslator implements
        PropositionTranslator<ValueThresholds, ValueThresholdGroupEntity> {

	private final TranslatorSupport translatorSupport;
	private final ValueComparatorDao valueCompDao;
	private final ThresholdsOperatorDao thresholdsOperatorDao;

	@Inject
	public ValueThresholdsTranslator(PropositionDao inPropositionDao,
	        ValueComparatorDao inValueComparatorDao,
	        ThresholdsOperatorDao inThresholdsOperatorDao,
	        SystemPropositionFinder inFinder) {
		translatorSupport = new TranslatorSupport(inPropositionDao, inFinder);
		valueCompDao = inValueComparatorDao;
		thresholdsOperatorDao = inThresholdsOperatorDao;
	}

	@Override
	public ValueThresholdGroupEntity translateFromElement(
	        ValueThresholds element) throws DataElementHandlingException {
		ValueThresholdGroupEntity result = new ValueThresholdGroupEntity();

		PropositionTranslatorUtil.populateCommonEntityFields(result, element);

		result.setThresholdsOperator(thresholdsOperatorDao.retrieve(element
		        .getThresholdsOperator()));
		List<ValueThresholdEntity> thresholds = new ArrayList<ValueThresholdEntity>();
		for (ValueThreshold vt : element.getValueThresholds()) {
			ValueThresholdEntity vte = new ValueThresholdEntity();
			vte.setAbstractedFrom(translatorSupport.getSystemEntityInstance(
			        element.getUserId(), vt.getDataElement()
			                .getDataElementKey()));

			vte.setMinValueThreshold(vt.getLowerValue());
			vte.setMinValueComp(valueCompDao.retrieve(vt.getLowerComp()));
			// vte.setMinUnits(vt.getLowerUnits());

			vte.setMaxValueThreshold(vt.getUpperValue());
			vte.setMaxValueComp(valueCompDao.retrieve(vt.getUpperComp()));
			// vte.setMaxUnits(vt.getUpperUnits());

			thresholds.add(vte);
		}
		result.setValueThresholds(thresholds);

		return result;
	}

	@Override
	public ValueThresholds translateFromProposition(
	        ValueThresholdGroupEntity entity) {
		ValueThresholds result = new ValueThresholds();

		PropositionTranslatorUtil.populateCommonDataElementFields(result,
		        entity);

		result.setThresholdsOperator(entity.getThresholdsOperator().getId());

		List<ValueThreshold> thresholds = new ArrayList<ValueThreshold>();
		for (ValueThresholdEntity vte : entity.getValueThresholds()) {
			ValueThreshold threshold = new ValueThreshold();
			threshold.setLowerValue(vte.getMinValueThreshold());
			threshold.setLowerComp(vte.getMinValueComp().getId());
			// threshold.setLowerUnits(vte.getMinUnits());

			threshold.setUpperValue(vte.getMaxValueThreshold());
			threshold.setUpperComp(vte.getMaxValueComp().getId());
			// threshold.setUpperUnits(vte.getMaxUnits());

			thresholds.add(threshold);
		}
		result.setValueThresholds(thresholds);

		return result;
	}

}
