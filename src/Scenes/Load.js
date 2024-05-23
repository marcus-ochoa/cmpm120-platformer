class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }

    preload() {
        this.load.setPath("./assets/");

        

        // Load tilemap information
        this.load.image("tilemap_tiles", "tilesheet_complete.png");                         // Packed tilemap
        this.load.tilemapTiledJSON("tiled-level", "tiled-level.tmj");   // Tilemap in JSON

        // Load the tilemap as a spritesheet
        this.load.spritesheet("tilemap_sheet", "tilesheet_complete.png", {
            frameWidth: 64,
            frameHeight: 64
        });

        

        // Load characters spritesheet
        this.load.atlas("characters_sheet", "player/character-texture.png", "player/character-texture.json");

        // Oooh, fancy. A multi atlas is a texture atlas which has the textures spread
        // across multiple png files, so as to keep their size small for use with
        // lower resource devices (like mobile phones).
        // kenny-particles.json internally has a list of the png files
        // The multiatlas was created using TexturePacker and the Kenny
        // Particle Pack asset pack.
        this.load.multiatlas("kenny-particles", "particles/kenny-particles.json");
        


    }

    create() {

        
        this.anims.create({
            key: 'walk',
            /*
            frames: this.anims.generateFrameNames('characters_sheet', {
                prefix: "tile_",
                start: 0,
                end: 1,
                suffix: ".png",
                zeroPad: 4
            }),
            */
            defaultTextureKey: "characters_sheet",
            frames: [
                { frame: "playerRed_walk2.png" },
                { frame: "playerRed_walk3.png" }
            ],
            frameRate: 5,
            repeat: -1
        });

        this.anims.create({
            key: 'idle',
            defaultTextureKey: "characters_sheet",
            frames: [
                { frame: "playerRed_stand.png" }
            ],
            repeat: -1
        });

        this.anims.create({
            key: 'dead',
            defaultTextureKey: "characters_sheet",
            frames: [
                { frame: "playerRed_dead.png" }
            ],
            repeat: -1
        });

        this.anims.create({
            key: 'jump',
            defaultTextureKey: "characters_sheet",
            frames: [
                { frame: "playerRed_up1.png" }
            ]
        });

         // ...and pass to the next Scene
         this.scene.start("platformerScene");
        
    }

    // Never get here since a new scene is started in create()
    update() {
    }
}