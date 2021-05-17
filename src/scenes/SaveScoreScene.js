import Phaser from 'phaser'

export default class SaveScoreScene extends Phaser.Scene {
  constructor() {
    super('SaveScoreScene');

    this.chars = [
      ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
      ["K", "L", "M", "N", "O", "P", "Q", "R", "S", "T"],
      ["U", "V", "W", "X", "Y", "Z", ".", "-", "<", ">"]
    ];

    /*this.chars = [
      ["A", "B", "C", "D", "E"],
      ["F", "G", "H", "I", "J"],
      ["K", "L", "M", "N", "O"],
      ["P", "Q", "R", "S", "T"],
      ["U", "V", "W", "X", "Y"],
      ["Z", ".", "-", "<", ">"]
    ];*/

    this.rows = this.chars.length;
    this.columns = this.chars[0].length;

    this.cursor = new Phaser.Math.Vector2();

    this.text;
    this.block;

    this.name = "";
    this.charLimit = 3;
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

    //create input panel
    // this.createInputPanel()

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

  createInputPanel() {
    this.padding = 25;
    this.letterSpacing = 20;
    var charWidth = 32;
    var charHeight = 32;
    var lineHeight = 2;
    this.xSpacing = charWidth + this.letterSpacing;
    this.ySpacing = charHeight * lineHeight;

    var characters = "";
    for (let i = 0; i < this.chars.length; i++) {
      characters += this.chars[i].join("");
      if (i !== this.chars.length - 1) {
        characters += "\n".repeat(lineHeight);
      }
    }

    let text = this.add.bitmapText(30 + this.padding, 50, 'Press Start 2P', characters);

    text.setLetterSpacing(this.letterSpacing);
    text.setInteractive();

    this.add.image(
      text.x +
        charWidth * (this.columns - 1) -
        20 +
        this.letterSpacing * (this.columns - 2),
      text.y + charWidth * (lineHeight * (this.chars.length - 1)) + 20,
      "rub"
    );
    this.add.image(
      text.x +
        charWidth * this.columns -
        20 +
        this.letterSpacing * (this.columns - 1),
      text.y + charWidth * (lineHeight * (this.chars.length - 1)) + 20,
      "end"
    );

    this.block = this.add.image(text.x - 10, text.y - 2, "block").setOrigin(0);

    this.text = text;

    this.input.keyboard.on("keyup_LEFT", this.moveLeft, this);
    this.input.keyboard.on("keyup_RIGHT", this.moveRight, this);
    this.input.keyboard.on("keyup_UP", this.moveUp, this);
    this.input.keyboard.on("keyup_DOWN", this.moveDown, this);
    this.input.keyboard.on("keyup_ENTER", this.pressKey, this);
    this.input.keyboard.on("keyup_SPACE", this.pressKey, this);
    this.input.keyboard.on("keyup", this.anyKey, this);

    text.on("pointermove", this.moveBlock, this);
    text.on("pointerup", this.pressKey, this);

    this.tweens.add({
      targets: this.block,
      alpha: 0.2,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
      duration: 350
    });
  }

  moveBlock(pointer, x, y) {
    let cx = Phaser.Math.Snap.Floor(x, this.xSpacing, 0, true);
    let cy = Phaser.Math.Snap.Floor(y, this.ySpacing, 0, true);

    if (cy <= this.rows - 1 && cx <= this.columns - 1) {
      this.cursor.set(cx, cy);

      this.block.x = this.text.x - 10 + cx * this.xSpacing;
      this.block.y = this.text.y - 2 + cy * this.ySpacing;
    }
  }

  moveLeft() {
    if (this.cursor.x > 0) {
      this.cursor.x--;
      this.block.x -= this.xSpacing;
    } else {
      this.cursor.x = 9;
      this.block.x += this.xSpacing * 9;
    }
  }

  moveRight() {
    if (this.cursor.x < 9) {
      this.cursor.x++;
      this.block.x += this.xSpacing;
    } else {
      this.cursor.x = 0;
      this.block.x -= this.xSpacing * 9;
    }
  }

  moveUp() {
    if (this.cursor.y > 0) {
      this.cursor.y--;
      this.block.y -= this.ySpacing;
    } else {
      this.cursor.y = 2;
      this.block.y += this.ySpacing * 2;
    }
  }

  moveDown() {
    if (this.cursor.y < 2) {
      this.cursor.y++;
      this.block.y += this.ySpacing;
    } else {
      this.cursor.y = 0;
      this.block.y -= this.ySpacing * 2;
    }
  }

  anyKey(event) {
    //  Only allow A-Z . and -

    let code = event.keyCode;

    if (code === Phaser.Input.Keyboard.KeyCodes.PERIOD) {
      this.cursor.set(6, 2);
      this.pressKey();
    } else if (code === Phaser.Input.Keyboard.KeyCodes.MINUS) {
      this.cursor.set(7, 2);
      this.pressKey();
    } else if (
      code === Phaser.Input.Keyboard.KeyCodes.BACKSPACE ||
      code === Phaser.Input.Keyboard.KeyCodes.DELETE
    ) {
      this.cursor.set(8, 2);
      this.pressKey();
    } else if (
      code >= Phaser.Input.Keyboard.KeyCodes.A &&
      code <= Phaser.Input.Keyboard.KeyCodes.Z
    ) {
      code -= 65;

      let y = Math.floor(code / 10);
      let x = code - y * 10;

      this.cursor.set(x, y);
      this.pressKey();
    }
  }

  pressKey() {
    let x = this.cursor.x;
    let y = this.cursor.y;
    let nameLength = this.name.length;

    this.block.x = this.text.x - 10 + x * this.xSpacing;
    this.block.y = this.text.y - 2 + y * this.ySpacing;

    if (x === this.columns - 1 && y === this.rows - 1 && nameLength > 0) {
      //  Submit
      this.events.emit("submitName", this.name);
    } else if (
      x === this.columns - 2 &&
      y === this.rows - 1 &&
      nameLength > 0
    ) {
      //  Rub
      this.name = this.name.substr(0, nameLength - 1);

      this.events.emit("updateName", this.name);
    } else if (this.name.length < this.charLimit) {
      //  Add
      this.name = this.name.concat(this.chars[y][x]);

      this.events.emit("updateName", this.name);
    }
  }
}
