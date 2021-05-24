import Phaser from "phaser";

export default class WaitingRoom extends Phaser.Scene {
  constructor() {
    super("WaitingRoom");
  }

  init(data) {
    this.socket = data.socket;
  }

  preload() {
    this.load.html("codeform", "assets/text/codeform.html");
    this.load.audio("denied", "assets/audio/denied.wav");
  }

  create() {
    const scene = this;
    document.querySelector("div").style.display = "block";
    scene.width = scene.game.config.width;
    scene.height = scene.game.config.height;

    scene.popUp = scene.add.graphics();
    scene.boxes = scene.add.graphics();

    // for popup window
    // scene.popUp.lineStyle(1, 0xffffff);
    // scene.popUp.fillStyle(0xffffff, 0.5);
    scene.popUp.lineStyle(1, 0x000000);
    scene.popUp.fillStyle(0x000000, 0.8);

    // for boxes
    // scene.boxes.lineStyle(1, 0xffffff);
    // scene.boxes.fillStyle(0xa9a9a9, 1);
    scene.boxes.lineStyle(1, 0xffffff);
    scene.boxes.fillStyle(0x000000, 0);

    // popup window
    scene.popUp.strokeRect(25, 25, 750, 500);
    scene.popUp.fillRect(25, 25, 750, 500);

    //title
    scene.title = scene.add.text(scene.width*0.5, scene.width*0.15, "ESCAPE THE 80s", {
      // fill: "#add8e6",
      // fontSize: "66px",
      // fontStyle: "bold",
      fill: '#feff38',
      fontSize: '30px',
      fontFamily: '"Press Start 2P"'
    }).setOrigin(0.5,0.5);

    //left popup
    scene.boxes.strokeRect(100, 200, 275, 100);
    scene.boxes.fillRect(100, 200, 275, 100);
    scene.requestButton = scene.add.text(110, 215, "Request Room Key", {
      // fill: "#000000",
      // fontSize: "20px",
      // fontStyle: "bold",
      fill: '#4DF3F5',
      fontSize: '16px',
      fontFamily: '"Press Start 2P"'
    });

    //right popup
    scene.boxes.strokeRect(425, 200, 275, 100);
    scene.boxes.fillRect(425, 200, 275, 100);
    // const codeForm = this.cache.html.get('codeform')
    // //console.log(codeForm)
    scene.inputElement = scene.add.scene.inputElement = scene.add
      .dom(562.5, 250)
      .createFromCache("codeform");
    console.log(scene.inputElement);
    scene.inputElement.addListener("click");
    scene.inputElement.on("click", function (event) {
      event.preventDefault();
      if (event.target.name === "enterRoom") {
        const input = scene.inputElement.getChildByName("code-form");
        scene.socket.emit("isKeyValid", input.value);
      }
    });
    scene.addStyling(scene)

    scene.notValidText = scene.add.text(451, 275, "", {
      // fill: "#ff0000",
      // fontSize: "20px",
      fill: '#F5452D',
      fontSize: '14px',
      fontFamily: '"Press Start 2P"'
    });
    scene.roomKeyText = scene.add.text(200, 255, "", {
      // fill: "#000000",
      // fontSize: "25px",
      // fontStyle: "bold",
      // fill: '#4DF3F5',
      fontSize: '16px',
      fontFamily: '"Press Start 2P"'
    });

    scene.socket.on("roomCreated", function (roomKey) {
      scene.roomKey = roomKey;
      scene.roomKeyText.setText(scene.roomKey);
    });

    scene.socket.on("keyNotValid", function () {
      scene.deniedSound.play();
      scene.notValidText.setText("Invalid Room Key");
    });
    scene.socket.on("keyIsValid", function (response) {
      const key = response[0];
      const playerNumber = response[1];
      scene.socket.emit("joinRoom", key);
      scene.scene.stop("WaitingRoom");
      if (playerNumber < 2) scene.scene.launch("WaitingforPlayer");
    });
  }
  update() {}

  addStyling(scene) {
    //request button
    scene.requestButton.setInteractive();
    scene.scene.get('MainMenuScene').createClick(scene) // add clicking sound
    scene.requestButton.on("pointerdown", () => {
      scene.click.play();
      scene.socket.emit("getRoomCode");
    });

    //add denied sound
    this.deniedSound = this.sound.add('denied');
    this.deniedSound.volume = 0.1;
  }
}
