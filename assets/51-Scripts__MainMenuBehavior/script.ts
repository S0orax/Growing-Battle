class MainMenuBehavior extends Sup.Behavior {
  awake() {
    
  }

  update() {
    if(Sup.Input.wasKeyJustPressed("R")) {
      Sup.loadScene("Game/Menu/RulesMenu");
    } else if(Sup.Input.wasKeyJustPressed("RETURN")) {
      Sup.loadScene("Game/Game");
    }
  }
}
Sup.registerBehavior(MainMenuBehavior);
