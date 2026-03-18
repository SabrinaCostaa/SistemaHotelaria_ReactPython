--Criação dos Schemas
CREATE SCHEMA IF NOT EXISTS schema_hospede;   
CREATE SCHEMA IF NOT EXISTS schema_quarto;   
CREATE SCHEMA IF NOT EXISTS schema_reserva;    
CREATE SCHEMA IF NOT EXISTS schema_hospedagem; 
CREATE SCHEMA IF NOT EXISTS schema_limpeza;    

--Criação dos Usuários
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'user_hospede') THEN
    CREATE USER user_hospede WITH PASSWORD 'pass_hospede';
  END IF;
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'user_quarto') THEN
    CREATE USER user_quarto WITH PASSWORD 'pass_quarto';
  END IF;
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'user_reserva') THEN
    CREATE USER user_reserva WITH PASSWORD 'pass_reserva';
  END IF;
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'user_hospedagem') THEN
    CREATE USER user_hospedagem WITH PASSWORD 'pass_hospedagem';
  END IF;
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'user_limpeza') THEN
    CREATE USER user_limpeza WITH PASSWORD 'pass_limpeza';
  END IF;
END $$;

--Configuração de Permissões por Microserviço

-- Serviço de Hóspedes
GRANT ALL PRIVILEGES ON SCHEMA schema_hospede TO user_hospede;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA schema_hospede TO user_hospede;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA schema_hospede TO user_hospede;
ALTER DEFAULT PRIVILEGES IN SCHEMA schema_hospede GRANT ALL ON TABLES TO user_hospede;
ALTER DEFAULT PRIVILEGES IN SCHEMA schema_hospede GRANT ALL ON SEQUENCES TO user_hospede;
ALTER ROLE user_hospede SET search_path TO schema_hospede;

-- Serviço de Quartos
GRANT ALL PRIVILEGES ON SCHEMA schema_quarto TO user_quarto;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA schema_quarto TO user_quarto;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA schema_quarto TO user_quarto;
ALTER DEFAULT PRIVILEGES IN SCHEMA schema_quarto GRANT ALL ON TABLES TO user_quarto;
ALTER DEFAULT PRIVILEGES IN SCHEMA schema_quarto GRANT ALL ON SEQUENCES TO user_quarto;
ALTER ROLE user_quarto SET search_path TO schema_quarto;

-- Serviço de Reservas
GRANT ALL PRIVILEGES ON SCHEMA schema_reserva TO user_reserva;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA schema_reserva TO user_reserva;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA schema_reserva TO user_reserva;
ALTER DEFAULT PRIVILEGES IN SCHEMA schema_reserva GRANT ALL ON TABLES TO user_reserva;
ALTER DEFAULT PRIVILEGES IN SCHEMA schema_reserva GRANT ALL ON SEQUENCES TO user_reserva;
ALTER ROLE user_reserva SET search_path TO schema_reserva;

-- Serviço de Hospedagem
GRANT ALL PRIVILEGES ON SCHEMA schema_hospedagem TO user_hospedagem;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA schema_hospedagem TO user_hospedagem;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA schema_hospedagem TO user_hospedagem;
ALTER DEFAULT PRIVILEGES IN SCHEMA schema_hospedagem GRANT ALL ON TABLES TO user_hospedagem;
ALTER DEFAULT PRIVILEGES IN SCHEMA schema_hospedagem GRANT ALL ON SEQUENCES TO user_hospedagem;
ALTER ROLE user_hospedagem SET search_path TO schema_hospedagem;

-- Serviço de Limpeza
GRANT ALL PRIVILEGES ON SCHEMA schema_limpeza TO user_limpeza;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA schema_limpeza TO user_limpeza;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA schema_limpeza TO user_limpeza;
ALTER DEFAULT PRIVILEGES IN SCHEMA schema_limpeza GRANT ALL ON TABLES TO user_limpeza;
ALTER DEFAULT PRIVILEGES IN SCHEMA schema_limpeza GRANT ALL ON SEQUENCES TO user_limpeza;
ALTER ROLE user_limpeza SET search_path TO schema_limpeza;

--Segurança Global
REVOKE CREATE ON SCHEMA public FROM PUBLIC;