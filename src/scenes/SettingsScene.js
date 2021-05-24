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

    this.createSkulls() // add skulls to be displayed with options
    this.createOptions() //add options and make them interactive

    // add back button
    this.scene.get('CreditsScene').createBack(this, 'MainMenuScene');
  }

  createOptions() {
    this.options = {};
    this.options["novice"] = this.add.text(this.width*0.19, this.height*0.5, 'Novice', { fontFamily: '"Press Start 2P"' }).setFontSize(24).setOrigin(0.5, 0.5)
    this.options["standard"] = this.add.text(this.width*0.51, this.height*0.5, 'Standard', { fontFamily: '"Press Start 2P"' }).setFontSize(24).setOrigin(0.5, 0.5)
    this.options["insane"] = this.add.text(this.width*0.83, this.height*0.5, 'Insane', { fontFamily: '"Press Start 2P"' }).setFontSize(24).setOrigin(0.5, 0.5)
    this.selected = store.getState().settings.campaignDifficulty
    this.options[this.selected].setColor('#F57C2D')
    this.animateSkulls(this.selected, this.skulls)

    for (let key of Object.keys(this.options)) {
      this.options[key].setInteractive();
      this.options[key].on("pointerover", () => {
        this.hoverIcon.setVisible(true);
        this.options[key].setColor('#feff38')
        this.hoverIcon.x = this.options[key].x - this.options[key].width/2 - 35;
        this.hoverIcon.y = this.options[key].y;
      })
      this.options[key].on("pointerout", () => {
        this.selected = store.getState().settings.campaignDifficulty
        this.hoverIcon.setVisible(false);
        // this.audio[key].stop()
        key === this.selected ? this.options[key].setColor('#F57C2D') : this.options[key].setColor('white')
      })
      this.options[key].on("pointerup", () => {
        this.click.play();
        this.audio[key].play()
        store.dispatch(setCampaignDifficulty(key))
        for (let key of Object.keys(this.options)) {
          this.options[key].setColor('white')
        }
        this.selected = store.getState().settings.campaignDifficulty
        this.options[this.selected].setColor('#F57C2D')
        this.animateSkulls(this.selected, this.skulls)
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
    this.skulls = {};
    positions.forEach((coordinateX, index) => {
      this.skulls[index] = this.add.sprite(this.width*coordinateX, (this.height*0.5)+50, 'skull').setScale(0.8).setOrigin(0.5)
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

  animateSkulls(selected, skulls) {
    Object.keys(skulls).forEach((index) => {
      skulls[index].anims.stop();
    })
    switch (selected) {
      case "novice":
        skulls["0"].play('moving-skull', true)
        break
      case "insane":
        skulls["3"].play('moving-skull', true)
        skulls["4"].play('moving-skull', true)
        skulls["5"].play('moving-skull', true)
        break
      default: "standard"
        skulls["1"].play('moving-skull', true)
        skulls["2"].play('moving-skull', true)
    }
  }
}
