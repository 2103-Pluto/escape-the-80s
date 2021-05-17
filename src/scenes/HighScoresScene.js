import Phaser from 'phaser'

const records = [
  { name: 'AAA', score: 50, level: 1 },
  { name: 'JSA', score: 108, level: 2 },
  { name: 'JSA', score: 36, level: 1 },
  { name: 'ELM', score: 120, level: 1 },
  { name: 'ISC', score: 15, level: 1 },
  { name: 'ISC', score: 134, level: 2 },
  { name: 'ISC', score: 89, level: 1 },
  { name: 'MHZ', score: 29, level: 1 },
  { name: 'MHZ', score: 125, level: 2 },
  { name: 'BRE', score: 52, level: 1 },
  { name: 'BRE', score: 140, level: 2 },
  { name: 'MHZ', score: 100, level: 2 },
  { name: 'IOP', score: 90, level: 1 },
  { name: 'GNH', score: 109, level: 2 },
  { name: 'GNJ', score: 78, level: 1 },
  { name: 'ZZG', score: 97, level: 1 },
  { name: 'FIT', score: 164, level: 2 },
  { name: 'PUN', score: 60, level: 1 },
  { name: 'MKP', score: 79, level: 1 },
  { name: 'AAB', score: 91, level: 1 }
].sort((a,b) => b.score-a.score)

export default class HighScoresScene extends Phaser.Scene {
  constructor() {
    super('HighScoresScene');
  }

  create() {
    this.sound.pauseOnBlur = false; //prevent sound from cutting when you leave tab

    const width = this.game.config.width;
    const height = this.game.config.height;

    const backgroundImage = this.add.image(width*0.5, height*0.5, "title-background").setOrigin(0.5, 0.5).setScale(1.2);
    backgroundImage.alpha = 0.1;

    //add text
    this.add.text(width*0.5, height*0.175, 'HIGH SCORES', { fontFamily: '"Press Start 2P"' }).setFontSize(28).setOrigin(0.5, 0.5).setColor('#ED6BF3')

    //top row of the table
    this.add.text(width*0.2, height*0.25, 'Rank', { fontFamily: '"Press Start 2P"' }).setFontSize(24).setOrigin(0.5, 0.5).setColor('#4DF3F5')
    this.add.text(width*0.4, height*0.25, 'Name', { fontFamily: '"Press Start 2P"' }).setFontSize(24).setOrigin(0.5, 0.5).setColor('#4DF3F5')
    this.add.text(width*0.6, height*0.25, 'Level', { fontFamily: '"Press Start 2P"' }).setFontSize(24).setOrigin(0.5, 0.5).setColor('#4DF3F5')
    this.add.text(width*0.8, height*0.25, 'Score', { fontFamily: '"Press Start 2P"' }).setFontSize(24).setOrigin(0.5, 0.5).setColor('#4DF3F5')

    //table with scores
    for (let i=0; i<records.length; i++) {
      const record = records[i];
      const rank = this.add.text(width*0.2, height*(0.25 + 0.07*(i+1)), `${i+1}`, { fontFamily: '"Press Start 2P"' }).setFontSize(20).setOrigin(0.5, 0.5)
      const name = this.add.text(width*0.4, height*(0.25 + 0.07*(i+1)), `${record.name}`, { fontFamily: '"Press Start 2P"' }).setFontSize(20).setOrigin(0.5, 0.5)
      const level = this.add.text(width*0.6, height*(0.25 + 0.07*(i+1)), `${record.level}`, { fontFamily: '"Press Start 2P"' }).setFontSize(20).setOrigin(0.5, 0.5)
      const score = this.add.text(width*0.8, height*(0.25 + 0.07*(i+1)), `${record.score}`, { fontFamily: '"Press Start 2P"' }).setFontSize(20).setOrigin(0.5, 0.5)

      //colorize
      let color;
      if (i === 0) {
        color = '#F5452D'
      }
      else if (i === 1) {
        color = '#F57C2D'
      }
      else if (i === 2) {
        color = '#feff38'
      }

      if (color) {
        rank.setColor(color)
        name.setColor(color)
        level.setColor(color)
        score.setColor(color)
      }
    }

    this.scene.get('CreditsScene').createBack(this, 'MainMenuScene'); //Going back
  }
}
