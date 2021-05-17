import Phaser from 'phaser'

export default class HighScoresScene extends Phaser.Scene {
  constructor() {
    super('HighScoresScene');
  }

  create() {
    this.sound.pauseOnBlur = false; //prevent sound from cutting when you leave tab

    const width = this.game.config.width;
    const height = this.game.config.height;

    const backgroundImage = this.add.image(width*0.5, height*0.5, "title-background").setOrigin(0.5, 0.5).setScale(1.2);
    backgroundImage.alpha = 0.1;

    //add text
    this.add.text(width*0.5, height*0.2, 'HIGH SCORES', { fontFamily: '"Press Start 2P"' }).setFontSize(28).setOrigin(0.5, 0.5).setColor('#ED6BF3')

    this.add.text(width*0.5, height*0.5, 'High Scores Will Go Here', { fontFamily: '"Press Start 2P"' }).setFontSize(28).setOrigin(0.5, 0.5)

    this.scene.get('CreditsScene').createBack(this, 'MainMenuScene'); //Going back
  }
}
