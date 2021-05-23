import Phaser from "phaser";

export default class WaitingforPlayer extends Phaser.Scene {
  constructor() {
    super("WaitingforPlayer");
    
  }
    create(){
        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;
        this.waiting = this.add.text(screenCenterX, screenCenterY, 'Waiting for Second Player', { fontFamily: '"Press Start 2P"' }).setFontSize(20).setOrigin(0.5).setColor('#feff38')
    }
}