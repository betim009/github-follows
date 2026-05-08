# GitHub Follows (Follow Checker)

App web (React + Vite) para:

- Ver quem você segue no GitHub que **não te segue de volta**
- Ver quem **te segue** no GitHub e você **não segue de volta**

## Requisitos

- Node.js (recomendado: versão LTS)
- Um token do GitHub (PAT) para evitar rate limit

## Como rodar localmente

```bash
git clone git@github.com:betim009/github-follows.git
cd github-follows/frontend
npm install
```

Crie seu `.env` local a partir do exemplo:

```bash
cp .env.example .env
```

Edite `frontend/.env` e configure:

- `VITE_GITHUB_USERNAME`: seu usuário do GitHub
- `VITE_GITHUB_TOKEN`: seu token do GitHub

Inicie o dev server:

```bash
npm run dev
```

Abra o endereço mostrado no terminal (por padrão `http://127.0.0.1:5173/`).

## Validação

```bash
cd frontend
npm run lint
npm run build
```

## Segurança

- Nunca commite `frontend/.env` com token real.
- Se um token foi exposto, **revogue/rotacione** o token imediatamente no GitHub.
