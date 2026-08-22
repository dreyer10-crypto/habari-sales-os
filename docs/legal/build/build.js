const d = require('docx');
const {Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell,
       WidthType, ShadingType, BorderStyle, LevelFormat, PageBreak, Footer, PageNumber, convertInchesToTwip} = d;
const fs = require('fs');

const W = 9026;                      // content width (A4 minus 1" margins)
const INK='1F1F1F', MUT='666057', ACC='A85A2E', CRIT='A32E2E', PRESS='8A5A18', RULE='D8D2CA',
      SOFT='F5F2EE', CRITBG='F8E9E7', ACCBG='F5E9E0';

// ---------- helpers ----------
const p = (text, o={}) => new Paragraph({
  spacing:{after:o.after??120, line:o.line??276},
  alignment:o.align,
  indent:o.indent,
  border:o.border,
  shading:o.shade?{type:ShadingType.CLEAR,fill:o.shade,color:'auto'}:undefined,
  children: Array.isArray(text)?text:[new TextRun({text, size:o.size??20, bold:o.bold, italics:o.italics,
             color:o.color??INK, font:o.font??'Calibri'})]
});
const r = (t,o={}) => new TextRun({text:t, size:o.size??20, bold:o.bold, italics:o.italics,
             color:o.color??INK, font:o.font??'Calibri', underline:o.underline});
const H1 = t => new Paragraph({heading:HeadingLevel.HEADING_1, spacing:{before:400,after:160},
  children:[new TextRun({text:t,size:30,bold:true,color:INK,font:'Calibri'})],
  border:{bottom:{style:BorderStyle.SINGLE,size:6,color:ACC,space:6}}});
const H2 = t => new Paragraph({heading:HeadingLevel.HEADING_2, spacing:{before:260,after:100},
  children:[new TextRun({text:t,size:23,bold:true,color:INK,font:'Calibri'})]});
const H3 = t => new Paragraph({heading:HeadingLevel.HEADING_3, spacing:{before:180,after:80},
  children:[new TextRun({text:t,size:20,bold:true,color:ACC,font:'Calibri'})]});
const LBL = t => new Paragraph({spacing:{before:220,after:70},
  children:[new TextRun({text:t.toUpperCase(),size:16,bold:true,color:MUT,font:'Calibri',characterSpacing:30})]});
const bul = (text,lvl=0) => new Paragraph({numbering:{reference:'bul',level:lvl}, spacing:{after:70,line:270},
  children: Array.isArray(text)?text:[r(text)]});
const num = (text,lvl=0) => new Paragraph({numbering:{reference:'num',level:lvl}, spacing:{after:70,line:270},
  children: Array.isArray(text)?text:[r(text)]});
