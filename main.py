@namespace
class SpriteKind:
    Finish = SpriteKind.create()
    Woodcutter = SpriteKind.create()
# a Hero helyzete a tile(létra)-n belül
ladderCenter2 = False
ladderLeft2 = False
ladderRight2 = False
ladderCol2 = 0
# Hero pályaszint kező helyzete
xHero = 0
yHero = 0
# a pályaszintek befejezéséhez összegyűjtendő elemek száma
goalCountOfTreasure = 0
class tool(Enum):
    None2 = 0
    Tree = 1
    Axe = 2
    Spade = 3
    Projectile = 4
inHand = False
JumpingNow = False
TimeBonus = 0
totalSeconds = 0
Bug = None
projectile = None
currentLevel = 1
class direction(Enum):
    Right = 0
    Left = 1
lastVelocity = direction.Right
scene.set_background_color(9)
info.set_score(0)
# A Hero-t már itt létrehozzuk, hogy a háttérben futó események ne keressék hiába
Hero = sprites.create(assets.image("""
    Mario
    """), SpriteKind.player)
Hero.set_flag(SpriteFlag.INVISIBLE, True)
# Intro rész itt következik majd
game.show_long_text("A kártevők megtámadták a fákat. Védd meg a növényzetet!",
    DialogLayout.CENTER)
m_levels.next_level(1)

def on_forever():
    global lastVelocity
    if Hero.vx > 0:
        lastVelocity = direction.Right
    elif Hero.vx < 0:
        lastVelocity = direction.Left
forever(on_forever)
