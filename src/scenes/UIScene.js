import Phaser from 'phaser';

export default class UIScene extends Phaser.Scene {
    constructor() {
        super('UIScene');
    }

    create() {
        const width = 1920;
        
        let bg = this.add.graphics();
        bg.fillStyle(0x000000, 0.85);
        bg.fillRect(0, 0, width, 140);
        bg.lineStyle(4, 0xffffff, 1);
        bg.strokeRect(0, 0, width, 140);

        const fontStyle = { fontSize: '24px', fill: '#ffffff', fontFamily: 'monospace', fontStyle: 'bold' };
        const smallFontStyle = { fontSize: '16px', fill: '#cccccc', fontFamily: 'monospace' };

        this.timerText = this.add.text(width / 2, 40, 'PREPARAÇÃO: 30', { fontSize: '48px', fill: '#ffff00', fontFamily: 'monospace', fontStyle: 'bold' }).setOrigin(0.5);
        this.add.text(width / 2, 90, '(Bebidas liberadas apenas na Wave)', { fontSize: '18px', fill: '#aaaaaa', fontFamily: 'monospace' }).setOrigin(0.5);
        
        // P1
        this.add.text(20, 10, 'JOGADOR 1 (Esquerda)', fontStyle);
        this.p1GorjetasText = this.add.text(20, 50, 'Gorjetas: $100', { ...fontStyle, fill: '#ffff55' });
        this.p1RendaText = this.add.text(20, 80, 'Renda: +$10', { ...fontStyle, fill: '#55ff55' });
        
        this.add.text(20, 110, 'Vida:', fontStyle);
        this.p1HealthBg = this.add.graphics();
        this.p1HealthBar = this.add.graphics();

        this.add.text(320, 10, 'Controles J1:', smallFontStyle);
        this.add.text(320, 30, 'Move: W, A, S, D', smallFontStyle);
        this.add.text(320, 50, 'Construir ($50) / Vender ($25): ESPAÇO', smallFontStyle);
        this.add.text(320, 70, 'Enviar Cerveja ($20): CTRL ESQ', smallFontStyle);

        // P2
        const p2Offset = 1000;
        this.add.text(p2Offset, 10, 'JOGADOR 2 (Direita)', fontStyle);
        this.p2GorjetasText = this.add.text(p2Offset, 50, 'Gorjetas: $100', { ...fontStyle, fill: '#ffff55' });
        this.p2RendaText = this.add.text(p2Offset, 80, 'Renda: +$10', { ...fontStyle, fill: '#55ff55' });

        this.add.text(p2Offset, 110, 'Vida:', fontStyle);
        this.p2HealthBg = this.add.graphics();
        this.p2HealthBar = this.add.graphics();

        this.add.text(p2Offset + 320, 10, 'Controles J2:', smallFontStyle);
        this.add.text(p2Offset + 320, 30, 'Move: SETAS', smallFontStyle);
        this.add.text(p2Offset + 320, 50, 'Construir ($50) / Vender ($25): ENTER', smallFontStyle);
        this.add.text(p2Offset + 320, 70, 'Enviar Cerveja ($20): CTRL DIR', smallFontStyle);
        
        this.drawHealthBars(0, 0);
    }

    drawHealthBars(drunkennessP1, drunkennessP2) {
        this.p1HealthBg.clear();
        this.p1HealthBg.fillStyle(0x333333, 1);
        this.p1HealthBg.fillRect(100, 112, 200, 20);
        
        this.p1HealthBar.clear();
        const p1Percent = Math.min(drunkennessP1 / 20, 1);
        this.p1HealthBar.fillStyle(0xff0000, 1);
        this.p1HealthBar.fillRect(100, 112, 200 * p1Percent, 20);

        const p2Offset = 1000;
        this.p2HealthBg.clear();
        this.p2HealthBg.fillStyle(0x333333, 1);
        this.p2HealthBg.fillRect(p2Offset + 100, 112, 200, 20);
        
        this.p2HealthBar.clear();
        const p2Percent = Math.min(drunkennessP2 / 20, 1);
        this.p2HealthBar.fillStyle(0xff0000, 1);
        this.p2HealthBar.fillRect(p2Offset + 100, 112, 200 * p2Percent, 20);
    }

    updateUI(p1, p2, gameState, timeRemaining) {
        if (!p1 || !p2) return;
        
        this.p1GorjetasText.setText(`Gorjetas: $${p1.tips}`);
        this.p1RendaText.setText(`Renda: +$${p1.popularity}`);
        this.p2GorjetasText.setText(`Gorjetas: $${p2.tips}`);
        this.p2RendaText.setText(`Renda: +$${p2.popularity}`);

        this.drawHealthBars(p1.drunkenness, p2.drunkenness);

        if (gameState === 'PREPARATION') {
            this.timerText.setText(`PREPARAÇÃO: ${timeRemaining}s`);
            this.timerText.setFill('#00ffff');
        } else {
            this.timerText.setText(`WAVE INICIADA!`);
            this.timerText.setFill('#ff5555');
        }
    }
}
