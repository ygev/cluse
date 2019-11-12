var sketch = require('sketch/dom');
var async = require('sketch/async');
var DataSupplier = require('sketch/data-supplier');
var UI = require('sketch/ui');
var Settings = require('sketch/settings');

function onApply(options) {
        console.log("onApply(options)");
        UI.alert("Test Alert", "goose!");
};

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



// TODO for Oct 29
// Assuming that two layers are selected, figure out which one is textColor, and which one is just a Fill. 
// Extract both and store in f(text) and b(fill) respectively.

module.exports = { onApply, onLoad };    
