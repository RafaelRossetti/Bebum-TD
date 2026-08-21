import Phaser from 'phaser';

export default class Drinker extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, type) {
        super(scene, x, y, texture);
        
        this.scene.add.existing(this);
        this.type = type; // 'student', 'sommelier', 'thirsty', 'uncle'
        
        switch(type) {
            case 'student':
                this.range = 150;
                this.fireRate = 800; // ms por gole
                this.damage = 1;
                break;
            case 'sommelier':
                this.range = 400;
                this.fireRate = 2000;
                this.damage = 3;
                break;
            // Podem ser adicionados outros tipos
            default:
                this.range = 150;
                this.fireRate = 800;
                this.damage = 1;
                break;
        }

        this.lastFired = 0;
        
        // Feedback visual do alcance
        this.rangeGraphics = this.scene.add.graphics();
        this.rangeGraphics.lineStyle(1, 0xffffff, 0.2);
        this.rangeGraphics.strokeCircle(this.x, this.y, this.range);
    }

    update(time, drinksGroup) {
        if (time > this.lastFired + this.fireRate) {
            // Acha o alvo mais próximo
            let target = this.findTarget(drinksGroup);
            if (target) {
                this.fire(target);
                this.lastFired = time;
            }
        }
    }

    findTarget(drinksGroup) {
        let closestDrink = null;
        let closestDist = this.range;
        
        drinksGroup.getChildren().forEach(drink => {
            let dist = Phaser.Math.Distance.Between(this.x, this.y, drink.x, drink.y);
            if (dist <= closestDist && drink.active) {
                closestDist = dist;
                closestDrink = drink;
            }
        });
        
        return closestDrink;
    }

    fire(target) {
        // Animação de "sugada" (um raio/linha da torre até a bebida)
        let line = this.scene.add.graphics();
        line.lineStyle(4, 0x00ffff, 0.8);
        line.beginPath();
        line.moveTo(this.x, this.y);
        line.lineTo(target.x, target.y);
        line.strokePath();
        
        this.scene.tweens.add({
            targets: line,
            alpha: 0,
            duration: 150,
            onComplete: () => {
                line.destroy();
            }
        });

        // Aplica dano
        target.takeDamage(this.damage);
    }
}
