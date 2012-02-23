package edu.emory.cci.aiw.cvrg.eureka.common.comm;

import java.util.ArrayList;
import java.util.List;

import javax.xml.bind.annotation.XmlRootElement;

import org.codehaus.jackson.annotate.JsonIgnore;

import edu.emory.cci.aiw.cvrg.eureka.common.entity.FileError;
import edu.emory.cci.aiw.cvrg.eureka.common.entity.FileUpload;
import edu.emory.cci.aiw.cvrg.eureka.common.entity.FileWarning;
import edu.emory.cci.aiw.cvrg.eureka.common.entity.Job;
import edu.emory.cci.aiw.cvrg.eureka.common.entity.JobEvent;

/**
 * A communication bean to transfer information about a user's job.
 * 
 * @author hrathod
 * 
 */
@XmlRootElement
public class JobInfo {
	/**
	 * The total number of steps in the process.
	 */
	private int totalSteps = 6;
	/**
	 * The file upload for the job being processed.
	 */
	private FileUpload fileUpload;
	/**
	 * The actual running job, if the file upload/validation/processing is
	 * complete.
	 */
	private Job job;

	/**
	 * Get the processing step for the file upload or job.
	 * 
	 * @return The process step that the job is currently on.
	 */
	@JsonIgnore
	public int getCurrentStep() {
		int step = 0;
		// we do this in descending order
		if (this.job != null) {
			String currentState = this.job.getCurrentState();
			if (currentState.equals("DONE") || currentState.equals("FAILED")
					|| currentState.equals("EXCEPTION")
					|| currentState.equals("INTERRUPTED")) {
				step = 6;
			} else if (currentState.equals("PROCESSING")) {
				step = 5;
			} else if (currentState.equals("CREATED")) {
				step = 4;
			}
		} else if (this.fileUpload != null) {
			if (this.fileUpload.isCompleted()) {
				step = 3;
			} else if (this.fileUpload.isProcessed()) {
				step = 2;
			} else if (this.fileUpload.isValidated()) {
				step = 1;
			}
		}
		return step;
	}

	/**
	 * @return the totalSteps
	 */
	public int getTotalSteps() {
		return this.totalSteps;
	}

	/**
	 * @param inTotalSteps the totalSteps to set
	 */
	public void setTotalSteps(int inTotalSteps) {
		this.totalSteps = inTotalSteps;
	}

	/**
	 * Get a list of messages for the job, including those generated by the file
	 * validation, as well as the running of the job itself.
	 * 
	 * @return The list of messages for the job.
	 */
	@JsonIgnore
	public List<String> getMessages() {
		List<String> messages;
		if (this.fileUpload == null) {
			messages = this.getJobMessages();
		} else {
			messages = this.getFileUploadMessages();
		}
		return messages;
	}

	/**
	 * Return a list of messages generated by the file upload validation.
	 * 
	 * @return The list of messages.
	 */
	private List<String> getFileUploadMessages() {
		List<String> messsages = new ArrayList<String>();
		if (this.fileUpload != null) {
			for (FileWarning fileWarning : this.fileUpload.getWarnings()) {
				messsages.add(fileWarning.toString());
			}
			for (FileError error : this.fileUpload.getErrors()) {
				messsages.add(error.toString());
			}
		}
		return messsages;
	}

	/**
	 * Return a list of messages generated by the job.
	 * 
	 * @return The list of messages.
	 */
	private List<String> getJobMessages() {
		List<String> messages = new ArrayList<String>();
		if (this.job != null) {
			for (JobEvent event : this.job.getJobEvents()) {
				messages.add(event.getMessage());
			}
		}
		return messages;
	}

	/**
	 * @return the fileUpload
	 */
	public FileUpload getFileUpload() {
		return this.fileUpload;
	}

	/**
	 * @param inFileUpload the fileUpload to set
	 */
	public void setFileUpload(FileUpload inFileUpload) {
		this.fileUpload = inFileUpload;
	}

	/**
	 * @return the job
	 */
	public Job getJob() {
		return this.job;
	}

	/**
	 * @param inJob the job to set
	 */
	public void setJob(Job inJob) {
		this.job = inJob;
	}
}
