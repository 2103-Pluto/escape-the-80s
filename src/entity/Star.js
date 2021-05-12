import 'phaser'

export default class Star extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, spriteKey) {
    super(scene, x, y, spriteKey)
    // Store reference of scene passed to constructor
    this.scene = scene;
    // Add star to scene and enable physics
    // this.scene.physics.world.enable(this);
    this.x = x,
    this.y = y
    this.scene.add.existing(this);
  }
  
  
}
