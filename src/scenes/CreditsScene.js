import Phaser from 'phaser'

export default class CreditsScene extends Phaser.Scene {
  constructor() {
    super('CreditsScene');
  }

  create() {

    this.sound.pauseOnBlur = false; //prevent sound from cutting when you leave tab

    const width = this.game.config.width;
    const height = this.game.config.height;

    const backgroundImage = this.add.image(width*0.5, height*0.5, "title-background").setOrigin(0.5, 0.5).setScale(1.2);
    backgroundImage.alpha = 0.1;

    //addd text
    this.add.text(width*0.5, height*0.2, 'THIS AMAZING GAME WAS CREATED BY', { fontFamily: '"Press Start 2P"' }).setFontSize(20).setOrigin(0.5, 0.5).setColor('#ED6BF3')
    //our names
    this.add.text(width*0.5, height*0.28, 'TEAM PLUTO:', { fontFamily: '"Press Start 2P"' }).setFontSize(20).setOrigin(0.5, 0.5).setColor('#ED6BF3')

    this.add.text(width*0.08, height*0.38, 'Isaac Easton', { fontFamily: '"Press Start 2P"' }).setFontSize(18).setOrigin(0, 0.5)
    this.add.text(width*0.5, height*0.38, 'Brendan Bettencourt', { fontFamily: '"Press Start 2P"' }).setFontSize(18).setOrigin(0, 0.5)
    this.add.text(width*0.08, height*0.48, 'Mahfouz Basith', { fontFamily: '"Press Start 2P"' }).setFontSize(18).setOrigin(0, 0.5)
    this.add.text(width*0.5, height*0.48, 'Juan S. Auli', { fontFamily: '"Press Start 2P"' }).setFontSize(18).setOrigin(0, 0.5)

    this.add.text(width*0.5, height*0.6, 'SPECIAL THANKS TO:', { fontFamily: '"Press Start 2P"' }).setFontSize(20).setOrigin(0.5, 0).setColor('#ED6BF3')

    const thanks = this.add.text(width*0.5, height*0.7, 'Ricky Rhodes, Joe Alves, and Hannah Bates\n\n and the Regex Spaceship Team\n\n(Hope Fourie, Adria Orenstein,\n\nand Catalina McQuade)', { fontFamily: '"Press Start 2P"', boundsAlignH: 'center' }).setFontSize(18).setOrigin(0.5, 0)

    thanks.setAlign('center')

    this.createBack(this, 'MainMenuScene');
    //customize the back button for this page
    this.back.setFontSize(24)
    this.hoverIcon.setScale(0.07)
  }

  createBack(scene, previousScene) {
    this.scene.get('MainMenuScene').createClick(scene) //add click sound
    //add hover icon
    scene.hoverIcon = scene.add.sprite(100, 100, 'cassette-tape');
    scene.hoverIcon.setScale(0.08)
    scene.hoverIcon.setVisible(false);

    //add option to return to menu
    scene.back = scene.add.text(35, 40, 'Go Back', { fontFamily: '"Press Start 2P"' }).setFontSize(28).setOrigin(0, 0.5).setColor('#4DF3F5')

    scene.back.setInteractive();
    scene.back.on("pointerover", () => {
      scene.hoverIcon.setVisible(true);
      scene.back.setColor('#feff38')
      scene.hoverIcon.x = scene.back.x + scene.back.width + 50;
      scene.hoverIcon.y = scene.back.y;

      if (scene.data.systems.config === 'CreditsScene') {
        scene.hoverIcon.x -= 12;
      }
    })
    scene.back.on("pointerout", () => {
      scene.hoverIcon.setVisible(false);
      scene.back.setColor('#4DF3F5')
    })
    scene.back.on("pointerup", () => {
      scene.click.play();
      if (scene.unsubscribe) {
        scene.unsubscribe() //this is for the HighScoresScene (to ubsubscribe from store)
      }
      scene.scene.stop();
      scene.scene.start(previousScene);
    })
  }
}
