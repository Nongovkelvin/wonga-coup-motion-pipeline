(function(){
var LOG = new File(File($.fileName).parent.fsName + "/rq_add.log"); var out=[];
function log(s){ out.push(s); LOG.open("w"); LOG.encoding="UTF-8"; LOG.write(out.join("\n")); LOG.close(); }
app.beginSuppressDialogs();
try {
  var rq=app.project.renderQueue;
  // remove the stray probe item (RQ was empty before probe2)
  for (var j=rq.numItems;j>=1;j--){ var it=rq.item(j); if (it.comp.id==119565 && it.status==RQItemStatus.QUEUED){ it.remove(); log("removed stray probe item "+j);} }
  var ids=[119565,95731,121569,124165,106679,109001,111027,113505,115105,116340];
  var dir=(($.getenv("FILM_ROOT") || (Folder("~").fsName + "/Films/Jude Bela/Wonga coup")) + "/AE EXPORT/Latest review export/");
  var made=[];
  for (var i=0;i<ids.length;i++){
    var c=app.project.itemByID(ids[i]);
    var r=rq.items.add(c);
    r.applyTemplate("Best Settings");
    try { r.setSetting("Time Span", "Length of Comp"); } catch(e1){ log("timespan set err "+e1); }
    r.timeSpanStart=0; r.timeSpanDuration=c.duration;
    var om=r.outputModule(1);
    om.applyTemplate("H.264 - Match Render Settings - 40 Mbps");
    try { om.setSettings({"Output Audio":"Off"}); } catch(e2){ log("audio off err "+e2); }
    var nm=c.name.replace(/:/g,".");
    om.file=new File(dir+nm+".mp4");
    made.push(c.id);
    var s=om.getSettings(GetSettingsFormat.STRING);
    log("rq"+rq.numItems+" "+c.name+" -> "+om.file.fsName+" | span "+r.timeSpanStart+"+"+r.timeSpanDuration.toFixed(3)+" | audio="+s["Output Audio"]+" fmt="+s["Format"]);
  }
  log("RQ total "+rq.numItems); log("DONE");
} catch(e){ log("ERR "+e.toString()+" line "+e.line); }
app.endSuppressDialogs(false);
})();
