import Phaser from 'phaser'

export default class CreditsScene extends Phaser.Scene {
  constructor() {
    super('CreditsScene');
  }

  preload() {

  }

  create() {

    this.sound.pauseOnBlur = false; //prevent sound from cutting when you leave tab

    const width = this.game.config.width;
    const height = this.game.config.height;

    const backgroundImage = this.add.image(width*0.5, height*0.5, "title-background").setOrigin(0.5, 0.5).setScale(1.2);
    backgroundImage.alpha = 0.1;

    //addd text
    this.add.text(width*0.5, height*0.25, 'This amazing game\n\n was created by:', { fontFamily: '"Press Start 2P"' }).setFontSize(28).setOrigin(0.5, 0.5)
    //our names
    this.add.text(width*0.5, height*0.43, 'Isaac Easton', { fontFamily: '"Press Start 2P"' }).setFontSize(24).setOrigin(0.5, 0.5)
    this.add.text(width*0.5, height*0.58, 'Brendan Bettencourt', { fontFamily: '"Press Start 2P"' }).setFontSize(24).setOrigin(0.5, 0.5)
    this.add.text(width*0.5, height*0.73, 'Mahfouz Basith', { fontFamily: '"Press Start 2P"' }).setFontSize(24).setOrigin(0.5, 0.5)
    this.add.text(width*0.5, height*0.89, 'Juan S. Auli', { fontFamily: '"Press Start 2P"' }).setFontSize(24).setOrigin(0.5, 0.5)

    this.createBack(this, 'MainMenuScene');
  }

  createBack(scene, previousScene) {
    this.scene.get('MainMenuScene').createClick(scene) //add click sound
    //add hover icon
    scene.hoverIcon = scene.add.sprite(100, 100, 'cassette-tape');
    scene.hoverIcon.setScale(0.08)
    scene.hoverIcon.setVisible(false);

    //add option to return to menu
    const back = scene.add.text(35, 40, 'Go back', { fontFamily: '"Press Start 2P"' }).setFontSize(28).setOrigin(0, 0.5)

    back.setInteractive();
    back.on("pointerover", () => {
      scene.hoverIcon.setVisible(true);
      back.setColor('yellow')
      scene.hoverIcon.x = back.x + back.width + 50;
      scene.hoverIcon.y = back.y;
    })
    back.on("pointerout", () => {
      scene.hoverIcon.setVisible(false);
      back.setColor('white')
    })
    back.on("pointerup", () => {
      scene.click.play();
      scene.scene.start(previousScene);
    })
  }
}
