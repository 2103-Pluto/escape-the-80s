import 'phaser';

export default class Bomb extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, spriteKey, facingLeft) {
    super(scene, x, y, spriteKey)
    this.scene = scene
    
    this.scene = scene;
    // Add laser to scene and enable physics
    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);
    // true or false
    this.facingLeft = facingLeft;
    // Set how fast the laser travels (pixels/ms). Hard coded it here for simplicity
    this.speed = Phaser.Math.GetSpeed(400, -400); // (distance in pixels, time (ms))
    // How long the laser will live (ms). Hard coded here for simplicity
    this.lifespan = 5000;

    this.body.setAllowGravity(true);
    this.reset(x, y, facingLeft)
  }
  
  reset(x, y, facingLeft) {
    this.setActive(true);
    this.setVisible(true);
    this.lifespan = 5000;
    this.facingLeft = facingLeft
    this.setPosition(x, y)
  }
  
  update(time, delta) {
    this.lifespan -= delta;
    const moveDistance = this.speed * delta
    this.body.angle++
    if (this.lifespan <= 0) {
      this.setActive(false);
      this.destroy()
      this.setVisible(false);
    }
    
    
  }
}

