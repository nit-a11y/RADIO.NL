# Rádio Rock - Nordeste Locações

Um player de rádio online focado em Rock, projetado para oferecer uma experiência contínua e imersiva. 

## Funcionalidades

- **Reprodução Contínua (Pre-fetch)**: O sistema pré-carrega automaticamente a próxima música da fila enquanto a atual está tocando, garantindo transições rápidas e sem engasgos.
- **Integração com YouTube**: Busca e transmite o áudio baseando-se no artista e título, utilizando o player do YouTube de forma oculta nos bastidores.
- **Interface Premium**: Design dark mode com estilo de rádio moderna, contendo controles completos de mídia (Play/Pause, Pular, Voltar, Aleatório, Repetir e Controle de Volume).
- **Espectrogramas e Animações**: Interface responsiva e com visualizadores animados de acordo com o estado da reprodução.
- **Gerenciador de Playlist**: Sistema de organização de músicas dividido em "Atos", permitindo explorar as seleções facilmente.
- **Sistema de Download**: Funcionalidade embutida para gravar/baixar faixas específicas da playlist para o seu dispositivo.

## Como Executar Localmente

**Pré-requisitos:** Node.js instalado em sua máquina.

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Configuração de Ambiente:
   Certifique-se de configurar suas variáveis de ambiente no arquivo `.env` (ou utilize o `.env.example` como base), especialmente se houver integração direta com APIs.

3. Inicie a aplicação:
   ```bash
   npm run dev
   ```

4. Acesse a rádio no navegador, na porta local indicada no terminal (ex: `http://localhost:5173`).
