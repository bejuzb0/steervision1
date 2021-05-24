
var adjustWidthbtn = document.getElementById("barrier_width_btn");
var inputWidthText = document.getElementById("barrier_width_txtbox");

var adjustScaleFixedObj = document.getElementById("fixed_object_btn");
var inputScaleFixedText = document.getElementById("fixed_object_txtbox");

var adjustScaleMovingObj = document.getElementById("moving_object_btn");
var inputScaleMovingText = document.getElementById("moving_object_txtbox");



var game;
var quadrant = -1;
var movableobj;
var SLOWING_FACTOR = 2;
var dot, barrier_obj;
var timer = 0, current_health = 100, dataPush_timer = 0;
var push_needed = 0;

let infoArray = [];

var topleft_text, coordinate_text, health_text;
var points = 0;

var spawn, spawnbarrier, spawngroupbarrierHor, spawngroupbarrierVer, addToDB, movementByMapping, movementByVector;
var groupHorizontal, groupVertical;

var barrierSeperation = 150;
var FixedScale = 1;
var MovingScale = 1;

var prevCoordX = 0;
var prevCoordY = 0;

var gameWidth = 0;
var gameHeight = 0;


class MyGame extends Phaser.Scene {

    constructor () {
        super();
    }

    preload () {
        this.load.image('object', './images/car_object.png');
        this.load.image('background', './images/background.png');
        this.load.image('collectible', './images/dot.png');
        this.load.image('barrierHor', './images/barrier.png');
        gameWidth = this.cameras.main.width;
        gameHeight = this.cameras.main.height;
        var tempScore = window.sessionStorage.getItem('score');
        if(tempScore == null) {
            points = 0;
        }
        else {
            points = tempScore;
        }
    }
      
