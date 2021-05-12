import 'phaser';

export default class MuzzleFlash extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, spriteKey, facingLeft) {
    super(scene, x, y, spriteKey);
    // Store reference of scene passed to constructor
    this.scene = scene;
    // Add laser to scene and enable physics
    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);
    this.facingLeft = facingLeft;
    if (this.facingLeft) this.flipX = !this.flipX

// How long the laser will live (ms). Hard coded here for simplicity
    this.lifespan = 22;
// Important to not apply gravity to the laser bolt!
    this.body.setAllowGravity(false);
  //  this.reset(x, y, facingLeft)
  }

  // reset(x, y, facingLeft) {
  //   this.setActive(true);
  //   this.setVisible(true);
  //   this.lifespan = 500;
  //   this.facingLeft = facingLeft
  //   this.setPosition(x, y)
  // }

  update(delta) {
    this.lifespan -= delta;
    if (this.lifespan <= 0) this.setVisible(false);
  }

  reset(x, y, facingLeft) {
    this.setPosition(x, y);
    this.lifespan = 20;
    this.setVisible(true);
    if (this.facingLeft !== facingLeft) {
      this.flipX = !this.flipX;
      this.facingLeft = facingLeft;
    }
  }

}
