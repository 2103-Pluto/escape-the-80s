import Phaser from 'phaser'
import SinglePlayerSynthwaveScene from './SinglePlayerSynthwaveScene'
import NeonAlleyScene from './NeonAlleyScene'

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
    this.createSaveScore(this, 0.5, 0.6);
    this.createQuit(this, 0.5, 0.75);
  }

  createQuit(scene, widthFraction, heightFraction) {
    const quit = scene.add.text(scene.width*widthFraction, scene.height*heightFraction, 'Quit', { fontFamily: '"Press Start 2P"' }).setFontSize(24).setOrigin(0.5, 0.5)

    quit.setInteractive();
    quit.on("pointerover", () => {
      scene.hoverIcon.setVisible(true);
      scene.hoverIcon.x = quit.x - 90;
      scene.hoverIcon.y = quit.y;
      quit.setColor('#feff38')
    })
    quit.on("pointerout", () => {
      scene.hoverIcon.setVisible(false);
      quit.setColor('white')
    })
    quit.on("pointerup", () => {
      const game = this.game;
      const previousSceneName = scene.previousScene.data.systems.config;
      scene.click.play();
      scene.previousScene.scene.stop(); //stop the previous scene, which is running in parallel
      scene.scene.stop(); //stop this menu scene
      scene.scene.start('TitleScene') //go back to TitleScene
      if (previousSceneName === 'SinglePlayerSynthwaveScene') {
        scene.scene.remove('SinglePlayerSynthwaveScene')
        scene.scene.remove('GameOverMenuScene')
        game.scene.add('SinglePlayerSynthwaveScene', SinglePlayerSynthwaveScene)
        game.scene.add('GameOverMenuScene', GameOverMenuScene)
      }
      else if (previousSceneName === 'NeonAlleyScene') {
        scene.scene.remove('SinglePlayerSynthwaveScene')
        scene.scene.remove('NeonAlleyScene')
        scene.scene.remove('GameOverMenuScene')
        game.scene.add('NeonAlleyScene', NeonAlleyScene)
        game.scene.add('GameOverMenuScene', GameOverMenuScene)
        game.scene.add('SinglePlayerSynthwaveScene', SinglePlayerSynthwaveScene)
      }
    })
  }

  createRestart(scene, widthFraction, heightFraction) {
    const restart = scene.add.text(scene.width*widthFraction, scene.height*heightFraction, 'Restart Level', { fontFamily: '"Press Start 2P"' }).setFontSize(24).setOrigin(0.5, 0.5)

    restart.setInteractive();
    restart.on("pointerover", () => {
      scene.hoverIcon.setVisible(true);
      scene.hoverIcon.x = restart.x - 200;
      scene.hoverIcon.y = restart.y;
      restart.setColor('#feff38')
    })
    restart.on("pointerout", () => {
      scene.hoverIcon.setVisible(false);
      restart.setColor('white')
    })
    restart.on("pointerup", () => {
      scene.click.play();
      scene.previousScene.scene.stop();
      scene.scene.stop(); //stop this menu scene
      scene.previousScene.scene.start(); //restart scene from the beginning
    })
  }

  createSaveScore(scene, widthFraction, heightFraction) {
    const save = scene.add.text(scene.width*widthFraction, scene.height*heightFraction, 'Save Score', { fontFamily: '"Press Start 2P"' }).setFontSize(24).setOrigin(0.5, 0.5)

    save.setInteractive();
    save.on("pointerover", () => {
      scene.hoverIcon.setVisible(true);
      scene.hoverIcon.x = save.x - 160;
      scene.hoverIcon.y = save.y;
      save.setColor('#feff38')
    })
    save.on("pointerout", () => {
      scene.hoverIcon.setVisible(false);
      save.setColor('white')
    })
    save.on("pointerup", () => {
      const game = this.game;
      const previousSceneName = scene.previousScene.data.systems.config;
      scene.click.play();
      scene.previousScene.scene.stop();
      scene.scene.stop(); //stop this menu scene
      scene.scene.start('SaveScoreScene', {
        score: this.previousScene.player.score,
        level: this.previousScene.level,
        gameCompleted: false
      });
      if (previousSceneName === 'SinglePlayerSynthwaveScene') {
        scene.scene.remove('SinglePlayerSynthwaveScene')
        scene.scene.remove('GameOverMenuScene')
        game.scene.add('SinglePlayerSynthwaveScene', SinglePlayerSynthwaveScene)
        game.scene.add('GameOverMenuScene', GameOverMenuScene)
      }
      else if (previousSceneName === 'NeonAlleyScene') {
        scene.scene.remove('SinglePlayerSynthwaveScene')

        scene.scene.remove('NeonAlleyScene')
        scene.scene.remove('GameOverMenuScene')
        game.scene.add('NeonAlleyScene', NeonAlleyScene)
        game.scene.add('GameOverMenuScene', GameOverMenuScene)
        game.scene.add('SinglePlayerSynthwaveScene', SinglePlayerSynthwaveScene)
      }
    })
  }
}
