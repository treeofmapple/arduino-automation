package com.tom.arduino.server.config;

/*
@Configuration
@Profile("prod")
@EnableJpaRepositories(basePackages = "com.tom.arduino.server.repository.timescale", entityManagerFactoryRef = "timescaleEntityManagerFactory", transactionManagerRef = "timescaleTransactionManager")
public class TimescaleConfig {

	@Bean
	@ConfigurationProperties("timescale.datasource")
	DataSource timescaleDataSource() {
		return DataSourceBuilder.create().build();
	}

	@Bean
	LocalContainerEntityManagerFactoryBean timescaleEntityManager(EntityManagerFactoryBuilder builder) {
		return builder.dataSource(timescaleDataSource()).packages("com.tom.arduino.server.model.timescale")
				.persistenceUnit("timescale").build();
	}

	@Bean
	PlatformTransactionManager timescaleTransactionManager(
			@Qualifier("timescaleEntityManager") LocalContainerEntityManagerFactoryBean emf) {
		return new JpaTransactionManager(emf.getObject());
	}
}
*/