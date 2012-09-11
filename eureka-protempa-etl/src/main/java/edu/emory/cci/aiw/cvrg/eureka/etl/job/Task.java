package edu.emory.cci.aiw.cvrg.eureka.etl.job;

import java.util.List;

import org.protempa.FinderException;
import org.protempa.PropositionDefinition;
import org.protempa.ProtempaStartupException;
import org.protempa.backend.BackendInitializationException;
import org.protempa.backend.BackendNewInstanceException;
import org.protempa.backend.BackendProviderSpecLoaderException;
import org.protempa.backend.ConfigurationsLoadException;
import org.protempa.backend.InvalidConfigurationException;
import org.protempa.query.QueryBuildException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.inject.Inject;

import edu.emory.cci.aiw.cvrg.eureka.common.entity.Job;
import edu.emory.cci.aiw.cvrg.eureka.etl.dao.JobDao;

public class Task implements Runnable {
	private static final Logger LOGGER = LoggerFactory.getLogger(Task.class);
	private final JobDao jobDao;
	private final ETL etl;
	private Long jobId;
	private List<PropositionDefinition> propositionDefinitions;

	@Inject
	Task (JobDao inJobDao, ETL inEtl) {
		this.jobDao = inJobDao;
		this.etl = inEtl;
	}

	Long getJobId() {
		return jobId;
	}

	void setJobId(Long inJobId) {
		jobId = inJobId;
	}

	List<PropositionDefinition> getPropositionDefinitions() {
		return propositionDefinitions;
	}

	void setPropositionDefinitions(List<PropositionDefinition>
		inPropositionDefinitions) {
		propositionDefinitions = inPropositionDefinitions;
	}

	@Override
	public void run() {
		Job myJob = this.jobDao.retrieve(this.jobId);
		LOGGER.debug("{} just got a job, id={}", Thread.currentThread().getName(), myJob.toString());
		myJob.setNewState("PROCESSING", null, null);
		LOGGER.debug("About to save job: {}", myJob.toString());
		this.jobDao.update(myJob);

		Long configId = myJob.getConfigurationId();

		try {
			PropositionDefinition[] propositionArray = new
				PropositionDefinition[this.getPropositionDefinitions().size()];
			this.getPropositionDefinitions().toArray(propositionArray);
			this.etl.run("config" + configId, propositionArray);
		} catch (FinderException e) {
			handleError(myJob, e);
		} catch (QueryBuildException e) {
			handleError(myJob, e);
		} catch (ConfigurationsLoadException e) {
			handleError(myJob, e);
		} catch (BackendProviderSpecLoaderException e) {
			handleError(myJob, e);
		} catch (InvalidConfigurationException e) {
			handleError(myJob, e);
		} catch (ProtempaStartupException e) {
			handleError(myJob, e);
		} catch (BackendInitializationException e) {
			handleError(myJob, e);
		} catch (BackendNewInstanceException e) {
			handleError(myJob, e);
		}

		myJob.setNewState("DONE", null, null);
		this.jobDao.update(myJob);
	}

	private void handleError (Job job, Exception e) {
		LOGGER.error(e.getMessage(), e);
		job.setNewState("EXCEPTION", e.getMessage(), null);
		this.jobDao.update(job);
	}
}
