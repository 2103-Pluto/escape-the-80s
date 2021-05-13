import Phaser from 'phaser'

export default class GameOverMenuScene extends Phaser.Scene {
  constructor() {
    super('GameOverMenuScene');
  }

  init(data) {
    this.previousScene = data.previousScene //retrieve previousScene
  }

  create() {
    this.width = this.game.config.width;
    this.height = this.game.config.height;
    this.hoverIcon = this.add.sprite(100, 100, 'cassette-tape').setScale(0.08);
    this.hoverIcon.setVisible(false)

    this.scene.get('MainMenuScene').createClick(this) //add click sound

    //add text
    this.add.text(this.width*0.5, this.height*0.3, 'GAME OVER', { fontFamily: '"Press Start 2P"' }).setFontSize(32).setOrigin(0.5, 0.5)
    //options
    this.createQuit();
    this.createRestart();
  }

  createQuit() {
    const quit = this.add.text(this.width*0.5, this.height*0.45, 'Quit', { fontFamily: '"Press Start 2P"' }).setFontSize(24).setOrigin(0.5, 0.5)

    quit.setInteractive();
    quit.on("pointerover", () => {
      this.hoverIcon.setVisible(true);
      this.hoverIcon.x = quit.x - 90;
      this.hoverIcon.y = quit.y;
      quit.setColor('yellow')
    })
    quit.on("pointerout", () => {
      this.hoverIcon.setVisible(false);
      quit.setColor('white')
    })
    quit.on("pointerup", () => {
      this.click.play();
      this.previousScene.scene.stop(); //stop the previous scene, which is running in parallel
      this.scene.stop(); //stop this menu scene
      this.scene.start('TitleScene') //go back to TitleScene
    })
  }

  createRestart() {
    const restart = this.add.text(this.width*0.5, this.height*0.6, 'Restart', { fontFamily: '"Press Start 2P"' }).setFontSize(24).setOrigin(0.5, 0.5)

    restart.setInteractive();
    restart.on("pointerover", () => {
      this.hoverIcon.setVisible(true);
      this.hoverIcon.x = restart.x - 126;
      this.hoverIcon.y = restart.y;
      restart.setColor('yellow')
    })
    restart.on("pointerout", () => {
      this.hoverIcon.setVisible(false);
      restart.setColor('white')
    })
    restart.on("pointerup", () => {
      this.click.play();
      this.scene.stop(); //stop this menu scene
      this.previousScene.scene.start(); //restart scene from the beginning
    })
  }
}
