const inputField = document.getElementById("userInput");
const displayParagraph = document.querySelector(".displayValue");
const submitButton = document.getElementById("submitButton");
const divElements = document.querySelectorAll("div.state");
const lineElement = document.querySelectorAll("div.line");
const clock = document.querySelector(".binaryclock");
const invalidRes = document.querySelector(".validationResult");
const validRes = document.querySelector(".validationResult")
const resDes = document.querySelector(".rdescribe");
let runMinute, runSecond, validity, clockCounter;

//this is for the reset button
reset.addEventListener("click", function () {
    divElements.forEach(div => {
        div.textContent = "";
        div.classList.remove("green");
        div.classList.remove("wrong");
        clock.textContent = "00:00:00";
        displayParagraph.textContent = " ";
        invalidRes.textContent = "";
        validRes.textContent = "";
        resDes.textContent = "";
    });
    lineElement.forEach(line => {
        line.classList.remove("green");
        line.classList.remove("wrong");
    });
});

// the simulator processes once we click go button
submitButton.addEventListener("click", function () {
    
    // if input has nothing
    if (inputField.value === "") {
        console.log("No input provided");
        const invalidRes = document.querySelector(".validationResult");
        invalidRes.textContent = "INVALID";
        describeRes("Inputted binary string is invalid because it has no input.");
        setTimeout(() => {
            invalidRes.classList.add("invalidResult");
            invalidRes.classList.remove("validResult");
        }, 3000);
        return;
    }

    //this is to display the current input from the user
    const tokenizedInput = inputField.value.split("");
    const displayInput = tokenizedInput.join(" ");
    displayParagraph.textContent = ` ${displayInput}`;

    // the delimiter for each substring is the space character
    const binaryinput = inputField.value.split(" ");
    const hour = binaryinput[0] ?? "";
    const minute = binaryinput[1] ?? "";
    const second = binaryinput[2] ?? "";

    // these are our checkers; each of these turns false if the substring for either of the three becomes invalid hence, it stops on processing
    runMinute = true;
    runSecond = true;
    validity = true;

    // these variables are used to display the equivalent decimal number of the binary time
    let hourdec, minutedec, seconddec;

    // if the user immediately inputs something and no longer wants to click reset button, this allows automatic reset
    divElements.forEach(div => {
        div.textContent = "";
        div.classList.remove("green");
        div.classList.remove("wrong");
        clock.textContent = "00:00:00";
        invalidRes.textContent = "";
        validRes.textContent = "";
    });
    lineElement.forEach(line => {
        line.classList.remove("green");
        line.classList.remove("wrong");
    });

    // this is the logic in order for the order of the process for each substring
    setTimeout(() => {
        if(hour.length === 0){ //just making sure that if the hour substring is empty it should stop the process here
            InvalidResult();
            return;
        }
        hour_machine(hour); // calling out hour_machine to process substring hour

        if (runMinute && minute.length > 0) { // if the runMinute is true and there is an input for minute, it processes substring minutes
            setTimeout(() => {
                minute_machine(minute);

                if (runSecond && second.length > 0) { // if runSecond is true and there is input for seconds, it processes substring seconds
                    setTimeout(() => {
                        second_machine(second);

                        // Final validity check
                        setTimeout(() => {
                            if (!runMinute || !runSecond || !validity) { // if at some point validity is false, then the entire string becomes invalid
                                
                                InvalidResult();
                            } else { // else, it is valid and displays the equivalent decimal value of the binary clock
                                describeRes("Inputted binary string is valid.");
                                hourdec = parseInt(hour, 2);
                                minutedec = parseInt(minute, 2);
                                seconddec = parseInt(second, 2);
                                console.log(hourdec, minutedec, seconddec);
                                clockDisplay(hourdec, minutedec, seconddec);
                                console.log("All checks passed");
                                ValidResult();
                            }
                        }, 9000);
                    }, 1000); 
                    // the following else if are just to avoid errors
                } else if(second.length === 0){
                    setTimeout(() => {
                        if (!runMinute || !runSecond || !validity) {
                            console.log("Invalid");
                            InvalidResult();
                        } else {
                            console.log("Valid");
                            hourdec = parseInt(hour, 2);
                            minutedec = parseInt(minute, 2);
                            console.log(hourdec, minutedec);
                            clockDisplay(hourdec, minutedec, "00");
                            console.log("All checks passed");
                            ValidResult();
                            describeRes("Inputted binary string is valid.");
                        }
                    }, 3000);
                }else{
                    console.log("Invalid");
                    InvalidResult();
                    describeRes("Inputted binary string is invalid because it has no input.");
                }
            }, 1000); 
        } else if(minute.length === 0){
            setTimeout(() => {
                if (!runMinute || !runSecond || !validity) {
                    console.log("Invalid");
                    InvalidResult();
                } else {
                    console.log("Valid");
                    hourdec = parseInt(hour, 2);
                    console.log(hourdec);
                    clockDisplay(hourdec, "00", "00");
                    console.log("All checks passed");
                    ValidResult();
                    describeRes("Inputted binary string is valid.");
                }
            }, 3000);
        }else{
            console.log("Invalid");
            InvalidResult();
            describeRes("Inputted binary string is invalid because it has no input.");
        }
    }, 0);

});
//this is the sub-state machine for the hour substring
function hour_machine(input_hour) {
    
    if(input_hour[0] == "1" && input_hour[1] == "1"){ // this is to impose if the substring follows the invalid pattern
        green(input_hour[0], 0);
        wrong(input_hour[1], 1);
        runMinute = false;
        describeRes("Inputted binary string for hour is invalid because it has exceeded the maximum value of 23.");
        return;
    }

    const hour_length = input_hour.length;
    let red = 0, i = 0;
    // if the substring doesn't follow the invalid pattern, then it goes through this loop to process each bit
    for (i = 0; i < hour_length; i++) {
        if (!inputValidation(input_hour[i])) { // if the character for the substring is valid
            wrong(input_hour[i], i);
            red = 1;
            describeRes("Inputted character is invalid because it is not a binary digit.");
            break;
        }

        // checks if it passes the required number of bits 
        if (i === hour_length - 1 && hour_length < 4) {
            wrong(input_hour[i], i);
            red = 1;
            describeRes("Inputted binary string for hour is invalid because it has less than 4 bits.");
            break;
        }else if(i === hour_length - 1 && hour_length > 5){
            wrong(input_hour[i-1], 4);
            red = 1;
            describeRes("Inputted binary string for hour is invalid because it has more than 5 bits.");
            break;
        }
        // if all is well for each character, then it becomes valid
        green(input_hour[i], i);
    }

    //if at some point, it gets inside the checker and the red becomes 1. We change the value of runMinute to false. 
    //this means that the substring is invalid therefore, it shouldn't process the next substrings anymore
    if (red === 1) {
        runMinute = false;
    }
}

