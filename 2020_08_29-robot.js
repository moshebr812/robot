// when working in px
// const defaultWidth = 25;
// const defautlHeight = 25;
// when working in %
const defaultWidth = 2.75;
const defautlHeight = 4.5;
const gDebug = false;
const northArrowBlack = 'up-BlackArrow.png';
const northArrowRed = 'up-RedArrow.png';
const replayTrailDelay = 2;

class Robot {
    // counter for unique ID on board
    static objectID = 0;
    static actualTrailPoints = 0;
    // get pointer to DOM only Once
    static divContainer = document.querySelector(`#robotPath`);
    // keep track of previous direction
    static previousDirection = 'North';
    // must keep the last x, y so we can "travel" on the DOM
    static xPos = 0;
    static yPos = 0;
   // do we show only last point of full trail as we play.
    static showFullTrail = false;
    // Array of points we walked through to enable a redraw
    static locationTrail = [];
    // When we replay the trail, we MUST NOT add the points to the Array !!!
    static isReplayTrailOn = false;

    constructor() {
    }

    printProperties (pBeforeORAfterChange, pNewDirection) {
        console.log (`\n\n Time: ${pBeforeORAfterChange}.   NewDirection: ${pNewDirection}`)
        console.log ( `x = ${Robot.xPos}  y = ${Robot.yPos}  previousDirection = ${Robot.previousDirection} objectID = ${Robot.objectID} `  );
    }

    walkOneStep (pAction) {
        Robot.objectID++;
        // 1st Point ==>> init the position only once
        if (Robot.objectID === 1) {
            // 1st Icon. Calc the x, y
            if ( gDebug ) { alert ('1st time')}

            // // when working in relative + px
            // Robot.xPos = Robot.divContainer.offsetWidth/2;
            // Robot.yPos = Robot.divContainer.offsetHeight/2;
            // when working in aobsolute + %
            Robot.xPos = 50;
            Robot.yPos = 50;

            // if (Robot.isReplayTrailOn === false) {
            //     Robot.locationTrail.push ({objectID: Robot.objectID, x: Robot.xPos, y: Robot.yPos,  walkCommand: pAction});
            // }

            Robot.actualTrailPoints++;  // increase this only when init or walk, not when changing a direction
            this.updateTrailInfo('init');

            // alert ('rootpath width = ' + Robot.divContainer.offsetWidth + '\n height = ' + Robot.divContainer.offsetHeight);
            // alert ('left : ' + Robot.divContainer.style.left + '   \n right : ' + Robot.divContainer.style.top) ;
        } else {

            // Nth Point ==>> do we show full Trail OR only the last point?
            let previousPointID = document.querySelector(`#imgPacer_${Robot.objectID - 1}`);

            if (Robot.showFullTrail) {
                // change the old trail from black to red using ....
                previousPointID.src = northArrowBlack;
            } else {
                // remove  old icon before we draw a new icon
                let previousPointID = document.querySelector(`#imgPacer_${Robot.objectID - 1}`);
                previousPointID.remove();
            }

            // User Flow, not initiation
            if (pAction === 'left' || pAction === 'right') {
                // no walk. Only icon Rotate
                this.updateTrailInfo('turn ' + pAction);

            } else    {
                // start section of walk, not 1st time
                Robot.actualTrailPoints++;
                // we need to walk
                if (Robot.previousDirection === 'North') {
                    // Robot.xPos += defaultWidth;      // xPos remains as is
                    Robot.yPos -= defautlHeight;
                } else if  (Robot.previousDirection === 'East') {
                    Robot.xPos += defaultWidth;
                    //Robot.yPos -= defautlHeight;   // yPose remains as is
                }  else if  (Robot.previousDirection === 'South') {
                    // Robot.xPos += defaultWidth;      // xPos remains as is
                    Robot.yPos += defautlHeight;
                }  else if  (Robot.previousDirection === 'West') {
                    Robot.xPos -= defaultWidth;
                    // Robot.yPos += defautlHeight;        // yPos remains as us
                } else {
                    alert (' ERROR: invalid Direction encountered at "walkOneStep');
                }

                // When in replay, we scan the existing array, we can't push into it.
                // if ( Robot.isReplayTrailOn === false) {
                //     Robot.locationTrail.push ({objectID: Robot.objectID, x: Robot.xPos, y: Robot.yPos,  walkCommand: pAction});
                // }

                this.updateTrailInfo('walk');
                // end section of walk, not 1st time
            }
        }

        if (Robot.isReplayTrailOn === false) {
            Robot.locationTrail.push ({objectID: Robot.objectID, x: Robot.xPos, y: Robot.yPos,  walkCommand: pAction, previousDirection: Robot.previousDirection });
        }

        console.log (pAction);
        let newStep = document.createElement('img');
        newStep.id = `imgPacer_${Robot.objectID}`;
        // Create a default class with the size & border
        newStep.className = `imageToWalk`;
        // Add the class that shows the correct Arrow Direction
        newStep.classList.add(`direction${Robot.previousDirection}`);
        newStep.alt = `???`;
        newStep.src= northArrowRed;

        if ( gDebug) { alert ('Robot.xPos = ' + Robot.xPos + '\n Robot.yPos = ' + Robot.yPos ) }

        // newStep.style.left = `${Robot.xPos}px`;
        // newStep.style.top = `${Robot.yPos}px`;
        newStep.style.left = `${Robot.xPos}%`;
        newStep.style.top = `${Robot.yPos}%`;


        Robot.divContainer.appendChild(newStep);
    }

