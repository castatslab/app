const {test}=require('node:test'),a=require('node:assert/strict');
const L=require('../Capa7/js/tactics-layout'),T=require('../Capa7/js/tactical-locks');
const {createMatchFromDraft}=require('../core/src/match-factory'),{MatchEngine}=require('../core/src/match-engine');
const court={'1':'a','2':'b','3':'c','4':'d','5':'e','6':'f'};
test('tàctica activa: penetració en R/C/A i retorn en D/B/S',()=>{
 for(const p of ['RECEPCIO','COLLOCACIO','ATAC'])a.equal(L.effectiveLayout('penetration-z1',p),'penetration-z1');
 for(const p of ['DEFENSA','BLOQUEIG','SERVEI',null,'unknown'])a.equal(L.effectiveLayout('penetration-z1',p),'3-3');
 a.throws(()=>L.effectiveLayout('invalid','DEFENSA'));
});
test('desactivar manté 3+3 en totes les fases',()=>{
 for(const p of ['RECEPCIO','COLLOCACIO','ATAC','DEFENSA','BLOQUEIG','SERVEI'])a.equal(L.effectiveLayout('3-3',p),'3-3');
});
test('Z1 reglamentària arriba al lloc correcte amb cadenats, sense alterar les dades',()=>{
 const locks={a:'5',e:'1'},visual=T.deriveVisualCourt(court,locks),before=JSON.stringify({court,locks,visual});
 const shown=L.placeZ1(court,visual);a.equal(shown['1'],'a');a.equal(new Set(Object.values(shown)).size,6);
 a.equal(JSON.stringify({court,locks,visual}),before);
 for(const phase of ['ATAC','DEFENSA']){const d=L.describe(L.effectiveLayout('penetration-z1',phase),court,shown);a.equal(L.validate(d),true);a.equal(d.slots.find(s=>s.playerId==='a').row,phase==='ATAC'?'front':'behind');a.equal(L.canBlock(d.slots.find(s=>s.playerId==='a')),false);}
 const rotated={'1':'b','2':'c','3':'d','4':'e','5':'f','6':'a'};a.equal(L.placeZ1(rotated,T.deriveVisualCourt(rotated,locks))['1'],'b');
});
test('cicle real del motor, desfer, rotació i substitució mantenen dades intactes',()=>{
 const made=createMatchFromDraft(require('./draft.json'),{matchId:'tactic-qa',now:'2030-01-15T12:00:00Z'}),e=new MatchEngine(made.state,made.actionLog);
 function layout(expected){const before=JSON.stringify(e.exportSession());a.equal(L.effectiveLayout('penetration-z1',e.state.game.phase),expected);L.placeZ1(e.state.game.court,T.deriveVisualCourt(e.state.game.court,{}));a.equal(JSON.stringify(e.exportSession()),before);}
 a.equal(e.state.game.phase,'RECEPCIO');layout('penetration-z1');
 e.ratePlayer('6',2);a.equal(e.state.game.phase,'COLLOCACIO');layout('penetration-z1');
 e.ratePlayer('1',2);a.equal(e.state.game.phase,'ATAC');layout('penetration-z1');
 e.ratePlayer('4',2);a.equal(e.state.game.phase,'DEFENSA');layout('3-3');
 e.undo();a.equal(e.state.game.phase,'ATAC');layout('penetration-z1');
 e.ratePlayer('4',2);e.ratePlayer('6',2);a.equal(e.state.game.phase,'COLLOCACIO');layout('penetration-z1');
 e.manualPoint('team');a.equal(e.state.game.phase,'SERVEI');layout('3-3');
 const out=e.state.game.court['1'];e.substitute(out,'qa_p11');a.equal(L.placeZ1(e.state.game.court,T.deriveVisualCourt(e.state.game.court,{}))['1'],'qa_p11');
});
