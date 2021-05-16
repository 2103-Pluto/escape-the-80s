import Phaser from 'phaser'

export default class ControlsScene extends Phaser.Scene {
  constructor() {
    super('ControlsScene');
  }

  preload() {

  }

  create() {

    this.sound.pauseOnBlur = false; //prevent sound from cutting when you leave tab

    const width = this.game.config.width;
    const height = this.game.config.height;

    const backgroundImage = this.add.image(width*0.5, height*0.5, "title-background").setOrigin(0.5, 0.5).setScale(1.2);
    backgroundImage.alpha = 0.1;

    //addd text
    this.add.text(width*0.5, height*0.2, 'CONTROLS', { fontFamily: '"Press Start 2P"' }).setFontSize(28).setOrigin(0.5, 0.5).setColor('#ED6BF3')
    this.add.text(width*0.15, height*0.34, 'Run right --- Right Arrow', { fontFamily: '"Press Start 2P"' }).setFontSize(24).setOrigin(0, 0.5)
    this.add.text(width*0.15, height*0.45, 'Run left ---- Left Arrow', { fontFamily: '"Press Start 2P"' }).setFontSize(24).setOrigin(0, 0.5)
    this.add.text(width*0.15, height*0.56, 'Jump -------- Up Arrow', { fontFamily: '"Press Start 2P"' }).setFontSize(24).setOrigin(0, 0.5)
    this.add.text(width*0.15, height*0.67, 'Crouch ------ Down Arrow', { fontFamily: '"Press Start 2P"' }).setFontSize(24).setOrigin(0, 0.5)
    this.add.text(width*0.15, height*0.78, 'Shoot ------- Space Bar', { fontFamily: '"Press Start 2P"' }).setFontSize(24).setOrigin(0, 0.5)
    this.add.text(width*0.15, height*0.89, 'Pause ------- p', { fontFamily: '"Press Start 2P"' }).setFontSize(24).setOrigin(0, 0.5)

    this.scene.get('CreditsScene').createBack(this, 'MainMenuScene');
  }
}
