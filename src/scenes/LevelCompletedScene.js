import Phaser from 'phaser'

export default class LevelCompletedScene extends Phaser.Scene {
  constructor() {
    super('LevelCompletedScene');

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

    //add text
    this.add.text(this.width*0.5, this.height*0.3, `Level ${this.level} completed!`, { fontFamily: '"Press Start 2P"' }).setFontSize(32).setOrigin(0.5)

    this.add.text(this.width*0.5, this.height*0.4, "You're one step closer", { fontFamily: '"Press Start 2P"' }).setFontSize(26).setOrigin(0.5)

    this.add.text(this.width*0.5, this.height*0.5, "to escaping the 80s", { fontFamily: '"Press Start 2P"' }).setFontSize(26).setOrigin(0.5)

    this.createScoreLabel()
    this.createHealthLabel()
  }

  createScoreLabel() {
    this.add.image(this.width*0.3, this.height*0.6, 'star').setOrigin(0.5).setScale(1.2).setScrollFactor(0)

    this.add.text(this.width*0.35, this.height*0.6, "x", { fontFamily: '"Press Start 2P"' }).setFontSize(24).setOrigin(0, 0.45)

    this.scoreLabel = this.add.text(this.width*0.4, this.height*0.6, `${this.score}`, { fontFamily: '"Press Start 2P"' }).setFontSize(24).setOrigin(0.5)
  }

  createHealthLabel() {
    this.add.image(this.width*0.3, this.height*0.7, 'heart').setOrigin(0.5).setScale(1.2).setScrollFactor(0)

    this.add.text(this.width*0.35, this.height*0.7, "x", { fontFamily: '"Press Start 2P"' }).setFontSize(24).setOrigin(0, 0.45)

    this.scoreLabel = this.add.text(this.width*0.4, this.height*0.7, `${this.health}`, { fontFamily: '"Press Start 2P"' }).setFontSize(24).setOrigin(0.5)
  }
}
