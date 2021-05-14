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
    this.createRestart(this, 0.5, 0.45);
    this.createQuit(this, 0.5, 0.6);
  }

  createQuit(scene, widthFraction, heightFraction) {
    const quit = scene.add.text(scene.width*widthFraction, scene.height*heightFraction, 'Quit', { fontFamily: '"Press Start 2P"' }).setFontSize(24).setOrigin(0.5, 0.5)

    quit.setInteractive();
    quit.on("pointerover", () => {
      scene.hoverIcon.setVisible(true);
      scene.hoverIcon.x = quit.x - 90;
      scene.hoverIcon.y = quit.y;
      quit.setColor('yellow')
    })
    quit.on("pointerout", () => {
      scene.hoverIcon.setVisible(false);
      quit.setColor('white')
    })
    quit.on("pointerup", () => {
      scene.click.play();
      scene.previousScene.scene.stop(); //stop the previous scene, which is running in parallel
      scene.scene.stop(); //stop this menu scene
      scene.scene.start('TitleScene') //go back to TitleScene
    })
  }

  createRestart(scene, widthFraction, heightFraction) {
    const restart = scene.add.text(scene.width*widthFraction, scene.height*heightFraction, 'Restart', { fontFamily: '"Press Start 2P"' }).setFontSize(24).setOrigin(0.5, 0.5)

    restart.setInteractive();
    restart.on("pointerover", () => {
      scene.hoverIcon.setVisible(true);
      scene.hoverIcon.x = restart.x - 126;
      scene.hoverIcon.y = restart.y;
      restart.setColor('yellow')
    })
    restart.on("pointerout", () => {
      scene.hoverIcon.setVisible(false);
      restart.setColor('white')
    })
    restart.on("pointerup", () => {
      scene.click.play();
      scene.scene.stop(); //stop this menu scene
      scene.previousScene.scene.start(); //restart scene from the beginning
    })
  }
}
