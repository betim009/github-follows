# Projeto Frontend Followers Github

Este ExecPlan é um documento vivo.

## Purpose / Big Picture
O objetivo do projeto é um sistema web simples capaz de visualizar quem eu sigo no github e comparar quem me segue e ter um bom resultado de saber quantas pessoas eu sigo que nao me seguem. 

Dessa forma consigo saber quem me segue ou não.

## Progress
- [x] Projeto ja iniciado
- [x] API ja conectada
- [x] Melhorar Design (UI com Material UI)
- [x] Criar Função para verificar quais pessoas que me seguem que eu nao sigo de volta
- [x] Readme na raiz editado


## Surprises & Discoveries
- Import em `frontend/src/App.jsx` referenciava `./services/githubApi`, mas o arquivo estava nomeado `githubAPI.jsx` (funcionava em macOS case-insensitive; quebraria em Linux/CI). Ajustado renomeando para `githubApi.js`.
- Regra do ESLint (`react-refresh/only-export-components`) falhou ao definir componente em `frontend/src/main.jsx` sem export. Resolvido criando `frontend/src/Root.jsx` e mantendo `main.jsx` apenas como bootstrap.
- O arquivo `frontend/.env` chegou a aparecer modificado localmente durante a execução; foi revertido antes de qualquer commit para evitar risco de versionar credenciais.
- Importante: se `frontend/.env` contiver um token real, revogue/rotacione o token (ele não deve ser commitado).
- `npm run dev` indicou que a porta 5173 estava em uso em wildcard, mas `127.0.0.1:5173` ficou disponível e o Vite subiu normalmente (smoke test do servidor ok).
- `frontend/.env` estava versionado e continha um token real; foi removido do tracking (mantendo apenas `frontend/.env.example`). Recomenda-se rotacionar o token no GitHub imediatamente.

## Decision Log
- Adotar Material UI como base do layout (AppBar, Container, Paper, List, Alert, Snackbar) para melhorar consistência visual e acessibilidade com pouco CSS manual.
- Centralizar tema MUI (com `prefers-color-scheme`) em um componente `Root` para manter `main.jsx` simples e compatível com React Refresh.
- Simplificar `frontend/src/index.css` para evitar conflitos com `CssBaseline`/tema MUI.
- Exibir as duas comparações (quem não segue de volta / quem eu não sigo de volta) em uma única tela via `Tabs`, para reduzir cliques e manter contexto.
- Não versionar `frontend/.env`; versionar apenas `frontend/.env.example` e instruir o setup no `README.md` da raiz.

## Outcomes & Retrospective
Resumo final

## Context and Orientation
Frontend em `frontend/` (React + Vite) que consulta a API do GitHub e exibe:

- Quem você segue e não te segue de volta (`notFollowingBack`)
- Quem te segue e você não segue de volta (`notFollowedBack`)

## Plan of Work
- Para melhorar o design do sistema eu quero que voce use os components da biblioteca Material UI. 
- Uma nova função precisa ser implementada que deve exibir na tela quais pessoas que me seguem e que eu nao sigo de volta.

## Concrete Steps
- Implementado novo layout MUI (header, cards, lista de resultados, estados de loading/erro).
- Ajustado serviço GitHub para nomenclatura consistente (case-sensitive).
- Criado wrapper de tema (`Root`) e aplicado `CssBaseline`.
- Implementada a segunda comparação: `notFollowedBack` (followers que não estão em following).
- UI atualizada com `Tabs` para alternar entre as listas.
- O README.md na raiz deve instruir pessoas ao clonar esse repo, a como fazer o projeto funcionar localmente no computador delas.
- `README.md` da raiz atualizado com requisitos, setup e validação.
- Criado `frontend/.env.example` e removido `frontend/.env` do Git (arquivo local continua existindo, mas não é versionado).

## Validation and Acceptance
- Validação local:
  - `npm run lint` (ok)
  - `npm run build` (ok)
- Smoke test do dev server:
  - `npm run dev -- --host 127.0.0.1 --port 5173 --strictPort` (subiu e foi interrompido com Ctrl+C)
- Observação: validação “sem erro no console” depende de rodar `npm run dev` e verificar manualmente no browser.
- Para cada etapa concluída, criar commits claros no Git.

## Idempotence and Recovery
Repetição e recuperação

## Artifacts and Notes
- Arquivos alterados:
  - `PLANS.md`
  - `frontend/src/App.jsx`
  - `frontend/src/Root.jsx`
  - `frontend/src/index.css`
  - `frontend/src/main.jsx`
  - `frontend/src/services/githubApi.js` (renomeado de `githubAPI.jsx`)
- Arquivos alterados (nesta etapa):
  - `PLANS.md`
  - `README.md`
  - `frontend/.env.example`
  - `frontend/.env` (removido do Git)
  - `frontend/src/App.jsx`
  - `frontend/src/services/githubApi.js`
- Comandos executados (até aqui):
  - `cat PLANS.md`
  - `ls -la` / `ls -la frontend` / `find .. -maxdepth 3 -name AGENTS.md -print`
  - `git diff` / `git restore .gitignore frontend/.env` (reversão preventiva)
  - `git restore frontend/.env` (reversão preventiva)
  - `git rm --cached frontend/.env`
  - `npm run lint` (frontend)
  - `npm run build` (frontend)
  - `npm run lint && npm run build` (frontend)
  - `npm run dev -- --host 127.0.0.1 --port 5173 --strictPort` (frontend; interrompido com Ctrl+C)
  - `git add -A PLANS.md frontend/src`
  - `git commit -m "feat(ui): redesign with Material UI"`
  - `git push origin main`
  - `git commit -m "feat(followers): show who I don't follow back"`
  - `git push origin main`
  - `git commit -m "docs(readme): add setup instructions and env example"`
  - `git commit -m "docs(plans): record README and env changes"`
  - `git push origin main`
- Commits:
  - `48b4d39` `feat(ui): redesign with Material UI`
  - `6c10cd3` `docs(plans): record artifacts and commit`
  - `db6fe68` `docs(plans): note push`
  - `da06ed2` `feat(followers): show who I don't follow back`
  - `adcf227` `docs(plans): record followers feature commit`
  - `3a336e0` `docs(readme): add setup instructions and env example`
  - `b614394` `docs(plans): record README and env changes`

## Interfaces and Dependencies
- Variáveis de ambiente (Vite):
  - `VITE_GITHUB_USERNAME`
  - `VITE_GITHUB_TOKEN` (GitHub token com permissões para ler followers/following)
- UI: Material UI (`@mui/material`, `@mui/icons-material`, `@emotion/*`, `@fontsource/roboto`)
