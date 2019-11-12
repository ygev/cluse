var sketch = require('sketch/dom');
var async = require('sketch/async');
var DataSupplier = require('sketch/data-supplier');
var UI = require('sketch/ui');
var Settings = require('sketch/settings');


function onLoad(webView) {
        console.error("onLoad()");
        var doc = sketch.getSelectedDocument();
        var selection = doc.selectedLayers;       
        var bgSketch = selection.layers[0].style.fills[0].color;
        var fgSketch = selection.layers[1].style.textColor;
        console.log("selected #: " + selection.length);
        console.log("layer 0: " + bgSketch);
        console.log("layer 1: " + fgSketch);

        console.log("calling " + `setColorInit('${bgSketch}', '${fgSketch}')`);
        // webView.evaluateJavaScript_completionHandler("setColorInit('#fff', '#000')", null);

        webView.evaluateJavaScript_completionHandler(`setColorInit('${bgSketch}', '${fgSketch}')`, null);
}

// Apply Color to Button
function onApply(options) {
        // UI.alert("Test Alert", JSON.stringify(options));
        // UI.alert("Test Alert", "backgroundis " + options.background + " and foregound is " + options.foreground);
        var doc = sketch.getSelectedDocument();
        var selection = doc.selectedLayers;       
        selection.layers[0].style.fills[0].color = options.background;
        selection.layers[1].style.textColor = options.foreground;

};

// Determine Text Size
function findTxtSize(){
        var doc = sketch.getSelectedDocument();
        var selection = doc.selectedLayers;
        var txtSize = selection.layers[0].style.fontSize;

}


module.exports = { onApply, onLoad };    
