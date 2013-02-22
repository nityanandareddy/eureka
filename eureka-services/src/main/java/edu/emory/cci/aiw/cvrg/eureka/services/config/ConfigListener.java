/*
 * #%L
 * Eureka Services
 * %%
 * Copyright (C) 2012 - 2013 Emory University
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
package edu.emory.cci.aiw.cvrg.eureka.services.config;

import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import javax.servlet.ServletContextEvent;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.inject.Guice;
import com.google.inject.Injector;
import com.google.inject.persist.PersistService;
import com.google.inject.persist.jpa.JpaPersistModule;
import com.google.inject.servlet.GuiceServletContextListener;

import edu.emory.cci.aiw.cvrg.eureka.services.finder.SystemPropositionFinder;
import edu.emory.cci.aiw.cvrg.eureka.services.thread.JobUpdateTask;
import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;

/**
 * Set up the Guice dependency injection engine. Uses two modules:
 * {@link ServletModule} for web related configuration, and {@link AppModule}
 * for non-web related configuration.
 *
 * @author hrathod
 *
 */
public class ConfigListener extends GuiceServletContextListener {

	private static final String JPA_UNIT = "services-jpa-unit";
	/**
	 * A timer scheduler to run the job update task.
	 */
	private final ScheduledExecutorService executorService = Executors
			.newSingleThreadScheduledExecutor();
	/**
	 * Make sure we always use the same injector
	 */
	private final Injector injector = Guice.createInjector(new ServletModule(),
			new AppModule(), new JpaPersistModule(JPA_UNIT));

	@Override
	protected Injector getInjector() {
		return this.injector;
	}
	/**
	 * The class level logger.
	 */
	private static final Logger LOGGER = LoggerFactory
			.getLogger(ConfigListener.class);

	@Override
	public void contextInitialized(ServletContextEvent inServletContextEvent) {
		super.contextInitialized(inServletContextEvent);

		EntityManagerFactory factory =
				Persistence.createEntityManagerFactory(JPA_UNIT);
		try {
			EntityManager entityManager = factory.createEntityManager();
			try {
				DatabasePopulator dp = new DatabasePopulator(entityManager);
				dp.doPopulateIfNeeded();
				entityManager.close();
				entityManager = null;
			} finally {
				if (entityManager != null) {
					try {
						entityManager.close();
					} catch (Exception ignore) {
					}
				}
			}
			factory.close();
			factory = null;
		} finally {
			if (factory != null) {
				try {
					factory.close();
				} catch (Exception ignore) {
				}
			}
		}

		try {
			ServiceProperties applicationProperties = injector
					.getInstance(ServiceProperties.class);
			JobUpdateTask jobUpdateTask = new JobUpdateTask(
					applicationProperties.getEtlUrl());
			this.executorService.scheduleWithFixedDelay(jobUpdateTask, 0, 10,
					TimeUnit.SECONDS);
		} catch (KeyManagementException e) {
			LOGGER.error(e.getMessage(), e);
		} catch (NoSuchAlgorithmException e) {
			LOGGER.error(e.getMessage(), e);
		}
	}

	@Override
	public void contextDestroyed(ServletContextEvent inServletContextEvent) {
		super.contextDestroyed(inServletContextEvent);
		this.executorService.shutdown();
		try {
			this.executorService.awaitTermination(10, TimeUnit.SECONDS);
		} catch (InterruptedException e) {
			LOGGER.error(e.getMessage(), e);
		}

		SystemPropositionFinder finder =
				this.getInjector().getInstance(SystemPropositionFinder.class);
		finder.shutdown();
	}
}
