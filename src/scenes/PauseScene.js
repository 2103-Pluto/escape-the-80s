import Phaser from 'phaser'

export default class PauseScene extends Phaser.Scene {
  constructor() {
    super('PauseScene');
  }

  init(data) {
    this.previousScene = data.previousScene //retrieve previousScene
  }

  create() {
    this.width = this.game.config.width;
    this.height = this.game.config.height;
    this.pauseSound = this.sound.add('pause')
    this.pauseSound.volume = 0.03;


    //add text
    this.add.text(this.width*0.5, this.height*0.5, 'PAUSED', { fontFamily: '"Press Start 2P"' }).setFontSize(32).setOrigin(0.5)
    //listen for P
    this.input.keyboard.on('keydown-P', () => {
      this.scene.stop()
      this.pauseSound.play()
      this.previousScene.scene.resume();
      this.previousScene.backgroundSound.resume()
    })
  }
}
