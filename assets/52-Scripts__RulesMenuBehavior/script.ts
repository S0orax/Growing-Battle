class RulesMenuBehavior extends Sup.Behavior {
  awake() {
    
  }

  update() {
    if(Sup.Input.wasKeyJustPressed("RETURN")) {
      Sup.loadScene("Game/Game");
    }
  }
}
Sup.registerBehavior(RulesMenuBehavior);
