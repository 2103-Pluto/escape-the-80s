import Phaser from 'phaser'

export default class SaveScoreScene extends Phaser.Scene {
  constructor() {
    super('SaveScoreScene');
  }

  init(data) {
    this.score = data.score; //initialize score
    this.level = data.level; //initialize level
  }

  create() {
    this.width = this.game.config.width;
    this.height = this.game.config.height;
    const backgroundImage = this.add.image(this.width*0.5, this.height*0.5, "title-background").setOrigin(0.5, 0.5).setScale(1.2);
    backgroundImage.alpha = 0.1;

    //add background music
    const backgroundMusic = this.sound.add('title-music');
    backgroundMusic.setLoop(true);
    backgroundMusic.volume = 0.03;
    backgroundMusic.play();

    this.sound.pauseOnBlur = false; //prevent sound from stopping when you switch tabs

    this.hoverIcon = this.add.sprite(100, 100, 'cassette-tape').setScale(0.08);
    this.hoverIcon.setVisible(false)

    this.scene.get('MainMenuScene').createClick(this) //add click sound

    //add title
    this.add.text(this.width*0.5, this.height*0.1, 'SAVE SCORE', { fontFamily: '"Press Start 2P"' }).setFontSize(28).setOrigin(0.5).setColor('#ED6BF3')

    //add text for saving
    const save = this.add.text(this.width*0.5, this.height*0.6, 'Save', { fontFamily: '"Press Start 2P"' }).setFontSize(28).setOrigin(0.5).setColor('#4DF3F5')

    save.setInteractive();
    save.on("pointerover", () => {
      this.hoverIcon.setVisible(true);
      this.hoverIcon.x = save.x - 100;
      this.hoverIcon.y = save.y;
      save.setColor('#feff38')
    })
    save.on("pointerout", () => {
      this.hoverIcon.setVisible(false);
      save.setColor('#4DF3F5')
    })
    save.on("pointerup", () => {
      this.click.play();
      this.scene.start('HighScoresScene') //go to high scores
    })
  }
}
