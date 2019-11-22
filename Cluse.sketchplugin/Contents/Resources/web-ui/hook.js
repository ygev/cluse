var initFg;
var initBg;


function setSketchData(bg, fg, isLrg) {
	f = fg;
	b = bg;
	update();
	iniFg = fg;
	initBg = bg;

	document.getElementById("normal").style.backgroundColor = bg;
	document.getElementById("normal").style.color = fg;
	// Set value of inputs to the correct color hex value
	document.getElementById("fHex").value = fg.substring(0,7);
	document.getElementById("bHex").value = bg.substring(0,7);

	if (isLrg){
		document.getElementById("js-txtSize").innerHTML = "Large Text";
	}
	else {
		document.getElementById("js-txtSize").innerHTML = "Normal Text";
	}
}

function apply(){
	var message = {
		"background": document.getElementById("bHex").value,
		"foreground": document.getElementById("fHex").value
	};

	window.webkit.messageHandlers.sketchPlugin.postMessage(
			JSON.stringify(message)
	);
};

document.addEventListener("DOMContentLoaded", () => {
	//	Set up apply to trigger on button press

	document.getElementById("js-ok").addEventListener("click", () => {
		apply();
	});

	//	Add ENTER key shortcut

	document.body.addEventListener("js-ok", e => {
		if(e.keyCode !== 13) return;
		apply();
	});
});

