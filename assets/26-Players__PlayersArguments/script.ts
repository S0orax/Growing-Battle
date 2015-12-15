class PlayersArgumentsBehavior {
  public static solidBodies:Sup.ArcadePhysics2D.Body[] = [];
  public static itemBodies:Sup.ArcadePhysics2D.Body[] = [];
  public static playerBodies:Sup.ArcadePhysics2D.Body[] = [];
  
  initBodies() {
    let solidActors = Sup.getActor("Solids").getChildren();
    let itemActors = Sup.getActor("Items").getChildren();
    let playerActors = Sup.getActor("Players").getChildren();
    
    for(let solidActor of solidActors) PlayersArgumentsBehavior.solidBodies.push(solidActor.arcadeBody2D);
    for(let itemActor of itemActors) PlayersArgumentsBehavior.itemBodies.push(itemActor.arcadeBody2D);
    for(let playerActor of playerActors) PlayersArgumentsBehavior.playerBodies.push(playerActor.arcadeBody2D);
  }
}
