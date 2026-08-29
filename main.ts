
namespace SpriteKind {
    export const Finish = SpriteKind.create();
    export const Woodcutter = SpriteKind.create();

}

// a Hero helyzete a tile(létra)-n belül
let ladderCenter2 = false
let ladderLeft2 = false
let ladderRight2 = false
let ladderCol2 = 0
// Hero mozgásához
enum tool { None, Tree, Axe, Spade, Pearl, Projectile }
let inHand = tool.None
let JumpingNow = false
enum direction { Right, Left }
let lastVelocity = direction.Right

// Hero pályaszint kező helyzete
let xHero = 0
let yHero = 0

// a pályaszinteken használt változók
let goalCountOfTreasure = 0
let TimeBonus = 0
let totalSeconds = 0
let currentLevel = 1
let projectile = null

// A Hero-t már itt létrehozzuk, hogy a háttérben futó események ne keressék hiába
let Hero = sprites.create(assets.image`Mario`, SpriteKind.Player)
Hero.setFlag(SpriteFlag.Invisible, true)

// Mindig figyelt és futtatot elemek
forever(function () {
    if (Hero.vx > 0) {
        lastVelocity = direction.Right;
    } else if (Hero.vx < 0) {
        lastVelocity = direction.Left;
    }
})

// Intro rész itt következik majd
info.setScore(0)
info.setLife(10)
m_levels.NextLevel(1)



namespace m_levels {
    // SZINTEK BEVEZETÉSE ÉS INDULÁSI PARAMÉTEREI
    export function NextLevel(num: number) {
        if (num == 1) {
            info.showScore(false)
            info.showLife(false)
            scene.setBackgroundColor(13)
            game.showLongText("Sötétedik...", DialogLayout.Bottom)
            game.showLongText("Furcsa rovarok jelentek meg az erdőben.", DialogLayout.Bottom)
            game.showLongText("Hallod, ahogy recsegnek az ágak, zizegnek a levelek.", DialogLayout.Bottom)
            scene.setBackgroundColor(12)
            game.showLongText("Úgy döntesz, kimész a fák közé és megnézed mi történik.", DialogLayout.Bottom)
            game.showLongText("A rovarok a fákat pusztítják. Mindent megesznek, ami az útjukba kerül", DialogLayout.Bottom)
            scene.setBackgroundColor(15)
            game.showLongText("Fuss! Siess a házba szerszámokért, hogy metsd, amit még lehet!", DialogLayout.Bottom)
            game.showLongText("Igyekezz!!! Megy az idő!", DialogLayout.Bottom)
            info.startCountdown(60)
            tiles.setCurrentTilemap(tilemap`level9`)
            goalCountOfTreasure += 0
            xHero = 24
            yHero = 424
            InitialLevel(xHero, yHero)
        } else if (num == 2) {
            scene.setBackgroundColor(8)
            game.showLongText("Bent vagy a házban. Nagy a kupleráj.", DialogLayout.Bottom)
            game.showLongText("Tologasd el a tárgyakat, hogy elérj a baltáig!", DialogLayout.Bottom)
            tiles.setCurrentTilemap(tilemap`level8`)
            goalCountOfTreasure += 12
            xHero = 24
            yHero = 200
            InitialLevel(xHero, yHero)
        } else {
            game.setGameOverEffect(true, effects.confetti)
            game.gameOver(true)
        }
    }
    // SZINT INDÍTÁSA
    function InitialLevel(xStartPos: number, yStartPos: number) {
        // Töröljük a megmaradt enemy-t
        sprites.destroyAllSpritesOfKind(SpriteKind.Enemy)
        sprites.destroyAllSpritesOfKind(SpriteKind.Woodcutter)

        // Megjelenítjük a Hero-t
        Hero.setFlag(SpriteFlag.Invisible, false)
        info.setLife(10)
        Hero.setPosition(xStartPos, yStartPos)
        Hero.vy = 0
        Hero.ay = 300
        scene.cameraFollowSprite(Hero)
        controller.moveSprite(Hero, 100, 0)

        // Megjelenítjük az Enemy-t és Woodcutter-t
        let Bug = null
        for (let value of tiles.getTilesByType(assets.tile`BackGrStoneBugStart`)) {
            Bug = sprites.create(assets.image`Bug`, SpriteKind.Enemy)
            tiles.placeOnTile(Bug, value)
            Bug.vx = 15
            Bug.ay = 300
        }
        for (let value of tiles.getTilesByType(assets.tile`BackGrkyFlierStart`)) {
            Bug = sprites.create(assets.image`Flier`, SpriteKind.Enemy)
            tiles.placeOnTile(Bug, value)
            Bug.vx = 15
        }
        for (let value of tiles.getTilesByType(assets.tile`BackGrWoodcutterStart`)) {
            Bug = sprites.create(assets.image`Woodcutter`, SpriteKind.Woodcutter)
            tiles.placeOnTile(Bug, value)
            Bug.vx = 15
            Bug.ay = 300
        }
    }
    // SZINT ZÁRÁSRA
    function CloseLevel() {
        // Az eltelt idő kiszámítása (másodperc alapú finomítással)
        totalSeconds = Math.round(game.runtime() / 1000)
        TimeBonus = Math.round(360 / totalSeconds)
        game.showLongText("" + totalSeconds + " másodperc alatt", DialogLayout.Center)
        game.showLongText("" + TimeBonus + " idő bónuszt kaptál", DialogLayout.Bottom)
        info.changeScoreBy(TimeBonus)
        currentLevel += 1
        NextLevel(currentLevel)
    }
    // LÁDA ÉS PONTOZÁS LOGIKÁJA
    scene.onOverlapTile(SpriteKind.Player, assets.tile`TreasureOP`, function (sprite, location) {
        if (inHand != tool.None) {
            inHand = tool.None
            Hero.setImage(assets.image`Mario`)
            info.changeScoreBy(1)
            if (info.score() == goalCountOfTreasure) {
                tiles.setTileAt(location, assets.tile`TreasureCl`)
                music.play(music.melodyPlayable(music.powerDown), music.PlaybackMode.InBackground)
            }
        }
    })
    scene.onOverlapTile(SpriteKind.Player, assets.tile`TreasureCl`, function (sprite, location) {
        CloseLevel()
    })
    scene.onOverlapTile(SpriteKind.Player, assets.tile`House`, function (sprite, location) {
        CloseLevel()
    })
}

