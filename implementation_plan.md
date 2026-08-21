# Plano de Implementação: Bebum TD

Este documento detalha o plano de desenvolvimento para o jogo **Bebum TD** (ou Happy Hour TD), um Tower Defense competitivo local (split-screen) construído para web utilizando Phaser.js.

Todos os arquivos do projeto serão criados e mantidos no diretório solicitado: `C:\Users\33775892877\Documents\GitHub\Bebum TD`.

## Revisão do Usuário Necessária

> [!IMPORTANT]
> **Arte e Assets:** Como não temos assets visuais (sprites, texturas, áudio) prontos, o plano inicial é utilizar formas primitivas (retângulos, círculos coloridos) e textos nativos do Phaser (placeholders) para garantir que toda a mecânica funcione perfeitamente primeiro. Posso gerar alguns assets básicos com IA (ferramenta de geração de imagem) durante o desenvolvimento se desejar, ou você planeja fornecer/substituir os assets posteriormente?

> [!WARNING]
> **Sistema de Caminhos (Pathfinding):** O GDD menciona "enviar bebidas pela esteira". Isso sugere que o caminho das bebidas será fixo e pré-definido (como em Bloons TD), ou os jogadores construirão torres soltas no grid criando um labirinto para as bebidas passarem (como em Desktop Tower Defense)? Assumirei o caminho fixo (esteira em zigue-zague, por exemplo) como padrão, com os slots ao redor dedicados aos "Fanfarrões".

> [!NOTE]
> **Tamanho e Resolução:** Para acomodar uma tela dividida na web, uma proporção padrão 16:9 é o ideal (ex: 1280x720 ou 1920x1080). Para os controles baseados em grid, qual seria um bom tamanho de célula (ex: 64x64 pixels)?

## Questões em Aberto

* **Condições Iniciais e Vitória:** Qual será a Vida (limite de embriaguez) base de cada bar?
* **Balanceamento Inicial:** Precisaremos começar com valores base (chutes educados) para: custo das torres, alcance, velocidade de "gole", e para as bebidas (custo, vida, velocidade de movimento, bônus de renda). Está de acordo em eu definir esses valores iniciais para fins de prototipagem?

## Mudanças Propostas

### 1. Configuração do Projeto e Build
O projeto será estruturado utilizando Node.js e Vite, oferecendo um servidor de desenvolvimento ultra rápido e empacotamento ideal para Phaser 3.

#### [NEW] [package.json](file:///C:/Users/33775892877/Documents/GitHub/Bebum%20TD/package.json)
Configuração de dependências (Phaser, Vite) e scripts de execução local.
#### [NEW] [index.html](file:///C:/Users/33775892877/Documents/GitHub/Bebum%20TD/index.html)
Ponto de entrada web, estrutura base e estilização mínima via CSS para centralizar o canvas do jogo e aplicar o background.
#### [NEW] [src/main.js](file:///C:/Users/33775892877/Documents/GitHub/Bebum%20TD/src/main.js)
Inicialização do Phaser, configuração de tela dividida. Uma abordagem eficiente será usar uma Cena principal configurada com 2 Câmeras (uma para a metade esquerda, outra para a metade direita), renderizando os mesmos sistemas mas focadas em mapas/barras diferentes.

---

### 2. Arquitetura Base do Jogo (Phaser Scenes)

#### [NEW] [src/scenes/GameScene.js](file:///C:/Users/33775892877/Documents/GitHub/Bebum%20TD/src/scenes/GameScene.js)
A cena principal que roda o core loop do jogo. Gerenciará as câmeras de split-screen, inicializará os mapas (esquerda e direita) e controlará os ticks de atualização do jogo.

#### [NEW] [src/managers/Player.js](file:///C:/Users/33775892877/Documents/GitHub/Bebum%20TD/src/managers/Player.js)
Classe para encapsular e gerenciar o estado isolado de cada jogador:
- Identificador (Jogador 1 ou 2)
- Moedas (Gorjetas e Popularidade/Renda)
- Barra de Embriaguez (Vida)
- Cursores e Seleção Atual

---

### 3. Sistemas e Entidades (Mecânicas)

#### [NEW] [src/entities/Drink.js](file:///C:/Users/33775892877/Documents/GitHub/Bebum%20TD/src/entities/Drink.js)
Entidades inimigas. Implementaremos lógica de movimento via `Phaser.Curves.Path` (seguindo a esteira).
Variações: Copo de Cerveja, Shot de Tequila, Jarra de Chopp (com lógica de spawnar copos ao morrer) e Coquetel Flamejante.

#### [NEW] [src/entities/Drinker.js](file:///C:/Users/33775892877/Documents/GitHub/Bebum%20TD/src/entities/Drinker.js)
As torres defensivas. Implementaremos lógica de detecção de alcance (range) e temporizador de cooldown (attack speed). Teremos projéteis invisíveis (ou "sugadas de canudo" visuais) para aplicar o dano às bebidas.

#### [NEW] [src/systems/GridInputSystem.js](file:///C:/Users/33775892877/Documents/GitHub/Bebum%20TD/src/systems/GridInputSystem.js)
Gerencia os controles baseados em Grid descritos no GDD:
- **J1:** WASD (Move), Espaço (Confirma), Shift Esq (Cancela/Vende)
- **J2:** Setas (Move), Enter (Confirma), Shift Dir (Cancela/Vende)

#### [NEW] [src/systems/EconomySystem.js](file:///C:/Users/33775892877/Documents/GitHub/Bebum%20TD/src/systems/EconomySystem.js)
Gerencia o "Core Loop" temporizado: adicionar o ganho passivo de gorjetas via renda de popularidade a cada tick (ex: 5 segundos). Intermediará compras e envios.

---

### 4. Interface de Usuário (HUD)

#### [NEW] [src/scenes/UIScene.js](file:///C:/Users/33775892877/Documents/GitHub/Bebum%20TD/src/scenes/UIScene.js)
Cena rodando em paralelo e por cima do GameScene. Exibirá textos e ícones na tela:
- Embriaguez (Vida)
- Gorjetas (Dinheiro Atual)
- Popularidade (Ganho por Tick)
- Um "Menu" visual baseado no cursor do jogador, mostrando a loja de torres (Ação de Defesa) e a loja de envio de bebidas (Ação de Ataque).

## Plano de Verificação

### Verificação Manual
1. Instalar dependências e rodar o jogo com `npm i && npm run dev`.
2. Acessar o localhost no navegador e validar se a tela dividida é renderizada corretamente com a distinção dos dois lados.
3. Testar a independência dos controles de entrada (Jogador 1 com WASD/Espaço, Jogador 2 com Setas/Enter) para mover os cursores.
4. Simular a compra de um Bebedor (Universitário) no mapa e checar a dedução do dinheiro (Gorjetas).
5. Simular o envio de uma Bebida (ex: Copo de Cerveja) e verificar se:
   - A bebida é instanciada na pista (esteira) correta do bar do oponente.
   - O dinheiro (Gorjetas) é deduzido e a Renda (Popularidade) do atacante aumenta.
6. Acompanhar a bebida pelo percurso:
   - Confirmar se a torre instalada "seca" a bebida corretamente se ela entrar no alcance.
   - Confirmar se o bar sofre dano (Embriaguez aumenta) caso a bebida não seja interceptada.