    // Assume the default Icon is North ==>> required rotation degree = 0
    turnLeft () {
        console.log ('LEFT !!!');

        switch (Robot.previousDirection) {
            case 'North':
                Robot.previousDirection = 'West';
               break;
            case 'East':
                Robot.previousDirection = 'North';
                break;
            case 'South':
                Robot.previousDirection = 'East';
                break;
            case 'West':
                Robot.previousDirection = 'South';
                break;
            default:
                alert ('wrong value passed to Robot.turnLeft() ' );
        }

        this.walkOneStep('left');
    }

    turnRight () {
        console.log ('RIGHT !!!');

        switch (Robot.previousDirection) {
            case 'North':
                Robot.previousDirection = 'East';
                break;
            case 'East':
                Robot.previousDirection = 'South';
                break;
            case 'South':
                Robot.previousDirection = 'West';
                break;
            case 'West':
                Robot.previousDirection = 'North';
                break;
            default:
                alert ('wrong value passed to Robot.turnRight() ' );
        }

        this.walkOneStep('right');
    }

    replayLocationTrail () {
        // We must flag the walk() function NOT to add points to the TrailArray[]
        // And we flag the Reset NOT to clear the TrailArray
        Robot.isReplayTrailOn = true;
        this.Reset();

        // simulate the 1st point as if was called from IIFE
        console.clear();
        console.log(`\n\n======= replayLocationTrail() \n   Replay Trail will start in seconds ${replayTrailDelay} `);

        let banner = `<strong id="trailReplayBanner" style="color: darkred ">Trail Replaying in ${replayTrailDelay} Seconds </strong>`
        Robot.divContainer.innerHTML = banner;

        alert ( `\n Array Length = ${Robot.locationTrail.length} \n replay will start in ${replayTrailDelay} seconds`);

        function internalReplay () {
            let iRobot = new Robot();
            // Now loop on all previous points
            for (let i = 0; i < Robot.locationTrail.length; i++) {

                console.log(`ID: ${Robot.locationTrail[i].objectID} trail: x:  ${Robot.locationTrail[i].x}  y:  ${Robot.locationTrail[i].y}  Command: ${Robot.locationTrail[i].walkCommand} Direction: ${Robot.previousDirection}`);

                // Set in Robot.previousDirection the value from the array
                // When not in replay, this is done from fucntions turnLeft(), turnRight()
                Robot.previousDirection = Robot.locationTrail [i].previousDirection;
                iRobot.walkOneStep(Robot.locationTrail[i].walkCommand);
            }

            Robot.isReplayTrailOn = false;
        }

        setTimeout (internalReplay, ( replayTrailDelay* 1000) );

        // // Now loop on all previous points
        // for (let i = 0; i < Robot.locationTrail.length; i++) {
        //
        //     console.log(`ID: ${Robot.locationTrail[i].objectID} trail: x:  ${Robot.locationTrail[i].x}  y:  ${Robot.locationTrail[i].y}  Command: ${Robot.locationTrail[i].walkCommand} Direction: ${Robot.previousDirection}`);
        //
        //     // Set in Robot.previousDirection the value from the array
        //     // When not in replay, this is done from fucntions turnLeft(), turnRight()
        //     Robot.previousDirection = Robot.locationTrail [i].previousDirection;
        //     this.walkOneStep(Robot.locationTrail[i].walkCommand);
        // }
        //
        // Robot.isReplayTrailOn = false;
    }   // END replayLocationTrail

