const Phaser = window.Phaser;
import Player from '../managers/Player.js';

// ============ CONSTANTES ============
const CELL = 64;
const HUD_HEIGHT = 175;
const HALF_W = 960;
const FULL_W = 1920;
const FULL_H = 1080;
const MAX_DRUNK = 20;

const PREP_TIME = 30;
const ECONOMY_TICK = 5000;

const DRINK_TYPES = {
    beer:    { name: 'Cerveja',    hp: 2,  damage: 1, speed: 12000, cost: 20, reward: 10 },
    tequila: { name: 'Tequila',    hp: 1,  damage: 1, speed: 6000,  cost: 15, reward: 8 },
    flaming: { name: 'Flamejante', hp: 5,  damage: 3, speed: 10000, cost: 50, reward: 25 },
    jug:     { name: 'Jarra',      hp: 10, damage: 5, speed: 20000, cost: 80, reward: 40 },
};

const TOWER_TYPES = {
    student:   { name: 'Universitário', range: 160, fireRate: 700,  damage: 1, cost: 50 },
    sommelier: { name: 'Sommelier',     range: 380, fireRate: 2200, damage: 4, cost: 120 },
    thirsty:   { name: 'Sedento',       range: 120, fireRate: 500,  damage: 1, cost: 80 },
    uncle:     { name: 'Tio do Boteco', range: 140, fireRate: 1800, damage: 6, cost: 100 },
};

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    // ============ PRELOAD ============
    preload() {
        this.generateTextures();
    }

    generateTextures() {
        let g;

        // Beer
        g = this.make.graphics({ add: false });
        g.fillStyle(0xffbb00); g.fillRoundedRect(4, 4, 24, 28, 4);
        g.fillStyle(0xffffff, 0.6); g.fillRect(8, 4, 6, 28);
        g.fillStyle(0xfff5cc); g.fillRect(2, 0, 28, 6);
        g.generateTexture('beer', 32, 32); g.destroy();

        // Tequila
        g = this.make.graphics({ add: false });
        g.fillStyle(0xccff00); g.fillRoundedRect(8, 8, 16, 20, 2);
        g.fillStyle(0xffffff, 0.4); g.fillRect(12, 8, 4, 20);
        g.generateTexture('tequila', 32, 32); g.destroy();

        // Jug
        g = this.make.graphics({ add: false });
        g.fillStyle(0xcc8800); g.fillRoundedRect(2, 2, 28, 28, 6);
        g.fillStyle(0xffcc44); g.fillRect(6, 4, 20, 24);
        g.fillStyle(0xffffff, 0.3); g.fillRect(10, 4, 6, 24);
        g.fillStyle(0xfff5cc); g.fillRect(4, 0, 24, 6);
        g.generateTexture('jug', 32, 32); g.destroy();

        // Flaming
        g = this.make.graphics({ add: false });
        g.fillStyle(0xff4400); g.fillRoundedRect(4, 10, 24, 22, 4);
        g.fillStyle(0xff8800); g.fillTriangle(16, 0, 8, 12, 24, 12);
        g.fillStyle(0xffcc00); g.fillTriangle(16, 4, 12, 12, 20, 12);
        g.generateTexture('flaming', 32, 32); g.destroy();

        // Tower student
        g = this.make.graphics({ add: false });
        g.fillStyle(0x2255ff); g.fillCircle(32, 14, 12);
        g.fillStyle(0x2255ff); g.fillRect(20, 26, 24, 28);
        g.fillStyle(0xffcc88); g.fillCircle(32, 14, 8);
        g.fillStyle(0x44ff44); g.fillRect(42, 30, 16, 4);
        g.generateTexture('tower_student', 64, 64); g.destroy();

        // Tower sommelier
        g = this.make.graphics({ add: false });
        g.fillStyle(0x8833cc); g.fillCircle(32, 18, 12);
        g.fillStyle(0x8833cc); g.fillRect(20, 30, 24, 24);
        g.fillStyle(0xffcc88); g.fillCircle(32, 18, 8);
        g.fillStyle(0x222222); g.fillRect(22, 4, 20, 8);
        g.fillStyle(0x222222); g.fillRect(18, 10, 28, 4);
        g.fillStyle(0xff4444); g.fillRect(42, 34, 20, 3);
        g.generateTexture('tower_sommelier', 64, 64); g.destroy();

        // Tower thirsty
        g = this.make.graphics({ add: false });
        g.fillStyle(0x33aa33); g.fillCircle(32, 14, 12);
        g.fillStyle(0x33aa33); g.fillRect(20, 26, 24, 28);
        g.fillStyle(0xffcc88); g.fillCircle(32, 14, 8);
        g.lineStyle(3, 0x00ffff);
        g.lineBetween(32, 26, 10, 10); g.lineBetween(32, 26, 54, 10);
        g.lineBetween(32, 26, 10, 50); g.lineBetween(32, 26, 54, 50);
        g.generateTexture('tower_thirsty', 64, 64); g.destroy();

        // Tower uncle
        g = this.make.graphics({ add: false });
        g.fillStyle(0xaa5500); g.fillCircle(32, 16, 14);
        g.fillStyle(0xaa5500); g.fillRect(16, 30, 32, 28);
        g.fillStyle(0xffcc88); g.fillCircle(32, 16, 10);
        g.fillStyle(0x886633); g.fillRect(22, 4, 20, 6);
        g.fillStyle(0xff8800); g.fillRect(46, 36, 14, 5);
        g.generateTexture('tower_uncle', 64, 64); g.destroy();

        // Background tile
        g = this.make.graphics({ add: false });
        g.fillStyle(0x3d2817); g.fillRect(0, 0, 64, 64);
        g.lineStyle(1, 0x2a1a0e, 0.5); g.strokeRect(0, 0, 64, 64);
        g.lineStyle(1, 0x4a3020, 0.3);
        g.lineBetween(0, 32, 64, 32); g.lineBetween(32, 0, 32, 64);
        g.generateTexture('bg_tile', 64, 64); g.destroy();
    }

    // ============ CREATE ============
    create() {
        this.add.tileSprite(FULL_W / 2, FULL_H / 2, FULL_W, FULL_H, 'bg_tile');

        this.drawGrid(0, HALF_W);
        this.drawGrid(HALF_W, FULL_W);

        // Divisória central
        let divider = this.add.graphics();
        divider.fillStyle(0x000000, 1);
        divider.fillRect(HALF_W - 3, 0, 6, FULL_H);
        divider.setDepth(10);

        // Caminhos
        this.pathP1 = this.createPath(0, HALF_W);
        this.pathP2 = this.createPath(HALF_W, FULL_W);

        // Jogadores
        this.p1 = new Player(1);
        this.p2 = new Player(2);

        // Entidades
        this.towers = [];
        this.drinksP1 = [];
        this.drinksP2 = [];

        // Estado
        this.gameState = 'PREPARATION';
        this.prepTimeLeft = PREP_TIME;
        this.lastEconomyTick = 0;
        this.gameOver = false;

        // Timer de preparação
        this.time.addEvent({
            delay: 1000,
            callback: () => {
                if (this.gameState === 'PREPARATION') {
                    this.prepTimeLeft--;
                    if (this.prepTimeLeft <= 0) {
                        this.gameState = 'WAVE';
                        this.lastEconomyTick = this.time.now;
                    }
                }
            },
            loop: true
        });

        this.setupInput();
        this.createHUD();
    }

    // ============ GRID ============
    drawGrid(startX, endX) {
        let g = this.add.graphics();
        g.lineStyle(1, 0xffffff, 0.06);
        for (let x = startX; x <= endX; x += CELL) {
            g.lineBetween(x, HUD_HEIGHT, x, FULL_H);
        }
        for (let y = HUD_HEIGHT; y <= FULL_H; y += CELL) {
            g.lineBetween(startX, y, endX, y);
        }
    }

    // ============ CAMINHOS ============
    createPath(startX, endX) {
        const w = endX - startX;
        const midX = startX + w / 2;
        const margin = 128;

        let path = new Phaser.Curves.Path(midX, HUD_HEIGHT);
        path.lineTo(midX, HUD_HEIGHT + 120);
        path.lineTo(startX + margin, HUD_HEIGHT + 120);
        path.lineTo(startX + margin, 560);
        path.lineTo(endX - margin, 560);
        path.lineTo(endX - margin, 860);
        path.lineTo(midX, 860);
        path.lineTo(midX, FULL_H);

        let g = this.add.graphics();
        g.lineStyle(50, 0x555555, 0.3);
        path.draw(g);
        g.setDepth(1);

        let g2 = this.add.graphics();
        g2.lineStyle(2, 0x777777, 0.2);
        path.draw(g2);
        g2.setDepth(2);

        return path;
    }

    // ============ INPUT ============
    setupInput() {
        this.p1Keys = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            action: Phaser.Input.Keyboard.KeyCodes.SPACE,
        });

        this.p2Keys = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.UP,
            down: Phaser.Input.Keyboard.KeyCodes.DOWN,
            left: Phaser.Input.Keyboard.KeyCodes.LEFT,
            right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
            action: Phaser.Input.Keyboard.KeyCodes.ENTER,
        });

        // Teclas para Trocar Unidades / Bebidas e Atacar
        this.input.keyboard.on('keydown', (event) => {
            if (this.gameOver) return;

            // P1: Q = Trocar Torre, E = Trocar Bebida
            if (event.code === 'KeyQ') this.p1.cycleTower();
            if (event.code === 'KeyE') this.p1.cycleDrink();

            // P2: Comma (,) / K = Trocar Torre, Period (.) / L = Trocar Bebida
            if (event.code === 'Comma' || event.code === 'KeyK') this.p2.cycleTower();
            if (event.code === 'Period' || event.code === 'KeyL') this.p2.cycleDrink();

            // CTRL para ataque
            if (event.code === 'ControlLeft') {
                event.preventDefault();
                this.handleAttack(this.p1, this.p2, this.drinksP2, this.pathP2);
            }
            if (event.code === 'ControlRight') {
                event.preventDefault();
                this.handleAttack(this.p2, this.p1, this.drinksP1, this.pathP1);
            }
        });

        // Cursores visuais
        this.p1Cursor = this.add.graphics();
        this.p2Cursor = this.add.graphics();
        this.p1Cursor.setDepth(50);
        this.p2Cursor.setDepth(50);

        this.p1LastMove = 0;
        this.p2LastMove = 0;
        this.moveDelay = 110;
    }

    drawCursor(gfx, x, y, color) {
        gfx.clear();
        gfx.lineStyle(4, color, 1);
        gfx.strokeRect(x + 2, y + 2, CELL - 4, CELL - 4);
        const c = 12;
        gfx.lineStyle(3, 0xffffff, 0.9);
        gfx.lineBetween(x + 2, y + 2, x + c, y + 2);
        gfx.lineBetween(x + 2, y + 2, x + 2, y + c);
        gfx.lineBetween(x + CELL - 2, y + 2, x + CELL - c, y + 2);
        gfx.lineBetween(x + CELL - 2, y + 2, x + CELL - 2, y + c);
        gfx.lineBetween(x + 2, y + CELL - 2, x + c, y + CELL - 2);
        gfx.lineBetween(x + 2, y + CELL - 2, x + 2, y + CELL - c);
        gfx.lineBetween(x + CELL - 2, y + CELL - 2, x + CELL - c, y + CELL - 2);
        gfx.lineBetween(x + CELL - 2, y + CELL - 2, x + CELL - 2, y + CELL - c);
    }

    handleMovement(keys, player, lastKey, minX, maxX, time) {
        if (time <= this[lastKey] + this.moveDelay) return;
        let moved = false;
        if (keys.left.isDown && player.cursorX - CELL >= minX) { player.cursorX -= CELL; moved = true; }
        else if (keys.right.isDown && player.cursorX + CELL < maxX) { player.cursorX += CELL; moved = true; }
        else if (keys.up.isDown && player.cursorY - CELL >= HUD_HEIGHT) { player.cursorY -= CELL; moved = true; }
        else if (keys.down.isDown && player.cursorY + CELL <= FULL_H - CELL) { player.cursorY += CELL; moved = true; }
        if (moved) this[lastKey] = time;
    }

    // ============ CONSTRUIR / VENDER ============
    handleBuildOrSell(player) {
        if (this.gameOver) return;
        const cx = player.cursorX;
        const cy = player.cursorY;

        const idx = this.towers.findIndex(t => t.gridX === cx && t.gridY === cy && t.active);
        if (idx !== -1) {
            // Vender por metade do custo da torre
            const tower = this.towers[idx];
            const refund = Math.floor((TOWER_TYPES[tower.type]?.cost || 50) / 2);
            tower.sprite.destroy();
            tower.rangeGfx.destroy();
            tower.active = false;
            player.addTips(refund);
            this.showFloatingText(cx + 32, cy, `+$${refund}`, 0x55ff55);
        } else {
            // Comprar a torre atualmente selecionada
            const selectedType = player.getSelectedTower();
            const cost = TOWER_TYPES[selectedType].cost;
            if (player.spendTips(cost)) {
                this.placeTower(player, cx, cy, selectedType);
                this.showFloatingText(cx + 32, cy, `-$${cost}`, 0xff5555);
            }
        }
    }

    placeTower(player, gx, gy, type) {
        const info = TOWER_TYPES[type];
        const cx = gx + CELL / 2;
        const cy = gy + CELL / 2;
        const texKey = 'tower_' + type;

        const sprite = this.add.sprite(cx, cy, texKey);
        sprite.setDisplaySize(CELL - 4, CELL - 4);
        sprite.setDepth(20);

        const rangeGfx = this.add.graphics();
        rangeGfx.lineStyle(1, 0xffffff, 0.12);
        rangeGfx.strokeCircle(cx, cy, info.range);
        rangeGfx.setDepth(5);

        this.towers.push({
            sprite, rangeGfx,
            gridX: gx, gridY: gy,
            cx, cy,
            type, playerId: player.id,
            range: info.range, fireRate: info.fireRate, damage: info.damage,
            lastFired: 0, active: true,
        });
    }

    // ============ ATAQUE (CTRL) ============
    handleAttack(attacker, defender, targetDrinkList, targetPath) {
        if (this.gameOver) return;
        if (this.gameState !== 'WAVE') return;

        const selectedDrink = attacker.getSelectedDrink();
        const info = DRINK_TYPES[selectedDrink];
        const cost = info.cost;
        const incomeBonus = Math.max(1, Math.floor(cost / 10));

        if (attacker.spendTips(cost)) {
            this.spawnDrink(targetPath, selectedDrink, defender.id, targetDrinkList);
            attacker.increasePopularity(incomeBonus);
            this.showFloatingText(
                attacker.id === 1 ? 200 : HALF_W + 200,
                HUD_HEIGHT + 20,
                `${info.name} enviada! (+${incomeBonus} Renda)`,
                0xffbb00
            );
        }
    }

    // ============ SPAWN DRINK ============
    spawnDrink(path, type, targetPlayerId, drinkList) {
        const info = DRINK_TYPES[type];
        const startPoint = path.getStartPoint();

        const follower = this.add.follower(path, startPoint.x, startPoint.y, type);
        follower.setDisplaySize(32, 32);
        follower.setDepth(30);

        const drinkObj = {
            follower,
            type,
            hp: info.hp,
            damage: info.damage,
            reward: info.reward,
            targetPlayerId,
            active: true,
        };

        follower.startFollow({
            duration: info.speed,
            rotateToPath: false,
            startAt: 0,
            positionOnPath: true,
            onComplete: () => {
                if (drinkObj.active) {
                    this.drinkReachEnd(drinkObj);
                }
            }
        });

        drinkList.push(drinkObj);
    }

    drinkReachEnd(drink) {
        if (!drink.active) return;
        drink.active = false;

        const target = drink.targetPlayerId === 1 ? this.p1 : this.p2;
        const isOver = target.takeDamage(drink.damage);

        this.showFloatingText(drink.follower.x, drink.follower.y, `+${drink.damage} Embriaguez!`, 0xff0000);
        drink.follower.destroy();

        if (isOver) this.triggerGameOver(drink.targetPlayerId);
    }

    // ============ TORRES ATACAM ============
    updateTowers(time) {
        for (const tower of this.towers) {
            if (!tower.active) continue;
            if (time < tower.lastFired + tower.fireRate) continue;

            const drinks = tower.cx < HALF_W ? this.drinksP1 : this.drinksP2;
            let bestDrink = null;
            let bestDist = tower.range;

            for (const d of drinks) {
                if (!d.active) continue;
                const dist = Phaser.Math.Distance.Between(tower.cx, tower.cy, d.follower.x, d.follower.y);
                if (dist <= bestDist) {
                    bestDist = dist;
                    bestDrink = d;
                }
            }

            if (bestDrink) {
                tower.lastFired = time;
                this.towerFire(tower, bestDrink);
            }
        }
    }

    towerFire(tower, drink) {
        let line = this.add.graphics();
        line.setDepth(35);
        line.lineStyle(3, 0x00eeff, 0.9);
        line.lineBetween(tower.cx, tower.cy, drink.follower.x, drink.follower.y);

        this.tweens.add({
            targets: line,
            alpha: 0,
            duration: 120,
            onComplete: () => line.destroy()
        });

        drink.hp -= tower.damage;

        this.tweens.add({
            targets: drink.follower,
            scaleX: 0.3, scaleY: 0.3,
            duration: 60, yoyo: true,
        });

        if (drink.hp <= 0) {
            drink.active = false;
            const defender = tower.playerId === 1 ? this.p1 : this.p2;
            defender.addTips(drink.reward);
            this.showFloatingText(drink.follower.x, drink.follower.y, `+$${drink.reward}`, 0x55ff55);
            this.showExplosion(drink.follower.x, drink.follower.y);
            drink.follower.destroy();
        }
    }

    showExplosion(x, y) {
        for (let i = 0; i < 8; i++) {
            const particle = this.add.circle(
                x, y,
                Phaser.Math.Between(3, 8),
                Phaser.Math.Between(0xffaa00, 0xffff00)
            );
            particle.setDepth(40);
            this.tweens.add({
                targets: particle,
                x: x + Phaser.Math.Between(-60, 60),
                y: y + Phaser.Math.Between(-60, 60),
                alpha: 0, scale: 0,
                duration: Phaser.Math.Between(200, 400),
                onComplete: () => particle.destroy()
            });
        }
    }

    // ============ FLOATING TEXT ============
    showFloatingText(x, y, text, color) {
        const hex = '#' + color.toString(16).padStart(6, '0');
        const txt = this.add.text(x, y, text, {
            fontSize: '22px', fill: hex, fontFamily: 'monospace', fontStyle: 'bold',
            stroke: '#000000', strokeThickness: 5,
        }).setOrigin(0.5).setDepth(100);

        this.tweens.add({
            targets: txt,
            y: y - 55, alpha: 0,
            duration: 1200,
            onComplete: () => txt.destroy()
        });
    }

    // ============ GAME OVER ============
    triggerGameOver(loserId) {
        this.gameOver = true;
        const winner = loserId === 1 ? 'JOGADOR 2' : 'JOGADOR 1';

        this.add.rectangle(FULL_W / 2, FULL_H / 2, FULL_W, FULL_H, 0x000000, 0.75).setDepth(200);

        this.add.text(FULL_W / 2, FULL_H / 2 - 60, `${winner} VENCEU!`, {
            fontSize: '72px', fill: '#ffcc00', fontFamily: 'monospace', fontStyle: 'bold',
            stroke: '#000', strokeThickness: 8,
        }).setOrigin(0.5).setDepth(201);

        this.add.text(FULL_W / 2, FULL_H / 2 + 40, 'Pressione R para reiniciar', {
            fontSize: '32px', fill: '#ffffff', fontFamily: 'monospace',
            stroke: '#000', strokeThickness: 4,
        }).setOrigin(0.5).setDepth(201);

        this.input.keyboard.once('keydown-R', () => this.scene.restart());
    }

    // ============ HUD ============
    createHUD() {
        const fs = { fontSize: '22px', fill: '#ffffff', fontFamily: 'monospace', fontStyle: 'bold', stroke: '#000', strokeThickness: 4 };
        this.hudBg = this.add.graphics().setDepth(80);

        // ---- JOGADOR 1 (canto esquerdo) ----
        this.p1Title = this.add.text(16, 6, 'JOGADOR 1', { ...fs, fontSize: '26px', fill: '#ffdd44' }).setDepth(81);
        this.p1TipsText = this.add.text(16, 36, '', { ...fs, fill: '#ffff55' }).setDepth(81);
        this.p1IncomeText = this.add.text(16, 64, '', { ...fs, fill: '#55ff55' }).setDepth(81);
        this.p1HealthLabel = this.add.text(16, 94, 'Embriaguez:', { ...fs, fontSize: '20px', fill: '#ff8888' }).setDepth(81);
        this.p1SelectText = this.add.text(16, 122, '', { ...fs, fontSize: '18px', fill: '#00ffff' }).setDepth(81);
        this.p1CtrlText = this.add.text(16, 148, '[Q]Torre | [E]Bebida | ESPAÇO=Construir | CTRL=Atacar', { ...fs, fontSize: '14px', fill: '#cccccc' }).setDepth(81);

        // ---- TIMER CENTRAL ----
        this.timerText = this.add.text(FULL_W / 2, 30, '', {
            fontSize: '38px', fill: '#00ffff', fontFamily: 'monospace', fontStyle: 'bold',
            stroke: '#000', strokeThickness: 6,
        }).setOrigin(0.5).setDepth(82);
        this.timerSubText = this.add.text(FULL_W / 2, 72, '', {
            fontSize: '16px', fill: '#cccccc', fontFamily: 'monospace',
            stroke: '#000', strokeThickness: 3,
        }).setOrigin(0.5).setDepth(82);

        // ---- JOGADOR 2 (canto direito) ----
        const p2X = FULL_W - 16;
        this.p2Title = this.add.text(p2X, 6, 'JOGADOR 2', { ...fs, fontSize: '26px', fill: '#44ddff' }).setOrigin(1, 0).setDepth(81);
        this.p2TipsText = this.add.text(p2X, 36, '', { ...fs, fill: '#ffff55' }).setOrigin(1, 0).setDepth(81);
        this.p2IncomeText = this.add.text(p2X, 64, '', { ...fs, fill: '#55ff55' }).setOrigin(1, 0).setDepth(81);
        this.p2HealthLabel = this.add.text(p2X, 94, 'Embriaguez:', { ...fs, fontSize: '20px', fill: '#ff8888' }).setOrigin(1, 0).setDepth(81);
        this.p2SelectText = this.add.text(p2X, 122, '', { ...fs, fontSize: '18px', fill: '#00ffff' }).setOrigin(1, 0).setDepth(81);
        this.p2CtrlText = this.add.text(p2X, 148, '[,]Torre | [.]Bebida | ENTER=Construir | CTRL=Atacar', { ...fs, fontSize: '14px', fill: '#cccccc' }).setOrigin(1, 0).setDepth(81);

        // Health bar graphics
        this.healthGfx = this.add.graphics().setDepth(81);
    }

    updateHUD() {
        // Fundo
        this.hudBg.clear();
        this.hudBg.fillStyle(0x0a0a0a, 0.94);
        this.hudBg.fillRect(0, 0, FULL_W, HUD_HEIGHT);
        this.hudBg.lineStyle(2, 0x555555, 1);
        this.hudBg.lineBetween(0, HUD_HEIGHT, FULL_W, HUD_HEIGHT);
        this.hudBg.lineBetween(HALF_W, 0, HALF_W, HUD_HEIGHT);

        // P1 Textos
        this.p1TipsText.setText(`Gorjetas: $${this.p1.tips}`);
        this.p1IncomeText.setText(`Renda: +$${this.p1.popularity}/tick`);

        const p1T = TOWER_TYPES[this.p1.getSelectedTower()];
        const p1D = DRINK_TYPES[this.p1.getSelectedDrink()];
        this.p1SelectText.setText(`[Q] Torre: ${p1T.name} ($${p1T.cost})  |  [E] Envio: ${p1D.name} ($${p1D.cost})`);

        // P2 Textos
        this.p2TipsText.setText(`Gorjetas: $${this.p2.tips}`);
        this.p2IncomeText.setText(`Renda: +$${this.p2.popularity}/tick`);

        const p2T = TOWER_TYPES[this.p2.getSelectedTower()];
        const p2D = DRINK_TYPES[this.p2.getSelectedDrink()];
        this.p2SelectText.setText(`[,] Torre: ${p2T.name} ($${p2T.cost})  |  [.] Envio: ${p2D.name} ($${p2D.cost})`);

        // Health bars
        this.healthGfx.clear();
        this.drawHealthBar(170, 96, this.p1.drunkenness);
        this.drawHealthBar(FULL_W - 16 - 220, 96, this.p2.drunkenness);

        // Timer
        if (this.gameState === 'PREPARATION') {
            this.timerText.setText(`PREPARAÇÃO ${this.prepTimeLeft}s`);
            this.timerText.setFill('#00ffff');
            this.timerSubText.setText('Posicione suas torres!');
        } else {
            this.timerText.setText('⚔ WAVE ATIVA ⚔');
            this.timerText.setFill('#ff5555');
            this.timerSubText.setText('CTRL para enviar bebidas!');
        }
    }

    drawHealthBar(x, y, drunkenness) {
        const barW = 200;
        const barH = 20;
        this.healthGfx.fillStyle(0x222222, 1);
        this.healthGfx.fillRect(x, y, barW, barH);
        const pct = Math.min(drunkenness / MAX_DRUNK, 1);
        const color = pct < 0.5 ? 0x44ff44 : pct < 0.8 ? 0xffaa00 : 0xff2222;
        if (pct > 0) {
            this.healthGfx.fillStyle(color, 1);
            this.healthGfx.fillRect(x, y, barW * pct, barH);
        }
        this.healthGfx.lineStyle(2, 0x888888, 1);
        this.healthGfx.strokeRect(x, y, barW, barH);
    }

    // ============ ECONOMIA ============
    updateEconomy(time) {
        if (this.gameState !== 'WAVE') return;
        if (time > this.lastEconomyTick + ECONOMY_TICK) {
            this.p1.applyTick();
            this.p2.applyTick();
            this.lastEconomyTick = time;
        }
    }

    // ============ CLEANUP ============
    cleanupInactive() {
        this.drinksP1 = this.drinksP1.filter(d => d.active);
        this.drinksP2 = this.drinksP2.filter(d => d.active);
        this.towers = this.towers.filter(t => t.active);
    }

    // ============ UPDATE LOOP ============
    update(time, delta) {
        if (this.gameOver) return;

        // Movimento
        this.handleMovement(this.p1Keys, this.p1, 'p1LastMove', 0, HALF_W, time);
        this.handleMovement(this.p2Keys, this.p2, 'p2LastMove', HALF_W, FULL_W, time);

        // Ação construir/vender
        if (Phaser.Input.Keyboard.JustDown(this.p1Keys.action)) this.handleBuildOrSell(this.p1);
        if (Phaser.Input.Keyboard.JustDown(this.p2Keys.action)) this.handleBuildOrSell(this.p2);

        // Cursores
        this.drawCursor(this.p1Cursor, this.p1.cursorX, this.p1.cursorY, 0xffff00);
        this.drawCursor(this.p2Cursor, this.p2.cursorX, this.p2.cursorY, 0x00ffff);

        // Torres
        this.updateTowers(time);

        // Economia
        this.updateEconomy(time);

        // HUD
        this.updateHUD();

        // Cleanup a cada ~2s
        this._cleanupTimer = (this._cleanupTimer || 0) + delta;
        if (this._cleanupTimer > 2000) {
            this.cleanupInactive();
            this._cleanupTimer = 0;
        }
    }
}
