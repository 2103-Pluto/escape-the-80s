import 'phaser';

export default class Explosion extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, spriteKey, facingLeft) {
    super(scene, x, y, spriteKey)
    this.scene = scene
    
    this.scene = scene;
    // Add explosion to scene and enable physics
    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);

    // How long the explosion will live (ms). Hard coded here for simplicity
    this.lifespan = 5000;

    this.body.setAllowGravity(true);
    this.reset(x, y)
  }
  
  reset(x, y) {
    this.setActive(true);
    this.setVisible(true);
    this.lifespan = 5000;
    this.setPosition(x, y)
  }
  
  update(time, delta) {
    this.lifespan -= delta;
    if (this.lifespan <= 0) {
      this.setActive(false);
      this.destroy()
      this.setVisible(false);
    }
    
    
  }
}
