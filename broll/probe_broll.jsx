(function(){ var o=[]; try { var pf=app.project.file; o.push("project " + (pf?decodeURI(pf.name):"none") + " dirty=" + app.project.dirty);
 for (var i=1;i<=app.project.numItems;i++){ var it=app.project.item(i); if (it instanceof CompItem && /^0\d /.test(it.name)) o.push(it.name + " " + it.numLayers); } } catch(e){ o.push("ERR "+e); }
 var f=new File(File($.fileName).parent.fsName+"/probe_broll.log"); f.open("w"); f.write(o.join("\n")); f.close(); })();
