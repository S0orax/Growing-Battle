class PlayerBehavior extends Sup.Behavior {
  
  private jumpBlock = 3;
  private jumpSpeed = this.jumpBlock / 10;
  private hasWater = false;
  private justAttack = false;
  private attackPassage = 0;
  private isDead = false;
  private time = 0;
  private timeToDeath = 0;
  private flower:Sup.Actor;
    

  speed:number;
  up:string;
  left:string;
  right:string;
  attackKey:string;
  spawnTileId:number;
  flowerName:string;

  awake() {
    let map = Sup.getActor("Map").tileMapRenderer.getTileMap();
    this.flower = Sup.getActor("Flowers").getChild(this.flowerName);

    this.calculSpawn(map);
    let args = new PlayersArgumentsBehavior();
    
    if(this.spawnTileId == 14) args.initBodies();
  }

  calculSpawn(map:Sup.TileMap) {
    for(let i = 0; i < map.getWidth(); i++) {
      for(let j = 0; j < map.getHeight(); j++) {
        let tile = map.getTileAt(1, i, j);
        if(tile == this.spawnTileId) {
          let xSpawn = i / 2 + this.actor.arcadeBody2D.getSize().width / 2;
          let ySpawn = j / map.getPixelsPerUnit() * this.actor.spriteRenderer.getSprite().getPixelsPerUnit() / 2;
          this.actor.arcadeBody2D.warpPosition(xSpawn, ySpawn);
          break;
        }
      }
    }
  }

  update() {
    Sup.ArcadePhysics2D.collides(this.actor.arcadeBody2D, PlayersArgumentsBehavior.solidBodies);

    let velocity = this.actor.arcadeBody2D.getVelocity();
    
    if(this.isDead) {
      this.spawnAfterDeath();
    } else {
      let prefix = "Stdr_";
      if(this.hasWater) prefix = "Water_";

      velocity.x = 0;

      if(Sup.Input.isKeyDown(this.left)) {
        velocity.x -= this.speed;
        this.actor.spriteRenderer.setHorizontalFlip(true);
      }
      if(Sup.Input.isKeyDown(this.right)) {
        velocity.x += this.speed;
        this.actor.spriteRenderer.setHorizontalFlip(false);
      }
      if(this.actor.arcadeBody2D.getTouches().bottom && Sup.Input.wasKeyJustPressed(this.up)) {
        Sup.Audio.playSound("Sound/Jump", 0.1);
        velocity.y = this.jumpSpeed;
      }
      if(Sup.Input.wasKeyJustPressed(this.attackKey)) {
        this.attack(prefix);
        this.attackPassage = 1;
      }

      for(let item of PlayersArgumentsBehavior.itemBodies) {
        if(Sup.ArcadePhysics2D.collides(this.actor.arcadeBody2D, item)) {
          if(this.actor.arcadeBody2D.getTouches()) {
            let index = PlayersArgumentsBehavior.itemBodies.indexOf(item);
            PlayersArgumentsBehavior.itemBodies.splice(index, 1);
            item.actor.destroy();
            this.hasWater = true;
            break;
          }
        }
      }
      
      if(Sup.ArcadePhysics2D.collides(this.actor.arcadeBody2D, this.flower.arcadeBody2D)) {
        if(this.hasWater) {
          this.hasWater = false;
          let flowerBehavior = this.flower.getBehavior(FlowerBehavior);
          flowerBehavior.step++;
          if(flowerBehavior.step == 4) {
            if(this.flowerName = "BlueFlower") Sup.loadScene("Game/Menu/BlueWin");
            else Sup.loadScene("Game/Menu/RedWin");
            return;
          }
          this.createWaterDrop(Sup.getActor("Items").getPosition());
        }
      }
      
      let camera = Sup.getActor("Camera");
      let leftCamera = camera.getPosition().x - camera.camera.getOrthographicScale() / 2 - 5;
      let rightCamera = camera.getPosition().x + camera.camera.getOrthographicScale() / 2 + 5;
      let bottomCamera = camera.getPosition().y - camera.camera.getOrthographicScale();
      let upCamera = camera.getPosition().y + camera.camera.getOrthographicScale();
      
      if(this.actor.getPosition().x < leftCamera || this.actor.getPosition().x > rightCamera) {
        this.dead();
      }

      this.checkAnimation(velocity, prefix);

      this.actor.arcadeBody2D.setVelocity(velocity);
    }
  }

  private createWaterDrop(position:Sup.Math.Vector3) {
    let itemsNode = Sup.getActor("Items");
    let waterActor = new Sup.Actor("WaterDrop", itemsNode);
    waterActor.spriteRenderer = new Sup.SpriteRenderer(waterActor);
    waterActor.spriteRenderer.setSprite("Items/WaterDrop/Sprite");
    waterActor.spriteRenderer.setAnimation("Animation", true);
    waterActor.setVisible(true);
    waterActor.arcadeBody2D = new Sup.ArcadePhysics2D.Body(waterActor, Sup.ArcadePhysics2D.BodyType.Box, {movable:true, width:0.5, height:0.5});
    PlayersArgumentsBehavior.itemBodies.push(waterActor.arcadeBody2D);
    waterActor.addBehavior(WaterDropBehavior);

    waterActor.arcadeBody2D.warpPosition(position);
  }

  checkAnimation(velocity:Sup.Math.Vector2, prefix:string) {
    if(this.justAttack) {
      if(this.actor.spriteRenderer.getAnimationFrameIndex() == 0) {
        if(this.attackPassage == 2) this.justAttack = false;
      }
      if(this.actor.spriteRenderer.getAnimationFrameIndex() == 2) {
        this.attackPassage = 2;
      }
    } else {
      if(velocity.x === 0) this.actor.spriteRenderer.setAnimation(prefix + "Idle");
      else this.actor.spriteRenderer.setAnimation(prefix + "Walk");
    }
    
  }

  attack(prefix:string) {
    Sup.Audio.playSound("Sound/Hit");
    this.justAttack = true;
    this.actor.spriteRenderer.setAnimation(prefix + "Attack");
    for(let ennemy of PlayersArgumentsBehavior.playerBodies) {
      if(Sup.ArcadePhysics2D.collides(this.actor.arcadeBody2D, ennemy)) {
        if(this.actor.arcadeBody2D.getTouches()) {
          let ennemyBehavior = ennemy.actor.getBehavior(PlayerBehavior);
          ennemyBehavior.dead();
          let camera = Sup.getActor("Camera");
          let cameraBehavior = camera.getBehavior(CameraBehavior);
          cameraBehavior.setTicket(this.actor);
        }
      }
    }
  }

  dead() {
    Sup.Audio.playSound("Sound/Hurt");
    this.isDead = true;
    let index = PlayersArgumentsBehavior.playerBodies.indexOf(this.actor.arcadeBody2D);
    PlayersArgumentsBehavior.playerBodies.splice(index, 1);
    
    if(this.hasWater) {
      this.createWaterDrop(this.actor.getPosition());
      this.hasWater = false;
    }
    
    this.actor.setVisible(false);
  }

  spawnAfterDeath() {
    let rng = new RNG();
    let map = Sup.getActor("Solids").getChild("Map").tileMapRenderer.getTileMap();
    if(this.timeToDeath == 0) this.timeToDeath = rng.random(100, 200);
    this.time++;
    if(this.time == this.timeToDeath) {
      let correctPos = false;
      while(!correctPos) {
        let posX = Math.floor(Sup.getActor("Camera").getPosition().x + rng.random(-5, 5));
        let posY = Sup.getActor("Camera").getPosition().y + rng.random(-4, 4);
        Sup.log(map.getTileAt(0, posX * 2, posY * 2));
        correctPos = (posX > 2 && posX < map.getWidth() / 2 - 1 && posY > 2 && posY < map.getHeight() / 2 - 1
                      && map.getTileAt(0, posX * 2, posY * 2) == -1);
        if(correctPos) this.actor.arcadeBody2D.warpPosition({x:posX, y:3.23});
      }
      PlayersArgumentsBehavior.playerBodies.push(this.actor.arcadeBody2D);
      this.actor.setVisible(true);
      this.time = 0;
      this.isDead = false;
      this.timeToDeath = 0;
    }
    
  }

}
Sup.registerBehavior(PlayerBehavior);
