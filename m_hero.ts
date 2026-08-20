namespace m_hero {
    export function Damage(effect: effects.ParticleEffect, lightTouch: boolean, location?: tiles.Location):void {
        if (lightTouch){
            if ( // könnyebb sérülés, csak akkor sebződik, ha vizszintesen 3 px-re belép és nem ugrik fel legalább 3 px magasra
                Hero.x >= location.x - 5 && Hero.x <= location.x + 5 && Hero.y >= location.y - 5) {
                Hero.vy = -100;
                Hero.startEffect(effect, 500);
                info.changeLifeBy(-1);
                music.play(music.melodyPlayable(music.powerDown), music.PlaybackMode.InBackground);
            }
        } else { // durva sérülés
                Hero.vy = -100;
                Hero.startEffect(effect, 500);
                info.changeLifeBy(-1);
                music.play(music.melodyPlayable(music.powerDown), music.PlaybackMode.InBackground);
        }
    }
    controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
        HeroJump()
    })
    controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
        HeroJump()
    })
    function HeroJump():void {
        ladderCenter2 = Hero.tileKindAt(TileDirection.Center, assets.tile`Ladder`) || Hero.tileKindAt(TileDirection.Center, assets.tile`LadderGrass`) || Hero.tileKindAt(TileDirection.Center, assets.tile`LadderTransparent`)
        ladderLeft2 = Hero.tileKindAt(TileDirection.Left, assets.tile`Ladder`) || Hero.tileKindAt(TileDirection.Left, assets.tile`LadderGrass`) || Hero.tileKindAt(TileDirection.Left, assets.tile`LadderTransparent`)
        ladderRight2 = Hero.tileKindAt(TileDirection.Right, assets.tile`Ladder`) || Hero.tileKindAt(TileDirection.Right, assets.tile`LadderGrass`) || Hero.tileKindAt(TileDirection.Right, assets.tile`LadderTransparent`)
        // Ha bármelyik igaz, akkor létrán vagyunk és kiszámoljuk, hogy melyik csempe-oszlopban van a létra, és rárakjuk a Hero-t a közepére (8 pixel eltolás)
        // Ha talajon áll, akkor nagy ugrás.
        // Ha ugrásből levegőben van, akkor kicsi ugrás
        if (ladderCenter2 || ladderLeft2 || ladderRight2) {
            if (ladderCenter2) {
                ladderCol2 = Math.floor(Hero.x / 16)
            } else if (ladderLeft2) {
                ladderCol2 = Math.floor((Hero.x - 8) / 16)
            } else if (ladderRight2) {
                ladderCol2 = Math.floor((Hero.x + 8) / 16)
            }
            Hero.x = ladderCol2 * 16 + 8
            Hero.vy = -80
        } else if (Hero.isHittingTile(CollisionDirection.Bottom)) {
            Hero.vy = -150
            JumpingNow = false
        } else if (!JumpingNow) {
            Hero.vy = -100
            JumpingNow = true
        }
    }
    // Az ugrásból talajra érkezés
    scene.onHitWall(SpriteKind.Player, function (sprite, location) {
        if (sprite.isHittingTile(CollisionDirection.Bottom)) {
            JumpingNow = false
        }
    })
    // TÁRGYAK FELVÉTELE VAGY LÖVÉS (B GOMB)
    controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
        if (!inHand && Hero.tileKindAt(TileDirection.Center, assets.tile`TreeUPW`)) {
            Hero.setImage(assets.image`MarioWtree`)
            tiles.setTileAt(Hero.tilemapLocation(), assets.tile`transparency16`)
            inHand = true
        } else if (!inHand && Hero.tileKindAt(TileDirection.Center, assets.tile`TreeDW`)) {
            Hero.setImage(assets.image`MarioWtree`)
            tiles.setTileAt(Hero.tilemapLocation(), assets.tile`BackGrStone`)
            inHand = true
        } else if (!inHand && Hero.tileKindAt(TileDirection.Center, assets.tile`TreeDWW`)) {
            Hero.setImage(assets.image`MarioWpearl`)
            tiles.setTileAt(Hero.tilemapLocation(), assets.tile`BackGrStone`)
            inHand = true
        } else if (!inHand) {
            projectile = sprites.createProjectileFromSprite(assets.image`projectile1`, Hero, 0, 0)
            projectile.lifespan = 200
            if (lastVelocity == direction.Right) {
                projectile.vx = 150
            } else {
                projectile.vx = -150
            }
        }
    })
}