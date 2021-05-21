import Phaser from 'phaser'

export default class RickRollScene extends Phaser.Scene {
  constructor() {
    super('RickRollScene');

    this.activeCreditsButton = false;

    this.createGoToCreditsButton = this.createGoToCreditsButton.bind(this)
    this.createAnimation = this.createAnimation.bind(this)
    this.createSound = this.createSound.bind(this)
    this.createText = this.createText.bind(this)
    this.playGoToCreditsButtonTween = this.playGoToCreditsButtonTween.bind(this)
  }

  preload() {
    this.load.spritesheet('rick-roll', 'assets/spriteSheets/rick-roll.png', {
      frameWidth: 640,
      frameHeight: 360,
    })
  }

  create() {
    this.width = this.game.config.width;
    this.height = this.game.config.height;

    //CREATE HOVER ICON
    this.hoverIcon = this.add.sprite(100, 100, 'cassette-tape').setScale(0.06);
    this.hoverIcon.setVisible(false)
    this.scene.get('MainMenuScene').createClick(this)

    this.createSound() //CREATE SOUND
    this.createAnimation() //CREATE ANIMATION
    this.createText() //Add TEXT
    this.createGoToCreditsButton() //create button to go to credits
  }

  createSound() {
    this.game.sound.stopAll()
    this.backgroundSound = this.sound.add('rick-roll-sound')
    this.backgroundSound.setLoop(true);
    this.backgroundSound.volume = 0.2;
    this.backgroundSound.play()

    this.sound.pauseOnBlur = false; //prevent sound from cutting when you leave tab
  }

  createAnimation() {
    this.anims.create({
      key: 'rick-roll-animation',
      frames: this.anims.generateFrameNumbers('rick-roll'),
      frameRate: 2,
      repeat: -1
    });

    this.add.sprite(this.width*0.5, this.height*0.5, 'rick-roll').play('rick-roll-animation', true);
  }

  createText() {
    this.topText = this.add.text(this.width*0.5, this.height*0.1, 'It was all a dream Rex!', { fontFamily: '"Press Start 2P"' }).setFontSize(32).setOrigin(0.5, 0.5).setColor('#ED6BF3')
    this.topText.alpha = 0

    this.bottomText = this.add.text(this.width*0.5, this.height*0.25, 'Go chase your dream', { fontFamily: '"Press Start 2P"' }).setFontSize(28).setOrigin(0.5, 0.5)
    this.bottomText.setVisible(false)

    this.tweens.add({
      targets: this.topText,
      duration: 5000,
      repeat: 0,
      alpha: 1,
      onComplete: () => {
        this.activeCreditsButton = true
        this.goToCreditsButton.setVisible(true)
        this.playGoToCreditsButtonTween()
        this.bottomText.setVisible(true)

      }
    })
  }

  createGoToCreditsButton() {
    this.goToCreditsButton = this.add.text(650, 570, 'Go to Credits', { fontFamily: '"Press Start 2P"' }).setFontSize(20).setOrigin(0.5).setColor('#4DF3F5')

    this.goToCreditsButton.setVisible(false)
    this.goToCreditsButton.setInteractive();

    this.goToCreditsButton.on("pointerover", () => {
      if (this.activeCreditsButton) {
        this.goToCreditsButton.alpha = 1;
        this.goToCreditsTween.pause()
        this.hoverIcon.setVisible(true);
        this.goToCreditsButton.setColor('#feff38')
        this.hoverIcon.x = this.goToCreditsButton.x - this.goToCreditsButton.width/2 - 30;
        this.hoverIcon.y = this.goToCreditsButton.y;
      }
    })
    this.goToCreditsButton.on("pointerout", () => {
      if (this.activeCreditsButton) {
        this.goToCreditsTween.resume()
        this.hoverIcon.setVisible(false);
        this.goToCreditsButton.setColor('#4DF3F5')
      }
    })
    this.goToCreditsButton.on("pointerup", () => {
      if (this.activeCreditsButton) {
        this.activeCreditsButton = false;
        const game = this.game;
        this.click.play();
        this.game.sound.stopAll()

        this.scene.start('CreditsScene')
        const backgroundMusic = this.sound.add('title-music');
        backgroundMusic.setLoop(true);
        backgroundMusic.volume = 0.05;
        backgroundMusic.play();
        this.scene.remove('RickRollScene')
        game.scene.add('RickRollScene', RickRollScene)
      }
    })
  }

  playGoToCreditsButtonTween() {
    this.goToCreditsTween = this.tweens.add({
      targets: this.goToCreditsButton,
      duration: 600,
      repeat: -1,
      ease: Phaser.Math.Easing.Expo.InOut,
      // ease: Phaser.Math.Easing.Cubic.Out,
      alpha: 0,
      yoyo: true
    })
  }
}
