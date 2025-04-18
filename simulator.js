const inputField = document.getElementById("userInput");
const displayParagraph = document.querySelector(".displayValue");
const submitButton = document.getElementById("submitButton");
const divElements = document.querySelectorAll("div.state");
const clock = document.querySelector(".binaryclock");
const invalidRes = document.querySelector(".validationResult");
const validRes = document.querySelector(".validationResult")
let runMinute, runSecond, validity, clockCounter;

reset.addEventListener("click", function () {
    divElements.forEach(div => {
        div.textContent = "";
        div.classList.remove("green");
        div.classList.remove("wrong");
        clock.textContent = "00:00:00";
        displayParagraph.textContent = " ";
        invalidRes.textContent = "";
        validRes.textContent = "";
    });
});
submitButton.addEventListener("click", function () {
    
    // if input has nothing
    if (inputField.value === "") {
        console.log("No input provided");
        const invalidRes = document.querySelector(".validationResult");
        invalidRes.textContent = "INVALID";
        setTimeout(() => {
            invalidRes.classList.add("invalidResult");
            invalidRes.classList.remove("validResult");
        }, 3000);
        return;
    }

    const tokenizedInput = inputField.value.split("");
    const displayInput = tokenizedInput.join(" ");
    displayParagraph.textContent = ` ${displayInput}`;

    const binaryinput = inputField.value.split(" ");
    const hour = binaryinput[0] ?? "";
    const minute = binaryinput[1] ?? "";
    const second = binaryinput[2] ?? "";
    console.log(hour.length, minute.length, second.length);

    runMinute = true;
    runSecond = true;
    validity = true;

    let hourdec, minutedec, seconddec;


    divElements.forEach(div => {
        div.textContent = "";
        div.classList.remove("green");
        div.classList.remove("wrong");
        clock.textContent = "00:00:00";
        invalidRes.textContent = "";
        validRes.textContent = "";
    });
    setTimeout(() => {
        if(hour.length === 0){
            InvalidResult();
            return;
        }
        hour_machine(hour);

        if (runMinute && minute.length > 0) {
            setTimeout(() => {
                minute_machine(minute);

                if (runSecond && second.length > 0) {
                    setTimeout(() => {
                        second_machine(second);

                        // Final validity check
                        setTimeout(() => {
                            if (!runMinute || !runSecond || !validity) {
                                //console.log("Invalid");
                                InvalidResult();
                            } else {
                                hourdec = parseInt(hour, 2);
                                minutedec = parseInt(minute, 2);
                                seconddec = parseInt(second, 2);
                                console.log(hourdec, minutedec, seconddec);
                                clockDisplay(hourdec, minutedec, seconddec);
                                console.log("All checks passed");
                                ValidResult();
                            }
                        }, 9000);
                    }, 1000); // Wait a bit before seconds
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
                        }
                    }, 3000);
                }else{
                    console.log("Invalid");
                    InvalidResult();
                }
            }, 1000); // Wait a bit before minutes
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
                }
            }, 3000);
        }else{
            console.log("Invalid");
            InvalidResult();
        }
    }, 0);

});
function hour_machine(input_hour) {
    
    if(input_hour[0] == "1" && input_hour[1] == "1"){
        green(input_hour[0], 0);
        wrong(input_hour[1], 1);
        runMinute = false;
        return;
    }

    const hour_length = input_hour.length;
    let red = 0, i = 0;

    for (i = 0; i < hour_length; i++) {
        if (!inputValidation(input_hour[i])) {
            wrong(input_hour[i], i);
            red = 1;
            break;
        }

        if (i === hour_length - 1 && hour_length < 4) {
            wrong(input_hour[i], i);
            red = 1;
            break;
        }else if(i === hour_length - 1 && hour_length > 5){
            wrong(input_hour[i-1], 4);
            red = 1;
            break;
        }

        green(input_hour[i], i);
    }

    if (red === 1) {
        runMinute = false;
    }
}

function minute_machine(input_minute){

    const minute = input_minute;
    const minute_length = input_minute.length;
    let i = 0, bitcounterlimit = 7, red = 0, index = 5;
    for (i = 0; i < minute_length; i++){
        // index is the continuation of the dev elements from the hour machine
        if(!inputValidation(minute[i])){
            wrong(minute[i], index);
            //InvalidResult();
            red = 1;
            break;
        }

        if(minute[0] == "1" && minute[1] == "1" && minute[2] == "1" && minute[3] == "1"){
            green(minute[0], 5);
            green(minute[1], 6);
            green(minute[2], 7);
            wrong(minute[3], 8);
            runSecond = false;
            return;
        }

        if(i === minute_length - 1 && minute_length < bitcounterlimit-1){
            wrong(minute[i], index);
            //InvalidResult();
            red = 1;
            break;
        }else if(i === minute_length - 1 && minute_length > bitcounterlimit-1){
            wrong(minute[i-1], 10);
            //InvalidResult();
            red = 1;
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
function second_machine(input_second){

    if(input_second[0] == "1" && input_second[1] == "1" && input_second[2] == "1" && input_second[3] == "1"){
        green(input_second[0], 11);
        green(input_second[1], 12);
        green(input_second[2], 13);
        wrong(input_second[3], 14);
        validity = false;
        return;
    }

    const second = input_second;
    const second_length = input_second.length;
    let i = 0, bitcounterlimit = 7, red = 0, index = 11;
    for (i = 0; i < second_length; i++){
        // index is the continuation of the dev elements from the hour machine
        if(!inputValidation(second[i])){
            wrong(second[i], index);
            //InvalidResult();
            red = 1;
            break;
        }
        if(i === second_length - 1 && second_length < bitcounterlimit-1){
            wrong(second[i], index);
            //InvalidResult();
            red = 1;
            break;
        }else if(i === second_length - 1 && second_length > bitcounterlimit-1){
            wrong(second[i-1], 17);
            //InvalidResult();
            red = 1;
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
    }, index * 600);
}
function wrong(input, index){
    setTimeout(() => {
        divElements[index].textContent = input;
        divElements[index].classList.add("wrong");
    }, index * 600);
}
function InvalidResult(){
    invalidRes.textContent = "INVALID";
    setTimeout(() => {
        invalidRes.classList.add("invalidResult");
        invalidRes.classList.remove("validResult");
    }, 9000);
    clockCounter = 0;
}
function ValidResult(){
    validRes.textContent = "VALID";
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
