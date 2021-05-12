import Phaser from 'phaser'
import WebFontFile from '../files/WebFontFile'

export default class CharacterChoosingScene extends Phaser.Scene {
  constructor() {
    super('CharacterChoosingScene');
    this.colors = ['Blue', 'Green', 'Red','Yellow'];
  }

  preload() {
    this.load.addFile(new WebFontFile(this.load, 'Press Start 2P'))

    this.load.image("cassette-tape", "assets/sprites/cassette-tape.png")
    this.load.audio("click", "assets/audio/click.wav");
    this.load.audio("click", "assets/audio/click.wav");

    for (let color of this.colors) {
      this.load.spritesheet(`${color}Idle`, `assets/spriteSheets/${color}/Gunner_${color}_Idle.png`, {
        frameWidth: 48,
        frameHeight: 48,
      });
      this.load.spritesheet(`${color}Run`, `assets/spriteSheets/${color}/Gunner_${color}_Run.png`, {
        frameWidth: 48,
        frameHeight: 48,
      });
    }
  }

  create() {
    this.sound.pauseOnBlur = false; //prevent sound from cutting when you leave tab

    const width = this.game.config.width;
    const height = this.game.config.height;

    //add text
    this.add.text(width*0.5, height*0.2, 'Player Select', { fontFamily: '"Press Start 2P"' }).setFontSize(28).setOrigin(0.5, 0.5)

    //add choices
    const options = {};

    options['Blue'] = this.add.sprite(width*0.35, height*0.45, 'BlueIdle').setScale(3);
    options['Green'] = this.add.sprite(width*0.35, height*0.75, 'GreenIdle').setScale(3);
    options['Red'] = this.add.sprite(width*0.65, height*0.45, 'RedIdle').setScale(3);
    options['Yellow'] = this.add.sprite(width*0.65, height*0.75, 'YellowIdle').setScale(3);
    const click = this.sound.add('click');
    click.volume = 0.1;

    //set interactivity and selection
    let selected;
    this.createAnimations()
    for (let key of Object.keys(options)) {
      options[key].setInteractive();
      options[key].play(`${key}Idle`)
      options[key].on("pointerover", () => {
        options[key].play(`${key}Run`)
        selected = key;
      })
      options[key].on("pointerout", () => {
        options[key].play(`${key}Idle`)
        selected = ''
      })
      options[key].on("pointerup", () => {
        if (selected) {
          click.play();
          this.scene.start('StoryScene', { color: selected })
        }
      })
    }
    //
    this.scene.get('CreditsScene').createBack(this, 'MainMenuScene');// Going back
  }

  createAnimations() {
    for (let color of this.colors) {
      this.anims.create({
        key: `${color}Idle`,
        frames: this.anims.generateFrameNumbers(`${color}Idle`),
        frameRate: 10,
        repeat: -1,
      });
      this.anims.create({
        key: `${color}Run`,
        frames: this.anims.generateFrameNumbers(`${color}Run`),
        frameRate: 10,
        repeat: -1,
      });
    }
  }
}
