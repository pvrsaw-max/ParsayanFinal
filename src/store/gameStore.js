import {fresh,assertInvariants,hydrate} from "../engine/gameEngine.js";
const KEY="parsayan_state_v15";
export const load=()=>{try{const raw=localStorage.getItem(KEY);if(!raw)return fresh();const s=hydrate(JSON.parse(raw));return assertInvariants(s).length?fresh():s}catch{return fresh()}};
export const hasSavedGame=()=>{try{const raw=localStorage.getItem(KEY);if(!raw)return false;const x=JSON.parse(raw);return Array.isArray(x?.players)&&x.players.length>0&&x.phase!=="setup"}catch{return false}};
export const save=s=>{try{localStorage.setItem(KEY,JSON.stringify(s));return true}catch{return false}};
export const reset=()=>{try{localStorage.removeItem(KEY)}catch{}return fresh()};
