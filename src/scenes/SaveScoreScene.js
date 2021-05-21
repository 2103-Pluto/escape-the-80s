import Phaser from 'phaser'
import store from '../store'
import { addRecord } from '../store/records'

export default class SaveScoreScene extends Phaser.Scene {
  constructor() {
    super('SaveScoreScene');

    this.chars = [
      [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J' ],
      [ 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T' ],
      [ 'U', 'V', 'W', 'X', 'Y', 'Z', '.', '-', '<', '>']
    ];

    this.cursor = new Phaser.Math.Vector2();

    this.text;
    this.block;

    this.name = '';
    this.charLimit = 3;
    this.playerText;
    this.activeToHighScores = false;
    this.savedRecord = false;
  }

  init(data) {
    this.score = data.score; //initialize score
    this.level = data.level; //initialize level
  }

  preload() {
    this.load.image('block', 'assets/input/block.png');
    this.load.image('rub', 'assets/input/rub.png');
    this.load.image('end', 'assets/input/end.png');

    this.load.bitmapFont('arcade', 'assets/input/arcade.png', 'assets/input/arcade.xml');

    this.load.audio("denied", "assets/audio/denied.wav");
  }

  create() {
    this.width = this.game.config.width;
    this.height = this.game.config.height;
    const backgroundImage = this.add.image(this.width*0.5, this.height*0.5, "title-background").setOrigin(0.5, 0.5).setScale(1.2);
    backgroundImage.alpha = 0.1;

    //add denied sound
    this.deniedSound = this.sound.add('denied');
    this.deniedSound.volume = 0.07;

    //add background music
    this.game.sound.stopAll() //stop previous music
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

    //score
    this.add.text(this.width*0.25, this.height*0.25, `Score: ${this.score}`, { fontFamily: '"Press Start 2P"' }).setFontSize(26).setOrigin(0.5).setColor('#4DF3F5')

    //level
    this.add.text(this.width*0.75, this.height*0.25, `Level: ${this.level}`, { fontFamily: '"Press Start 2P"' }).setFontSize(26).setOrigin(0.5).setColor('#4DF3F5')

    //instructions
    this.add.text(this.width*0.5, this.height*0.35, 'Enter your name (3 characters)', { fontFamily: '"Press Start 2P"' }).setFontSize(24).setOrigin(0.5)

    //leters entered
    this.playerText = this.add.text(this.width*0.5, this.height*0.45, '', { fontFamily: '"Press Start 2P"' }).setFontSize(28).setOrigin(0.5).setColor('#feff38')

    //create input panel
    this.createInputPanel()

    //create go to high scores button
    this.createToHighScores()
  }

  createInputPanel() {
    let text = this.add.bitmapText(150, 300, 'arcade', 'ABCDEFGHIJ\n\nKLMNOPQRST\n\nUVWXYZ.-');

    text.setLetterSpacing(20);
    text.setInteractive();

    this.add.image(text.x + 430, text.y + 148, 'rub');
    this.add.image(text.x + 482, text.y + 148, 'end');

    this.block = this.add.image(text.x - 10, text.y - 2, 'block').setOrigin(0);

    this.text = text;
    this.text.setInteractive();

    //listen to events
    this.events.on('updateName', this.updateName, this)
    this.events.on('submitName', this.submitName, this)
    this.text.on('pointermove', this.moveBlock, this)
    this.text.on('pointerup', this.pressKey, this)


    this.tweens.add({
      targets: this.block,
      alpha: 0.2,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
      duration: 350
    });
  }

  moveBlock(pointer, x, y) {
    let cx = Phaser.Math.Snap.Floor(x, 52, 0, true);
    let cy = Phaser.Math.Snap.Floor(y, 64, 0, true);
    let char = this.chars[cy][cx];

    this.cursor.set(cx, cy);

    this.block.x = this.text.x - 10 + (cx * 52);
    this.block.y = this.text.y - 2 + (cy * 64);
  }

  pressKey() {
    let x = this.cursor.x;
    let y = this.cursor.y;
    let nameLength = this.name.length;

    this.block.x = this.text.x - 10 + (x * 52);
    this.block.y = this.text.y - 2 + (y * 64);

    if (x === 9 && y === 2) {
        //  Submit
        this.events.emit('submitName', this.name);
    }
    else if (x === 8 && y === 2) {
      //  Rub
      if (nameLength > 0) {
        this.name = this.name.substr(0, nameLength - 1);

        this.events.emit('updateName', this.name);
      } else {
        this.deniedSound.play()
      }
    }
    else {
      //  Add
      if (this.name.length < this.charLimit) {
        this.name = this.name.concat(this.chars[y][x]);
        this.events.emit('updateName', this.name);
        this.click.play();
      }
      else {
        this.deniedSound.play()
      }
    }
  }

  updateName(name) {
    name.includes('>') ?
    this.deniedSound.play()
    : this.playerText.setText(name)
  }

  submitName(name) {
    if (name.length === 3 && !this.savedRecord) {
      this.click.play();
      store.dispatch(addRecord( //create a new record
        name,
        this.score,
        this.level
      ))
      this.activeToHighScores = true;
      this.toHighScores.setVisible(true)
      this.savedRecord = true;
    } else {
      this.deniedSound.play() //name is not valid
    }

  }

  createToHighScores() {
    this.toHighScores = this.add.text(this.width*0.5, this.height*0.9, 'Go to High Scores', { fontFamily: '"Press Start 2P"' }).setFontSize(28).setOrigin(0.5).setColor('#4DF3F5')
    this.toHighScores.setVisible(false)

    this.toHighScores.setInteractive();
    this.toHighScores.on("pointerover", () => {
      if (this.activeToHighScores) {
        this.hoverIcon.setVisible(true);
        this.toHighScores.setColor('#feff38')
        this.hoverIcon.x = this.toHighScores.x - this.toHighScores.width/2 - 45;
        this.hoverIcon.y = this.toHighScores.y;
      }
    })
    this.toHighScores.on("pointerout", () => {
      if (this.activeToHighScores) {
        this.hoverIcon.setVisible(false);
        this.toHighScores.setColor('#4DF3F5')
      }
    })
    this.toHighScores.on("pointerup", () => {
      if (this.activeToHighScores) {
        const game = this.game;
        this.click.play();
        this.scene.start('HighScoresScene')
        this.scene.remove('SaveScoreScene')
        game.scene.add('SaveScoreScene', SaveScoreScene)
      }
    })
  }
}