    create () {
        //this.add.image(gameWidth/2,gameHeight/2,'background');
        this.cameras.main.setBackgroundColor(0xadd8e6);
        movableobj = this.physics.add.image(100,gameHeight/2, 'object');
        movableobj.setScale(MovingScale);

       // movableobj.setCircle(15, 10, -2.5);
        console.log(movableobj);

        topleft_text = this.add.text(10,10,points+" points",{ fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' } );
        coordinate_text = this.add.text(10, 30, "X: "+movableobj.x.toFixed(2)+"  Y: "+ movableobj.y.toFixed(2),{ fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' });
        health_text = this.add.text(10, 50, "Health: "+current_health, { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' } );

        spawn = (spawnobjectname) => {
            dot = this.physics.add.sprite(gameWidth-100,gameHeight/2,spawnobjectname);
            this.physics.add.overlap(movableobj, dot, this.removeObj);
            dot.setScale(FixedScale);
        } 

        spawnbarrier = (barrierobject) => {
            barrier_obj = this.physics.add.image(Phaser.Math.Between(50, gameWidth-50),Phaser.Math.Between(50, gameHeight-50),barrierobject).setImmovable().setBounce(0);
        }

        movementByMapping = (movableobj) => {
            //movableobj.x = normalizedX*800;
             movableobj.x = (indexFingerX+540)*gameWidth/(430);
             //movableobj.y = normalizedY*600;
             movableobj.y = (indexFingerY-170)*gameHeight/220;
         }

        movementByVector = (movableobj) => {
            if(distanceX > 0) {
                if(distanceY > 0) quadrant = 1;
                else quadrant = 4;
            } 
            else {
                if(distanceY > 0) quadrant = 2;
                else quadrant = 3;
            }
                        
            //var angleindegrees = angle*(180/Math.PI);
        
            if(quadrant == 1) {
                movableobj.setVelocityX(magnitude/SLOWING_FACTOR*Math.cos(angle));
                movableobj.setVelocityY(-magnitude/SLOWING_FACTOR*Math.sin(angle));
                // movableobj.x = (movableobj.x + (magnitude/SLOWING_FACTOR)*Math.cos(angle));
                // movableobj.y -= (magnitude/SLOWING_FACTOR)*Math.sin(angle);
                //movableobj.angle = -angleindegrees;
                
                
            }
            else if(quadrant == 2) {
                movableobj.setVelocityX(magnitude/SLOWING_FACTOR*Math.cos(angle));
                movableobj.setVelocityY(-magnitude/SLOWING_FACTOR*Math.sin(angle));
                // movableobj.x = (movableobj.x + (magnitude/SLOWING_FACTOR)*Math.cos(angle));
                // movableobj.y -= (magnitude/SLOWING_FACTOR)*Math.sin(angle);
                //movableobj.angle = -angleindegrees;
        
            }
            else if(quadrant == 3) {
                movableobj.setVelocityX(magnitude/SLOWING_FACTOR*Math.cos(angle));
                movableobj.setVelocityY(-magnitude/SLOWING_FACTOR*Math.sin(angle));
                // movableobj.x = (movableobj.x + (magnitude/SLOWING_FACTOR)*Math.cos(angle));
                // movableobj.y -= (magnitude/SLOWING_FACTOR)*Math.sin(angle);
                //movableobj.angle = -angleindegrees;
            }
            else {
                movableobj.setVelocityX(magnitude/SLOWING_FACTOR*Math.cos(angle));
                movableobj.setVelocityY(-magnitude/SLOWING_FACTOR*Math.sin(angle));
                // movableobj.x = (movableobj.x + (magnitude/SLOWING_FACTOR)*Math.cos(angle));
                // movableobj.y -= (magnitude/SLOWING_FACTOR)*Math.sin(angle);
                //movableobj.angle = -angleindegrees;
            }
        
        
            if(movableobj.x > gameWidth) {
                movableobj.x = 0;
            }
            else if(movableobj.x < 0) {
                movableobj.x = gameWidth;
            }
            if(movableobj.y > gameHeight) {
                movableobj.y = 0;
            }
            else if(movableobj.y < 0) {
                movableobj.y = gameHeight;
            }
         }


        spawngroupbarrierHor = (barrier_obj) => {
             groupHorizontal = this.physics.add.staticGroup({
                key: barrier_obj,
                frameQuantity: 2,
                immovable:true,
            });

            var children = groupHorizontal.getChildren();

            for(var i = 0; i<children.length; i++) {
                var x = Phaser.Math.Between(50, gameWidth-50);
                var y = Phaser.Math.Between(50, gameHeight-50);
                //var anglebarrier = Phaser.Math.Between(-Math.PI, Math.PI);

                children[i].setPosition(x,y);
                //children[i].rotation = anglebarrier;
                
            }
            children[0].setPosition(gameWidth/2, gameHeight/2 - (barrierSeperation/2));
            children[1].setPosition(gameWidth/2, gameHeight/2+ barrierSeperation/2);
            

            groupHorizontal.refresh();
        }

        addToDB = () => {
            const dbname = "gamejamdb";
            

            var DBDeleteRequest = window.indexedDB.deleteDatabase(dbname);

            DBDeleteRequest.onerror = function(event) {
                console.log("Error deleting database.");
            };

            DBDeleteRequest.onsuccess = function(event) {
            console.log("Database deleted successfully");
            
            const dbrequest = window.indexedDB.open(dbname);

            dbrequest.onupgradeneeded = function(event) {
                var db = event.target.result;
                var store = db.createObjectStore("data1", {autoIncrement: true});
                store.transaction.oncomplete = function(event) {
                    
                    var ObjectStore = db.transaction("data1", "readwrite").objectStore("data1");
                    infoArray.forEach(function(info) {
                      ObjectStore.add(info);
                    });
                  };
            }

            dbrequest.onsuccess = function(event) {
                
                
                console.log(infoArray.length+" total items");
                //location.reload();

                
                // for(var i = 0; i<infoArray.length; i++) {
                //     store.put(
                //         {
                //             TimeStamp: infoArray[i].timeStamp,
                //             xCoord: infoArray[i].xCoord,
                //             yCoord:infoArray[i].yCoord,
                //             collision: infoArray[i].collision,
                //             fixedObjScale : infoArray[i].fixedObjScale,
                //             movingObjScale : infoArray[i].movingObjScale
                //         }
                //     );
                // }
            }
            
            };

            
            

        }

        adjustWidthbtn.addEventListener("click", function() {
            if(!isNaN(inputWidthText.value) && parseInt(inputWidthText.value) > 0) {
                
                barrierSeperation = parseInt(inputWidthText.value);
                console.log(barrierSeperation);
                game.destroy(true,false);
                game = new Phaser.Game(config);
            }
            
        });

        adjustScaleFixedObj.addEventListener("click", function() {
            if(!isNaN(inputScaleFixedText.value) && parseFloat(inputScaleFixedText.value) > 0) {
                FixedScale  = parseFloat(inputScaleFixedText.value);
                
                console.log("Fixed Object Scale changed!");
                game.destroy(true,false);
                game = new Phaser.Game(config);
            }
            
        });

        adjustScaleMovingObj.addEventListener("click", function() {
            if(!isNaN(inputScaleMovingText.value) && parseFloat(inputScaleMovingText.value) > 0) {
                MovingScale = parseFloat(inputScaleMovingText.value);
                
                console.log("Moving Object Scale changed!");
                game.destroy(true,false);
                game = new Phaser.Game(config);
            }
            
        });

        /*spawngroupbarrierVer = (barrier_obj) => {
            groupVertical = this.physics.add.staticGroup({
               key: barrier_obj,
               frameQuantity: 4,
               immovable:true,
           });

           var children = groupVertical.getChildren();

           for(var i = 0; i<children.length; i++) {
               var x = Phaser.Math.Between(50, 750);
               var y = Phaser.Math.Between(50, 550);
               //var anglebarrier = Phaser.Math.Between(-Math.PI, Math.PI);

               children[i].setPosition(x,y);
               //children[i].rotation = anglebarrier;
               
           }

           groupVertical.refresh();
       } */
        
        spawn('collectible');
        spawngroupbarrierHor('barrierHor');
        //spawngroupbarrierVer('barrierVer');
        
        //spawnbarrier('barrier');

        

    }

    


    // update(time, delta) {
    //     if(push_needed == 1) {
    //         push_needed = 0;
    //         addToDB();
    //     }
    //     if(isPredicting) {
    //         timer += delta;
    //         while(timer > 1000) {
    //             timer -=1000;
    //             //current_health -=5;
    //             //health_text.setText("Health: "+ current_health);
                
                

    //         }
    //         this.physics.world.collide(movableobj, groupHorizontal, function() {
    //             //movableobj.setVelocityY(0);
    //             console.log("Collision");
    //             setTimeout(function() {
    //                 points -= 10; 
    //                 topleft_text.setText(points + " points");
    //             }, 1000);
    //             let singleInfo = {
    //                 "timeStamp": Date.now(),
    //                 "xCoord": movableobj.x.toFixed(2),
    //                 "yCoord": movableobj.y.toFixed(2),
    //                 "collision": "1"
    //             }
    //             infoArray.push(singleInfo);
    //             push_needed = 1;
                
    //         });

    //         this.physics.world.collide(movableobj, groupVertical, function() {
    //             console.log("Collision");
    //             //movableobj.setVelocityX(0);
    //             setTimeout(function() {
    //                 points -= 10; 
    //                 topleft_text.setText(points + " points");
    //             }, 1000);
    //         });
            
    //         if(distanceX > 0) {
    //             if(distanceY > 0) quadrant = 1;
    //             else quadrant = 4;
    //         } 
    //         else {
    //             if(distanceY > 0) quadrant = 2;
    //             else quadrant = 3;
    //         }
            
    //         var angleindegrees = angle*(180/Math.PI);
        
    //         if(quadrant == 1) {
    //             movableobj.setVelocityX(magnitude/SLOWING_FACTOR*Math.cos(angle));
    //             movableobj.setVelocityY(-magnitude/SLOWING_FACTOR*Math.sin(angle));
    //             // movableobj.x = (movableobj.x + (magnitude/SLOWING_FACTOR)*Math.cos(angle));
    //             // movableobj.y -= (magnitude/SLOWING_FACTOR)*Math.sin(angle);
    //             movableobj.angle = -angleindegrees;
                
                
    //         }
    //         else if(quadrant == 2) {
    //             movableobj.setVelocityX(magnitude/SLOWING_FACTOR*Math.cos(angle));
    //             movableobj.setVelocityY(-magnitude/SLOWING_FACTOR*Math.sin(angle));
    //             // movableobj.x = (movableobj.x + (magnitude/SLOWING_FACTOR)*Math.cos(angle));
    //             // movableobj.y -= (magnitude/SLOWING_FACTOR)*Math.sin(angle);
    //             movableobj.angle = -angleindegrees;
        
    //         }
    //         else if(quadrant == 3) {
    //             movableobj.setVelocityX(magnitude/SLOWING_FACTOR*Math.cos(angle));
    //             movableobj.setVelocityY(-magnitude/SLOWING_FACTOR*Math.sin(angle));
    //             // movableobj.x = (movableobj.x + (magnitude/SLOWING_FACTOR)*Math.cos(angle));
    //             // movableobj.y -= (magnitude/SLOWING_FACTOR)*Math.sin(angle);
    //             movableobj.angle = -angleindegrees;
    //         }
    //         else {
    //             movableobj.setVelocityX(magnitude/SLOWING_FACTOR*Math.cos(angle));
    //             movableobj.setVelocityY(-magnitude/SLOWING_FACTOR*Math.sin(angle));
    //             // movableobj.x = (movableobj.x + (magnitude/SLOWING_FACTOR)*Math.cos(angle));
    //             // movableobj.y -= (magnitude/SLOWING_FACTOR)*Math.sin(angle);
    //             movableobj.angle = -angleindegrees;
    //         }
        
        
    //         if(movableobj.x > 800) {
    //             movableobj.x = 0;
    //         }
    //         else if(movableobj.x < 0) {
    //             movableobj.x = 800;
    //         }
    //         if(movableobj.y > 600) {
    //             movableobj.y = 0;
    //         }
    //         else if(movableobj.y < 0) {
    //             movableobj.y = 600;
    //         }

    //         coordinate_text.setText("X: " + movableobj.x.toFixed(2) + " Y: "+movableobj.y.toFixed(2));
    //         let singleInfo = {
    //             "timeStamp": Date.now(),
    //             "xCoord": movableobj.x.toFixed(2),
    //             "yCoord": movableobj.y.toFixed(2),
    //             "collision": "0"
    //         }
    //         infoArray.push(singleInfo); 
            
            
    //     }
    // }

    update(time, delta) {
        // if(push_needed == 1) {
        //     push_needed = 0;
        //     addToDB();
        // }
        if(isPredicting) {
            timer += delta;
            dataPush_timer += delta;
            while(timer > 300) {
                timer -=300;
                prevCoordX = movableobj.x;
                prevCoordY = movableobj.y
                current_health -=1;
                health_text.setText("Health: "+ current_health);
                if(current_health < 0) {
                    alert("Took too long ! Game Over");
                    location.reload();
                }
                


            }

            while(dataPush_timer > 100) {
                dataPush_timer -=100;
                let singleInfo = {
                    "timeStamp": Date.now(),
                    "xCoord": movableobj.x.toFixed(2),
                    "yCoord": movableobj.y.toFixed(2),
                    "fixedObjScale" : FixedScale,
                    "movingObjScale" : MovingScale,
                    "collision": "0"
                }
                infoArray.push(singleInfo); 
            }


            this.physics.world.collide(movableobj, groupHorizontal, function() {
                console.log("Collision");
                //groupHorizontal.destroy();
                isPredicting = false;
                setTimeout(function() {
                    points -= 10; 
                    topleft_text.setText(points + " points");
                }, 1000);
                let singleInfo = {
                    "timeStamp": Date.now(),
                    "xCoord": movableobj.x.toFixed(2),
                    "yCoord": movableobj.y.toFixed(2),
                    "fixedObjScale" : FixedScale,
                    "movingObjScale" : MovingScale,
                    "collision": "1"
                }
                infoArray.push(singleInfo);
                //push_needed = 1;
                addToDB();
                
                
            });

            
            this.physics.world.collide(movableobj, groupVertical, function() {
                console.log("Collision");
                //movableobj.setVelocityX(0);
                setTimeout(function() {
                    points -= 10; 
                    topleft_text.setText(points + " points");
                }, 1000);
            });

            // this.physics.world.collide(movableobj, barrier_obj, function () {
            //     console.log('hit?');
            // });
            
           

            movementByMapping(movableobj);
            //movementByVector(movableobj);
            


            
            coordinate_text.setText("X: " + movableobj.x.toFixed(2) + " Y: "+movableobj.y.toFixed(2));
            
            
            
            
        }
    }


    removeObj(movableobj, dotobj) {
            dotobj.body.enable = false;
            dotobj.destroy();
            console.log("Consumed!");
            let singleInfo = {
                "timeStamp": Date.now(),
                "xCoord": movableobj.x.toFixed(2),
                "yCoord": movableobj.y.toFixed(2),
                "fixedObjScale" : FixedScale,
                "movingObjScale" : MovingScale,
                "collision": "0"
            }
            infoArray.push(singleInfo);
            addToDB();
            var pt = parseInt(points);
            pt += (25-barrierSeperation/10) + (20-FixedScale*10);
            points = pt;
            window.sessionStorage.setItem('score', points);
            current_health += 15;
            health_text.setText("Health: "+current_health);
            topleft_text.setText(points + " points");
            
            
            
            //location.reload();
    }

    barrier_collision_fn(movableobj, barrierobj) {
            console.log("Collided!");
            points -= 10;
            let singleInfo = {
                "timeStamp": Date.now(),
                "xCoord": movableobj.x.toFixed(2),
                "yCoord": movableobj.y.toFixed(2),
                "fixedObjScale" : FixedScale,
                "movingObjScale" : MovingScale,
                "collision": "1"
            }
            infoArray.push(singleInfo);
            addtoDB();
            topleft_text.setText(points + " points");
    }

    render() {
        
    }

}


// const myCustomCanvas = document.createElement('canvas');
// myCustomCanvas.id = 'myCustomCanvas';
// document.body.prepend(myCustomCanvas);

const config = {
    type: Phaser.AUTO,
    width: 1450, //1450
    height: 700, //700

    physics: {
        default: 'arcade',
        // arcade : {
        //    debug: true
        // }
    },
    scene: MyGame
};

game = new Phaser.Game(config);


