import Phaser from 'phaser'

export default class LevelCompletedScene extends Phaser.Scene {
  constructor() {
    super('LevelCompletedScene');
    this.activeGoToNextLevelButton = true;
    this.scoreTweenDuration = 2000;

    this.createScoreLabel = this.createScoreLabel.bind(this)
    this.createHealthLabel = this.createHealthLabel.bind(this)
  }

  init(data) {
    this.score = data.score,
    this.health = data.health,
    this.color = data.color,
    this.level = data.level
  }

  create() {
    this.height = this.game.config.height;
    this.width = this.game.config.width;

    this.hoverIcon = this.add.sprite(100, 100, 'cassette-tape').setScale(0.08);
    this.hoverIcon.setVisible(false)
    this.scene.get('MainMenuScene').createClick(this)
    this.powerUpSound = this.sound.add('power-up');
    this.powerUpSound.volume = 0.1;
    this.coinSound = this.sound.add('coin');
    this.coinSound.volume = 0.1;

    //add text
    this.add.text(this.width*0.5, this.height*0.2, `Level ${this.level} completed!`, { fontFamily: '"Press Start 2P"' }).setFontSize(32).setOrigin(0.5)

    this.add.text(this.width*0.5, this.height*0.4, "You're one step closer", { fontFamily: '"Press Start 2P"' }).setFontSize(26).setOrigin(0.5)

    this.add.text(this.width*0.5, this.height*0.5, "to escaping the 80s", { fontFamily: '"Press Start 2P"' }).setFontSize(26).setOrigin(0.5)

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
      onComplete: () => {
        this.powerUpSound.play()
        this.goToNextLevelButton.setVisible(true);
      }
    });
  }

  createGoToNextLevelButton() {
    this.goToNextLevelButton = this.add.text(550, 40, 'Go to Next Level', { fontFamily: '"Press Start 2P"' }).setFontSize(28).setOrigin(0.5).setColor('#4DF3F5')
    this.goToNextLevelButton.setVisible(false);

    this.goToNextLevelButton.setInteractive();
    this.goToNextLevelButton.on("pointerover", () => {
      if (this.activeGoToNextLevelButton) {
        this.hoverIcon.setVisible(true);
        this.goToNextLevelButton.setColor('#feff38')
        this.hoverIcon.x = this.goToNextLevelButton.x - this.goToNextLevelButton.width/2 - 45;
        this.hoverIcon.y = this.goToNextLevelButton.y;
      }
    })
    this.goToNextLevelButton.on("pointerout", () => {
      if (this.activeGoToNextLevelButton) {
        this.hoverIcon.setVisible(false);
        this.goToNextLevelButton.setColor('#4DF3F5')
      }
    })
    this.goToNextLevelButton.on("pointerup", () => {
      if (this.activeGoToNextLevelButton) {
        this.click.play();
      }
    })
  }

  update() {
    this.scoreLabel.setText(Math.floor(this.scoreTween.getValue()))
    this.healthLabel.setText(Math.floor(this.healthTween.getValue()))
  }
}
