export default class EconomySystem {
    constructor(scene, player1, player2) {
        this.scene = scene;
        this.p1 = player1;
        this.p2 = player2;
        
        this.tickRate = 5000; // 5 segundos por tick
        this.lastTick = 0;
    }

    update(time) {
        if (time > this.lastTick + this.tickRate) {
            this.p1.applyTick();
            this.p2.applyTick();
            this.lastTick = time;
            
            // Avisa a UI que a economia atualizou
            this.scene.events.emit('economyUpdate');
        }
    }
}
