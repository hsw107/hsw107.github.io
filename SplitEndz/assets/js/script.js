function hide() {
    document.getElementById('overlay').style.top = '75%';
    document.getElementById('overlay').style.height = '25%';
}
document.getElementById('content').insertAdjacentHTML("afterend", '<div id="overlay" onclick="hide()" style="position:fixed; height: 100%; width: 100%; background: rgba(255,255,255,0.75); top: 0; left: 0; text-align: center;"><div style="position:absolute; font-size:44px; top: 50%; left:0; right:0; text-align:center;">THIS WEBSITE IS NOT FOR COMMERCIAL USE</div></div>')


function areWeOpen(d) {
    var d = d || new Date();
    var day = d.getDay();
    var hour = d.getHours();
    var isOpen = true;
    if(day === 1 || day === 0) {
        isOpen = false;
    } else {
        if((day === 2 || day == 5) && (hour < 9 || hour >= 17)) {
            isOpen = false;
        }
        if((day === 3 || day == 4) && (hour < 9 || hour >= 20)) {
            isOpen = false;
        }
        if((day === 6) && (hour < 9 || hour >= 15)) {
            isOpen = false;
        }
    }
    return isOpen;
}

function getDay() {
    return (new Date()).getDay();
}


var isOpen = areWeOpen(new Date());
var str = '';
if(isOpen) {
    str = "We are currently open!";
    document.getElementById("open").style.color = "green";
} else {
    str = 'Sorry, we are closed right now.'
    document.getElementById("open").style.color = "red";
}
document.getElementById("open").innerHTML = str;
document.getElementById("copyrightYear").innerHTML = ((new Date()).getYear() + 1900);
document.getElementById("day" + getDay()).style.fontWeight = "bold";



