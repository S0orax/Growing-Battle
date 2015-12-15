class FlowerBehavior extends Sup.Behavior {
  step:number;
  
  awake() {
    this.step = 1;
  }

  update() {
    Sup.ArcadePhysics2D.collides(this.actor.arcadeBody2D, PlayersArgumentsBehavior.solidBodies);
    this.actor.spriteRenderer.setAnimation("Step" + this.step);
  }
}
Sup.registerBehavior(FlowerBehavior);
