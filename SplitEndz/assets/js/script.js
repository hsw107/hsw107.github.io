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