namespace m_hero {
    export function Damage(effect: effects.ParticleEffect, lightTouch: boolean, location?: tiles.Location): void {
        if (lightTouch) {
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
    function HeroJump(): void {
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
        if (inHand = tool.None && Hero.tileKindAt(TileDirection.Center, assets.tile`TreeUPW`)) {
            Hero.setImage(assets.image`MarioWtree`)
            tiles.setTileAt(Hero.tilemapLocation(), assets.tile`transparency16`)
            inHand = tool.Tree
        } else if (inHand = tool.None && Hero.tileKindAt(TileDirection.Center, assets.tile`TreeDW`)) {
            Hero.setImage(assets.image`MarioWtree`)
            tiles.setTileAt(Hero.tilemapLocation(), assets.tile`BackGrStone`)
            inHand = tool.Tree
        } else if (inHand = tool.None && Hero.tileKindAt(TileDirection.Center, assets.tile`TreeDWW`)) {
            Hero.setImage(assets.image`MarioWpearl`)
            tiles.setTileAt(Hero.tilemapLocation(), assets.tile`BackGrStone`)
            inHand = tool.Pearl
        } else if (inHand = tool.None) {
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

namespace m_enemies {
    scene.onHitWall(SpriteKind.Woodcutter, function (sprite, location) {
        if (sprite.isHittingTile(CollisionDirection.Left)) {
            sprite.vx = 15
        }
        if (sprite.isHittingTile(CollisionDirection.Right)) {
            sprite.vx = -15
        }
    })

}

namespace events {
    scene.onOverlapTile(SpriteKind.Player, assets.tile`Firefield0`, function (sprite, location) {
        m_hero.Damage(effects.fire, true, location);
    })
    scene.onOverlapTile(SpriteKind.Player, assets.tile`WaterField`, function (sprite, location) {
        m_hero.Damage(effects.bubbles, true, location);
    })
    sprites.onOverlap(SpriteKind.Player, SpriteKind.Enemy, function (sprite, otherSprite) {
        m_hero.Damage(effects.none, false);
        sprites.destroy(otherSprite, effects.disintegrate, 150);
    })
    sprites.onOverlap(SpriteKind.Enemy, SpriteKind.Projectile, function (sprite, otherSprite) {
        sprites.destroy(sprite);
        sprites.destroy(otherSprite, effects.disintegrate, 150);
        music.play(music.melodyPlayable(music.baDing), music.PlaybackMode.InBackground)
    })
    scene.onOverlapTile(SpriteKind.Woodcutter, assets.tile`TreeUPW`, function (sprite, location) {
        let directionX = sprite.vx;
        sprite.vx = 0;
        let tree = sprites.create(assets.image`TreeAnim`, SpriteKind.Food);
        tiles.placeOnTile(tree, location);
        animation.runImageAnimation(tree, assets.animation`TreeAnim`,200,false);
        control.runInParallel(function() {
            pause(1000);
            sprite.vx = directionX;
            tree.destroy();
        })
        
        tiles.setTileAt(location, assets.tile`TreeUPW0`);
    })
}

