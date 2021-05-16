import Phaser from 'phaser'

export default class StoryScene extends Phaser.Scene {
  constructor() {
    super('StoryScene');
  }

  init(data) {
    this.color = data.color //retrieve color
  }

  create() {
    this.sound.pauseOnBlur = false; //prevent sound from cutting when you leave tab

    const width = this.game.config.width;
    const height = this.game.config.height;

    //add text
    this.add.text(width*0.5, height*0.5, 'Story Will Go Here', { fontFamily: '"Press Start 2P"' }).setFontSize(28).setOrigin(0.5, 0.5)

    //add back
    this.scene.get('CreditsScene').createBack(this, 'CharacterChoosingScene');
    // add skip
    const skip = this.add.text(710, 40, 'Skip', { fontFamily: '"Press Start 2P"' }).setFontSize(28).setOrigin(0.5, 0.5).setColor('#4DF3F5')
    skip.setInteractive();
    skip.on("pointerover", () => {
      this.hoverIcon.setVisible(true);
      skip.setColor('#feff38')
      this.hoverIcon.x = skip.x - skip.width + 5;
      this.hoverIcon.y = skip.y;
    })
    skip.on("pointerout", () => {
      this.hoverIcon.setVisible(false);
      skip.setColor('white')
    })
    skip.on("pointerup", () => {
      this.click.play();
      this.scene.start('SinglePlayerSynthwaveScene', { color: this.color });
    })

  }
}
