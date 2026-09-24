const KEY="parsayan_hall_v20";
const read=()=>{try{const x=JSON.parse(localStorage.getItem(KEY)||"[]");return Array.isArray(x)?x:[]}catch{return[]}};
const write=x=>{try{localStorage.setItem(KEY,JSON.stringify(x.slice(0,100)));return true}catch{return false}};
export const hallGames=()=>read();
export function recordGame(s){
  if(!s?.players?.length||s.phase!=="finished")return read();
  const signature=[...s.players].sort().join("|")+"::"+Object.entries(s.scores||{}).sort().map(x=>x.join(":" )).join("|")+"::"+(s.winner||"");
  const all=read(); if(all.some(g=>g.signature===signature))return all;
  const ranking=[...s.players].sort((a,b)=>(s.scores[b]||0)-(s.scores[a]||0)).map((name,i)=>({rank:i+1,name,score:s.scores[name]||0}));
  const game={id:`g-${Date.now()}`,signature,date:new Date().toISOString(),winner:s.winner||ranking[0]?.name||"—",score:s.scores[s.winner||ranking[0]?.name]||0,players:s.players.length,ranking};
  all.unshift(game);write(all);return all;
}
export function hallStats(){
 const games=read(),wins={}; let best=null;
 games.forEach(g=>{wins[g.winner]=(wins[g.winner]||0)+1;if(!best||g.score>best.score)best={name:g.winner,score:g.score}});
 const champion=Object.entries(wins).sort((a,b)=>b[1]-a[1])[0];
 return {games:games.length,totalPlayers:games.reduce((n,g)=>n+(g.players||0),0),best,champion:champion?{name:champion[0],wins:champion[1]}:null};
}
export function leaderboard(){
 const wins={},best={};read().forEach(g=>{wins[g.winner]=(wins[g.winner]||0)+1;(g.ranking||[]).forEach(r=>best[r.name]=Math.max(best[r.name]??-Infinity,r.score))});
 return Object.keys(best).map(name=>({name,wins:wins[name]||0,best:best[name]})).sort((a,b)=>b.wins-a.wins||b.best-a.best||a.name.localeCompare(b.name,"fa")).slice(0,10);
}
export function clearHall(){write([])}
