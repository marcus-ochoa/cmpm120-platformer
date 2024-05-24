// Marcus Ochoa
// CMPM 120 UCSC
// Created: 5/21/2024
// Phaser: 3.70.0

// debug with extreme prejudice
"use strict"

// game config
let config = {
    parent: 'phaser-game',
    type: Phaser.CANVAS,
    render: {
        pixelArt: false  // prevent pixel art from getting blurred when scaled
    },
    physics: {
        default: 'arcade',
        arcade: {
            //debug: true,
            gravity: {
                x: 0,
                y: 0
            }
        }
    },
    width: 700,
    height: 704,
    scene: [Load, Platformer]
}

var cursors;
const SCALE = 0.5;
var my = {sprite: {}, text: {}, vfx: {}};

const game = new Phaser.Game(config);