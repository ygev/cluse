// Set initial values.
var initFg, initBg, initFgLightness, initBgLightness;

// Get values from Sketch.
function setSketchData(bg, fg, isLrg) {
	fColor = fg.substring(0,7);
	fHSL = RGBtoHSL(getRGB(fColor.substr(1, 2)), getRGB(fColor.substr(3, 2)), getRGB(fColor.substr(-2)));
	initFgLightness = fHSL[2];
	bColor = bg.substring(0,7);
	bHSL = RGBtoHSL(getRGB(bColor.substr(1, 2)), getRGB(bColor.substr(3, 2)), getRGB(bColor.substr(-2)));
	initBgLightness = bHSL[2];
	update();
	initFg = fg;
	initBg = bg;

	// Set value of inputs to the correct color hex value
	document.getElementById("fHex").value = fg.substring(0,7);
	document.getElementById("bHex").value = bg.substring(0,7);

	if (isLrg){
		document.getElementById("js-txtSize").innerHTML = "Large Text";
	} else {
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

// function resetButtonState() {
// 	console.log("fg is" + fg);
// 	console.log("initFg is" + initFg);
	//  Reset Button Appears if you change the value.
	// if (fg != initFg) {
	// 	document.getElementById("js-reset-fg").style.display = "block";
	// }
// }

// Reset BG to Original
function resetBg() {
	bColor = initBg.substring(0,7);
	bHSL = RGBtoHSL(getRGB(bColor.substr(1, 2)), getRGB(bColor.substr(3, 2)), getRGB(bColor.substr(-2)));
	document.getElementById("bHex").value = initBg.substring(0,7);
	document.getElementById("bColorLightness").value = initBgLightness;

	var messageCancel = {
		"background": initBg,
	};

	window.webkit.messageHandlers.sketchPlugin.postMessage(
			JSON.stringify(messageCancel)
	);
}

// Reset FG to Original
function resetFg() {
	fColor = initFg.substring(0,7);
	fHSL = RGBtoHSL(getRGB(fColor.substr(1, 2)), getRGB(fColor.substr(3, 2)), getRGB(fColor.substr(-2)));
	document.getElementById("fHex").value = initFg.substring(0,7);
	document.getElementById("fColorLightness").value = initFgLightness;

	var messageCancel = {
		"foreground": initFg,
	};

	window.webkit.messageHandlers.sketchPlugin.postMessage(
			JSON.stringify(messageCancel)
	);
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
		checkContrast();
	});
});

// When you press undo on FG, reset the FG to the original color.
document.addEventListener("DOMContentLoaded", () => {
	document.getElementById("js-reset-fg").addEventListener("click", () => {
		resetFg();
		checkContrast();
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
