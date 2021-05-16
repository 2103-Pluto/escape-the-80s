import Phaser from 'phaser'

export default class CharacterChoosingScene extends Phaser.Scene {
  constructor() {
    super('CharacterChoosingScene');
    this.colors = ['Blue', 'Green', 'Red','Yellow'];
  }

  preload() {
    //load animations
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
    //load audio
    for (let i=1; i<5; i++) {
      this.load.audio(`one-liner${i}`, `assets/audio/one_liners/one-liner${i}.wav`);
    }
  }

  create() {
    this.sound.pauseOnBlur = false; //prevent sound from cutting when you leave tab

    const width = this.game.config.width;
    const height = this.game.config.height;

    //add text
    this.add.text(width*0.5, height*0.2, 'PLAYER SELECT', { fontFamily: '"Press Start 2P"' }).setFontSize(28).setOrigin(0.5, 0.5).setColor('#ED6BF3')

    //add choices
    const options = {};

    options['Blue'] = this.add.sprite(width*0.35, height*0.45, 'BlueIdle').setScale(3);
    options['Green'] = this.add.sprite(width*0.35, height*0.75, 'GreenIdle').setScale(3);
    options['Red'] = this.add.sprite(width*0.65, height*0.45, 'RedIdle').setScale(3);
    options['Yellow'] = this.add.sprite(width*0.65, height*0.75, 'YellowIdle').setScale(3);

    //add clicking sound effect
    const click = this.sound.add('click');
    click.volume = 0.05;

    //add one liner audio files
    const audio = {}
      audio['Green'] = this.sound.add(`one-liner1`); //Sudden Impact 0.15
      audio['Green'].volume =0.15
      audio['Blue'] = this.sound.add(`one-liner2`); //Rocky 0.17
      audio['Blue'].volume =0.17
      audio['Red'] = this.sound.add(`one-liner3`); //Airplane 0.15
      audio['Red'].volume =0.17
      audio['Yellow'] = this.sound.add(`one-liner4`); //Terminator 0.12
      audio['Yellow'].volume =0.12
      // const audio5 = this.sound.add(`one-liner5`); //Incredible Hulk 0.2
      // audio5.volume =0.2
      // const audio6 = this.sound.add(`one-liner6`); //Scarface 0.15
      // audio6.volume =0.15

    //set interactivity and selection
    let selected;
    let finalSelected;
    this.createAnimations()
    for (let key of Object.keys(options)) {
      options[key].setInteractive();
      options[key].play(`${key}Idle`)
      options[key].on("pointerover", () => {
        if (!finalSelected) {
          options[key].play(`${key}Run`)
          selected = key;
          audio[key].play()
        }
      })
      options[key].on("pointerout", () => {
        if (!finalSelected) {
          options[key].play(`${key}Idle`)
          selected = ''
          audio[key].stop()
        }
      })
      options[key].on("pointerup", () => {
        if (selected) {
          finalSelected = selected;
          click.play();
          audio[key].on('complete', () => {
            this.scene.start('StoryScene', { color: finalSelected})
          })
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
