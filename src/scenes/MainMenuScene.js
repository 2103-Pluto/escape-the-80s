import Phaser from 'phaser'

export default class MainMenuScene extends Phaser.Scene {
  constructor() {
    super('MainMenuScene');
  }

  create() {
    const width = this.game.config.width;
    const height = this.game.config.height;
    //add faded background image
    const backgroundImage = this.add.image(width*0.5, height*0.5, "title-background").setOrigin(0.5, 0.5).setScale(1.2);
    backgroundImage.alpha = 0.1;

    this.createClick(this) //add clicking sound

    //add text options
    const options = {};
    options['CharacterChoosingScene'] = this.add.text(width*0.3, height*0.2, 'Campaign', { fontFamily: '"Press Start 2P"' }).setFontSize(32).setOrigin(0, 0.5)

    options['SynthwaveScene'] = this.add.text(width*0.3, height*0.35, 'Multiplayer', { fontFamily: '"Press Start 2P"' }).setFontSize(32).setOrigin(0, 0.5)

    options['HighScoresScene'] = this.add.text(width*0.3, height*0.5, 'High Scores', { fontFamily: '"Press Start 2P"' }).setFontSize(32).setOrigin(0, 0.5)

    options['ControlsScene'] = this.add.text(width*0.3, height*0.65, 'Controls', { fontFamily: '"Press Start 2P"' }).setFontSize(32).setOrigin(0, 0.5)

    options['CreditsScene'] = this.add.text(width*0.3, height*0.8, 'Credits', { fontFamily: '"Press Start 2P"' }).setFontSize(32).setOrigin(0, 0.5)

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
        options[key].setColor('#feff38')
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
          this.click.play();
          this.scene.start(selected);
        }
      })
    }
  }

  createClick(scene) {
    scene.click = scene.sound.add('click');
    scene.click.volume = 0.05;
  }
}
