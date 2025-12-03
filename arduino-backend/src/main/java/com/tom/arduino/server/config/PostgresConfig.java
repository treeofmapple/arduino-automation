package com.tom.arduino.server.config;

/*
@Configuration
@Profile("prod")
@EnableJpaRepositories(basePackages = "com.tom.arduino.server.repository.postgres", entityManagerFactoryRef = "postgresEntityManagerFactory", transactionManagerRef = "postgresTransactionManager")
public class PostgresConfig {

	@Bean
	@Primary
	@ConfigurationProperties("postgres.datasource")
	DataSource postgresDataSource() {
		return DataSourceBuilder.create().build();
	}

	@Bean
	@Primary
	LocalContainerEntityManagerFactoryBean postgresEntityManager(EntityManagerFactoryBuilder builder) {
		return builder.dataSource(postgresDataSource()).packages("com.tom.arduino.server.model.postgres")
				.persistenceUnit("postgres").build();
	}

	@Bean
	@Primary
	PlatformTransactionManager postgresTransactionManager(
			@Qualifier("postgresEntityManager") LocalContainerEntityManagerFactoryBean emf) {
		return new JpaTransactionManager(emf.getObject());
	}

}
*/