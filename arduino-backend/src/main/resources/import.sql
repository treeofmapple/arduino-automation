DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM timescaledb_information.hypertables
        WHERE hypertable_name = 'arduino_logs'
    ) THEN
        PERFORM create_hypertable('arduino_logs', 'time');
    END IF;
END
$$;
