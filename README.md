# 📋 API de Gerenciamento de Tarefas (CRUD) — Node.js

API REST desenvolvida em **Node.js puro** (sem frameworks como Express) para gerenciamento completo de tarefas, com suporte a criação, listagem com filtros, atualização, remoção, marcação de conclusão e **importação em massa via CSV**.

Este projeto foi desenvolvido como desafio prático do módulo de **Fundamentos de Node.js**, com o objetivo de aplicar conceitos de CRUD, streams, roteamento manual e manipulação de arquivos sem depender de bibliotecas externas para o core da aplicação.

## ✨ Funcionalidades

- ✅ Criar tarefas
- ✅ Listar tarefas com busca por `title` e/ou `description`
- ✅ Atualizar título e/ou descrição de uma tarefa
- ✅ Remover uma tarefa
- ✅ Marcar/desmarcar uma tarefa como concluída
- ✅ Importar tarefas em massa a partir de um arquivo `.csv`
- ✅ Persistência dos dados em arquivo (`db.json`)
- ✅ Validações de campos obrigatórios e de existência do recurso

## 🛠️ Tecnologias

- [Node.js](https://nodejs.org/) (módulos nativos: `http`, `fs`, `crypto`)
- [csv-parse](https://csv.js.org/) — leitura e parsing de arquivos CSV

Nenhum framework HTTP (como Express ou Fastify) foi utilizado — o roteamento, o parsing do corpo da requisição e o tratamento de parâmetros/query string foram implementados manualmente, como proposto no desafio.

## 📁 Estrutura do projeto

```
api-tasks/
├── db.json                        # "Banco de dados" (gerado automaticamente)
├── server.js                      # Ponto de entrada: sobe o servidor HTTP
├── import-csv.js                  # Script de importação em massa via CSV
├── tasks.csv                      # Exemplo de arquivo para importação
├── package.json
└── src/
    ├── database.js                # Camada de acesso e persistência dos dados
    ├── routes.js                  # Definição das rotas e regras de negócio
    ├── middlewares/
    │   └── json.js                # Middleware que faz o parse do body em JSON
    └── utils/
        └── build-route-path.js    # Converte rotas com parâmetros (:id) em regex
```

## 🚀 Como rodar o projeto

### Pré-requisitos

- [Node.js](https://nodejs.org/) versão 18 ou superior instalado

### Passo a passo

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/api-tasks.git

# Acesse a pasta do projeto
cd api-tasks

# Instale as dependências
npm install

# Suba o servidor
npm run dev
```

O servidor vai subir em:

```
http://localhost:3333
```

> O modo `dev` utiliza a flag nativa `--watch` do Node, reiniciando o servidor automaticamente a cada alteração nos arquivos.

## 📡 Rotas da API

Todas as rotas retornam e recebem dados no formato `application/json`.

### Criar uma tarefa

```http
POST /tasks
```

**Body:**

```json
{
  "title": "Estudar Node.js",
  "description": "Terminar o desafio de CRUD de tarefas"
}
```

**Resposta:** `201 Created`

```json
{
  "id": "b3f2c1a0-...",
  "title": "Estudar Node.js",
  "description": "Terminar o desafio de CRUD de tarefas",
  "completed_at": null,
  "created_at": "2026-07-07T02:33:49.045Z",
  "updated_at": "2026-07-07T02:33:49.045Z"
}
```

Caso `title` ou `description` não sejam enviados, a API retorna `400 Bad Request`.

---

### Listar tarefas

```http
GET /tasks
```

Permite busca opcional por `title` e/ou `description` via **query string**:

```http
GET /tasks?title=Node
GET /tasks?description=desafio
```

**Resposta:** `200 OK`

```json
[
  {
    "id": "b3f2c1a0-...",
    "title": "Estudar Node.js",
    "description": "Terminar o desafio de CRUD de tarefas",
    "completed_at": null,
    "created_at": "2026-07-07T02:33:49.045Z",
    "updated_at": "2026-07-07T02:33:49.045Z"
  }
]
```

---

### Atualizar uma tarefa

```http
PUT /tasks/:id
```

**Body** (envie pelo menos um dos campos):

```json
{
  "title": "Novo título",
  "description": "Nova descrição"
}
```

**Respostas:**

- `204 No Content` — atualizado com sucesso
- `404 Not Found` — tarefa não encontrada
- `400 Bad Request` — nenhum campo enviado

---

### Remover uma tarefa

```http
DELETE /tasks/:id
```

**Respostas:**

- `204 No Content` — removida com sucesso
- `404 Not Found` — tarefa não encontrada

---

### Marcar/desmarcar tarefa como concluída

```http
PATCH /tasks/:id/complete
```

Alterna o estado da tarefa: se estiver pendente, marca `completed_at` com a data atual; se já estiver concluída, volta para `null`.

**Respostas:**

- `204 No Content` — status alterado com sucesso
- `404 Not Found` — tarefa não encontrada

## 📥 Importação em massa via CSV

Além das rotas HTTP, o projeto conta com um script (`import-csv.js`) para importar várias tarefas de uma vez a partir de um arquivo `.csv`, usando a biblioteca [`csv-parse`](https://csv.js.org/) com leitura via *stream* (`for await`).

### Formato esperado do arquivo

O arquivo `tasks.csv` (na raiz do projeto) deve seguir o formato:

```csv
title,description
Task 01,Descrição da Task 01
Task 02,Descrição da Task 02
Task 03,Descrição da Task 03
```

### Como importar

1. Garanta que o servidor esteja rodando (`npm run dev`) em outro terminal
2. Em um novo terminal, na raiz do projeto, rode:

```bash
node import-csv.js
```

Cada linha do CSV será enviada como uma requisição `POST /tasks` para a API, e o resultado de cada importação será exibido no terminal:

```
✅ Tarefa criada: Task 01
✅ Tarefa criada: Task 02
✅ Tarefa criada: Task 03
Importação finalizada!
```

## 💾 Persistência dos dados

Os dados são armazenados em um arquivo `db.json` na raiz do projeto, criado e atualizado automaticamente pela aplicação a cada operação de escrita. Não é necessário configurar nenhum banco de dados externo para rodar o projeto.

## 🧪 Testando a API

Você pode testar as rotas usando ferramentas como [Insomnia](https://insomnia.rest/), [Postman](https://www.postman.com/) ou `curl`. Exemplo:

```bash
curl -X POST http://localhost:3333/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Estudar Node","description":"Terminar o desafio"}'
```

## 📄 Licença

Este projeto está sob a licença MIT. Sinta-se à vontade para utilizá-lo como referência de estudo.

---

Desenvolvido durante os estudos de **Node.js** 🚀