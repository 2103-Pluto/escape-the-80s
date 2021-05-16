import Phaser from 'phaser'
import WebFontFile from '../files/WebFontFile'

export default class TitleScene extends Phaser.Scene {
  constructor() {
    super('TitleScene');

    this.playStartTween = this.playStartTween.bind(this);
  }

  preload() {
    this.load.image("title-background", "assets/backgrounds/title_scene/title-background.png");
    this.load.audio("title-music", "assets/audio/title_scene/title-music.wav");
    this.load.addFile(new WebFontFile(this.load, 'Press Start 2P'))
    this.load.audio("click", "assets/audio/click.wav");
  }

  create() {
    //add background music
    const backgroundMusic = this.sound.add('title-music');
    backgroundMusic.setLoop(true);
    backgroundMusic.volume = 0.03;
    backgroundMusic.play();

    this.sound.pauseOnBlur = false; //prevent sound from cutting when you leave tab

    //add background
    const width = this.game.config.width;
    const height = this.game.config.height;
    this.add.image(width*0.5, height*0.5, "title-background").setOrigin(0.5, 0.5).setScale(1.2);

    this.startText = this.add.text(width*0.5, height*0.65, '- PRESS ENTER TO START -', { fontFamily: '"Press Start 2P"' }).setFontSize(18).setOrigin(0.5, 0.5)
    this.playStartTween();

    //listen to event to transition to next scene
    this.input.keyboard.on('keydown-ENTER', () => {
      const click = this.sound.add('click');
      click.volume = 0.05;
      click.play();
      this.scene.start('MainMenuScene');
    })
  }

  playStartTween() {
    this.tweens.add({
      targets: this.startText,
      duration: 650,
      delay: 300,
      repeat: -1,
      ease: Phaser.Math.Easing.Expo.InOut,
      // ease: Phaser.Math.Easing.Cubic.Out,
      alpha: 0,
      yoyo: true
    })
  }
}
