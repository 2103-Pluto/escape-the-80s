import Phaser from 'phaser'

import WaitingRoom from './WaitingRoom'
import CountdownScene from './CountdownScene'
import WaitingforPlayer from './MultiplayerWaiting'
import MultiplayerCompletedScene from './MultiplayerCompletedScene'
import SynthwaveScene from './SynthwaveScene';

export default class MultiplayerCompletedScene extends Phaser.Scene {
  constructor() {
    super('MultiplayerCompletedScene');
    this.scoreTweenDuration = 2000;

    // this.timeLabel = this.timeLabel.bind(this)
    // this.winnerLabel = this.winnerLabel.bind(this)
  }

  init(data) {
    this.winTime = data.winTime,
    this.winner = data.winner
  }

  preload(){
    this.load.audio('celebration', 'assets/audio/celebration.wav')
  }

  create() {
    document.querySelector('div').style.display = 'none'
    this.height = this.game.config.height;
    this.width = this.game.config.width;

    this.hoverIcon = this.add.sprite(100, 100, 'cassette-tape').setScale(0.06);
    this.hoverIcon.setVisible(false)
    this.scene.get('MainMenuScene').createClick(this)

    //play celebration music
    this.backgroundSound = this.sound.add('celebration');
    this.backgroundSound.setLoop(true);
    this.backgroundSound.volume = 0.15;
    this.backgroundSound.play();
    this.sound.pauseOnBlur = false;

    //add text
    

    this.add.text(this.width*0.5, this.height*0.4, `${this.winner}`, { fontFamily: '"Press Start 2P"' }).setFontSize(32).setOrigin(0.5).setColor('#feff38')
    this.add.text(this.width*0.5, this.height*0.6, `Winner time: ${this.winTime}`, { fontFamily: '"Press Start 2P"' }).setFontSize(32).setOrigin(0.5).setColor('#feff38')
    this.line1 = this.add.text(this.width*0.5, this.height*0.5, "One step closer to escaping the 80s", { fontFamily: '"Press Start 2P"' }).setFontSize(20).setOrigin(0.5)
    this.line1.setVisible(false)

    this.createGoToMainMenu()
  }

  
  createGoToMainMenu() {
    this.goToMainMenuButton = this.add.text(620, 570, 'Main Menu', { fontFamily: '"Press Start 2P"' }).setFontSize(20).setOrigin(0.5).setColor('#4DF3F5')

    this.goToMainMenuButton.setInteractive();
    this.goToMainMenuButton.on("pointerover", () => {
        this.hoverIcon.setVisible(true);
        this.goToMainMenuButton.setColor('#feff38')
        this.hoverIcon.x = this.goToMainMenuButton.x - this.goToMainMenuButton.width/2 - 30;
        this.hoverIcon.y = this.goToMainMenuButton.y;
    })
    this.goToMainMenuButton.on("pointerout", () => {
        this.hoverIcon.setVisible(false);
        this.goToMainMenuButton.setColor('#4DF3F5')
    })
    this.goToMainMenuButton.on("pointerup", () => {
     
        
        const game = this.game;
        this.click.play();
        window.location.reload(true)
        //this.scene.stop()
        // this.scene.start('TitleScene')
        // this.scene.remove("SynthwaveScene")
        // this.scene.remove("WaitingRoom")
        // this.scene.remove("SynthwaveScene")
        // this.scene.remove("WaitingforPlayer")
        // this.scene.remove("CountdownScene")
        // this.scene.remove('MultiplayerCompletedScene') //remove this scene
        // game.scene.add('MultiplayerCompletedScene', MultiplayerCompletedScene) //add new instance of level completed
        // game.scene.add('WaitingRoom', WaitingRoom)
        // game.scene.add('CountdownScene', CountdownScene)
        // game.scene.add("WaitingforPlayer", WaitingforPlayer)
        // game.scene.add('SynthwaveScene', SynthwaveScene)

    })
  }

  // playGoToNextLevelTween() {
  //   this.goToNextLevelTween = this.tweens.add({
  //     targets: this.goToNextLevelButton,
  //     duration: 600,
  //     repeat: -1,
  //     ease: Phaser.Math.Easing.Expo.InOut,
  //     // ease: Phaser.Math.Easing.Cubic.Out,
  //     alpha: 0,
  //     yoyo: true
  //   })
  // }

  update() {
    // this.scoreLabel.setText(Math.floor(this.scoreTween.getValue()))
    // this.healthLabel.setText(Math.floor(this.healthTween.getValue()))
  }
}