// this is the sub-state machine for the minutes
function minute_machine(input_minute){

    const minute = input_minute;
    const minute_length = input_minute.length;
    let i = 0, bitcounterlimit = 7, red = 0, index = 5;
    
    for (i = 0; i < minute_length; i++){
        // index is the continuation of the dev elements from the hour machine
        if(!inputValidation(minute[i])){
            wrong(minute[i], index);
            red = 1;
            describeRes("Inputted character is invalid because it is not a binary digit.");
            break;
        }

        // this is the invalid pattern. If the substring qualifies this, it becomes invalid
        if(minute[0] == "1" && minute[1] == "1" && minute[2] == "1" && minute[3] == "1"){
            green(minute[0], 5);
            green(minute[1], 6);
            green(minute[2], 7);
            wrong(minute[3], 8);
            runSecond = false;
            describeRes("Inputted binary string for minute is invalid because it has exceeded the maximum value of 59.");
            return;
        }

        // if the substring is okay then, we check the length of the substring
        if(i === minute_length - 1 && minute_length < bitcounterlimit-1){
            wrong(minute[i], index);
            red = 1;
            describeRes("Inputted binary string for minute is invalid because it has less than 6 bits.");
            break;
        }else if(i === minute_length - 1 && minute_length > bitcounterlimit-1){
            wrong(minute[i-1], 10);
            red = 1;
            describeRes("Inputted binary string for minute is invalid because it has more than 6 bits.");
            break;
        }
        // If all is good, mark the current bit green
        green(minute[i], index);
        index += 1; // Increment index for the next bit
    }

    if (red == 1){
        runSecond = false;
    }
}

