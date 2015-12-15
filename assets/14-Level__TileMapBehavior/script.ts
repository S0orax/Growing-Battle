class TileMapBehavior extends Sup.Behavior {
  awake() {
    this.actor.tileMapRenderer.setLayerOpacity(1, 0);
  }
  
}
Sup.registerBehavior(TileMapBehavior);
