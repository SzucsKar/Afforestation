
namespace SpriteKind {
    export const Finish = SpriteKind.create();
    export const Woodcutter = SpriteKind.create();
    export const SokoSprite = SpriteKind.create();
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
enum direction { Right, Left, Up, Down }
let lastVelocity = direction.Right

// SOKO mozgásához
enum SokoTileState {Clear, Wall, SokoSprite}

// SOKO játék raszter kiosztása (16*16px)
let sokoRowHero = 0
let sokoColHero = 0

// Hero pályaszint kezdő helyzete
let xHero = 0
let yHero = 0
let gHero = false


// Pályaszinteken használt változók
let resetedLevel = false
let goalCountOfTreasure = 0
let levelScore = 0
let TimeBonus = 0
let levelBonus
let remainingSeconds = 0
let currentLevel = 1
let projectile = null
let heroFire = false


// Általános beállítások változói
let difficulty = false
let selectedDifficulty = 0
let difficultyFactor = [1.2,1.0]
enum GameMode { soko, platform }
let gameMode = GameMode.platform

// SokoSprite céltárgyai
let axe: Sprite = null

// SokoSprite random helyei a 2. pályához
let layouts =[
    [[7, 2], [2, 2], [5, 2], [4, 3], [6, 4], [3, 5], [5, 5], [4, 7]],
    [[7, 3], [4, 2], [6, 2], [3, 3], [5, 3], [2, 4], [5, 4], [3, 5], [3, 6], [4, 6], [2, 7], [4, 8]],
    [[7, 3], [2, 1], [4, 1], [1, 2], [3, 2], [5, 2], [3, 3], [4, 3], [2, 4], [5, 4], [1, 5], [3, 5], [2, 6], [4, 6], [5, 6], [4, 7]]
]
// SokoSprite random képei a 2. pályához
let spriteSet: Image [] = [
    assets.image`s_bicycle`,
    assets.image`s_table`,
    assets.image`s_cabinet`,
    assets.image`s_chair`,
    assets.image`s_flower`,
    assets.image`s_water`,
    assets.image`s_bed`,
    assets.image`s_bicycle`,
    assets.image`s_table`,
    assets.image`s_cabinet`,
    assets.image`s_chair`,
    assets.image`s_flower`,
    assets.image`s_water`,
    assets.image`s_bed`,
    assets.image`s_chair`,
    assets.image`s_flower`,
    assets.image`s_water`
]

// A Hero-t már itt létrehozzuk, hogy a háttérben futó események ne keressék hiába
let Hero = sprites.create(assets.image`Mario`, SpriteKind.Player)
Hero.setFlag(SpriteFlag.Invisible, true)

// Mindig figyelt és futtatot elemek
forever(function () {
    if (Hero.vx > 0) {
        lastVelocity = direction.Right;
    } else if (Hero.vx < 0) {
        lastVelocity = direction.Left;
    } else if (Hero.vy < 0) {
        lastVelocity = direction.Up;
    } else if (Hero.vy > 0) {
        lastVelocity = direction.Down
    }
})

namespace intro{
    difficulty = game.ask("A könnyebb módban játszol?","Ez hosszabb pályaidőt jelent.")
    if (difficulty) {selectedDifficulty= 0 } else {selectedDifficulty=1 }
    info.setScore(0)
    info.setLife(1)
    scene.setBackgroundColor(13)
    game.showLongText(
        "Egyik este furcsa rovarok jelentek meg az erdőben.\n", DialogLayout.Bottom)
    scene.setBackgroundColor(12)
    game.showLongText(
        "A rovarok a fákat pusztítják. Mindent megesznek, ami az útjukba kerül", DialogLayout.Bottom)
    m_levels.NextLevel(1)
}

namespace m_levels {
    // SZINTEK BEVEZETÉSE ÉS INDULÁSI PARAMÉTEREI
    export function NextLevel(num: number) {
        if (num == 1) {
            scene.setBackgroundColor(15)
            game.showLongText(
                "Menj a házba szerszámért, hogy metsd a fákat!" +
                "Siess, megy az idő!", DialogLayout.Bottom)
            tiles.setCurrentTilemap(tilemap`level9`)
            info.showLife(false)
            info.setLife(1)
            info.showCountdown(true)
            info.startCountdown(Math.round(50 * difficultyFactor[selectedDifficulty]))
            info.showScore(false)
            if(!resetedLevel){goalCountOfTreasure += 0}
            heroFire = false
            gameMode = GameMode.platform
            xHero = 24; yHero = 424; gHero = true
            InitialLevel(xHero, yHero, gHero)
        } else if (num == 2) {
            scene.setBackgroundColor(11)
            game.showLongText(
                "A házban nagy a kupi.", DialogLayout.Bottom)
            game.showLongText(
                "Told el a tárgyakat, hogy ki tudd tolni a baltát a ládához!", DialogLayout.Bottom)
            tiles.setCurrentTilemap(tilemap`level_15`)
            info.setLife(1)
            info.showLife(false)
            info.showCountdown(true)
            info.startCountdown(Math.round(50 * difficultyFactor[selectedDifficulty]))
            info.showScore(false)
            if (!resetedLevel) {goalCountOfTreasure += 0}
            heroFire = false
            gameMode = GameMode.soko
            xHero = 136; yHero = 120; gHero = false
            InitialLevel(xHero, yHero, gHero)
        } else if (num == 3) {
            scene.setBackgroundColor(9)
            tiles.setCurrentTilemap(tilemap`level31`)
            game.showLongText(
                "Összesen 15 facsemetét kell gyűjtened, hogy újra ültethesd az erdőt.", DialogLayout.Bottom)
            game.showLongText(
                "Igyekezz, mert a rovarok megeszik!", DialogLayout.Bottom)
            game.showLongText(
                "Szerezz meg 4 csemetét!", DialogLayout.Bottom)
            info.showLife(false)
            info.setLife(1)
            info.showCountdown(true)
            info.startCountdown(Math.round(50 * difficultyFactor[selectedDifficulty]))
            info.showScore(true)
            if (!resetedLevel) {goalCountOfTreasure += 4}
            heroFire = false
            gameMode = GameMode.platform
            xHero = 120; yHero = 88; gHero = true
            InitialLevel(xHero, yHero, gHero)
        } else if (num == 4) {
            scene.setBackgroundColor(9)
            tiles.setCurrentTilemap(tilemap`level32`)
            game.showLongText(
                "Több kell! Érd el a 10 darabot!", DialogLayout.Bottom)
            info.showLife(false)
            info.setLife(1)
            info.showCountdown(true)
            info.startCountdown(Math.round(50 * difficultyFactor[selectedDifficulty]))
            info.showScore(true)
            if (!resetedLevel) {goalCountOfTreasure += 6}
            heroFire = false
            gameMode = GameMode.platform
            xHero = 184; yHero = 56; gHero = true
            InitialLevel(xHero, yHero, gHero)
        } else if (num == 5) {
            scene.setBackgroundColor(9)
            tiles.setCurrentTilemap(tilemap`level33`)
            game.showLongText(
                "Utolsó esély, hogy meglegyen a 15 csemete!", DialogLayout.Bottom)
            info.showLife(false)
            info.setLife(2)
            info.showCountdown(true)
            info.startCountdown(Math.round(50 * difficultyFactor[selectedDifficulty]))
            info.showScore(true)
            if (!resetedLevel) {goalCountOfTreasure += 5}
            heroFire = false
            gameMode = GameMode.platform
            xHero = 104; yHero = 40; gHero = true
            InitialLevel(xHero, yHero, gHero)
        } else {
            info.changeScoreBy(TimeBonus)
            game.setGameOverEffect(true, effects.confetti)
            game.gameOver(true)
        }
    }
    // SZINT INDÍTÁSA
    function InitialLevel(xStartPos: number, yStartPos: number, gravity: boolean) {
        // Töröljük a megmaradt enemy-t
        sprites.destroyAllSpritesOfKind(SpriteKind.Enemy)
        sprites.destroyAllSpritesOfKind(SpriteKind.Woodcutter)
        sprites.destroyAllSpritesOfKind(SpriteKind.SokoSprite)

        // Szintenként gyűjtött pontszámláló visszaállítása
        levelScore = 0

        // Megjelenítjük a Hero-t és beállítjuk a mozgását
        Hero.setFlag(SpriteFlag.Invisible, false)
        Hero.setPosition(xStartPos, yStartPos)
        scene.cameraFollowSprite(Hero)
        
        if (gameMode == GameMode.platform){
            Hero.vy = 0
            Hero.ay = 300
            controller.moveSprite(Hero, 100, 0)
        }
        if (gameMode == GameMode.soko){
            Hero.vx = 0
            Hero.vy = 0
            Hero.ax = 0
            Hero.ay = 0
            controller.moveSprite(Hero, 0, 0)
            sokoColHero = (xHero-8)/16
            sokoRowHero = (yHero-8)/16
        }

        // Megjelenítjük az Enemy-t és Woodcutter-t vagy a SOKO elemeket
        let Bug = null
        if (gameMode == GameMode.platform){
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
        if (gameMode == GameMode.soko){
            //Véletlen layouts kiválasztása és a SokoSprite-k felhelyezése
            let spritek: Sprite[] = []
            let rnd = randint(0, layouts.length - 1)
            console.log ("Véletlen pálya:" + rnd)
            let selectedLayout = layouts[rnd]
            
            // Balta kihelyezése az első koordinátára
            axe = sprites.create(assets.image`AxeAnim`, SpriteKind.SokoSprite)
            animation.runImageAnimation(axe, assets.animation`AxeAnim`, 200, true)
            let x = selectedLayout[0][0]
            let y = selectedLayout[0][1]
            axe.setPosition(x * 16 + 8, y * 16 + 8)
            console.log("Axe: " + x + "," + y)

            // Többi sprite kihelyezése
            for (let i = 1; i < selectedLayout.length; i++) {
                let x = selectedLayout[i][0]
                let y = selectedLayout[i][1]
                let ujSprite = sprites.create(spriteSet[i], SpriteKind.SokoSprite)
                ujSprite.setPosition(x * 16 + 8, y * 16 + 8)
                spritek.push(ujSprite)
                console.log("SokoSprite(" + i + "): " + x + "," + y)
            }
        }
    }

    // LÁDA LEZÁRÁSA
    scene.onOverlapTile(SpriteKind.Player, assets.tile`TreasureOP`, function (sprite, location) {
        if (inHand != tool.None) {
            inHand = tool.None
            Hero.setImage(assets.image`Mario`)
            info.changeScoreBy(1)
            levelScore += 1
            if (info.score() == goalCountOfTreasure) {
                tiles.setTileAt(location, assets.tile`TreasureCl`)
                music.play(music.melodyPlayable(music.powerDown), music.PlaybackMode.InBackground)
            }
        }
    })
    
    // CÉLTERÜLETEK ELÉRESE
    scene.onOverlapTile(SpriteKind.Player, assets.tile`TreasureCl`, function (sprite, location) {
        CloseLevel()
    })
    scene.onOverlapTile(SpriteKind.Player, assets.tile`House`, function (sprite, location) {
        CloseLevel()
    })
    export function SokoWin() {
        console.log("végét ellenőrzöm")
        if (tiles.tileAtLocationEquals(axe.tilemapLocation(), assets.tile`TreasureOP`)) {
            CloseLevel()
        }
    }

    // SZINT ZÁRÁSRA
    function CloseLevel() {
        // Az eltelt idő kiszámítása (másodperc alapú finomítással)
        remainingSeconds = info.countdown()
        levelBonus = Math.round(remainingSeconds*0.25)
        game.showLongText("Teljesítetted a " + currentLevel + ". szintet.", DialogLayout.Top)
        game.showLongText("" + remainingSeconds + " másodperc maradtt", DialogLayout.Center)
        game.showLongText("Kaptál" + levelBonus + " időbónuszt", DialogLayout.Bottom)
        resetedLevel = false
        TimeBonus += levelBonus
        currentLevel += 1
        NextLevel(currentLevel)
    }

    // TIMEOUT KEZELÉSE
    info.onCountdownEnd(function () {
        let text = "Lejárt az idő! Újra játszod a pályát?"
        Retry(text)
    })
    info.onLifeZero(function () {
        let text = "Elfogyott az életed! Újra játszod a pályát?"
        Retry(text)
    })
    function Retry(text: string){
        if (game.ask(text)) {
            info.changeScoreBy(-levelScore)
            resetedLevel = true
            m_levels.NextLevel(currentLevel)
        } else {
            game.setGameOverEffect(true, effects.blizzard)
            game.gameOver(true)
        }
    }
}

namespace m_hero {
    
