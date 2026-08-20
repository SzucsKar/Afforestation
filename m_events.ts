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
        sprites.destroy(sprite)
        sprites.destroy(otherSprite, effects.disintegrate, 150)
        music.play(music.melodyPlayable(music.baDing), music.PlaybackMode.InBackground)
    })
    scene.onOverlapTile(SpriteKind.Woodcutter, assets.tile`TreeUPW`, function (sprite, location) {
        tiles.setTileAt(location, assets.tile`TreeUPW0`)
    })
}