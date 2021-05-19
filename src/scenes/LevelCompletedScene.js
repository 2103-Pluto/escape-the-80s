import Phaser from 'phaser'

export default class LevelCompletedScene extends Phaser.Scene {
  constructor() {
    super('LevelCompletedScene');
    this.activeGoToNextLevelButton = true;

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

    this.input.keyboard.enabled = false; //disable player movement

    this.hoverIcon = this.add.sprite(100, 100, 'cassette-tape').setScale(0.08);
    this.hoverIcon.setVisible(false)
    this.scene.get('MainMenuScene').createClick(this)

    //add text
    this.add.text(this.width*0.5, this.height*0.2, `Level ${this.level} completed!`, { fontFamily: '"Press Start 2P"' }).setFontSize(32).setOrigin(0.5)

    this.add.text(this.width*0.5, this.height*0.4, "You're one step closer", { fontFamily: '"Press Start 2P"' }).setFontSize(26).setOrigin(0.5)

    this.add.text(this.width*0.5, this.height*0.5, "to escaping the 80s", { fontFamily: '"Press Start 2P"' }).setFontSize(26).setOrigin(0.5)

    this.createScoreLabel()
    this.createHealthLabel()
    this.createGoToNextLevelButton()
  }

  createScoreLabel() {
    this.add.image(this.width*0.465, this.height*0.603, 'star').setOrigin(0.5).setScale(2)

    this.add.text(this.width*0.5, this.height*0.6, "x", { fontFamily: '"Press Start 2P"' }).setFontSize(26).setOrigin(0, 0.45)

    this.scoreLabel = this.add.text(this.width*0.548, this.height*0.605, `${this.score}`, { fontFamily: '"Press Start 2P"' }).setFontSize(26).setOrigin(0, 0.5)

    this.ScoreTween = this.tweens.addCounter({
      from: 0,
      to: this.score,
      duration: 3000
    });
  }

  createHealthLabel() {
    this.add.image(this.width*0.465, this.height*0.703, 'heart').setOrigin(0.5).setScale(2)

    this.add.text(this.width*0.5, this.height*0.7, "x", { fontFamily: '"Press Start 2P"' }).setFontSize(26).setOrigin(0, 0.45)

    this.healthLabel = this.add.text(this.width*0.548, this.height*0.705, `${this.health}`, { fontFamily: '"Press Start 2P"' }).setFontSize(26).setOrigin(0, 0.5)

    this.healthTween = this.tweens.addCounter({
      from: 0,
      to: this.health,
      duration: 3000
    });
  }

  createGoToNextLevelButton() {
    this.goToNextLevelButton = this.add.text(550, 40, 'Go to Next Level', { fontFamily: '"Press Start 2P"' }).setFontSize(28).setOrigin(0.5).setColor('#4DF3F5')

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
        console.log(this.score, this.health, this.color)
      }
    })
  }

  update() {
    this.scoreLabel.setText(Math.floor(this.ScoreTween.getValue()))
    this.healthLabel.setText(Math.floor(this.healthTween.getValue()))
  }
}
