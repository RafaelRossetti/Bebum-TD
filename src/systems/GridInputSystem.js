import Phaser from 'phaser';

export default class GridInputSystem {
    constructor(scene, player1, player2) {
        this.scene = scene;
        this.p1 = player1;
        this.p2 = player2;
        
        this.p1Keys = this.scene.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            action: Phaser.Input.Keyboard.KeyCodes.SPACE
        });
        
        this.p2Keys = this.scene.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.UP,
            down: Phaser.Input.Keyboard.KeyCodes.DOWN,
            left: Phaser.Input.Keyboard.KeyCodes.LEFT,
            right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
            action: Phaser.Input.Keyboard.KeyCodes.ENTER
        });
        
        // Mapear os controles nativos de ControlLeft e ControlRight para enviar ataques
        this.scene.input.keyboard.on('keydown', (event) => {
            if (event.code === 'ControlLeft') {
                this.scene.events.emit('p1Attack');
            } else if (event.code === 'ControlRight') {
                this.scene.events.emit('p2Attack');
            }
        });

        this.cellSize = 64;
        const offset = this.cellSize / 2;
        
        this.p1CursorVisual = this.scene.add.rectangle(this.p1.cursorX + offset, this.p1.cursorY + offset, this.cellSize, this.cellSize, 0xffff00, 0.5);
        this.p2CursorVisual = this.scene.add.rectangle(this.p2.cursorX + offset, this.p2.cursorY + offset, this.cellSize, this.cellSize, 0x00ffff, 0.5);
        
        this.p1LastMove = 0;
        this.p2LastMove = 0;
        this.moveDelay = 120; // ligeiramente mais rápido
    }

    update(time) {
        this.handleMovement(this.p1Keys, this.p1, this.p1CursorVisual, 0, 960, time, 'p1LastMove');
        this.handleMovement(this.p2Keys, this.p2, this.p2CursorVisual, 960, 1920, time, 'p2LastMove');
        
        if (Phaser.Input.Keyboard.JustDown(this.p1Keys.action)) {
            this.scene.events.emit('p1Action', { x: this.p1.cursorX, y: this.p1.cursorY });
        }
        if (Phaser.Input.Keyboard.JustDown(this.p2Keys.action)) {
            this.scene.events.emit('p2Action', { x: this.p2.cursorX, y: this.p2.cursorY });
        }
    }

    handleMovement(keys, player, cursorVisual, minX, maxX, time, lastMoveKey) {
        if (time > this[lastMoveKey] + this.moveDelay) {
            let moved = false;
            // Impede o cursor de subir para cima da HUD (128 pixels de HUD)
            const minHudY = 128;

            if (keys.left.isDown && player.cursorX > minX) {
                player.cursorX -= this.cellSize;
                moved = true;
            } else if (keys.right.isDown && player.cursorX < maxX - this.cellSize) {
                player.cursorX += this.cellSize;
                moved = true;
            } else if (keys.up.isDown && player.cursorY > minHudY) {
                player.cursorY -= this.cellSize;
                moved = true;
            } else if (keys.down.isDown && player.cursorY < 1080 - this.cellSize) {
                player.cursorY += this.cellSize;
                moved = true;
            }
            
            if (moved) {
                const offset = this.cellSize / 2;
                cursorVisual.setPosition(player.cursorX + offset, player.cursorY + offset);
                this[lastMoveKey] = time;
            }
        }
    }
}
