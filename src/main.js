import Phaser from 'phaser';
import GameScene from './scenes/GameScene.js';

const config = {
    type: Phaser.AUTO,
    width: 1920,
    height: 1080,
    parent: 'game-container',
    pixelArt: true,
    backgroundColor: '#1a0e08',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1920,
        height: 1080,
    },
    scene: [GameScene]
};

new Phaser.Game(config);
