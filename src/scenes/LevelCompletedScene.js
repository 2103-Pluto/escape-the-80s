import Phaser from 'phaser'
import SinglePlayerSynthwaveScene from './SinglePlayerSynthwaveScene'
import NeonAlleyScene from './NeonAlleyScene'

export default class LevelCompletedScene extends Phaser.Scene {
  constructor() {
    super('LevelCompletedScene');
    this.activeGoToNextLevelButton = false;
    this.scoreTweenDuration = 2000;

    this.createScoreLabel = this.createScoreLabel.bind(this)
    this.createHealthLabel = this.createHealthLabel.bind(this)
  }

  init(data) {
    this.score = data.score,
    this.health = data.health,
    this.color = data.color,
    this.level = data.level,
    this.previousSceneName = data.previousSceneName
  }

  create() {
    this.height = this.game.config.height;
    this.width = this.game.config.width;

    this.hoverIcon = this.add.sprite(100, 100, 'cassette-tape').setScale(0.06);
    this.hoverIcon.setVisible(false)
    this.scene.get('MainMenuScene').createClick(this)
    this.powerUpSound = this.sound.add('power-up');
    this.powerUpSound.volume = 0.1;
    this.coinSound = this.sound.add('coin');
    this.coinSound.volume = 0.1;

    //play celebration music
    this.backgroundSound = this.sound.add('celebration');
    this.backgroundSound.setLoop(true);
    this.backgroundSound.volume = 0.12;
    this.backgroundSound.play();
    this.sound.pauseOnBlur = false;

    //add text
    this.add.text(this.width*0.5, this.height*0.4, `LEVEL ${this.level} COMPLETED!!!`, { fontFamily: '"Press Start 2P"' }).setFontSize(32).setOrigin(0.5).setColor('#feff38')

    this.line1 = this.add.text(this.width*0.5, this.height*0.5, "One step closer to escaping the 80s", { fontFamily: '"Press Start 2P"' }).setFontSize(20).setOrigin(0.5)

    if (this.previousSceneName === 'NeonAlleyScene') {
      this.line1.text = 'You can escape the 80s now!!'
    }

    this.line1.setVisible(false)

    this.createGoToNextLevelButton()
    this.createScoreLabel()
    this.createHealthLabel()
  }

  createScoreLabel() {
    this.add.image(this.width*0.465, this.height*0.603, 'star').setOrigin(0.5).setScale(2)

    this.add.text(this.width*0.5, this.height*0.6, "x", { fontFamily: '"Press Start 2P"' }).setFontSize(26).setOrigin(0, 0.45)

    this.scoreLabel = this.add.text(this.width*0.548, this.height*0.605, 0, { fontFamily: '"Press Start 2P"' }).setFontSize(26).setOrigin(0, 0.5)

    if (this.score === 0) this.scoreTweenDuration = 200;
    this.scoreTween = this.tweens.addCounter({
      from: 0,
      to: this.score,
      duration: this.scoreTweenDuration,
      onComplete: () => this.coinSound.play()
    });
  }

  createHealthLabel() {
    this.add.image(this.width*0.465, this.height*0.703, 'heart').setOrigin(0.5).setScale(2)

    this.add.text(this.width*0.5, this.height*0.7, "x", { fontFamily: '"Press Start 2P"' }).setFontSize(26).setOrigin(0, 0.45)

    this.healthLabel = this.add.text(this.width*0.548, this.height*0.705, 0, { fontFamily: '"Press Start 2P"' }).setFontSize(26).setOrigin(0, 0.5)
    this.healthTween = this.tweens.addCounter({
      from: 0,
      to: this.health,
      duration: 600,
      delay: this.scoreTweenDuration,
      completeDelay: 200,
      onComplete: () => {
        this.powerUpSound.play()
        this.line1.setVisible(true)
        this.time.delayedCall(500, () => {
          this.goToNextLevelButton.setVisible(true);
          this.activeGoToNextLevelButton = true;
          this.playGoToNextLevelTween();
        }, null, this)
      }
    });
  }

  createGoToNextLevelButton() {
    this.goToNextLevelButton = this.add.text(620, 570, 'Go to Next Level', { fontFamily: '"Press Start 2P"' }).setFontSize(20).setOrigin(0.5).setColor('#4DF3F5')

    if (this.previousSceneName === 'NeonAlleyScene') {
      this.goToNextLevelButton.text = 'Save Score and Escape'
      this.goToNextLevelButton.x -= 50
    }

    this.goToNextLevelButton.setVisible(false);

    this.goToNextLevelButton.setInteractive();
    this.goToNextLevelButton.on("pointerover", () => {
      if (this.activeGoToNextLevelButton) {
        this.goToNextLevelButton.alpha = 1;
        this.goToNextLevelTween.pause()
        this.hoverIcon.setVisible(true);
        this.goToNextLevelButton.setColor('#feff38')
        this.hoverIcon.x = this.goToNextLevelButton.x - this.goToNextLevelButton.width/2 - 30;
        this.hoverIcon.y = this.goToNextLevelButton.y;
      }
    })
    this.goToNextLevelButton.on("pointerout", () => {
      if (this.activeGoToNextLevelButton) {
        this.goToNextLevelTween.resume()
        this.hoverIcon.setVisible(false);
        this.goToNextLevelButton.setColor('#4DF3F5')
      }
    })
    this.goToNextLevelButton.on("pointerup", () => {
      if (this.activeGoToNextLevelButton) {
        this.activeGoToNextLevelButton = false;
        const game = this.game;
        this.click.play();

        if (this.previousSceneName === 'SinglePlayerSynthwaveScene') {
          this.scene.stop('SinglePlayerSynthwaveScene') //stop previous scene instance
          this.scene.start('NeonAlleyScene', { //start neon alley
            score: this.score,
            health: this.health,
            color: this.color
          })
        } else if (this.previousSceneName === 'NeonAlleyScene') {
          this.scene.stop('NeonAlleyScene')
          this.scene.start('SaveScoreScene', {
            score: this.previousScene.player.score,
            level: this.previousScene.level
          }) //go to save score
          this.scene.remove('NeonAlleyScene') //remove previous scene instance
          this.scene.remove('SinglePlayerSynthwaveScene') //remove previous first level scene instance
          game.scene.add('NeonAlleyScene', NeonAlleyScene) //add previous scene new instance
          game.scene.add('SinglePlayerSynthwaveScene', SinglePlayerSynthwaveScene) //add previous first level scene new instance
        }
        this.scene.remove('LevelCompletedScene') //remove this scene
        game.scene.add('LevelCompletedScene', LevelCompletedScene) //add new instance of level completed
      }
    })
  }

  playGoToNextLevelTween() {
    this.goToNextLevelTween = this.tweens.add({
      targets: this.goToNextLevelButton,
      duration: 600,
      repeat: -1,
      ease: Phaser.Math.Easing.Expo.InOut,
      // ease: Phaser.Math.Easing.Cubic.Out,
      alpha: 0,
      yoyo: true
    })
  }

  update() {
    this.scoreLabel.setText(Math.floor(this.scoreTween.getValue()))
    this.healthLabel.setText(Math.floor(this.healthTween.getValue()))
  }
}
