package edu.emory.cci.aiw.cvrg.eureka.common.entity;

/*
 * #%L
 * Eureka Common
 * %%
 * Copyright (C) 2012 - 2014 Emory University
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

import java.util.Arrays;
import javax.persistence.Entity;
import javax.persistence.Table;

/**
 *
 * @author Andrew Post
 */
@Entity
@Table(name = "i2b2_destinations")
public class I2B2DestinationEntity extends DestinationEntity {

	public I2B2DestinationEntity() {
		LinkEntity link = new LinkEntity();
		link.setUrl("/i2b2/");
		link.setDisplayName("Go to i2b2");
		setLinks(Arrays.asList(new LinkEntity[]{link}));
	}
	
	@Override
	public void accept(DestinationEntityVisitor visitor) {
		visitor.visit(this);
	}
	
}
