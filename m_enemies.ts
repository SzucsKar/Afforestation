namespace m_enemies {
    scene.onHitWall(SpriteKind.Enemy, function (sprite, location) {
        if (sprite.isHittingTile(CollisionDirection.Left)) {
            sprite.vx = 15
        }
        if (sprite.isHittingTile(CollisionDirection.Right)) {
            sprite.vx = -15
        }
    })
    scene.onHitWall(SpriteKind.Woodcutter, function (sprite, location) {
        if (sprite.isHittingTile(CollisionDirection.Left)) {
            sprite.vx = 15
        }
        if (sprite.isHittingTile(CollisionDirection.Right)) {
            sprite.vx = -15
        }
    })
    game.onUpdate(function () {
        for (let enemy of sprites.allOfKind(SpriteKind.Woodcutter)) {
            if (enemy.vx > 0) {
                if (!enemy.tileKindAt(TileDirection.Bottom, assets.tile`MiddleWall0`)) {
                    enemy.x -= 2
                    enemy.vx = -15
                }
            }
            if (enemy.vx < 0) {
                if (!enemy.tileKindAt(TileDirection.Bottom, assets.tile`MiddleWall0`)) {
                    enemy.x += 2
                    enemy.vx = 15
                }
            }
        }
    })
}