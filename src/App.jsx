import React,{useEffect,useState}from"react";import GameShell from"./components/GameShell";import Icon from"./components/Icon";
import{load,save,hasSavedGame}from"./store/gameStore";
import{addPlayer,ownerResult,stealResult,commitTurn,setAuction,armPower,undo,canCoup,duelResult,swapQuestion,auctionRemaining,dealPowerHand,chooseSecretPowers,confirmHandoff,availablePowers,resolveTie,newGame,startGame,selectCategory,selectQuestion,revealOptions,backFromValues}from"./engine/gameEngine";
import{bank,challenges}from"./data/questions";import{duelTopics as duels}from"./data/duels";
import Setup from"./screens/Setup";import HallOfFame from"./screens/HallOfFame";import Landing from"./screens/Landing";import SecretPowers from"./screens/SecretPowers";import TieBreak from"./screens/TieBreak";import Board from"./screens/Board";import Values from"./screens/Values";import Winner from"./screens/Winner";

const powers=["شکار","دو یا هیچ","بیمه","دوئل","تعویض"];
export default function App(){
 const[s,setS]=useState(load),[modal,setModal]=useState(null),[,setClock]=useState(0),[atLanding,setAtLanding]=useState(true),[showHall,setShowHall]=useState(false),[selectedOption,setSelectedOption]=useState(null),[feedback,setFeedback]=useState(null);
 useEffect(()=>{if(s.auctionStage!=="steal"||!s.auctionDeadline)return;const id=setInterval(()=>{setClock(x=>x+1);if(Date.now()>=s.auctionDeadline)clearInterval(id)},250);return()=>clearInterval(id)},[s.auctionStage,s.auctionDeadline]);
 const sync=()=>{save(s);setS({...s})}, player=s.players[s.turn];
 const startNewFromLanding=()=>{if(hasSavedGame()&&!window.confirm("بازی قبلی ذخیره شده. بازی جدید جای آن را می‌گیرد. ادامه می‌دهی؟"))return;const n=newGame();save(n);setS(n);setSelectedOption(null);setAtLanding(false)};
 const goHome=()=>{save(s);setModal(null);setSelectedOption(null);setShowHall(false);setAtLanding(true)};
 const add=n=>{let ok=addPlayer(s,n);sync();return ok};
 const start=()=>{let r=startGame(s);if(!r.ok)return alert(r.error);sync()};
 const pick=cat=>{const had=!!s.activePower&&cat.includes("چالش");let r=selectCategory(s,cat,[...Object.keys(bank),"🎭 چالش"]);if(!r.ok)return alert(r.error);if(had)alert("قدرت شخصی روی چالش اجرا نمی‌شود؛ قدرت فعال لغو شد");sync()};
 const choose=v=>{let r=selectQuestion(s,v,bank,challenges);if(!r.ok)return alert(r.error);setSelectedOption(null);sync()};
 const finishTurn=()=>{commitTurn(s);sync();setModal(null);setSelectedOption(null);setFeedback(null)};
 const showAnswerFeedback=(ok,who=player)=>{setFeedback({ok,who,answer:s.question?.opts?.[s.question?.correctIndex]||"",explanation:s.question?.explanation||""});sync();setModal(null)};
 const judge=ok=>{let r=ownerResult(s,ok);if(!r.ok)return alert(r.error);if(r.next==="steal"){sync();setModal(null);setSelectedOption(null)}else showAnswerFeedback(ok)};
 const doUndo=()=>{let p=undo(s);if(!p)return alert("چیزی برای Undo نیست");save(p);setS(p);setModal(null)};
 const power=p=>{if(s.usedPowers[player]?.includes(p))return alert("این قدرت قبلاً استفاده شده");if(p==="تعویض"&&s.phase!=="question")return alert("تعویض بعد از دیدن متن سؤال و قبل از گزینه‌ها فعال می‌شود");if(p!=="تعویض"&&s.phase==="question")return alert("این قدرت باید قبل از انتخاب سؤال فعال شود");
  if(p==="تعویض"&&s.phase==="question"){armPower(s,"تعویض");let r=swapQuestion(s,bank);if(!r.ok){s.activePower=null;return alert(r.error)}sync();setModal(null);return}if(p==="دوئل"){if(!armPower(s,"دوئل"))return alert("دوئل الان قابل فعال‌سازی نیست");sync();return setModal("duel")}if(p==="شکار")return setModal("hunt");if(!armPower(s,p))return alert("این قدرت الان قابل فعال‌سازی نیست");sync();setModal(null)};
 const doAuction=(who,sec)=>{let r=setAuction(s,who,sec);if(!r.ok)return alert(r.error);sync();setModal(null)};
 const judgeSteal=ok=>{let r=stealResult(s,ok);if(!r.ok)return alert(r.error);showAnswerFeedback(!r.expired&&ok,s.auction?.player)};
 const runDuel=loser=>{let pool=duels.filter(x=>!s.usedDuels.includes(x.id));if(!pool.length)pool=duels;let topic=pool[Math.floor(Math.random()*pool.length)];setModal({type:"duelJudge",loser,topic})};
 const duelWin=winner=>{let loser=winner===player?modal.loser:player;let dr=duelResult(s,winner,loser,modal.topic.id);if(!dr.ok)return alert(dr.error);sync();setModal(null)};
 if(showHall)return <HallOfFame back={()=>setShowHall(false)}/>;
 if(atLanding)return <Landing canContinue={hasSavedGame()} onContinue={()=>setAtLanding(false)} onNew={startNewFromLanding} onHall={()=>setShowHall(true)}/>;
 if(s.phase==="setup")return <><Setup s={s} add={add} start={start}/><HomeButton go={goHome}/></>;
 if(s.phase==="secret"){
  const name=s.players[s.powerDraft.index];let hand=s.powerDraft.hands[name]||dealPowerHand(s,name);
  return <SecretPowers s={s} hand={hand} choose={(n,c)=>{let r=chooseSecretPowers(s,n,c);if(!r.ok)return alert(r.error);sync()}} confirm={()=>{let r=confirmHandoff(s);if(!r.ok)return alert(r.error);if(s.phase==="secret"){let nx=s.players[s.powerDraft.index];if(!s.powerDraft.hands[nx])dealPowerHand(s,nx)}sync()}}/>
 }
 if(s.phase==="tiebreak")return <TieBreak s={s} win={n=>{let r=resolveTie(s,n);if(!r.ok)return alert(r.error);sync()}} undo={doUndo}/>;
 if(s.phase==="board")return <><Board s={s} pick={pick}/><Nav undo={doUndo} power={()=>setModal("power")} home={goHome}/>{modal&&<Overlay>{modal==="power"&&<PowerMenu s={s} player={player} allowed={availablePowers(s,player).filter(p=>p!=="تعویض")} choose={power} close={()=>setModal(null)}/>} </Overlay>}</>;
 if(s.phase==="values")return <Values cat={s.cat} choose={choose} back={()=>{let r=backFromValues(s);if(!r.ok)return alert(r.error);sync()}}/>;
 if(s.phase==="finished")return <Winner s={s} home={goHome} hall={()=>setShowHall(true)} newGame={()=>{if(!window.confirm("بازی جدید شروع شود؟ بازیکن‌ها، امتیازها، قدرت‌ها و تاریخچه پاک می‌شوند."))return;let n=newGame();save(n);setS(n)}}/>;
 if(s.phase==="question")return <GameShell round={Math.min(s.round,3)} player={`نوبت ${player}`} score={s.scores[player]} progress={`${(s.turnIndex??s.turn??0)+1} از ${s.players.length}`}>
  <div className="questionMeta premium"><span>{s.cat}</span><b>{s.value}</b></div>{s.stats?.[player]?.correct>=2&&<div className="gamePulse"><Icon name="spark" size={16}/><span><b>{player}</b> تا اینجا {s.stats[player].correct} پاسخ درست ثبت کرده</span></div>}
  {s.activePower&&<div className={`armed powerArmed ${s.activePower==="کودتا"?"coupArmed":""}`}><Icon name={s.activePower==="کودتا"?"crown":"bolt"} size={17}/><span>قدرت فعال: <b>{s.activePower}</b></span></div>}
  {s.auctionStage==="steal"&&<div className="armed">حراج در انتظار پاسخ {s.auction?.player} · {auctionRemaining(s)} ثانیه</div>}
  <h1 className="question premiumQuestion">{s.question?.text}</h1>
  {!s.cat.includes("چالش")&&s.auctionStage!=="steal"&&<div className="actionrow actionDock">{!s.optionsRevealed&&s.activePower!=="بیمه"&&<button className="iconAction" onClick={()=>setModal("auction")}><Icon name="hammer"/> حراج</button>}{!s.optionsRevealed&&!s.activePower&&<button className="iconAction" onClick={()=>setModal("power")}><Icon name="bolt"/> قدرت</button>}{!s.optionsRevealed&&!s.activePower&&canCoup(s,player)&&<button className="iconAction coupButton" onClick={()=>{if(!armPower(s,"کودتا"))return alert("کودتا در این وضعیت مجاز نیست");sync()}}><Icon name="crown"/> کودتا</button>}</div>}
  {s.question?.opts&&!s.optionsRevealed&&<button className="primary" onClick={()=>{let r=revealOptions(s);if(!r.ok)return alert(r.error);sync()}}>نمایش گزینه‌ها</button>}
  {s.optionsRevealed&&s.question?.opts&&<div className="options optionGrid">{s.question.opts.map((o,i)=><button type="button" className={selectedOption===i?"selected":""} key={i} onClick={()=>setSelectedOption(i)}><span>{i+1}</span><b>{o}</b></button>)}</div>}
  {s.auctionStage!=="steal"&&s.cat.includes("چالش")&&<div className="judge judgeDock"><button onClick={()=>judge(false)}>✕ انجام نشد</button><button onClick={()=>judge(true)}>✓ انجام شد</button></div>}
  {s.auctionStage!=="steal"&&!s.cat.includes("چالش")&&s.optionsRevealed&&<div className="answerDock"><button className="submitAnswer" disabled={selectedOption===null} onClick={()=>judge(selectedOption===s.question.correctIndex)}>{selectedOption===null?"یک گزینه را انتخاب کن":"ثبت پاسخ"}</button><small>با لمس گزینه، انتخابت مشخص می‌شود؛ بعد پاسخ را ثبت کن.</small></div>}
  <Nav undo={doUndo} home={goHome}/>
  {feedback&&<Overlay><AnswerFeedback data={feedback} next={finishTurn}/></Overlay>}
  {!feedback&&(modal||s.auctionStage==="steal")&&<Overlay>
   {s.auctionStage==="steal"?<Steal s={s} judge={judgeSteal}/>:modal==="auction"&&<Auction s={s} owner={player} go={doAuction} close={()=>setModal(null)}/>}
   {modal==="power"&&<PowerMenu s={s} player={player} allowed={availablePowers(s,player).filter(p=>p==="تعویض")} choose={power} close={()=>setModal(null)}/>}
   {modal==="hunt"&&<Hunt s={s} owner={player} go={t=>{if(!armPower(s,"شکار",t))return alert("هدف شکار معتبر نیست");sync();setModal(null)}} close={()=>setModal(null)}/>}
   {modal==="duel"&&<Hunt title="حریف دوئل" s={s} owner={player} go={runDuel} close={()=>{s.activePower=null;s.powerTarget=null;sync();setModal(null)}}/>}
   {modal?.type==="duelJudge"&&<div><div className="duelScene"><div className="duelBadge"><Icon name="sword" size={28}/></div><span className="eyebrow">DUEL · رودررو</span><h2>{player} <i>VS</i> {modal.loser}</h2><h3>{modal.topic.title}</h3><p>{modal.topic.topic}</p><p className="duelRule">{modal.topic.rule}</p><div className="duelWinners"><button onClick={()=>duelWin(player)}><Icon name="trophy"/> {player}</button><button onClick={()=>duelWin(modal.loser)}><Icon name="trophy"/> {modal.loser}</button></div></div></div>}
  </Overlay>}
 </GameShell>;
 return null
}
function Overlay({children}){return <div className="overlay"><div className="sheet">{children}</div></div>}
function Nav({undo,power,home}){return <div className="nav">{undo&&<button onClick={undo}>↶ بازگشت حرکت</button>}{power&&<button onClick={power}>⚡ قدرت‌ها</button>}{home&&<button onClick={home}>⌂ منوی اصلی</button>}</div>}
function HomeButton({go}){return <button className="floatingHome" onClick={go}>⌂ منوی اصلی</button>}
function PowerMenu({s,player,allowed=powers,choose,close}){const meta={"شکار":["target","امتیاز را از یک رقیب بقاپ"],"دو یا هیچ":["bolt","ریسک دوبرابر برای سؤال سخت"],"بیمه":["shield","پاسخ غلط بدون کسر امتیاز"],"دوئل":["sword","یک رقیب را رودررو به چالش بکش"],"تعویض":["swap","سؤال را با هم‌ارزش خودش عوض کن"]};return <div className="powerSheet"><span className="eyebrow">SECRET POWER</span><h2>قدرت {player}</h2><div className="powerGrid">{powers.filter(p=>allowed.includes(p)).map(p=><button className="powerCard" disabled={s.usedPowers[player]?.includes(p)} key={p} onClick={()=>choose(p)}><i><Icon name={meta[p][0]} size={24}/></i><span><b>{p}</b><small>{s.usedPowers[player]?.includes(p)?"استفاده شده":meta[p][1]}</small></span><em>←</em></button>)}</div><button className="ghost" onClick={close}>بستن</button></div>}
function Hunt({title="هدف شکار",s,owner,go,close}){return <div><h2>{title}</h2>{s.players.filter(x=>x!==owner).map(n=><button className="sheetbtn" key={n} onClick={()=>go(n)}>{n}</button>)}<button className="ghost" onClick={close}>بستن</button></div>}
function Auction({s,owner,go,close}){const[w,setW]=useState(s.players.find(x=>x!==owner)||""),[sec,setSec]=useState(5);return <div className="auctionScene"><div className="auctionIcon"><Icon name="hammer" size={30}/></div><span className="eyebrow">AUCTION MODE</span><h2>حراج سؤال</h2><p>کمترین زمان پیشنهادی برنده حراج است.</p><label>برنده حراج<select value={w} onChange={e=>setW(e.target.value)}>{s.players.filter(x=>x!==owner).map(n=><option key={n}>{n}</option>)}</select></label><label>زمان پاسخ<div className="timeInput"><input type="number" min="2" max="15" value={sec} onChange={e=>setSec(e.target.value)}/><span>ثانیه</span></div></label><button className="primary sheetbtn" onClick={()=>go(w,sec)}>ثبت حراج ←</button><button className="ghost" onClick={close}>انصراف</button></div>}

function AnswerFeedback({data,next}){return <div className={`answerFeedback ${data.ok?"isCorrect":"isWrong"}`}><div className="feedbackIcon"><Icon name={data.ok?"check":"close"} size={43}/></div><span className="feedbackKicker">{data.who} · نتیجه پاسخ</span><h2>{data.ok?"پاسخ درست بود":"پاسخ اشتباه بود"}</h2><div className="correctAnswer"><small>پاسخ صحیح</small><strong>{data.answer}</strong></div>{data.explanation&&<p>{data.explanation}</p>}<button className="primary feedbackNext" onClick={next}>ادامه بازی ←</button></div>}
function Steal({s,judge}){const left=auctionRemaining(s);return <div><h2>فرصت حراج</h2><p>{s.auction?.player} جواب بده.</p><div className="timer">{left>0?`${left} ثانیه`:`زمان تمام شد`}</div><div className="judge judgeDock"><button onClick={()=>judge(false)}>غلط / بی‌پاسخ</button><button disabled={left<=0} onClick={()=>judge(true)}>درست</button></div></div>}
