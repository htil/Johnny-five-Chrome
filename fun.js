var five = require("johnny-five");
const { Board, Motor , Sensor} = require("johnny-five");
var board = new five.Board({ port: "/dev/ttyACM0" });
var button ;
var button2;
var speed = 100; 

board.on("ready", () => {
    /*
        Motor A
          pwm: 3
          dir: 12
     */
    button = new five.Button(2);
    button2 = new five.Button(8);

    const potentiometer = new Sensor("A3");

    /*potentiometer.on("change", () => {
      const {value, raw} = potentiometer;
      console.log("Sensor: ");
      console.log("  value  : ", value);
      console.log("  raw    : ", raw);
      console.log("-----------------");
    });
*/

    const motor = new Motor({
      pins: {
        pwm: 3,
        dir: 12
      },
      invertPWM: true
    });
  
    board.repl.inject({
      motor,
      button: button
    });
  
    button.on("down", function() {
      console.log("down");
      speed = speed + 10;
      console.log(speed);
    });

    button2.on("down", function() {
      console.log("down");
      speed = speed - 10;
      console.log(speed);
    });
  
    // "hold" the button is pressed for specified time.
    //        defaults to 500ms (1/2 second)
    //        set
    button.on("hold", function() {
      console.log("hold");
      speed = speed - 10;
      console.log(speed);
    });


    motor.on("start", () => {
      console.log(`Speed is : ${speed}`);
      if(speed < 100){
        motor.stop();
      }
      
      board.wait(1000, () => {
        motor.start(speed);
      });
    });
  
    motor.on("stop", () => {
      console.log(`stopped on: ${speed}`);
    });
  
    motor.on("forward", () => {
      console.log(`forward: ${Date.now()}`);
      if(speed < 100){
        motor.stop();
      }
  
      // demonstrate switching to reverse after 5 seconds
    //  board.wait(2000, () => motor.reverse(speed));
    });
  
    motor.on("reverse", () => {
      console.log(`reverse: ${Date.now()}`);
      if(speed < 100){
        motor.stop();
      }
  
      // demonstrate stopping after 5 seconds
     // board.wait(2000, () => motor.forward(speed))

    });
    // set the motor going forward full speed
    if(speed >= 100){
      motor.start(speed);
      motor.forward();
    }
    if(speed < 100){
      motor.stop();
    }
   // motor.start(speed);
  
  });