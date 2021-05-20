import Phaser from "phaser";

export default class Countdown extends Phaser.Scene {
  constructor() {
    super("Countdown");
    
  }


  create(){
      this.countingDown
  }


  countingDown(){
    this.events.on('resume', () => {
      this.initialTime = 3
      const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
      const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;
      //scene.scene.resume()
      this.countDownText = this.add.text(screenCenterX, screenCenterY, 
        'Start Race in:' + this.initialTime).setOrigin(0.5)
        this.timedEvent = this.time.addEvent({
          delay: 1000,
          callback: this.countDown,
          callbackScope: this,
          loop: true
        })
      })
        
  }


  listenToEvents(){
    const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
    const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;
    
    this.events.on('resume', () => {
      this.initialTime = 3;
      this.countDownText = this.add.text(screenCenterX, screenCenterY, 
          'Start Race in:' + this.initialTime, { fontFamily: '"Press Start 2P"' }).setFontSize(28).setOrigin(0.5)
      this.timedEvent = this.time.addEvent({
        delay: 1000,
        callback: this.countDown,
        callbackScope: this,
        loop: true
      })
    })
  }

  countDown() {
    this.initialTime--;
    this.countDownText.setText('Start Race in:' + this.initialTime);
    if (this.initialTime <= 0) {
      this.countDownText.setText('');
      //scene.resume();
      
      this.timedEvent.remove();
      
    }
  }
}