//this is the sub-state machine for the seconds
function second_machine(input_second){

    // checking the invalid pattern. If it checks then it is invalid
    if(input_second[0] == "1" && input_second[1] == "1" && input_second[2] == "1" && input_second[3] == "1"){
        green(input_second[0], 11);
        green(input_second[1], 12);
        green(input_second[2], 13);
        wrong(input_second[3], 14);
        validity = false;
        describeRes("Inputted binary string for second is invalid because it has exceeded the maximum value of 59.");
        return;
    }

    const second = input_second;
    const second_length = input_second.length;
    let i = 0, bitcounterlimit = 7, red = 0, index = 11;
    for (i = 0; i < second_length; i++){
        // index is the continuation of the dev elements from the hour machine
        if(!inputValidation(second[i])){
            wrong(second[i], index);
            red = 1;
            describeRes("Inputted character is invalid because it is not a binary digit.");
            break;
        }

        //checkes the length of the string
        if(i === second_length - 1 && second_length < bitcounterlimit-1){
            wrong(second[i], index);
            red = 1;
            describeRes("Inputted binary string for second is invalid because it has less than 6 bits.");
            break;
        }else if(i === second_length - 1 && second_length > bitcounterlimit-1){
            wrong(second[i-1], 17);
            red = 1;
            describeRes("Inputted binary string for second is invalid because it has more than 6 bits.");
            break;
        }
        // If all is good, mark the current bit green
        green(second[i], index);
        index += 1; // Increment index for the next bit
    }


    if (red == 1){
        validity = false;
    }
}

function inputValidation(element){
    //binary validation
    if (element == "0" || element == "1"){
        return true;
    } else {
        return false;
    }
}

function green(input, index){
    setTimeout(() => {
        divElements[index].textContent = input;
        divElements[index].classList.add("green");
        lineElement[index].classList.add("green");
        if(index == 5){ //if at some point, the hour substring is length 4, the line before the state for minutes should change color
            lineElement[4].classList.add("green");
        }
    }, index * 600);
}
function wrong(input, index){
    // this is the pink, which means the bit is invalid
    setTimeout(() => {
        divElements[index].textContent = input;
        divElements[index].classList.add("wrong");
        lineElement[index].classList.add("wrong");
    }, index * 600);
}
function InvalidResult(){
    invalidRes.textContent = " INVALID";
    setTimeout(() => {
        invalidRes.classList.add("invalidResult");
        invalidRes.classList.remove("validResult");
    }, 9000);
    clockCounter = 0;
}
function ValidResult(){
    validRes.textContent = " VALID";
    setTimeout(() => {
        validRes.classList.add("validResult");
        validRes.classList.remove("invalidResult");
    }, 9000);
    clockCounter = 1;
}

function clockDisplay(hourinput, minuteinput, secondsinput) {
    const time = `${hourinput}:${minuteinput}:${secondsinput}`;
    clock.textContent = time;
    clock.style.visibility = "visible";
    clock.style.opacity = 1;
}

function describeRes(inputtedString){
    setTimeout(()=> {
        resDes.textContent = inputtedString;
    }, 3000);
}
