import 'phaser'
import WebFontFile from '../files/WebFontFile'

export default class MainMenuScene extends Phaser.Scene {
  constructor() {
    super('MainMenuScene');
  }

  preload() {
    this.load.image("title-background", "assets/backgrounds/title_scene/title-background.png");
    this.load.addFile(new WebFontFile(this.load, 'Press Start 2P'))

    this.load.image("cassette-tape", "assets/sprites/cassette-tape.png");
    this.load.audio("click", "assets/audio/click.wav");
  }

  create() {
    const width = this.game.config.width;
    const height = this.game.config.height;
    //add faded background image
    const backgroundImage = this.add.image(width*0.5, height*0.5, "title-background").setOrigin(0.5, 0.5).setScale(1.2);
    backgroundImage.alpha = 0.1;

    //add text options
    const options = {};
    options['MainScene'] = this.add.text(width*0.3, height*0.3, 'Play', { fontFamily: '"Press Start 2P"' }).setFontSize(32).setOrigin(0, 0.5)

    options['HighScoresScene'] = this.add.text(width*0.3, height*0.45, 'High Scores', { fontFamily: '"Press Start 2P"' }).setFontSize(32).setOrigin(0, 0.5)

    options['CreditsScene'] = this.add.text(width*0.3, height*0.6, 'Credits', { fontFamily: '"Press Start 2P"' }).setFontSize(32).setOrigin(0, 0.5)

    //add hover icon
    const hoverIcon = this.add.sprite(100, 100, 'cassette-tape');
    hoverIcon.setScale(0.08)
    hoverIcon.setVisible(false);

    let selected;
    //listen to event to transition to next scene
    for (let key of Object.keys(options)) {
      options[key].setInteractive();
      options[key].on("pointerover", () => {
        hoverIcon.setVisible(true);
        options[key].setColor('yellow')
        selected = key;
        hoverIcon.x = options[key].x - 60;
        hoverIcon.y = options[key].y;
      })
      options[key].on("pointerout", () => {
        hoverIcon.setVisible(false);
        options[key].setColor('white')
        selected = ''
      })
      options[key].on("pointerup", () => {
        if (selected) {
          const click = this.sound.add('click');
          click.volume = 0.1;
          click.play();
          this.scene.start(selected);
        }
      })
    }
  }
}
