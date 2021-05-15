import Phaser from 'phaser'

export default class PauseScene extends Phaser.Scene {
  constructor() {
    super('PauseScene');
  }

  init(data) {
    this.previousScene = data.previousScene //retrieve previousScene
  }

  create() {
    //create variables needed for pausing
    this.width = this.game.config.width;
    this.height = this.game.config.height;
    this.pauseSound = this.sound.add('pause')
    this.pauseSound.volume = 0.03;

    //create hover icon
    this.hoverIcon = this.add.sprite(100, 100, 'cassette-tape').setScale(0.08);
    this.hoverIcon.setVisible(false)
    this.scene.get('MainMenuScene').createClick(this) //add click sound

    //add text for pausing
    this.add.text(this.width*0.5, this.height*0.3, 'PAUSED', { fontFamily: '"Press Start 2P"' }).setFontSize(32).setOrigin(0.5)

    //listen for P
    this.input.keyboard.on('keydown-P', () => {
      this.scene.stop()
      this.pauseSound.play()
      this.previousScene.scene.resume();
      this.previousScene.backgroundSound.resume()
    })
    //create quitting and restarting options
    this.scene.get('GameOverMenuScene').createRestart(this, 0.5, 0.45);
    this.scene.get('GameOverMenuScene').createQuit(this, 0.5, 0.6);
  }
}
