# Arduino Automation Dashboard

Este projeto é uma solução completa para monitoramento e automação de dispositivos Arduino em tempo real. O sistema integra um Backend, Frontend, banco de dados TimescaleDB e um broker MQTT (EMQX) para coleta e visualização de dados de sensores.

## 🚀 Tecnologias Utilizadas

- **Backend:** Java (Spring Boot)
    
- **Frontend:** React (Vite)
    
- **Banco de Dados:** TimescaleDB (PostgreSQL otimizado para séries temporais)
    
- **Mensageria:** MQTT (EMQX)
    
- **Infraestrutura:** Docker & Docker Compose
    

---

## 🛠️ Configuração do Ambiente

### 1. Pré-requisitos

Certifique-se de ter o **Docker** e o **Docker Compose** instalados em sua máquina.

### 2. Variáveis de Ambiente

Todas as variáveis necessárias para configurar o ambiente estão no arquivo de exemplo. Antes de iniciar, crie o arquivo `.env` na raiz (ou na pasta `compose`, dependendo da sua estrutura):

Bash

```
cp .env.sample .env
```

Conteúdo padrão do `.env`:

Properties

```
PROFILE=prod
ARDUINO_DASHBOARD_PORT=8000

# Configuração do TimescaleDB
TS_HOST=timescale
TS_USER=timescale
TS_PASSWORD=timescale
TS_DATABASE=timescale
TS_PORT=5432

# Configuração MQTT
MQTT_URL=tcp://emqx:1883
MQTT_DASHBOARD_USERNAME=admin
MQTT_DASHBOARD_PASSWORD=admin
MQTT_USERNAME=admin
MQTT_PASSWORD=admin
```

### 3. Executando o Sistema

Para compilar e subir todos os contêineres (Backend, Frontend, Banco e Broker), utilize os comandos abaixo. O sistema foi configurado na pasta `/compose`.

Bash

```
# Buildar e subir os containers em modo "detached" (segundo plano)
docker compose up -d --build
```

---

## 📡 Configuração do Arduino

O projeto suporta tanto dispositivos físicos quanto simulação via Docker. O código fonte encontra-se na pasta `/arduino-code`.

### Opção A: Simulação (Docker)

Você pode rodar múltiplos Arduinos simulados diretamente pelo Docker Compose. O código utilizado é o `simulation.ino`.

Para configurar a quantidade de dispositivos e suas credenciais, edite o serviço de simulação no `docker-compose.yml` adicionando as variáveis de ambiente:

YAML

```
environment:
  - DEVICE_NAME=sensor-003
  - API_KEY=none        # Ou a chave gerada pelo sistema
  - SECRET=none         # Ou o segredo gerado pelo sistema
  - MQTT_BROKER=mqtt-broker
```

### Opção B: Arduino Físico (Hardware)

Para conectar um Arduino real (ex: ESP32/ESP8266), utilize o código `physical.ino`.

#### 1. Credenciais de Rede e Servidor

Abra o arquivo `physical.ino` e configure as seguintes variáveis globais para conectar ao Wi-Fi e encontrar o servidor MQTT:

C++

```
// Configuração do Wi-Fi
const char *WIFI_SSID = "NOME_DA_SUA_REDE";
const char *WIFI_PASSWORD = "SENHA_DA_SUA_REDE";

// Configuração do Broker MQTT
// Importante: Coloque o IP da máquina onde o Docker está rodando (ex: 192.168.1.X)
const char *MQTT_BROKER = "192.168.X.X"; 
int MQTT_PORT = 9002; // Porta externa mapeada no Docker
```

#### 2. Credenciais do Dispositivo

Primeiro, suba o sistema e acesse o Dashboard. Crie um novo dispositivo na interface. O sistema fornecerá as credenciais que devem ser inseridas no código:

C++

```
const char *DEVICE_NAME = "SEU_DEVICE_NAME"; // Gerado no Dashboard
const char *API_KEY = "SUA_API_KEY";         // Gerado no Dashboard
const char *SECRET = "SEU_SECRET";           // Gerado no Dashboard
```

Após inserir os dados, carregue o código no seu microcontrolador.

---

## 📂 Estrutura de Pastas

- **`/compose`**: Contém o arquivo `docker-compose.yml` e configurações para subir o sistema completo.
    
- **`/arduino-code`**:
    
    - `simulation.ino`: Código para rodar sensores virtuais dentro do Docker.
        
    - `physical.ino`: Código C++ para carregar em placas físicas (ESP32/ESP8266).
        
- **`.env.sample`**: Modelo das variáveis de ambiente necessárias.
