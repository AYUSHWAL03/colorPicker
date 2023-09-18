const msgbox = document.querySelector('.flash-msg')
const activated = document.querySelector('#activated');
const colorsBg = document.querySelector('.colorBg');
const hexColor = document.querySelector('.Hexcolors');
const rgbColor = document.querySelector('.RGBcolors');
activated.addEventListener('click', async() =>{
    //this listener having scope which is activating the script and some function on extension
    let [tab] = await chrome.tabs.query({active : true , currentWindow : true});
    chrome.scripting.executeScript({
        target : {tabId : tab.id},
        function : colorPicker
    },async(injectionResult) =>{
        const [data] = await injectionResult;
        if (data.result){
            const color = data.result[0].sRGBHex;
            const colorR = data.result[1].r;
            const colorG = data.result[1].g;
            const colorB = data.result[1].b;
            
            colorsBg.style.backgroundColor = color;
            hexColor.innerText = color;
            rgbColor.innerText = `rgb(${colorR},${colorG},${colorB})`;
            
            if(color){
                console.log('working')
                msgbox.innerText = 'coppied successfully'
                setTimeout(() => msgbox.innerText='',1000)
            }
            try {
                await navigator.clipboard.writeText(color)
            } catch (error) {
                console.error(error)
            }
                
            }
            console.log(injectionResult)
        })
    });


const colorPicker = async() =>{
    //this function having different scope so it cannot access the element declared above
    //Here we have used Eyedropper API to get the color picker
    try {
        const eyedropper = new EyeDropper();
        const selectedColor = await eyedropper.open();
        const color = selectedColor.sRGBHex
        const r = parseInt(color.slice(1,3),16);
        const g = parseInt(color.slice(3,5),16);
        const b = parseInt(color.slice(5,7),16);        
        return [selectedColor,{r,g,b}];
        
    } catch (error) {
        console.log(error)
    }
}