const quote = (t,cite) => {
  const out=[new Paragraph({spacing:{before:110,after:cite?40:140,line:270},
    indent:{left:340},
    border:{left:{style:BorderStyle.SINGLE,size:12,color:ACC,space:10}},
    shading:{type:ShadingType.CLEAR,fill:SOFT,color:'auto'},
    children:[r(t,{italics:true,color:'3A342E'})]})];
  if(cite) out.push(new Paragraph({spacing:{after:140},indent:{left:340},
    children:[r(cite,{size:16,color:MUT,bold:true})]}));
  return out;
};
const callout = (label, kids, fill=ACCBG, edge=ACC) => {
  const b={style:BorderStyle.SINGLE,size:6,color:edge,space:8};
  const arr=[new Paragraph({spacing:{before:120,after:40},shading:{type:ShadingType.CLEAR,fill,color:'auto'},
    border:{top:b,left:b,right:b},
    children:[r(label.toUpperCase(),{size:16,bold:true,color:edge,characterSpacing:30})]})];
  kids.forEach((k,i)=>arr.push(new Paragraph({spacing:{after:i===kids.length-1?0:70,line:270},
    shading:{type:ShadingType.CLEAR,fill,color:'auto'},
    border:{left:b,bottom:i===kids.length-1?b:undefined,right:b},
    children:Array.isArray(k)?k:[r(k)]})));
  arr.push(new Paragraph({spacing:{after:140},children:[r('',{size:2})]}));
  return arr;
};
const chip = (t) => {
  const c = t==='MUST CHANGE'?CRIT : t==='PRESS HARD'?PRESS : t==='RAISE & TRADE'?'4F6138' : MUT;
  return r('  ['+t+']  ',{size:15,bold:true,color:c});
};
const cell = (kids, w, o={}) => new TableCell({
  width:{size:w,type:WidthType.DXA},
  shading:o.shade?{type:ShadingType.CLEAR,fill:o.shade,color:'auto'}:undefined,
  margins:{top:90,bottom:90,left:120,right:120},
  children: kids.map(k=>typeof k==='string'
    ? new Paragraph({spacing:{after:0,line:260},alignment:o.align,children:[r(k,{size:o.size??19,bold:o.bold,color:o.color})]})
    : k)
});
const table = (widths, rows, o={}) => new Table({
  columnWidths:widths,
  width:{size:widths.reduce((a,b)=>a+b,0),type:WidthType.DXA},
  borders:{
    top:{style:BorderStyle.SINGLE,size:4,color:RULE}, bottom:{style:BorderStyle.SINGLE,size:4,color:RULE},
    left:{style:BorderStyle.SINGLE,size:4,color:RULE}, right:{style:BorderStyle.SINGLE,size:4,color:RULE},
    insideHorizontal:{style:BorderStyle.SINGLE,size:4,color:RULE},
    insideVertical:{style:BorderStyle.SINGLE,size:4,color:RULE}},
  rows: rows.map((cells,ri)=> new TableRow({
    tableHeader: ri===0 && o.header!==false,
    children: cells.map((c,ci)=> Array.isArray(c)&&c[0] instanceof Paragraph
      ? cell(c,widths[ci],{shade:(ri===0&&o.header!==false)?SOFT:undefined})
      : cell([String(c)], widths[ci], {
          shade:(ri===0&&o.header!==false)?SOFT:undefined,
          bold:(ri===0&&o.header!==false)||(o.boldCol0&&ci===0),
          color:(ri===0&&o.header!==false)?MUT:undefined,
          size:(ri===0&&o.header!==false)?16:19,
          align:(o.numCols||[]).includes(ci)?AlignmentType.RIGHT:undefined
        }))
  }))
});
const spacer = (h=120)=>new Paragraph({spacing:{after:h},children:[r('',{size:2})]});
const RULEP = ()=>new Paragraph({spacing:{before:160,after:160},
  border:{bottom:{style:BorderStyle.SINGLE,size:4,color:RULE,space:2}},children:[r('',{size:2})]});

// ================= CONTENT =================
const K=[];

// --- cover block ---
K.push(new Paragraph({spacing:{after:60},
  children:[r('BORROWER-SIDE REVIEW  ·  18 AUGUST 2026',{size:16,bold:true,color:ACC,characterSpacing:40})]}));
K.push(new Paragraph({spacing:{after:100},
  children:[new TextRun({text:'Plane Tree Capital facility and security package',size:40,bold:true,color:INK,font:'Calibri'})]}));
K.push(p('A review of the Loan Facility Agreement and the Agreement of Cession and Pledge circulated for Tyron Bos — what the deal actually costs, which wording creates exposure, and what has to change before anyone signs.',
  {size:22,color:'3A342E',after:200}));

K.push(...callout('Status — draft',[
  [r('NOT FOR EXECUTION. ',{bold:true,color:CRIT}),
   r('This is a commercial and risk review, not a legal opinion. It requires sign-off by the principal and review by our attorney before either document is signed, and before any company details or acknowledgement of debt are provided for the legal-fee invoice. See section 11.')]
],CRITBG,CRIT));

