import Phaser from "phaser";

export default class Countdown extends Phaser.Scene {
  constructor() {
    super("CountdownScene");
  }

  preload() {
    this.load.audio("race", "assets/audio/racing_count.mp3");
    this.load.audio("raceStart", "assets/audio/race_start.mp3");
  }

  create() {
    this.raceSound = this.sound.add("race");
    this.raceSound.volume = 0.3;

    this.raceStart = this.sound.add("raceStart");
    this.raceStart.volume = 0.3;
    this.countingDown();
  }

  countingDown() {
    this.raceSound.play();
    this.initialTime = 3;
    const screenCenterX =
      this.cameras.main.worldView.x + this.cameras.main.width / 2;
    const screenCenterY =
      this.cameras.main.worldView.y + this.cameras.main.height / 2;
    this.instructions = this.add
      .text(
        screenCenterX,
        screenCenterY - 50,
        "First to the flagpole wins!!!",
        { fontFamily: '"Press Start 2P"' }
      )
      .setFontSize(20)
      .setOrigin(0.5)
      .setColor('#feff38');
    this.countDownText = this.add
      .text(screenCenterX, screenCenterY, "Start Race in:" + this.initialTime, {
        fontFamily: '"Press Start 2P"',
      })
      .setFontSize(40)
      .setOrigin(0.5)
      .setColor('#feff38');
    this.timedEvent = this.time.addEvent({
      delay: 1000,
      callback: this.countDown,
      callbackScope: this,
      loop: true,
    });
  }

  countDown() {
    if (this.initialTime > 1) this.raceSound.play();
    else this.raceStart.play();
    this.initialTime--;
    this.countDownText.setText("Start Race in:" + this.initialTime);
    if (this.initialTime <= 0) {
      this.countDownText.setText("Go");
      this.scene.stop("CountdownScene");
      this.scene.resume("SynthwaveScene");

      this.timedEvent.remove();
    }
  }
}
