import Phaser from 'phaser'
import store from '../store'
import { setCampaignDifficulty } from '../store/settings'


export default class SettingsScene extends Phaser.Scene {
  constructor() {
    super('SettingsScene');
  }

  create() {
    this.width = this.game.config.width;
    this.height = this.game.config.height;
    this.audio = {};
    this.createSounds(this.audio) //add sounds

    // add background image
    const backgroundImage = this.add.image(this.width*0.5, this.height*0.5, "title-background").setOrigin(0.5, 0.5).setScale(1.2);
    backgroundImage.alpha = 0.1;

    // add title
    this.add.text(this.width*0.5, this.height*0.2, 'SETTINGS', { fontFamily: '"Press Start 2P"' }).setFontSize(28).setOrigin(0.5, 0.5).setColor('#ED6BF3')

    // add section header
    this.add.text(this.width*0.5, this.height*0.35, 'Campaign Difficulty', { fontFamily: '"Press Start 2P"' }).setFontSize(26).setOrigin(0.5, 0.5).setColor('#ED6BF3')

    this.createOptions() //add options and make them interactive
    this.createSkulls() // add skulls to be displayed with options

    // add back button
    this.scene.get('CreditsScene').createBack(this, 'MainMenuScene');
  }

  createOptions() {
    this.options = {};
    this.options["novice"] = this.add.text(this.width*0.18, this.height*0.5, 'Novice', { fontFamily: '"Press Start 2P"' }).setFontSize(24).setOrigin(0.5, 0.5)
    this.options["standard"] = this.add.text(this.width*0.5, this.height*0.5, 'Standard', { fontFamily: '"Press Start 2P"' }).setFontSize(24).setOrigin(0.5, 0.5)
    this.options["insane"] = this.add.text(this.width*0.82, this.height*0.5, 'Insane', { fontFamily: '"Press Start 2P"' }).setFontSize(24).setOrigin(0.5, 0.5)

    for (let key of Object.keys(this.options)) {
      this.options[key].setInteractive();
      this.options[key].on("pointerover", () => {
        this.hoverIcon.setVisible(true);
        this.options[key].setColor('#feff38')
        this.hoverIcon.x = this.options[key].x - this.options[key].width/2 - 35;
        this.hoverIcon.y = this.options[key].y;
        this.audio[key].play()
      })
      this.options[key].on("pointerout", () => {
        this.hoverIcon.setVisible(false);
        this.audio[key].stop()
        this.options[key].setColor('white')
      })
      this.options[key].on("pointerup", () => {
        this.click.play();
        store.dispatch(setCampaignDifficulty(key))
        this.unsubscribe = store.subscribe(() => {
          this.records = store.getState().settings.campaignDifficulty
        })
      })
    }
  }

  createSkulls() {
    const positions = [0.18, 0.47, 0.53, 0.77, 0.82, 0.87]
    this.anims.create({
      key: 'moving-skull',
      frames: this.anims.generateFrameNumbers('skull'),
      frameRate: 10,
      repeat: -1,
    });
    positions.forEach((coordinateX) => {
      this.add.sprite(this.width*coordinateX, (this.height*0.5)+50, 'skull').setScale(0.8).setOrigin(0.5).play('moving-skull', true)
    })
  }

  createSounds(audio) {
    this.sound.pauseOnBlur = false; //prevent sound from cutting when you leave tab

    //add quotes for difficulty options
    ['insane', 'standard', 'novice'].forEach((difficulty) => {
      audio[difficulty] = this.sound.add(difficulty);
      difficulty === 'insane' ? audio[difficulty].volume = 0.2 : audio[difficulty].volume = 0.35;
    })
  }
}
