// Set initial values.
var initFg;
var initBg;

// Get values from Sketch.
function setSketchData(bg, fg, isLrg) {
	f = fg;
	b = bg;
	update();
	initFg = fg;
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

// Apply slider hexes to the canvas.
function apply(){
	var message = {
		"background": document.getElementById("bHex").value,
		"foreground": document.getElementById("fHex").value
	};

	window.webkit.messageHandlers.sketchPlugin.postMessage(
			JSON.stringify(message)
	);
};


// Reset BG to Original
function resetBg() {
	var messageCancel = {
		"background": initBg,
	};

	window.webkit.messageHandlers.sketchPlugin.postMessage(
			JSON.stringify(messageCancel)
	);

	bColor = initBg.substring(0,7);
	document.getElementById("bHex").value = initBg.substring(0,7);
}


// Reset FG to Original
function resetFg() {
	var messageCancel = {
		"foreground": initFg,
	};

	window.webkit.messageHandlers.sketchPlugin.postMessage(
			JSON.stringify(messageCancel)
	);

	fColor = initFg.substring(0,7);
	document.getElementById("fHex").value = initFg.substring(0,7);
}


// Reset FG & BG to Original (For Cancel Button)
function resetToInitial() {
	var messageCancel = {
		"background": initBg,
		"foreground": initFg
	};

	window.webkit.messageHandlers.sketchPlugin.postMessage(
			JSON.stringify(messageCancel)
	);
}

// Close the Window
function closeWindow() {
	var messageCancel = {
		close: true
	};

	window.webkit.messageHandlers.sketchPlugin.postMessage(
		JSON.stringify(messageCancel)
	);
}

// When you press undo on BG, reset the BG to the original color.
document.addEventListener("DOMContentLoaded", () => {
	document.getElementById("js-reset-bg").addEventListener("click", () => {
		resetBg();
	});
});

// When you press undo on FG, reset the FG to the original color.
document.addEventListener("DOMContentLoaded", () => {
	document.getElementById("js-reset-fg").addEventListener("click", () => {
		resetFg();
	});
});

// When you press cancel, reset everything to original and close window.
document.addEventListener("DOMContentLoaded", () => {
	document.getElementById("js-cancel").addEventListener("click", () => {
		resetToInitial();
		closeWindow();
	});
});

// When you press OK, apply the new colors and close the window.
document.addEventListener("DOMContentLoaded", () => {
	document.getElementById("js-ok").addEventListener("click", () => {
		apply();
		closeWindow();
	});

	//	Add ENTER key shortcut (broken)
	// document.body.addEventListener("js-ok", e => {
	// 	if(e.keyCode == 13) {
	// 	apply();
	// 	closeWindow();
	// }
	// });
});

