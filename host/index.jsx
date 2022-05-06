var MainDir = "C://Program Files (x86)/Common Files/Adobe/CEP/extensions/Kraken/host";


function importHarvesting() {
  var activeComp = app.project.activeItem;
  if (!activeComp || !(activeComp instanceof CompItem)) {
    return alert('Композиция не выбрана');
  }
  //Importing project of if exists copy "coins fly" composition
  var check = findFolder("coins.aep");
  var folder = check || importFile("/harvesting/coins.aep");

  //Add comp to current composition
  var layer = check ? activeComp.layers.add(check.item(1).duplicate()) : activeComp.layers.add(folder.item(1));
  layer.startTime = activeComp.time || 0;
  layer.applyPreset(new File(MainDir + "/harvesting/FX.ffx"));

  //Define layers/effects and variables
  var ControlLayerFX = findComp(folder, layer.name).layer(7).property("Effects");
  var particularLayer = findComp(folder, layer.name).layer(8);
  var effect = layer.property("Effects").property("Kraken");
  var easeIn = new KeyframeEase(0.3, 33);
  var easeOut = new KeyframeEase(0.3, 33);

  //Set keyframes
  effect.property("Anim").setValueAtTime(layer.startTime, 0);
  effect.property("Anim").setValueAtTime(layer.startTime + 1, 100);
  effect.property("Anim").setTemporalEaseAtKey(1, [easeIn], [easeOut]);
  effect.property("Anim").setTemporalEaseAtKey(2, [easeIn], [easeOut]);

  //Set expressions
  particularLayer.property("Effects").property("Particular").property("Life (seconds)").expression = "var fx = comp('" + activeComp.name + "').layer('" + layer.name + "');\nvar keyIndex = fx.effect('Kraken')('Anim').numKeys;\nfx.effect('Kraken')('Anim').key(keyIndex).time - fx.startTime;";
  ControlLayerFX.property("Anim").property("Slider").expression = generateExp(activeComp, layer, "Anim");
  ControlLayerFX.property("Starting point").property("Point").expression = generateExp(activeComp, layer, "Starting point");
  ControlLayerFX.property("Starting bezier").property("Point").expression = generateExp(activeComp, layer, "Starting bezier");
  ControlLayerFX.property("Ending point").property("Point").expression = generateExp(activeComp, layer, "Ending point");
  ControlLayerFX.property("Ending bezier").property("Point").expression = generateExp(activeComp, layer, "Ending bezier");
  ControlLayerFX.property("Preview").property("Checkbox").expression = generateExp(activeComp, layer, "Preview");
  ControlLayerFX.property("Duration(sec)").property("Slider").expression = generateExp(activeComp, layer, "Duration(sec)");
  ControlLayerFX.property("Particles/sec").property("Slider").expression = generateExp(activeComp, layer, "Particles/sec");
  ControlLayerFX.property("Scatter").property("Slider").expression = generateExp(activeComp, layer, "Scatter");

}

function importHand() {
  var activeComp = app.project.activeItem;
  if (!activeComp || !(activeComp instanceof CompItem)) {
    return alert('Композиция не выбрана');
  }
  
  var folder = importFile("/hand/Hand.aep");
  
  
  var layer = activeComp.layers.add(folder.item(2));
  layer.startTime = activeComp.time || 0;
  layer.applyPreset(new File(MainDir + "/hand/FX.ffx"));
  layer.timeRemapEnabled = true;
  var timeRemap = layer.property("ADBE Time Remapping")
  timeRemap.expression = "action = comp(name).layer('action');\nvar fx = effect('Hand')('State')\nn = 0;\nif (fx.numKeys > 0){\n  n = fx.nearestKey(time).index;\n  if (fx.key(n).time > time){\n    n--;\n  }\n}\n \nif (n == 0){\n  0\n}else{\n  m = fx.key(n);\n  myComment = m.value.toString();\n  t = time - m.time;\n  try{\n    actMarker = action.marker.key(myComment);\n    if (action.marker.numKeys > actMarker.index){\n      tMax = action.marker.key(actMarker.index + 1).time - actMarker.time;\n    }else{\n      tMax = action.outPoint - actMarker.time;\n    }\n    t = Math.min(t, tMax);\n    actMarker.time + t;\n  }catch (err){\n    0\n  }\n}";
  timeRemap.removeKey(2)

}



function importFile(path) {
  return app.project.importFile(new ImportOptions(new File(MainDir + path)));

}
function generateExp(comp, layer, property) {
  return "var fx = comp('" + comp.name + "').layer('" + layer.name + "')\nfx.effect('Kraken')('" + property + "').valueAtTime(fx.startTime+time)";
}
function findFolder(name) {

  for (var i = 1; i <= app.project.numItems; i++) {
    if ((app.project.item(i) instanceof FolderItem) && (app.project.item(i).name === name)) {
      return app.project.item(i);

    }
  }
  return null
}
function findComp(arr, name) {
  for (var i = 1; i <= arr.numItems; i++) {
    if ((arr.item(i).name === name) && (arr.item(i) instanceof CompItem)) {
      return arr.item(i);
    }
  }
  return null
}