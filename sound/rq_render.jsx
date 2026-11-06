(function(){
var LOG = new File(File($.fileName).parent.fsName + "/rq_render.log"); var out=[];
function log(s){ out.push(s); LOG.open("w"); LOG.encoding="UTF-8"; LOG.write(out.join("\n")); LOG.close(); }
app.beginSuppressDialogs();
try { log("render start"); app.project.renderQueue.render(); 
  var rq=app.project.renderQueue; for (var j=1;j<=rq.numItems;j++){ var r=rq.item(j); log(" rq"+j+" "+r.comp.name+" status="+r.status+" elapsed="+r.elapsedSeconds); }
  log("DONE"); } catch(e){ log("ERR "+e.toString()+" line "+e.line); }
app.endSuppressDialogs(false);
})();