    function GetSokoAt(checkedCol: number, checkedRow:number): Sprite {
        for (let soko of sprites.allOfKind(SpriteKind.SokoSprite)) {
            let loc = soko.tilemapLocation()
            if (loc.column == checkedCol && loc.row == checkedRow) {
                return soko
            }
        }
        return null
    }
    
    function CheckSokoTile(checkedCol: number, checkedRow: number): SokoTileState {
        if (tiles.tileAtLocationIsWall(
            tiles.getTileLocation(checkedCol, checkedRow))) {
            return SokoTileState.Wall
        }
        for (let soko of sprites.allOfKind(SpriteKind.SokoSprite)) {
            let loc = soko.tilemapLocation()

            if (loc.column == checkedCol && loc.row == checkedRow) {
                return SokoTileState.SokoSprite
            }
        }
        return SokoTileState.Clear     
    }

    function SokoMovingLogic(displCol:number, displRow:number){
        let State = CheckSokoTile(sokoColHero + displCol, sokoRowHero + displRow)
        if (State == SokoTileState.Clear) {
            sokoColHero += displCol; sokoRowHero += displRow
            Hero.setPosition(sokoColHero * 16 + 8, sokoRowHero * 16 + 8)
            music.play(music.melodyPlayable(music.footstep), music.PlaybackMode.InBackground);
        }
        else if (State == SokoTileState.Wall) {
            music.play(music.melodyPlayable(music.knock), music.PlaybackMode.InBackground);
        }
        else if (State == SokoTileState.SokoSprite) {
            let NextState = CheckSokoTile(sokoColHero + displCol * 2, sokoRowHero + displRow * 2)
            if ( NextState == SokoTileState.Clear) {
                sokoColHero += displCol; sokoRowHero += displRow
                Hero.setPosition(sokoColHero * 16 + 8, sokoRowHero * 16 + 8)
                GetSokoAt(sokoColHero, sokoRowHero).setPosition((sokoColHero + displCol) * 16 + 8, (sokoRowHero + displRow) * 16 + 8)
                music.play(music.melodyPlayable(music.zapped), music.PlaybackMode.InBackground)
                m_levels.SokoWin();
            }
            else if (NextState == SokoTileState.Wall) {
                music.play(music.melodyPlayable(music.knock), music.PlaybackMode.InBackground);
            }
            else if (NextState == SokoTileState.SokoSprite) {
                music.play(music.melodyPlayable(music.knock), music.PlaybackMode.InBackground);
            }
        }
    }

    controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
        if (gameMode == GameMode.platform) {
            HeroJump()
        }
        if (gameMode == GameMode.soko) {
            SokoMovingLogic(0,-1)
        }
    })
    controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
        if (gameMode == GameMode.platform) {
            return
        }
        if (gameMode == GameMode.soko) {
            SokoMovingLogic(0, 1)
        }
    })
    controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
        if (gameMode == GameMode.platform) {
            return
        }
        if (gameMode == GameMode.soko) {
            SokoMovingLogic(1, 0)
        }
    })
    controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
        if (gameMode == GameMode.platform) {
            return
        }
        if (gameMode == GameMode.soko) {
            SokoMovingLogic(-1, 0)
        }
    })


    controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
        if (gameMode == GameMode.platform) {
            HeroJump()
        }
    })
    controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
        if(gameMode == GameMode.platform){
            // TÁRGYAK FELVÉTELE VAGY LÖVÉS
            if (inHand === tool.None && Hero.tileKindAt(TileDirection.Center, assets.tile`TreeUPW`)) {
                Hero.setImage(assets.image`MarioWtree`)
                tiles.setTileAt(Hero.tilemapLocation(), assets.tile`transparency16`)
                inHand = tool.Tree
            } else if (inHand === tool.None && Hero.tileKindAt(TileDirection.Center, assets.tile`TreeDW`)) {
                Hero.setImage(assets.image`MarioWtree`)
                tiles.setTileAt(Hero.tilemapLocation(), assets.tile`BackGrStone`)
                inHand = tool.Tree
            } else if (inHand === tool.None && Hero.tileKindAt(TileDirection.Center, assets.tile`TreeDWW`)) {
                Hero.setImage(assets.image`MarioWpearl`)
                tiles.setTileAt(Hero.tilemapLocation(), assets.tile`BackGrStone`)
                inHand = tool.Pearl
            } else if (inHand === tool.None && heroFire) {
                projectile = sprites.createProjectileFromSprite(assets.image`projectile1`, Hero, 0, 0)
                projectile.lifespan = 200
                if (lastVelocity == direction.Right) {
                    projectile.vx = 150
                } else {
                    projectile.vx = -150
                }
            }
        }
        if (gameMode == GameMode.soko) {
            return
        }
    })
    scene.onHitWall(SpriteKind.Player, function (sprite, location) {
        if (gameMode == GameMode.platform) {
            // Az ugrásból talajra érkezés
            if (sprite.isHittingTile(CollisionDirection.Bottom)) {
                JumpingNow = false
            }
        }
        if (gameMode == GameMode.soko) {
            return
        }
    })
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