import Phaser from 'phaser';

export default class Drink extends Phaser.GameObjects.PathFollower {
    constructor(scene, path, x, y, texture, type, targetPlayerId) {
        super(scene, path, x, y, texture);
        
        this.scene.add.existing(this);
        this.type = type; // 'beer', 'tequila', 'jug', 'flaming'
        this.targetPlayerId = targetPlayerId;
        
        // Define propriedades baseado no tipo
        switch(type) {
            case 'beer':
                this.hp = 2; // Quantidade de goles para secar
                this.damage = 1; // Pontos de embriaguez causados
                this.speed = 10000; // Tempo para percorrer o caminho (ms)
                break;
            case 'tequila':
                this.hp = 1;
                this.damage = 1;
                this.speed = 5000;
                break;
            case 'jug':
                this.hp = 10;
                this.damage = 5;
                this.speed = 18000;
                break;
            case 'flaming':
                this.hp = 5;
                this.damage = 3;
                this.speed = 8000;
                break;
        }

        // Inicia o movimento
        this.startFollow({
            duration: this.speed,
            onComplete: () => this.reachEnd()
        });
    }

    takeDamage(amount) {
        this.hp -= amount;
        
        // Efeito visual (piscar e escalar levemente)
        this.scene.tweens.add({
            targets: this,
            scaleX: 0.8,
            scaleY: 0.8,
            duration: 50,
            yoyo: true
        });

        if (this.hp <= 0) {
            this.die();
        }
    }

    die() {
        // Explode partículas
        const particles = this.scene.add.particles(this.x, this.y, this.texture.key, {
            speed: 100,
            scale: { start: 0.5, end: 0 },
            lifespan: 300,
            blendMode: 'ADD'
        });
        particles.explode(10);
        
        this.destroy(); // Remove o inimigo
    }

    reachEnd() {
        // Bebida chegou no fim do bar
        this.scene.events.emit('drinkReachedEnd', { playerId: this.targetPlayerId, damage: this.damage });
        this.destroy();
    }
}