K.push(LBL('The deal'));
K.push(table([2100,2600,2100,2226],[
  ['Principal','Rate','Effective rate','Term'],
  ['R2 400 000','21% p.a. nominal, compounded daily','23.36%','12 months from drawdown'],
  ['Balloon, 31 Aug 2027','Borrower','Lender','Purpose'],
  ['≈ R1 632 000 (modelled)','Tyron Bos — personal capacity, unlimited recourse','Plane Tree Capital (Pty) Ltd — NCRCP21814, FSP51788','Investments and projects relating to copper']
],{header:false}));
K.push(spacer(140));
K.push(p([r('Documents reviewed: ',{bold:true}),
  r('2026.08.12 — Loan Facility Agreement — Tyron Bos v1.docx; 2026.08.13 — Pledge and Cession of Claims v1.docx (with Annexures A and B), including the fourteen margin comments left in the files by the lender’s drafter.',{size:18,color:MUT})]));
K.push(p([r('Whose side this is written from. ',{bold:true}),
  r('This review is written for the borrower side. Every recommendation is aimed at reducing Tyron’s personal exposure and preserving our freedom to operate.',{italics:true})],{after:0}));

K.push(new Paragraph({children:[new PageBreak()]}));

// --- 1 bottom line ---
K.push(H1('1.  Bottom line'));
K.push(p([r('Do not sign either document in its current form.',{bold:true}),
  r(' Neither is unusual for a private credit lender’s opening draft, but as drafted the package is materially one-sided and contains at least '),
  r('five provisions that would cause us real harm',{bold:true}),
  r(', plus two that the lender’s own attorney has already conceded, in the margins of his own draft, are non-compliant with the National Credit Act.')]));
K.push(p('The three things that matter most:'));
K.push(num([r('The Sale of Shares proceeds are ceded to Plane Tree "out and out" — outright, not as security. ',{bold:true}),
  r('Ownership of that claim transfers on signature date. There is no clause returning it when the loan is repaid, and no clause obliging Plane Tree to pay back any surplus above what we owe. And the risk that is easy to miss: on this construction the claim '),
  r('falls into Plane Tree’s estate if they become insolvent',{bold:true}),
  r(', leaving Tyron a concurrent creditor for the whole excess. (Pledge cl 4.2 and Annexure A; see section 5.1.)')]));
K.push(num([r('There is no "ordinary course of business" carve-out anywhere in the security document. ',{bold:true}),
  r('All present and future book debts and the credit balance in Tyron’s bank account are ceded, and cl 6.1 then forbids dealing with any of it without prior written consent. Read literally, '),
  r('Tyron cannot collect his own debtors or spend his own money from day one',{bold:true}),
  r(', and is in technical default the moment he does.')]));
K.push(num([r('This is a personal loan with unlimited recourse. ',{bold:true}),
  r('There is no company borrower, no limited recourse, no cap. Tyron is personally liable for R2.4m plus interest, secured on his vehicle, his plant, his receivables, his bank account and his insurance proceeds — and he warrants things that no person can truthfully warrant for twelve months.')]));
K.push(p([r('The email asking for '),r('"company details to be used in the AOD/invoice for legal fees"',{bold:true}),
  r(' should not be answered with company details. See section 3 — it is the most urgent item, and their own attorney has written in the margin that it "is not strictly permitted".')]));

// --- 2 cost ---
K.push(H1('2.  What this actually costs'));
K.push(p([r('The Cost of Credit table leaves '),r('TOTAL INTEREST, FEES AND CHARGES',{bold:true}),r(' and '),
  r('TOTAL COST OF CREDIT',{bold:true}),
  r(' as R[●] — blank. Their comment 10 asks us to supply the figure. Here it is, modelled on the agreement’s own terms (R2.4m, 21% nominal compounded daily on a 365-day year, payments applied to interest first per cl 8.3):')]));
K.push(table([3626,2700,2700],[
  ['','Drawdown 20 Aug 2026','Drawdown 15 Sept 2026'],
  ['12 × R100 000 instalments','R1 200 000','R1 100 000 *'],
  ['Balloon due 31 Aug 2027','R1 632 126','R1 711 262'],
  ['Total interest','R432 126','R411 262'],
  ['Total repaid','R2 832 126','R2 811 262']
],{numCols:[1,2],boldCol0:true}));
K.push(p('* On a September drawdown the first instalment date has already passed — see the third point below.',{size:16,color:MUT,after:160}));

