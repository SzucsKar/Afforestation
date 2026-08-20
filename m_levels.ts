namespace m_levels {
    // SZINTEK KÖZÖTTI VÁLTÁS
    export function NextLevel(num: number) {
        if (num == 1) {
            game.showLongText("Kerüld ki az összes fanyúvő bogarat és gyümölcs denevért!", DialogLayout.Bottom)
            tiles.setCurrentTilemap(tilemap`level6`)
            goalCountOfTreasure += 12
            xHero = 24
            yHero = 200
            InitialLevel(xHero, yHero)
        } else if (num == 2) {
            game.showLongText("Gyűjtd össze a facsemetéket!", DialogLayout.Bottom)
            tiles.setCurrentTilemap(tilemap`level8`)
            goalCountOfTreasure += 12
            xHero = 73
            yHero = 54
            InitialLevel(xHero, yHero)
        }else if (num == 3) {
            game.showLongText("Gyűjtd össze a facsemetéket!", DialogLayout.Bottom)
            tiles.setCurrentTilemap(tilemap`level5`)
            goalCountOfTreasure += 10
            xHero = 73
            yHero = 54
            InitialLevel(xHero, yHero)
        } else if (num == 4) {
            game.showLongText("Ásványokkal kell táplálni a fákat!", DialogLayout.Bottom)
            tiles.setCurrentTilemap(tilemap`level0`)
            goalCountOfTreasure += 12
            xHero = 73
            yHero = 54
            InitialLevel(xHero, yHero)
        } else if (num == 5) {
            tiles.setCurrentTilemap(tilemap`level3`)
            goalCountOfTreasure += 4
            xHero = 73
            yHero = 54
            InitialLevel(xHero, yHero)
        } else {
            game.setGameOverEffect(true, effects.confetti)
            game.gameOver(true)
        }
    }
    // SZINT INDÍTÁSA
    function InitialLevel(xStartPos: number, yStartPos: number) {
        // Megjelenítjük a karaktert
        Hero.setFlag(SpriteFlag.Invisible, false)
        info.setLife(10)
        Hero.setPosition(xStartPos, yStartPos)
        Hero.vy = 0
        Hero.ay = 300
        scene.cameraFollowSprite(Hero)
        controller.moveSprite(Hero, 100, 0)
        sprites.destroyAllSpritesOfKind(SpriteKind.Enemy)
        for (let value of tiles.getTilesByType(assets.tile`BackGrStoneBugStart`)) {
            Bug = sprites.create(assets.image`Bug`, SpriteKind.Enemy)
            tiles.placeOnTile(Bug, value)
            Bug.vx = 15
            Bug.ay = 300
        }
        for (let value2 of tiles.getTilesByType(assets.tile`BackGrkyFlierStart`)) {
            Bug = sprites.create(assets.image`Flier`, SpriteKind.Enemy)
            tiles.placeOnTile(Bug, value2)
            Bug.vx = 15
        }
        for (let value3 of tiles.getTilesByType(assets.tile`BackGrWoodcutterStart`)) {
            Bug = sprites.create(assets.image`Woodcutter`, SpriteKind.Woodcutter)
            tiles.placeOnTile(Bug, value3)
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
        if (inHand) {
            inHand = false
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