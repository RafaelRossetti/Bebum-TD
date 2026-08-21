export default class Player {
    constructor(id) {
        this.id = id; // 1 ou 2
        this.drunkenness = 0; // Embriaguez: limite 20
        this.maxDrunkenness = 20;
        this.tips = 150; // Dinheiro inicial
        this.popularity = 10; // Renda por tick
        
        // Seleção de Unidades e Bebidas
        this.towerTypes = ['student', 'sommelier', 'thirsty', 'uncle'];
        this.selectedTowerIndex = 0;

        this.drinkTypes = ['beer', 'tequila', 'flaming', 'jug'];
        this.selectedDrinkIndex = 0;

        // Posição inicial do cursor no grid (alinhado ao grid de 64)
        this.cursorX = this.id === 1 ? 448 : 1408;
        this.cursorY = 512; // abaixo da HUD (>= 192)
    }

    cycleTower() {
        this.selectedTowerIndex = (this.selectedTowerIndex + 1) % this.towerTypes.length;
    }

    cycleDrink() {
        this.selectedDrinkIndex = (this.selectedDrinkIndex + 1) % this.drinkTypes.length;
    }

    getSelectedTower() {
        return this.towerTypes[this.selectedTowerIndex];
    }

    getSelectedDrink() {
        return this.drinkTypes[this.selectedDrinkIndex];
    }

    takeDamage(damage) {
        this.drunkenness += damage;
        if (this.drunkenness >= this.maxDrunkenness) {
            this.drunkenness = this.maxDrunkenness;
            return true; // game over
        }
        return false;
    }

    addTips(amount) {
        this.tips += amount;
    }

    spendTips(amount) {
        if (this.tips >= amount) {
            this.tips -= amount;
            return true;
        }
        return false;
    }

    increasePopularity(amount) {
        this.popularity += amount;
    }

    applyTick() {
        this.tips += this.popularity;
    }
}
