const inputSlider =document.querySelector("[data-lengthSlider]");
const lengthDisplay =document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generate-Button");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';


/* -- initially -- */
let password="";
let passwordLength= 10;
let checkCount = 0;
handleSlider();
// set strength circle color to grey
setIndicator("#ccc");


/* -- Set password length function -- Handle slider ka sirf kaam itna hai ki password length ko UI par reflect krwta hai */
function handleSlider() {
       inputSlider.value = passwordLength;
       lengthDisplay.innerText = passwordLength; //UI par text show krne ke liye...
       const min = inputSlider.min;
       const max = inputSlider.max;
       inputSlider.style.backgroundSize = ( (passwordLength - min)*100 / (max - min)) + "% 100%"     // idhar phli '%' widht bta rhi and 2nd '100%' height bta rhi 
}

/* -- Set Indicator function -- */
function setIndicator(color){
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

/* -- Get random all type value function  -- */
function getRndInteger(min,max){
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber(){
     return getRndInteger(0,9);
}

function generateLowerCase(){
     return String.fromCharCode(getRndInteger(97,123)); // number to string conversion
}

function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65,91)); // number to string conversion
}

function generateSymbol(){
    const randNum = getRndInteger(0, symbols.length);
    return symbols.charAt(randNum); //Iss number pr konsi char hai wo btati hai ye wali method
}


/* -- password strength function -- */
function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheck.checked) hasUpper = true; // if uppercase check hai to 'hasUpper' ko true kr dena mtlb consider kar lena and '.checked' ek property hai verify krne ke liye ki check hai ki nhi
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;
  
    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) 
    {
      setIndicator("#0f0");
    } 

    else if (
      (hasLower || hasUpper) &&
      (hasNum || hasSym) &&
      passwordLength >= 6
    ) 
    {
      setIndicator("#ff0");
    } 

    else 
    {
      setIndicator("#f00");
    }
} 

/* -- copy content function -- */
async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value); //password jo display par hogi usse copy krne ke liye
        copyMsg.innerText="copied";
    }
    catch(e){
         copyMsg.innerText="failed";
    }
      //to make copy wala span visible and kuch time baad 'copied' text chali jaati hai isiliye timeout method bhi lga denge
    copyMsg.classList.add("active"); // CSS mei ek clss create krni hogi 'active' naam ki tbb ye wali line execute hogi
    setTimeout(() =>{
        copyMsg.classList.remove("active");
    },2000);

}


/* -- Shuffle Password function -- */
//ye ek array ('shufflePassword') le rha as an input
function shufflePassword(array){
    //shuffle krne ki algorithm hoti jiska naam hai 'Fisher Yates Method'-- iss method ka use krke hum kisi array pr apply krke usko shuufle kr skte hai
    
    for(let i = array.length - 1; i > 0; i--) 
    {
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



/* -- slider pr event listener -- */
inputSlider.addEventListener('input',(e) =>{
    passwordLength = e.target.value; //  '=' ke baad jo likha hai wo ek value degi 1 se 20 ke beech mei i.e.,slider ki value degi
    handleSlider();
})

/* -- copy button pr event listener -- */
copyBtn.addEventListener('click',() =>{
    if(passwordDisplay.value) // ya if passwordlength > 0 tbb copy kr do
    {
        copyContent();
    }
})

/* -- checkbox par event listener -- */
// checkbox pr listener lgana hoga taake hum track rakh paaye kitne checkbox tick hai aur kitne nhi hai
function handleCheckBoxChange(){
      checkCount = 0;
      allCheckBox.forEach((checkbox) => {
        if(checkbox.checked)
        {
            checkCount++;
        }
      })
      // Special condition
    //   if(passwordLength < checkCount) 
    //   {
    //     passwordLength = checkCount;
    //     handleSlider();
    //   }
}

allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange); // change tick untick dono ko mana jayega
})


/* -- Generate button pr event listener -- */
generateBtn.addEventListener('click', () => { 
  // None of the checkbox are selected
  if(checkCount == 0 )
  return; //return nothing
  
  if(passwordLength < checkCount) 
      {
        passwordLength = checkCount;
        handleSlider();
      }

    // let's start the journey to find new password
    console.log("Starting the Journey");
    // Remove old Password i.e., password ko empty kr diye
    password = "";

    // let's put the stuffs mentioned by checkboxes
    // if(uppercaseCheck.checked){
    //     password= password + generateUpperCase;
    // }

    // if(lowercaseCheck.checked){
    //     password += generateLowerCase();
    // }

    // if(numbersCheck.checked){
    //     password += generateRandomNumber();
    // }

    // if(symbolsCheck.checked){
    //     password += generateSymbol();
    // }
    
            // Another way to do above wala using Array jisme randomly function ho aur usse call krke requirement ke hisab se output de de

        let funcArr = [];  //iske under function store hoga jo bhi box checked hai
        if(uppercaseCheck.checked)
            funcArr.push(generateUpperCase);

        if(lowercaseCheck.checked)
            funcArr.push(generateLowerCase);

        if(numbersCheck.checked)
            funcArr.push(generateRandomNumber);

        if(symbolsCheck.checked)
            funcArr.push(generateSymbol);

           // compulsory addition (function calling ) (understanding below code kahani - suppose password length 10 hai and suppose 2 box check hai to 2 input jayega funcArray mei and initially password mei kuch nhi hai to funcArray mei jo element hai(password digit hai compulsory wale) wo password mei add hoge to remaining rha 10-2=8..to 8 koi sa bhi getRndint() se nikal lenge)
            for(let i=0; i<funcArr.length; i++)
               {
                 password = password + funcArr[i]();  // funcArr[1]();
               }
               console.log("Compulsory adddition done");

          // Remaining addition
          for(let i=0; i<passwordLength-funcArr.length; i++) {
            let randIndex = getRndInteger(0,funcArr.length);
            console.log("randIndex " + randIndex);
            password += funcArr[randIndex]();
        }
            console.log("Remaining adddition done"); // just for me
            
          // Now shuffling the password qk ek line mei aa rhe the randomly nhi
          password = shufflePassword(Array.from(password));  // aaray ki form password ki string ko pass kr diya iss function mei
          console.log("Shuffling done");

          // Now have to show password in UI
          passwordDisplay.value = password
          console.log("UI adddition done");

          // Jbb password daal diya to strength bhi btana hoga to call kr denge uss function ko
          calcStrength();
});


