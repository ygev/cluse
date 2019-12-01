// Set initial values.
var initFg, initBg, initFgLightness, initBgLightness, swapped = false;

// Get values from Sketch.
function setSketchData(bg, fg, isLrg) {
	fColor = fg.substring(0,7);
	fHSL = RGBtoHSL(getRGB(fColor.substr(1, 2)), getRGB(fColor.substr(3, 2)), getRGB(fColor.substr(-2)));
	initFgLightness = fHSL[2];
	bColor = bg.substring(0,7);
	bHSL = RGBtoHSL(getRGB(bColor.substr(1, 2)), getRGB(bColor.substr(3, 2)), getRGB(bColor.substr(-2)));
	initBgLightness = bHSL[2];
	initFg = fg;
	initBg = bg;

	// Set value of inputs to the correct color hex value
	document.getElementById("fHex").value = fg.substring(0,7);
	document.getElementById("bHex").value = bg.substring(0,7);

	if (isLrg) {
		document.getElementById("js-txtSize").innerHTML = "Large Text";
	} else {
		document.getElementById("js-txtSize").innerHTML = "Normal Text";
	}

	update();
}

// Apply slider hexes to the canvas.
function apply() {
	var message = {
		"background": document.getElementById("bHex").value,
		"foreground": document.getElementById("fHex").value
	};

	window.webkit.messageHandlers.sketchPlugin.postMessage(
			JSON.stringify(message)
	);
};

// Reset button appears if you change the value.
function resetButtonState() {
	if (fColor != initFg.substring(0,7)) {
		document.getElementById("js-reset-fg").style.display = "block";
	} else {
		document.getElementById("js-reset-fg").style.display = "none";
	}

	if (bColor != initBg.substring(0,7)) {
		document.getElementById("js-reset-bg").style.display = "block";
	} else {
		document.getElementById("js-reset-bg").style.display = "none";
	}
}

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

	resetButtonState();
	checkContrast();
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

	resetButtonState();
	checkContrast();
}


// Reset FG & BG to Original (For Cancel Button)
function resetToInitial() {
	if (swapped) {
		swapHTML();
		swapIds();
		swapVars();
		constructResetEventListeners();
		swapped = false;
	}

	var messageCancel = {
		cancel: true
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

// Swap HTML between Foreground slider and Background slider 
function swapHTML() {
	// Swap titles and make flex into row-reverse.
	if (document.getElementById("contrastForm").style.flexDirection == "row") {
		document.getElementById("contrastForm").style.flexDirection = "row-reverse";
		document.getElementById("bTitle").innerHTML = "Foreground Color";
		document.getElementById("fTitle").innerHTML = "Background Color";
	} else {
		document.getElementById("contrastForm").style.flexDirection = "row";
		document.getElementById("fTitle").innerHTML = "Foreground Color";
		document.getElementById("bTitle").innerHTML = "Background Color";
	}
}

// Swap Ids of Foreground and Background elements
function swapIds() {
	// Swap bColorLightness & fColorLightness
	var firstColorLightness = document.getElementById("fColorLightness"),
		secondColorLightness = document.getElementById("bColorLightness");
	firstColorLightness.id = "bColorLightness";
	secondColorLightness.id ="fColorLightness";
	
	// Swap bHex & fHex
	var firstHex = document.getElementById("fHex"),
		secondHex = document.getElementById("bHex");
	firstHex.id = "bHex";
	secondHex.id ="fHex";

	// Swap Reset Buttons (apply() works when this is commented out)
	var firstReset = document.getElementById("js-reset-fg"),
		secondReset = document.getElementById("js-reset-bg");
	firstReset.id = "js-reset-bg";
	secondReset.id ="js-reset-fg";
}

// Swap variables of Foreground and Background elements
function swapVars() {
	// Swap bColor & fColor
	var tempColor = bColor;
	bColor = fColor;
	fColor = tempColor;

	// Swap bHSL & fHSL
	var tempHSL = bHSL;
	bHSL = fHSL;
	fHSL = tempHSL;

	// Swap initFg & initBg
	var tempInit = initBg;
	initBg = initFg;
	initFg = tempInit;

	// Swap initFgLightness & initBgLightness
	var tempInitL = initBgLightness;
	initBgLightness = initFgLightness;
	initFgLightness = tempInitL;
}


function constructResetEventListeners() {
	// remove any existing event listeners
	document.getElementById("js-reset-fg").removeEventListener("click", resetBg);
	document.getElementById("js-reset-fg").removeEventListener("click", resetFg);
	document.getElementById("js-reset-bg").removeEventListener("click", resetFg);
	document.getElementById("js-reset-bg").removeEventListener("click", resetBg);

	// When you press undo on BG, reset the BG to the original color.
	document.getElementById("js-reset-bg").addEventListener("click", resetBg);

	// When you press undo on FG, reset the FG to the original color.
	document.getElementById("js-reset-fg").addEventListener("click", resetFg);
}

document.addEventListener("DOMContentLoaded", () => {
	// When you press undo, reset the BG or FG to the original color.
	constructResetEventListeners();

	// When you press cancel, reset everything to original and close window.
	document.getElementById("js-cancel").addEventListener("click", () => {
		resetToInitial();
		closeWindow();
	});

	// When you press OK, apply the new colors and close the window.
	document.getElementById("js-ok").addEventListener("click", () => {
		apply();
		closeWindow();
	});

	// When you press swap, swap foreground and background.
	document.getElementById("js-swap").addEventListener("click", () => {
		if (!swapped) {
			swapped = true;
		} else {
			swapped = false;
		}

		swapHTML();
		swapIds();
		swapVars();
		constructResetEventListeners();
		apply();
	});
});

// Add enter + esc key shortcuts
document.body.addEventListener("keydown", e => {
	if (e.keyCode == 13) {
		apply();
		closeWindow();
	} else if (e.keyCode == 27) {
		resetToInitial();
		closeWindow();
	}
});
