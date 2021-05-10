import 'phaser'
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
    this.add.text(width*0.5, height*0.5, 'High scores will Go Here', { fontFamily: '"Press Start 2P"' }).setFontSize(28).setOrigin(0.5, 0.5)

        //add hover icon
        const hoverIcon = this.add.sprite(100, 100, 'cassette-tape');
        hoverIcon.setScale(0.08)
        hoverIcon.setVisible(false);

        //add option to return to menu
        const back = this.add.text(35, 40, 'Go back', { fontFamily: '"Press Start 2P"' }).setFontSize(28).setOrigin(0, 0.5)

        back.setInteractive();
        back.on("pointerover", () => {
          hoverIcon.setVisible(true);
          back.setColor('yellow')
          hoverIcon.x = back.x + back.width + 50;
          hoverIcon.y = back.y;
        })
        back.on("pointerout", () => {
          hoverIcon.setVisible(false);
          back.setColor('white')
        })
        back.on("pointerup", () => {
          const click = this.sound.add('click');
          click.volume = 0.1;
          click.play();
          this.scene.start('MainMenuScene');
        })
  }
}
