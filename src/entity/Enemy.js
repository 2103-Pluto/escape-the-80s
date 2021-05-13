export default class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, spriteKey) {
    super(scene, x, y, spriteKey);
    // Store reference of scene passed to constructor
    this.scene = scene;
    let enemy = this
    // Add enemy to scene and enable physics
    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);

    // Turn him around to face player
    this.flipX = !this.flipX;

    this.playedSound = false;
    
    this.setPushable(false)
    // this.scene.physics.add.collider(this, this.scene.groundGroup);
    
    // this.scene.physics.add.collider(this, this.scene.player, function (){
    //   //enemy.setPushable(false)
    //   console.log('collision', enemy)
    // });
    console.log('SCENE', this.scene)
    console.log('what is', this)
  }

  

  update(screamSound) {
    // if (this.y > 600 && !this.playedSound) {
    //   this.playedSound = true;
    //   screamSound.play();
    // }
  }
}
