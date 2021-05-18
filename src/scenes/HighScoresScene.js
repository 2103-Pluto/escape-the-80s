import Phaser from 'phaser';
import store from '../store';
import { fetchRecords } from '../store/records'

export default class HighScoresScene extends Phaser.Scene {
  constructor() {
    super('HighScoresScene');
  }

  create() {
    this.width = this.game.config.width;
    this.height = this.game.config.height;

    //retrieve top 10 records
    this.retrieveRecords();

    this.sound.pauseOnBlur = false; //prevent sound from cutting when you leave tab

    const backgroundImage = this.add.image(this.width*0.5, this.height*0.5, "title-background").setOrigin(0.5, 0.5).setScale(1.2);
    backgroundImage.alpha = 0.1;

    //add text
    this.add.text(this.width*0.5, this.height*0.175, 'HIGH SCORES', { fontFamily: '"Press Start 2P"' }).setFontSize(28).setOrigin(0.5, 0.5).setColor('#ED6BF3')

    //top row of the table
    this.add.text(this.width*0.2, this.height*0.25, 'Rank', { fontFamily: '"Press Start 2P"' }).setFontSize(24).setOrigin(0.5, 0.5).setColor('#4DF3F5')
    this.add.text(this.width*0.4, this.height*0.25, 'Name', { fontFamily: '"Press Start 2P"' }).setFontSize(24).setOrigin(0.5, 0.5).setColor('#4DF3F5')
    this.add.text(this.width*0.6, this.height*0.25, 'Level', { fontFamily: '"Press Start 2P"' }).setFontSize(24).setOrigin(0.5, 0.5).setColor('#4DF3F5')
    this.add.text(this.width*0.8, this.height*0.25, 'Score', { fontFamily: '"Press Start 2P"' }).setFontSize(24).setOrigin(0.5, 0.5).setColor('#4DF3F5')

    this.scene.get('CreditsScene').createBack(this, 'MainMenuScene'); //Going back
  }

  retrieveRecords() {
    store.dispatch(fetchRecords())
    this.unsubscribe = store.subscribe(() => { //subdscribe to the store
      this.records = store.getState().records.topRecords;

      //table with scores
      for (let i=0; i<this.records.length; i++) {
        const record = this.records[i];
        const rank = this.add.text(this.width*0.2, this.height*(0.25 + 0.07*(i+1)), `${i+1}`, { fontFamily: '"Press Start 2P"' }).setFontSize(20).setOrigin(0.5, 0.5)
        const name = this.add.text(this.width*0.4, this.height*(0.25 + 0.07*(i+1)), `${record.name}`, { fontFamily: '"Press Start 2P"' }).setFontSize(20).setOrigin(0.5, 0.5)
        const level = this.add.text(this.width*0.6, this.height*(0.25 + 0.07*(i+1)), `${record.level}`, { fontFamily: '"Press Start 2P"' }).setFontSize(20).setOrigin(0.5, 0.5)
        const score = this.add.text(this.width*0.8, this.height*(0.25 + 0.07*(i+1)), `${record.score}`, { fontFamily: '"Press Start 2P"' }).setFontSize(20).setOrigin(0.5, 0.5)

        //colorize
        let color;
        if (i === 0) {
          color = '#F5452D' //arcade red
        }
        else if (i === 1) {
          color = '#F57C2D' //arcade orange
        }
        else if (i === 2) {
          color = '#feff38' //arcade yellow
        }

        if (color) {
          rank.setColor(color)
          name.setColor(color)
          level.setColor(color)
          score.setColor(color)
        }
      }
    })
  }
}
