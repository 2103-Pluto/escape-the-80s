import 'phaser';

export default class Heart extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, spriteKey) {
    super(scene, x, y, spriteKey);
    // Store reference of scene passed to constructor
    this.scene = scene;
    this.x = x;
    this.y = y;
    // Add heart to world
    this.scene.add.existing(this);
  }

}
