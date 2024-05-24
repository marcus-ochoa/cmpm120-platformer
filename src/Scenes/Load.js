class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }

    preload() {
        
        this.load.setPath("./assets/");

        // load tilemap information
        this.load.image("tilemap_tiles", "tilesheet_complete.png");                 
        this.load.tilemapTiledJSON("tiled-level", "tiled-level.tmj");

        // load tilemap spritesheet
        this.load.spritesheet("tilemap_sheet", "tilesheet_complete.png", {
            frameWidth: 64,
            frameHeight: 64
        });

        // load characters spritesheet
        this.load.atlas("characters_sheet", "player/character-texture.png", "player/character-texture.json");

        // load particles
        this.load.multiatlas("kenny-particles", "particles/kenny-particles.json");

        // load audio
        this.load.audio("jump_sound", "audio/phaseJump2.ogg");
        this.load.audio("coin_sound", "audio/powerUp9.ogg");
        this.load.audio("key_sound", "audio/powerUp11.ogg");
        this.load.audio("fail_sound", "audio/phaserDown3.ogg");
        
    }

    create() {

        // create animations
        this.anims.create({
            key: 'walk',
            defaultTextureKey: "characters_sheet",
            frames: [
                { frame: "playerRed_walk2.png" },
                { frame: "playerRed_walk3.png" }
            ],
            frameRate: 10,
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
            key: 'jump',
            defaultTextureKey: "characters_sheet",
            frames: [
                { frame: "playerRed_up1.png" }
            ]
        });

        this.anims.create({
            key: 'coin_anim',
            defaultTextureKey: "tilemap_sheet",
            frames: [
                { frame: 58 },
                { frame: 36 },
                { frame: 14 }
            ],
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'key_anim',
            defaultTextureKey: "tilemap_sheet",
            frames: [
                { frame: 101 },
                { frame: 79 }
            ],
            frameRate: 2,
            repeat: -1
        });

         // start main scene level
         this.scene.start("platformerScene");
        
    }

    update() {
    }
}