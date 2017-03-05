var LOCALSTORAGE_KEY = 'rustPasscodes';
var passcodes = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY)) || [];
$(function(){
	console.log(passcodes);
	passcodes.forEach(function(unformPass){
		var splitPass = unformPass.code.split('');
		var formattedPass = {one: splitPass[0], two:splitPass[1], three: splitPass[2], four: splitPass[3] };
		var name = unformPass.name;
        renderCode(formattedPass,name);
	});
	function generatePass() {
		lastPass = {
			one: getRandomIntInclusive(0,9),
			two: getRandomIntInclusive(0,9),
			three: getRandomIntInclusive(0,9),
			four: getRandomIntInclusive(0,9)
		};
		if(hasTwin(lastPass) || hasDupPattern(lastPass) || isFourCorners(lastPass) || isCommonYear(lastPass) || isStairAsc(lastPass) || isStairDesc(lastPass)) {
			console.log(lastPass);
			generatePass();
		}
	}

    function clickGenerate() {
        generatePass();

        $('.one').text(lastPass.one);
        $('.two').text(lastPass.two);
        $('.three').text(lastPass.three);
        $('.four').text(lastPass.four);
        console.log(lastPass);
    }
    function renderCode(pass, name) {
        $('#kept').append('<div class="line">'
			+ '<div title="deletes the passcode" class="deleteCode">✖</div>'
			+ '<span class="one_kept num">' + pass.one + '</span>'
            + '<span class="two_kept num">' + pass.two + '</span>'
            + '<span class="three_kept num">' + pass.three + '</span>'
            + '<span class="four_kept num">' + pass.four + '</span>'
            + '<span class="name_kept">' + name + '</span>'
            + '</div>');
	}
	function deleteAll() {
        if (window.confirm("Do you really want to delete all saved passcodes?\nTHIS CANNOT BE UNDONE.")) {
			localStorage.removeItem(LOCALSTORAGE_KEY);
			passcodes = [];
			$('#kept').empty();
        }
	}
    function keepPasscode() {
        var name = $('#name').val();
        if(typeof lastPass === 'undefined') { return; }
        renderCode(lastPass,name);

        //save

        $('#name').val('');
        $('.one').text('');
        $('.two').text('');
        $('.three').text('');
        $('.four').text('');
        var passcode = {};
        passcode.name = name;
        passcode.code = '';
        passcode.code += lastPass.one;
        passcode.code += lastPass.two;
        passcode.code += lastPass.three;
        passcode.code += lastPass.four;
        passcodes.push(passcode);
        localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(passcodes));
        lastPass = undefined;
        $('#name').focus();
        clickGenerate();
    }
    $('#generate').on('click', function(){
        clickGenerate();
    });

	$('#keep').on('click', function(){
        keepPasscode();
	});

	$('#genAndKeep').on('click', function(){
		clickGenerate();
        keepPasscode();
	});
    $('#clearAll').on('click', function(){
        deleteAll();
    });


    $('#kept').on('click', '.deleteCode', function(){
    	passcodes.splice($(this).parent().index(), 1);
        localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(passcodes));
        $(this).parent().remove();
    });
    $('#export').on('click', function(){
    	if(passcodes.length === 0) return;
        var encodedUri = encodeURI("data:text/csv;charset=utf-8," + ConvertToCSV(JSON.stringify(passcodes)));
        var link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "rust_passcodes.csv");
        document.body.appendChild(link); // Required for FF
        link.click();
    });

    clickGenerate();
});
var prev = undefined;
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  var num = Math.floor(Math.random() * (max - min + 1)) + min;
  return num;
}

function hasTwin(code) {
	var isValid = code.one === code.two || code.two === code.three || code.three === code.four;
	if(isValid) console.log('Invalid pass: has twin');
	return isValid;
}

function hasDupPattern(code) {
	var isValid = code.one + '' + code.two === code.three + '' + code.four;
	if(isValid) console.log('Invalid pass: has pattern');
	return isValid;
}
function isAscending(code) {
	var isValid = code.one < code.two && code.two < code.three && code.three < code.four;
	if(isValid) console.log('Invalid pass: is asc');
	return isValid;
}

function isDescending(code) {
	var isValid = code.one > code.two && code.two > code.three && code.three > code.four;
	if(isValid) console.log('Invalid pass: is desc');
	return isValid;
}

function isStairAsc(code) {
	var isValid = (code.four - 1 == code.three && code.three - 1 === code.two) || (code.three - 1 == code.two && code.two - 1 === code.one)
	if(isValid) console.log('%c Invalid pass: is stair asc', 'background: #222; color: #bada55');
	return isValid;
}

function isStairDesc(code) {
	var isValid = (code.one - 1 == code.two && code.two - 1 === code.three) || (code.two - 1 == code.three && code.three - 1 === code.four)
	if(isValid) console.log('%c Invalid pass: is stair desc', 'background: #222; color: #bada55');
	return isValid;
}

function isFourCorners(code) {
    var cornerArr = [1,3,7,9];
    for(var item in code) {
        cornerArr = cornerCheck(cornerArr, code[item]);
    }
    //If the length is 0, then we know the code was all 4 corners
	var isValid = cornerArr.length === 0;
    if(isValid) console.log('%c Invalid pass: is four corners', 'background: #222; color: red');
	return isValid;
}

//	var isValid = (code.one > code.two && code.two > code.three) || (code.two > code.three && code.three > code.four);

function isCommonYear(code) {
	var totalCode = parseInt(code.one + '' + code.two + code.three + '' + code.four);
	var isValid = totalCode > 1700 && totalCode < (new Date()).getYear() + 1910;
	if(isValid) console.log('Invalid pass: is year ');
	return isValid;
}

function cornerCheck(arr, a) {
    //Remove item from array and return it
    if(arr.indexOf(a) > -1)  arr.splice(arr.indexOf(a), 1);
	return arr;
}

function ConvertToCSV(objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';

    for (var i = 0; i < array.length; i++) {
        var line = '';
        for (var index in array[i]) {
            if (line != '') line += ','

            line += array[i][index];
        }

        str += line + '\r\n';
    }

    return str;
}