     Reset() {
            // we start the Objects Counter from Scratch
            Robot.objectID = 0;
            Robot.actualTrailPoints = 0;
            // Set back direction to default North
            Robot.previousDirection = 'North';
            // clean all children;
            Robot.divContainer.innerHTML='';
            // Remove History

            // in case we are in replayTrail the following 2 actions ARE NOT needed
            if (Robot.isReplayTrailOn === false) {
                Robot.locationTrail = [];
                walk();
            }
     } //   END Reset

     updateTrailInfo (pCalledFrom) {
         document.querySelector('#inputWalkDirection').value = Robot.previousDirection;
         document.querySelector('#inputXpos').value = Robot.xPos;
         document.querySelector('#inputYpos').value = Robot.yPos;
         document.querySelector('#inputTotalPoints').value = Robot.actualTrailPoints;
         document.querySelector('#inputLastAction').value = pCalledFrom;
     }

     showHideTrail(pShowTrail) {
        Robot.showFullTrail = pShowTrail;
     }

     printJSONTrailToConsole () {
        alert ('Open Console to view TrailArray JSON');
        console.log ( JSON.stringify( Robot.locationTrail ) );
     }
}

// IIFE
( () => {
    if (gDebug) { alert ('IIFE') }
    // Init the "walk" so we get the 1st point in teh middle of the screen ....
    walk();
}) ()

//  Pointers to DOM Buttons
const buttonWalk = document.querySelector('#buttonWalk')
const buttonTurnLeft = document.querySelector('#buttonTurnLeft')
const buttonTurnRight = document.querySelector('#buttonTurnRight')
const buttonRelayTrail = document.querySelector(`#buttonRelayTrail`);
const buttonReset = document.querySelector(`#buttonReset`);
const buttonTrialJSON  = document.querySelector(`#buttonPrintTrailArray`);
// Pointer to CheckBox
const checkboxFullTrail = document.querySelector(`#inputShowFullTrail`);

// 1 common instance of class Robot
const myRobot = new Robot();

// Add relevant Events
buttonWalk.addEventListener('click', function() {
    walk() });
buttonTurnLeft.addEventListener('click', function() {
    left () });
buttonTurnRight.addEventListener('click', function() {
    right () });
buttonRelayTrail.addEventListener( 'click', replayTrail );
buttonReset.addEventListener('click',function () {
    let nRobot = new Robot();
    nRobot.Reset();
});
buttonTrialJSON.addEventListener ('click', myRobot.printJSONTrailToConsole ) ;
//    alert('\n open console to view trail array info');
//    console.clear();
//    alert (myRobot.xP)
//    // console.log ( JSON.stringify( myRobot.locationTrail ) ) ;
//    // console.log ( `Array Length = ${myRobot.locationTrail.length} `) ;
// });

checkboxFullTrail.addEventListener('click', function() {
    let showTrail = checkboxFullTrail.checked;
    myRobot.showHideTrail(showTrail);
});
//


function walk () {
    let myDirection = new Robot();
    myDirection.printProperties('after', 'walk');
    myDirection.walkOneStep('walk');
}

function left () {
    // let myDirection = new Robot();
    // myRobot.printProperties('before','left');
    myRobot.turnLeft();
    myRobot.printProperties('after','left');
}

function right () {
    let myDirection = new Robot();
    // myDirection.printProperties('before','right')
    myDirection.turnRight();
    myDirection.printProperties('after','right')
}

function replayTrail() {
    let newLocation = new Robot();
    newLocation.replayLocationTrail () ;
}

