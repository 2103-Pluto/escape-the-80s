import Phaser from 'phaser'
import WebFontFile from '../files/WebFontFile'

export default class HighScoresScene extends Phaser.Scene {
  constructor() {
    super('HighScoresScene');
  }

  preload() {
    this.load.image("title-background", "assets/backgrounds/title_scene/title-background.png");
    this.load.addFile(new WebFontFile(this.load, 'Press Start 2P'))

    this.load.image("cassette-tape", "assets/sprites/cassette-tape.png")
    this.load.audio("click", "assets/audio/click.wav");
  }

  create() {

    this.sound.pauseOnBlur = false; //prevent sound from cutting when you leave tab

    const width = this.game.config.width;
    const height = this.game.config.height;

    const backgroundImage = this.add.image(width*0.5, height*0.5, "title-background").setOrigin(0.5, 0.5).setScale(1.2);
    backgroundImage.alpha = 0.1;

    //add text
    this.add.text(width*0.5, height*0.5, 'High Scores Will Go Here', { fontFamily: '"Press Start 2P"' }).setFontSize(28).setOrigin(0.5, 0.5)

    this.scene.get('CreditsScene').createBack(this, 'MainMenuScene'); //Going back
  }
}