K.push(H2('The instalment schedule is a disguised balloon'));
K.push(p([chip('MUST CHANGE'),r(' R100 000 a month barely exceeds the interest accrual of roughly R42–47k, so capital hardly moves. '),
  r('About 68% of the principal falls due in a single payment on 31 August 2027.',{bold:true}),
  r(' Clause 8.1 reads like an amortising loan. It is not. Our refinancing and exit plan has to be built around a ~R1.63m bullet, not around twelve instalments.')]));

K.push(H2('"21% compounded daily" is not 21% — but argue it under Regulation 40'));
K.push(p([chip('MUST CHANGE'),r(' Compounded daily, the effective annual rate is '),r('23.36%',{bold:true}),
  r('. Their own attorney twice notes, in comments 8 and 19:')]));
K.push(...quote('In terms of the national credit act, the maximum interest rate which can be charged is the Repo Rate plus 14%. That is 21% at the moment and we cannot charge 24%.','Their comments 8 and 19'));
K.push(p([r('The temptation is to argue "23.36% exceeds the 21% cap". '),r('Do not',{bold:true}),
  r(' — whether the Regulation 42 cap bites on the nominal or the effective rate is genuinely unresolved (section 9.1). The stronger and cleaner point is '),
  r('Regulation 40',{bold:true}),
  r(': interest must be calculated daily but may be added to the deferred amount only once a month. Daily capitalisation is not permitted at all, whatever the headline rate.')]));
K.push(...callout('Ask for',[ 'Simple interest, or at most monthly capitalisation; and the effective annual rate stated on the face of the agreement alongside the nominal rate, with the Cost of Credit table completed.' ]));

K.push(H2('The payment dates are hard-coded and will break'));
K.push(p([chip('MUST CHANGE'),r(' Clause 8.1.1 fixes the first R100 000 instalment at '),r('31 August 2026',{bold:true}),
  r('. But cl 5.1 gives 14 calendar days from signature for suspensive conditions — extendable by Plane Tree "in its sole and absolute discretion" — and cl 6.2 then gives them a further 14 days to pay out. On any realistic timeline '),
  r('the first instalment falls due before the money arrives',{bold:true}),
  r('. Clause 14.1.2 makes non-payment on due date an Event of Default, and cl 8.2 then accelerates the whole R2.4m.')]));
K.push(...callout('Ask for',[ [r('Every payment date keyed to the actual Drawdown Date — "the last day of the first calendar month following the Drawdown Date" — never to a fixed calendar date. '),r('This is the cheapest and most important single amendment in the package.',{bold:true})] ]));

// --- 3 AOD ---
K.push(H1('3.  Urgent — the "AOD / invoice for legal fees" request'));
K.push(p([r('Toivo’s email asks us to send '),r('"your company details to be used in the AOD/invoice for legal fees."',{bold:true}),
  r(' Do not send them. Three reasons, in ascending order of seriousness.')]));

K.push(H2('(a)  We are probably not liable for these fees at all — and there is binding SCA authority'));
K.push(p('Loan cl 16 and Pledge cl 9 say the Borrower pays all costs of drafting and implementing the agreements. Their own attorney’s comment 49 says otherwise, in terms:'));
K.push(...quote('In terms of section 100 of the National Credit Act a credit provider must not charge an amount to the consumer in respect of any fee, charge, commission, expense or other amount payable by the credit provider to any third party… We will need to address this as we cannot charge the consumer the costs for the preparation of this agreement.','Their comment 49'));
K.push(p([r('He is right, and the position hardened last year. In '),
  r('National Credit Regulator v National Consumer Tribunal',{italics:true}),
  r(' [2025] ZASCA 132; 2026 (2) SA 455 (SCA) — the "on-the-road fees" case — the SCA held that '),
  r('s101(1) read with s102(1) contains a closed list',{bold:true}),
  r(' of the permissible charges a credit provider may require a consumer to pay, and that each charge must be examined '),
  r('on its substance, not its label',{bold:true}),
  r('. Drafting fees are not on that list. The initiation fee under s101(1)(b) is the statutorily permitted, capped recovery for originating a credit agreement — and Plane Tree has disclosed it as NIL.')]));
