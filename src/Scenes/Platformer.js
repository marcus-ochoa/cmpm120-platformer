class Platformer extends Phaser.Scene {
    constructor() {
        super("platformerScene");
    }

    init() {
        // variables and settings
        this.ACCELERATION = 2000;
        this.MAX_VELOCITY = 500;
        this.DRAG = 2000;    // DRAG < ACCELERATION = icy slide
        this.physics.world.gravity.y = 1500;
        this.JUMP_VELOCITY = -800;
        this.PARTICLE_VELOCITY = 100;
        this.SCALE = 0.5;
    }

    create() {

        this.gameover = false;
        this.hasKey = false;

        // Create a new tilemap game object which uses 18x18 pixel tiles, and is
        // 48 tiles wide and 25 tiles tall.
        this.map = this.add.tilemap("tiled-level", 64, 64, 80, 22);

        // Add a tileset to the map
        // First parameter: name we gave the tileset in Tiled
        // Second parameter: key for the tilesheet (from this.load.image in Load.js)
        
        this.tileset = this.map.addTilesetImage("tilesheet_complete", "tilemap_tiles");

        this.physics.world.setBounds(0,0,this.map.widthInPixels,this.map.heightInPixels);
        this.physics.world.TILE_BIAS = 24;

        // Create a layer
        this.groundLayer = this.map.createLayer("Ground", this.tileset, 0, 0);

        this.spikeLayer = this.map.createLayer("Spikes", this.tileset, 0, 0);

        this.aestheticLayer = this.map.createLayer("Aesthetic", this.tileset, 0, 0);

        this.doorLayer = this.map.createLayer("Door", this.tileset, 0, 0);

        // Make it collidable
        this.groundLayer.setCollisionByProperty({
            collision: true
        });

        this.spikeLayer.setCollisionByProperty({
            collision: true
        });

        this.doorLayer.setCollisionByProperty({
            collision: true
        });

        // Find coins in the "Objects" layer in Phaser
        // Look for them by finding objects with the name "coin"
        // Assign the coin texture from the tilemap_sheet sprite sheet
        // Phaser docs:
        // https://newdocs.phaser.io/docs/3.80.0/focus/Phaser.Tilemaps.Tilemap-createFromObjects

        this.coins = this.map.createFromObjects("Objects", {
            name: "coin",
            key: "tilemap_sheet",
            frame: 58
        });

        // Since createFromObjects returns an array of regular Sprites, we need to convert 
        // them into Arcade Physics sprites (STATIC_BODY, so they don't move) 
        this.physics.world.enable(this.coins, Phaser.Physics.Arcade.STATIC_BODY);

        // Create a Phaser group out of the array this.coins
        // This will be used for collision detection below.
        this.coinGroup = this.add.group(this.coins);


        this.keys = this.map.createFromObjects("Objects", {
            name: "key",
            key: "tilemap_sheet",
            frame: 101
        });

        this.physics.world.enable(this.keys, Phaser.Physics.Arcade.STATIC_BODY);

        this.keyGroup = this.add.group(this.keys);

        // set up player avatar
        my.sprite.player = this.physics.add.sprite(100, 500, "characters_sheet", "playerRed_stand.png");
        my.sprite.player.setCollideWorldBounds(true);
        my.sprite.player.setScale(1.5);
        my.sprite.player.setMaxVelocity(this.MAX_VELOCITY, -this.JUMP_VELOCITY*3);

        // Enable collision handling
        this.physics.add.collider(my.sprite.player, this.groundLayer);

        // Handle collision detection with coins
        
        this.physics.add.overlap(my.sprite.player, this.coinGroup, (obj1, obj2) => {
            obj2.destroy(); // remove coin on overlap
        });

        this.physics.add.overlap(my.sprite.player, this.keyGroup, (obj1, obj2) => {
            obj2.destroy(); // remove coin on overlap
            this.hasKey = true;
        });

        // set up Phaser-provided cursor key input
        cursors = this.input.keyboard.createCursorKeys();

        this.rKey = this.input.keyboard.addKey('R');

        // debug key listener (assigned to D key)
        this.input.keyboard.on('keydown-D', () => {
            this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true
            this.physics.world.debugGraphic.clear()
        }, this);

        // movement vfx

        my.vfx.walking = this.add.particles(0, 0, "kenny-particles", {
            frame: ['circle_01.png', 'circle_02.png'],
            // TODO: Try: add random: true
            scale: {start: 0.03, end: 0.1},
            // TODO: Try: maxAliveParticles: 8,
            lifespan: 350,
            gravityY: -800,
            alpha: {start: 1, end: 0.1}, 
        });

        my.vfx.walking.stop();

        my.vfx.death = this.add.particles(0, 0, "kenny-particles", {
            frame: ['trace_04.png', 'trace_05.png'],
            // TODO: Try: add random: true
            scale: {start: 0.03, end: 0.5},
            // TODO: Try: maxAliveParticles: 8,
            lifespan: 350,
            // TODO: Try: gravityY: -400,
            alpha: {start: 1, end: 0.1}, 
        });

        my.vfx.death.stop();
        
        this.physics.add.collider(my.sprite.player, this.spikeLayer, () => {

            if(!this.gameover) {
                my.vfx.death.setPosition(my.sprite.player.x, my.sprite.player.y-100);
                my.vfx.death.start();
                this.add.text(my.sprite.player.x, 600, "Get Spiked!", {fontSize: '128px'}).setOrigin(0.5);
                this.add.text(my.sprite.player.x, 800, "(Press 'R' to restart)", {fontSize: '64px'}).setOrigin(0.5);
                this.gameover = true;
                this.cameras.main.stopFollow();
                my.sprite.player.visible = false;
                my.vfx.walking.stop();
                this.add.sprite(my.sprite.player.x, my.sprite.player.y, "characters_sheet", "playerRed_dead.png").setScale(1.5);
                
            }
            
        });

        this.physics.add.collider(my.sprite.player, this.doorLayer, () => {

            if(!this.gameover && this.hasKey) {
                this.add.text(my.sprite.player.x, 600, "Wow you made it!", {fontSize: '128px'}).setOrigin(0.5);
                this.add.text(my.sprite.player.x, 800, "(Press 'R' to restart)", {fontSize: '64px'}).setOrigin(0.5);
                this.gameover = true;
                this.cameras.main.stopFollow();
                my.sprite.player.visible = false;
                my.vfx.walking.stop();
            }

            if(!this.gameover && (!this.hasKey)) {
                my.vfx.death.setPosition(my.sprite.player.x, my.sprite.player.y-100);
                my.vfx.death.start();
                this.add.text(my.sprite.player.x, 600, "Forgot the key!", {fontSize: '128px'}).setOrigin(0.5);
                this.add.text(my.sprite.player.x, 800, "(Press 'R' to restart)", {fontSize: '64px'}).setOrigin(0.5);
                this.gameover = true;
                this.cameras.main.stopFollow();
                my.sprite.player.visible = false;
                my.vfx.walking.stop();
                this.add.sprite(my.sprite.player.x, my.sprite.player.y, "characters_sheet", "playerRed_hit.png").setScale(1.5);
            }
            
        });
        
        

        // camera code
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(my.sprite.player, true, 0.25, 0.25); // (target, roundPixels, lerpX, lerpY)
        this.cameras.main.setDeadzone(50, 50);
        this.cameras.main.setZoom(this.SCALE);

    }

    update() {
        
        if (!this.gameover) {

            if(cursors.left.isDown) {

                my.sprite.player.setAccelerationX(-this.ACCELERATION);

                my.sprite.player.setFlip(true, false);
                my.sprite.player.anims.play('walk', true);
                
                // add particle following
                my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayHeight/2, my.sprite.player.displayHeight/2-30, false);

                my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);

                // Only play smoke effect if touching the ground

                if (my.sprite.player.body.blocked.down) {

                    my.vfx.walking.start();

                }

            } else if(cursors.right.isDown) {
                my.sprite.player.setAccelerationX(this.ACCELERATION);
                
                my.sprite.player.resetFlip();
                my.sprite.player.anims.play('walk', true);

                // add particle following
                my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayHeight/2-70, my.sprite.player.displayHeight/2-30, false);

                my.vfx.walking.setParticleSpeed(-this.PARTICLE_VELOCITY, 0);

                // Only play smoke effect if touching the ground

                if (my.sprite.player.body.blocked.down) {

                    my.vfx.walking.start();

                }

            } else {
                // Set acceleration to 0 and have DRAG take over
                my.sprite.player.setAccelerationX(0);
                my.sprite.player.setDragX(this.DRAG);
                my.sprite.player.anims.play('idle');
                // have the vfx stop playing
                my.vfx.walking.stop();
            }

            // player jump
            // note that we need body.blocked rather than body.touching b/c the former applies to tilemap tiles and the latter to the "ground"
            if(!my.sprite.player.body.blocked.down) {
                my.sprite.player.anims.play('jump');
                console.log("in air");
            }
            if(my.sprite.player.body.blocked.down && Phaser.Input.Keyboard.JustDown(cursors.up)) {
                my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY);
            }

            if(Phaser.Input.Keyboard.JustDown(this.rKey)) {
                this.scene.restart();
            }
        }

        else {

            my.sprite.player.stop();
            my.sprite.player.enable = false;

            if (this.rKey.isDown) {
                this.scene.restart();
            }
        }
    }
}