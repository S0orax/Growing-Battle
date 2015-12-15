class CameraBehavior extends Sup.Behavior {
  
  private playerTicket:Sup.Actor;
  
  awake() {
    this.playerTicket = null;
  }

  update() {
    if(this.playerTicket != null) {
      this.moveInterpolation(this.playerTicket.getPosition(), 0.3);
    }
  }

  private moveInterpolation(target:Sup.Math.Vector3, time:number) {
    let lerpPosition = this.actor.getPosition().lerp(target, time);
    lerpPosition.y = 5;
    lerpPosition.z = 5;
    this.actor.setPosition(lerpPosition);
  }

  public setTicket(player:Sup.Actor) {
    this.playerTicket = player;
  }
}
Sup.registerBehavior(CameraBehavior);
