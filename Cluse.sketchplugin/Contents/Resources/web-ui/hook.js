

function setSketchData(bg, fg) {
	f = fg;
	b = bg;
	update();

	document.getElementById("normal").style.backgroundColor = bg;
	document.getElementById("normal").style.color = fg;
	// Set value of inputs to the correct color hex value
	document.getElementById("fHex").value = fg.substring(0,7);
	document.getElementById("bHex").value = bg.substring(0,7);
}

function apply(){
	window.webkit.messageHandlers.sketchPlugin.postMessage(
			JSON.stringify({"testMessage": "hello from hook.js!"})
	);
};

function apply(){
	var message = {
		"background": b,
		"foreground": f
	};

	window.webkit.messageHandlers.sketchPlugin.postMessage(
			//JSON.stringify({"testMessage": "hello from hook.js!"})
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
