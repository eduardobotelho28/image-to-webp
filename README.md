# Image Worker

Ferramenta de linha de comando para converter em lote todas as imagens de uma pasta para WebP.

Útil para quem cria sites e precisa otimizar imagens antes de colocar no ar: em vez de converter arquivo por arquivo, você aponta a ferramenta para uma pasta e ela processa tudo.

```text
CLI → fila de processamento → worker → Sharp → output/
```

A CLI apenas encontra as imagens e enfileira o trabalho. O processamento roda em segundo plano, em um worker separado, então a conversão de várias imagens acontece em paralelo.

## Stack

- Node.js
- BullMQ + Redis (fila de processamento)
- Sharp (conversão de imagens)
- Docker / Docker Compose

## Estrutura

```text
image-worker/
├── input/          # imagens de entrada
├── output/         # imagens .webp geradas
├── src/
│   ├── cli.js       # comando `process` — encontra imagens e enfileira jobs
│   ├── queue.js      # configuração da fila
│   ├── worker.js     # consome a fila e chama o processor
│   └── processor.js  # conversão da imagem para WebP via Sharp
├── docker-compose.yml
├── Dockerfile
└── package.json
```

## Pré-requisitos

- Node.js 20+
- Docker Desktop

## Como rodar

### Opção 1 — Redis no Docker, CLI e worker no host

Suba apenas o Redis:

```bash
docker compose up -d redis
```

Instale as dependências:

```bash
npm install
```

Em um terminal, suba o worker:

```bash
npm run worker
```

Em outro terminal, coloque as imagens (`.jpg`, `.jpeg`, `.png`) na pasta `input/` e rode a CLI:

```bash
node src/cli.js process ./input
```

Saída esperada:

```text
Found 3 images.
Queued 3 jobs.
```

Os arquivos `.webp` aparecem em `output/` conforme o worker processa cada imagem.

### Opção 2 — Redis e worker no Docker, CLI no host

O Docker Compose sobe Redis e worker dockerizados, sem precisar instalar nada além do Docker para essa parte. Mas a CLI roda localmente (fora do container) e depende de pacotes do `node_modules`, então o `npm install` continua necessário:

```bash
npm install
docker compose up -d --build
```

Acompanhar os logs do worker:

```bash
docker compose logs -f worker
```

A CLI continua rodando no host (ela só precisa acessar o Redis exposto na porta `6379`):

```bash
node src/cli.js process ./input
```

As pastas `input/` e `output/` do seu filesystem são montadas como volumes no container, então os arquivos aparecem normalmente em `output/` local.

Parar tudo:

```bash
docker compose down
```

## Fora de escopo (intencionalmente)

- Banco de dados
- API
- Frontend
- Kubernetes / Kafka
