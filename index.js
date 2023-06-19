const inputSlider=document.querySelector("[data-lengthSlider]");
const lengthDisplay=document.querySelector("[data-lengthNumber]");

const passwordDisplay=document.querySelector("[data-passwordDisplay]");

const copyButton=document.querySelector("[data-copy]");
const copyMsg=document.querySelector("[data-copyMsg]");

const upperCaseCheck=document.querySelector("#uppercase");
const lowerCaseCheck=document.querySelector("#lowercase");
const numbersCheck=document.querySelector("#numbers");
const symbolsCheck=document.querySelector("#symbols");

const indicator=document.querySelector("[data-indicator]");
const generateBtn=document.querySelector(".generateButton");
const allCheckBox=document.querySelectorAll("input[type=checkbox]");


/*initial values*/
let password="";
let passwordLength=10;
let checkCount=0;
handleSlider();
setIndicator("#ccc");
//set circle color to grey

//set password length i.e. passwordLength variable
function handleSlider()
{
    //input slider ko default 10 pe set kardo
   inputSlider.value=passwordLength;

    //password length variable me slider ki value daal do
   lengthDisplay.innerText=passwordLength;
   const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%";

}

//indicator ko btaye color jitna kardo
function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

//min-max ke beech me ek integer dedo

function getRndInteger(min,max){
    return Math.floor(Math.random()*(max-min))+min;
}
/* inn chaaro function me ascii value aur use karke aur getRndInteger use karke ek random character mil jayega*/
function generateRandomNumber(){
    return getRndInteger(0,9);
}

function generateToLowerCase(){
    return String.fromCharCode(getRndInteger(97,123));
}

function generateToUpperCase(){
    return String.fromCharCode(getRndInteger(65,91));

}

function generateSymbol(){
    return String.fromCharCode(getRndInteger(33,47));
}

/* password ki strength nikalo*/
function calcStrength(){
    let hasUpper=false;
    let hasLower=false;
    let hasNum=false;
    let hasSym=false;


    if(upperCaseChecked.checked)  hasUpper=true;
    if(lowerCaseChecked.checked)  hasLower=true;
    if(numbersChecked.checked)  hasNum=true;
    if(symbolsChecked.checked)  hasSym=true;

    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
        setIndicator("#0f0");
      } else if (
        (hasLower || hasUpper) &&
        (hasNum || hasSym) &&
        passwordLength >= 6
      ) {
        setIndicator("#ff0");
      } else {
        setIndicator("#f00");
      }

}

/*copy content to clipboard*/
async function copyContent(){

    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText="copied";
    }
    catch(e){
        copyMsg.innerText="failed";
    }

    copyMsg.classList.add("active");

    setTimeout( () => {
        copyMsg.classList.remove("active");
    },2000);
       
}

/*shuffle kardo password*/
function shufflePassword(array) {
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        //random J, find out using random function
        const j = Math.floor(Math.random() * (i + 1));
        //swap number at i index and j index
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

/* count number of checked checkboxes*/
function handleCheckBoxChange(){
    checkCount=0;

    allCheckBox.forEach( (checkbox) => {
        if(checkbox.checked)
            ++checkCount;
    });

    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }
}


/*checkbox array me jab bi koi change ho toh handleCheckBox bulao*/

allCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('change',handleCheckBoxChange);
})


/*To Link Slider with the updated Value*/

/*jab input slider ko change karenge toh ek event listener call hoga
jo password length ko slider value barabaar karega aur since password length change 
hua hai toh input slider call hoga*/

inputSlider.addEventListener('input',(e) => {
    passwordLength=e.target.value;

    handleSlider();
})


/*agar password empty nahi hai toh clipboard me copy karo*/

copyButton.addEventListener('click', () => {
    if(passwordDisplay.value)
        copyContent();
})

generateBtn.addEventListener('click', () => {

    //password nahi generate kar skte agar kuch na select kiya ho toh
    if(checkCount==0)
        return;

    //agar types of characters password length se kam hai toh

    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }

    console.log("starting the journey");

    password="";

    let funcArr=[];

    //jo jo select kiya hai unn functions ko ek array me daal lo

    if(upperCaseCheck.checked)
        funcArr.push(generateToUpperCase);

    if(lowerCaseCheck.checked)
        funcArr.push(generateToLowerCase);

    if(numbersCheck.checked)
        funcArr.push(generateRandomNumber);

    if(symbolsCheck.checked)
        funcArr.push(generateSymbol);

    for(let i=0;i<funcArr.length;i++){
        password+=funcArr[i]();
    }

    console.log("zaruri kaam karliya");

    //bachi hui lengths pe password daalo

    for(let i=0;i<passwordLength-funcArr.length;++i){
        let randIndex=getRndInteger(0,funcArr.length);
        console.log("random index= "+randIndex);
        password+=funcArr[randIndex]();
    }

    console.log("pura password milgya");


    //pehle password ko ek string me convert karo aur fir use shuffle password function me bhejdo

    password=shufflePassword(Array.from(password));

    passwordDisplay.value=password;

    calcStrength();
})