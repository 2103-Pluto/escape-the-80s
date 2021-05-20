import Phaser from 'phaser'
import WebFontFile from '../files/WebFontFile'

export default class TitleScene extends Phaser.Scene {
  constructor() {
    super('TitleScene');
    this.colors = ['Blue', 'Green', 'Red','Yellow'];

    this.playStartTween = this.playStartTween.bind(this);
  }

  preload() {
    //Loading bar
    this.displayLoadingBar(this, 'Bueller? Bueller? Bueller?');

    //Load images, sprites, spritesheets
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

    this.load.image("title-background", "assets/backgrounds/title_scene/title-background.png");
    this.load.image("cassette-tape", "assets/sprites/cassette-tape.png");

    //load audio
    for (let i=1; i<5; i++) {
      this.load.audio(`one-liner${i}`, `assets/audio/one_liners/one-liner${i}.wav`);
    }
    this.load.audio("title-music", "assets/audio/title_scene/title-music.wav");
    this.load.audio("click", "assets/audio/click.wav");
    this.load.audio("typing-sounds", "assets/audio/public_audio_Typing_Text.wav")
    //load other files
    this.load.addFile(new WebFontFile(this.load, 'Press Start 2P'))
  }

  create() {
    document.querySelector('div').style.display = 'none'
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

  displayLoadingBar(scene, phrase) {
    var progressBar = scene.add.graphics();
    var progressBox = scene.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(240, 270, 320, 50);
    var width = scene.cameras.main.width;
    var height = scene.cameras.main.height;
    var loadingText = scene.make.text({
        x: width / 2,
        y: height / 2 - 50,
        text: 'Loading...',
        style: {
            font: '20px monospace',
            fill: '#ffffff'
        }
    });
    loadingText.setOrigin(0.5, 0.5);
    var percentText = scene.make.text({
      x: width / 2,
      y: height / 2 - 5,
      text: phrase,
      style: {
        font: '18px monospace',
        fill: '#ffffff'
      }
    });
    percentText.setOrigin(0.5, 0.5);

    scene.load.on('progress', function (value) {
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(250, 280, 300 * value, 30);
      // percentText.setText(parseInt(value * 100) + '%');
    });

    scene.load.on('complete', function () {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      percentText.destroy();
    });

  }
}