K.push(p([r('Note the distinction they may try: legal fees '),r('are',{italics:true}),
  r(' recoverable as collection costs under s101(1)(g) — but that covers fees incurred in '),r('enforcing',{bold:true}),
  r(' the consumer’s obligations, not in originating the agreement.')]));

K.push(H2('(b)  The company-invoice route is that same attorney’s stated workaround'));
K.push(p('Comment 49 continues:'));
K.push(...quote('We can possibly have his company pay these amounts but it is not strictly permitted.','Their comment 49, continued'));
K.push(p([r('The request in Toivo’s email is the execution of that workaround. If we supply company details we become a knowing participant in routing a charge around a statutory prohibition. That is bad for us twice over: we pay money we may not owe, '),
  r('and',{bold:true,italics:true}),r(' we create a paper trail showing both parties knew.')]));
K.push(...callout('In fairness',[
  [r('This route is not automatically fatal. In '),r('Uys NO v National Credit Regulator',{italics:true}),
   r(' [2025] ZASCA 34 the SCA held there is '),r('nothing unlawful in structuring transactions so as to avoid the application of the NCA',{bold:true}),
   r(', and that a transaction is not simulated merely because it was arranged to avoid regulatory consequences — simulation requires a shared dishonest intention to disguise. If our company genuinely receives a genuine service and genuinely owes the fee, Uys protects the arrangement. If it is a pass-through so that Tyron ultimately bears the cost of drafting his own credit agreement, s100(1) and the substance-over-label approach apply. That is a question of fact — which is precisely why we should ask the questions rather than assume.')]
]));

K.push(H2('(c)  An AOD is a separate, independently enforceable debt — and this exact device has been struck down'));
K.push(p([r('An Acknowledgement of Debt is typically a liquid document: it can support provisional sentence or summary judgment, often with a consent to judgment attached. Worse, where an AOD contains a '),
  r('deferral of payment plus interest, fees or charges',{bold:true}),
  r(', it is likely itself a credit agreement, which drags in registration, the s101 closed list and the Regulation 42 caps.')]));
K.push(p([r('And in '),r('Absa Bank Ltd v Serfontein',{italics:true,bold:true}),
  r(' (SCA, 10 February 2025) an AOD concluded '),r('separately',{bold:true}),
  r(' from the credit agreement, incorporating a power of attorney permitting execution without court process, was held to be an unlawful '),
  r('supplementary agreement',{bold:true}),
  r(' under s91 — unlawful under s90(2)(j), (k) and (a)(i), '),r('unseverable',{bold:true}),
  r(', with the agreement declared unlawful and the resulting sale void from the outset. (Citation to be confirmed — see section 9.3.)')]));
K.push(...callout('Note also',[
  [r('The Cost of Credit table records '),r('INITIATION FEE: NIL',{bold:true}),r(' and '),r('SERVICE FEE: NIL',{bold:true}),
   r('. They have contractually agreed to charge us nothing, and are now seeking the same money through a side document. Hold them to the table.')],
  [r('Recommended response: ',{bold:true}),r('do not decline rudely and do not send company details. Ask three questions (draft wording in section 8) — what is the quantum, on what basis is the Borrower liable given s100, and why an AOD rather than disclosure in the Cost of Credit table. In most cases that ends the request.')]
],CRITBG,CRIT));

fs.writeFileSync('/tmp/kids1.json','ok');
module.exports = {d,K,p,r,H1,H2,H3,LBL,bul,num,quote,callout,chip,table,spacer,RULEP,W,INK,MUT,ACC,CRIT,PRESS,RULE,SOFT,CRITBG,ACCBG,PageBreak,Paragraph,TextRun,AlignmentType,Document,Packer,Footer,PageNumber,LevelFormat,BorderStyle,convertInchesToTwip};
