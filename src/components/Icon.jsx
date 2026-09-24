import React from "react";
const paths={
 play:<><path d="M9 7.5v9l7-4.5-7-4.5Z"/></>, trophy:<><path d="M8 5h8v3c0 3-1.7 5-4 5s-4-2-4-5V5Z"/><path d="M8 7H5c0 3 1.4 4.5 4 4.5M16 7h3c0 3-1.4 4.5-4 4.5M12 13v4m-3 2h6"/></>,
 hammer:<><path d="m14.5 5.5 4 4M13 7l4 4M5 19l9.5-9.5-2-2L3 17v2h2Z"/></>, sword:<><path d="m5 19 12-12m-8-2 10 10M4 14l6 6M16 4l4 4M4 4l5 5"/></>,
 bolt:<><path d="M13 2 5.5 13H11l-1 9L18.5 10H13l0-8Z"/></>, crown:<><path d="m4 8 4 4 4-7 4 7 4-4-2 10H6L4 8Z"/></>,
 home:<><path d="m3 11 9-7 9 7v9h-6v-6H9v6H3v-9Z"/></>, undo:<><path d="M9 7 4 12l5 5M5 12h8a6 6 0 1 1 0 12"/></>,
 check:<><path d="m5 12 4 4L19 6"/></>, close:<><path d="m6 6 12 12M18 6 6 18"/></>, star:<><path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z"/></>,
 shield:<><path d="M12 3 5 6v5c0 5 3 8 7 10 4-2 7-5 7-10V6l-7-3Z"/></>, swap:<><path d="M7 7h11l-3-3m3 3-3 3M17 17H6l3 3m-3-3 3-3"/></>, target:<><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><path d="M12 2v4m0 12v4M2 12h4m12 0h4"/></>,
 spark:<><path d="M12 2c.7 5.4 2.6 7.3 8 8-5.4.7-7.3 2.6-8 8-.7-5.4-2.6-7.3-8-8 5.4-.7 7.3-2.6 8-8Z"/></>
};
export default function Icon({name,size=20,className=""}){return <svg className={`uiIcon ${className}`} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]||paths.spark}</svg>}
