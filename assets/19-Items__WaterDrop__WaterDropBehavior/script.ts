class WaterDropBehavior extends Sup.Behavior {
  awake() {
    //this.actor.arcadeBody2D.setCustomGravity({x:0, y:0});
  }

  update() {
    Sup.ArcadePhysics2D.collides(this.actor.arcadeBody2D, PlayersArgumentsBehavior.solidBodies);
  }
}
Sup.registerBehavior(WaterDropBehavior);
