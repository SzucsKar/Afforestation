namespace SpriteKind {
    export const Finish = SpriteKind.create()
    export const Woodcutter = SpriteKind.create()
}
// a Hero helyzete a tile(létra)-n belül
let ladderCenter2 = false
let ladderLeft2 = false
let ladderRight2 = false
let ladderCol2 = 0

// Hero pályaszint kező helyzete
let xHero = 0
let yHero = 0

// a pályaszintek befejezéséhez összegyűjtendő elemek száma
let goalCountOfTreasure = 0

enum tool { None, Tree, Axe, Spade, Projectile }
let inHand = false

let JumpingNow = false
let TimeBonus = 0
let totalSeconds = 0

let Bug = null
let projectile = null
let currentLevel = 1
enum direction {Right,Left}
let lastVelocity = direction.Right
scene.setBackgroundColor(9)
info.setScore(0)

// A Hero-t már itt létrehozzuk, hogy a háttérben futó események ne keressék hiába
let Hero = sprites.create(assets.image`Mario`, SpriteKind.Player)
Hero.setFlag(SpriteFlag.Invisible, true)

// Intro rész itt következik majd
game.showLongText("A kártevők megtámadták a fákat. Védd meg a növényzetet!", DialogLayout.Center)
m_levels.NextLevel(1)

forever(function () {
    if (Hero.vx > 0) {
        lastVelocity = direction.Right;
    } else if (Hero.vx < 0) {
        lastVelocity = direction.Left;
    }
})
