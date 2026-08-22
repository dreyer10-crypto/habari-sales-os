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
const GRN='4F6138';

K.push(new Paragraph({spacing:{after:60},
  children:[r('SIGNATURE REPORT  ·  22 AUGUST 2026',{size:16,bold:true,color:ACC,characterSpacing:40})]}));
K.push(new Paragraph({spacing:{after:100},
  children:[new TextRun({text:'Plane Tree Capital — final documents',size:40,bold:true,color:INK,font:'Calibri'})]}));
K.push(p('The three final agreements circulated for execution on 21 August 2026 — what moved since the 18 August review, what still has to be answered in writing, and what to sign.',
  {size:22,color:'3A342E',after:200}));

K.push(...callout('Status — draft',[
  [r('NOT FOR EXECUTION. ',{bold:true,color:CRIT}),
   r('Commercial and risk review, not a legal opinion. Requires sign-off by the principal and review by CST Law before any of the three documents is signed. The suggested reply in section 9 has not been sent.')]
],CRITBG,CRIT));

K.push(LBL('Documents reviewed'));
K.push(table([3600,1400,4026],[
  ['Document','Pages','Verdict'],
  ['2026.08.21 — Loan Facility Agreement — Tryon Bos (final)','22','Sign after the interest reconciliation and two corrections'],
  ['2026.08.21 — Pledge and Cession of Claims (final)','19','Sign after a settlement-and-reversion side letter'],
  ['2026.08.21 — AOD — Legal Fees (Final)','12','Do not sign in current form']
]));
K.push(spacer(140));
K.push(p([r('Compared against ',{bold:true}),
  r('the 12/13 August drafts reviewed in the 18 August borrower-side memo. Written from the borrower side throughout.',{size:18,color:MUT})]));

K.push(new Paragraph({children:[new PageBreak()]}));

// 1
K.push(H1('1.  Bottom line'));
K.push(p([r('Do not sign today.',{bold:true}),
  r(' Four items need a written answer from Plane Tree first. Three are quick — a reconciliation and two clause corrections. The fourth is a decision for you, not a drafting point.')]));
K.push(p([r('The lender moved on the two things that mattered most in the last review: '),
  r('cure periods now exist',{bold:true}),r(', and the '),r('power of attorney is no longer unconditional',{bold:true}),
  r('. Those were real concessions and worth acknowledging when you reply.')]));
K.push(p([r('Against that: the Cost of Credit table has been filled in with figures that '),
  r('do not follow from the agreement’s own repayment clauses',{bold:true}),
  r(', and a third document has appeared that pushes the lender’s legal fees onto '),
  r('SB Innovative Construction (Pty) Ltd',{bold:true}),
  r(' — an entity that is not a party to the loan and receives nothing under it.')]));

// 2
K.push(H1('2.  What actually changed since 18 August'));
K.push(p('Four substantive changes. Everything else in the previous memo stands unchanged.'));
K.push(H2('Improvements — genuine'));
K.push(num([r('Cure periods now exist. ',{bold:true}),
  r('Loan cl 14.1.2 gives 5 business days’ written notice to remedy a missed payment; cl 14.1.3 gives 15 business days for any other breach. Previously any breach was an immediate Event of Default with no chance to fix it. This was finding #5 last time and has been properly addressed.')]));
K.push(num([r('The power of attorney is conditioned. ',{bold:true}),
  r('Pledge cl 6.5 now only lets a Plane Tree director sign in your name (a) during a subsisting, unremedied Event of Default, and (b) after 5 business days’ written notice to you to sign yourself. Previously it was a bare power of attorney in rem suam.')]));
K.push(num([r('Minor softening. ',{bold:true}),
  r('Cl 14.1.8 now requires a material misstatement that prejudices the Lender; cl 14.1.1 no longer treats a waived suspensive condition as a default; cl 6.3.4 broadens permitted use of funds to “any lawful purposes”.')]));
K.push(H2('The new exposure'));
K.push(num([r('A third agreement. ',{bold:true}),
  r('An Acknowledgement of Debt for R74 750 (R65 000 + VAT) with SB Innovative Construction (Pty) Ltd as Principal Debtor. Section 6 deals with it.')]));
K.push(...callout('What did not change',[
  'The Pledge is otherwise word-for-word the draft. The out-and-out cession of the Sale of Shares proceeds, enforcement without notice or court authorisation, the absence of any ordinary-course carve-out, the lender’s free right to cede without your consent, the inverted cooling-off clause, the lender’s own accountant as final arbiter of calculation disputes, and the “borrower pays the drafting costs” clause are all still there exactly as they were.'
]));

K.push(new Paragraph({children:[new PageBreak()]}));

// 3
K.push(H1('3.  Blocking item 1 — the disclosed interest does not match the agreement'));
K.push(p('The Cost of Credit table, previously blank, now reads:'));
K.push(table([3400,5626],[
  ['Line','Disclosed'],
  ['Principal debt','R2 400 000.00'],
  ['Interest rate','21% p.a. nominal, compounded daily — fixed'],
  ['Service fee','NIL'],
  ['Initiation fee','NIL'],
  ['Total interest, fees and charges','R688 013.32  (fees & charges R99 613.33; interest R588 399.99)'],
  ['Total cost of credit','R3 088 013.32']
],{boldCol0:true}));
K.push(spacer(140));

K.push(H2('3.1  The interest figure ignores your instalments'));
K.push(p([r('Clause 8.1 requires twelve instalments of R100 000 (31 August 2026 through 31 July 2027), with the balance due 31 August 2027. Clause 9.2 says interest is calculated daily on the '),
  r('outstanding balance',{bold:true}),r('. Clause 8.5 applies every payment to interest first, then fees, then capital. Run those clauses and the numbers come out like this:')]));
K.push(table([2600,2100,2200,2126],[
  ['Drawdown assumption','Interest over term','Balloon 31 Aug 2027','Total repaid'],
  ['22 Aug 2026','R428 701','R1 628 701','R2 828 701'],
  ['5 Sep 2026','R405 187','R1 605 187','R2 805 187'],
  ['19 Sep 2026 (latest under cl 5 + 6.2)','R382 497','R1 582 497','R2 782 497']
],{numCols:[1,2,3]}));
K.push(spacer(100));
K.push(p('Model output on the agreement’s own terms — daily compounding at 0.21/365, instalments applied on their due dates. To be confirmed against the lender’s own calculation.',{size:17,color:MUT,italics:true}));
K.push(p([r('The disclosed R588 399.99 sits far above all of these. It corresponds to daily compounding on '),
  r('the full, undiminished R2 400 000 for roughly 381 days',{bold:true}),
  r(' — as if the twelve R100 000 instalments were never paid at all. For reference: R2.4m compounded daily for 381 days is R588 021; simple interest at 21% for fourteen months is R588 000.')]));
K.push(...callout('The gap',[
  [r('Roughly R183 000 in interest, and roughly R283 000 in total cost of credit. ',{bold:true,color:CRIT}),
   r('The disclosed total implies a balloon of R1 888 013 on 31 August 2027 rather than the ~R1.6m the repayment clauses produce.')],
  [r('Either the table is a worst-case, non-amortising disclosure — in which case it should say so — or the lender intends to charge interest on the original capital regardless of what you repay, which flatly contradicts clause 9.2. '),
   r('Ask for the amortisation schedule behind the R588 399.99',{bold:true}),
   r(', showing the assumed drawdown date and how each R100 000 instalment is applied.')]
],CRITBG,CRIT));

K.push(H2('3.2  R99 613.33 of “fees and charges” is unexplained'));
K.push(p([r('The same table records '),r('SERVICE FEE: NIL',{bold:true}),r(' and '),r('INITIATION FEE: NIL',{bold:true}),
  r(', then discloses R99 613.33 of “Fees & Charges”. Nothing in the agreement identifies what these are. Note also that R99 613.33 is neither the R74 750 in the AOD nor any multiple of it.')]));
K.push(p('This matters beyond the money. Under the NCA a credit provider may only charge the amounts the Act permits, and the initiation and service fee caps are a fraction of this figure. An unexplained six-figure charge line, sitting directly beneath two NIL entries in the statutory disclosure table, is the kind of defect that undermines the disclosure as a whole.'));
K.push(p([r('Ask for an itemised written breakdown before signature',{bold:true}),
  r(', and confirmation that it is not the same legal cost being recovered a second time through the AOD.')]));

K.push(new Paragraph({children:[new PageBreak()]}));

// 4
K.push(H1('4.  Blocking item 2 — the first instalment falls due before you are funded'));
K.push(p('This was finding #4 last time. It has become near-certain rather than theoretical, purely because of the calendar.'));
K.push(bul([r('Clause 8.1.1: ',{bold:true}),r('R100 000 due on or before 31 August 2026.')]));
K.push(bul([r('Clause 5.1: ',{bold:true}),r('suspensive conditions within 14 calendar days after signature — up to ~5 September if you sign on 22 August.')]));
K.push(bul([r('Clause 6.2: ',{bold:true}),r('the R2.4m is paid within 14 days of the Effective Date — up to ~19 September.')]));
K.push(bul([r('Clause 14.1.2: ',{bold:true}),r('failure to pay on the due date, uncured after 5 business days’ notice, is an Event of Default that accelerates the entire debt and lets the lender execute against every pledged asset.')]));
K.push(p([r('On the documents as drafted you can be in default on a R2.4m facility '),
  r('before a cent has been advanced to you',{bold:true}),
  r('. The new 5-business-day cure period helps but does not solve it — you would be curing a payment obligation on money you do not have.')]));
K.push(...callout('Fix',[
  [r('Amend clause 8.1.1 so the first instalment is due on the last day of the first full calendar month following the date of actual drawdown, with every subsequent date running off that. This is mechanical and there is no honest reason to resist it.')],
  [r('While that clause is open, also press for a '),r('long-stop on funding',{bold:true}),
   r('. Clause 6.2 obliges the lender to pay “within 14 days of the Effective Date” but gives you no remedy at all if they do not. Ask for a right to walk away, at no cost and with the security released, if the money has not landed by a fixed date.')]
]));

// 5
K.push(H1('5.  Blocking item 3 — the Sale of Shares cession still has no way home'));
K.push(p('Unchanged from the last memo, and still the largest structural risk in the package.'));
K.push(p([r('Every other asset is ceded '),r('in securitatem debiti',{italics:true}),
  r(' — as security, with your underlying ownership intact. The Sale of Shares proceeds are the single exception: Pledge clause 4.2 cedes them ')]));
K.push(...quote('out and out on an outright basis','Pledge cl 4.2'));
K.push(p('Annexure A now goes further and instructs Mila De Jongh, Megan De Jongh, Liam Daniel De Jongh and Andries Jacobus Nel to pay Plane Tree directly, while Annexure A clause 7 keeps your obligations to them fully in place.'));
K.push(p([r('There is still '),r('no clause requiring the claim to be ceded back to you when the loan is settled',{bold:true}),
  r(', and no clause obliging the lender to account to you for anything the purchasers pay over and above what you owe. Clause 5.3 credits net collections against the debt; clause 5.2.9’s surplus mechanism applies only where the lender elects to take transfer as beneficial owner.')]));
K.push(bul([r('If you repay in full, ',{bold:true}),r('nothing automatically returns the claim to you or redirects the purchasers back to your account. You would depend on the lender’s cooperation.')]));
K.push(bul([r('If Plane Tree is wound up, ',{bold:true}),r('an out-and-out cession means the claim sits in their insolvent estate, not yours. You would rank as a concurrent creditor for the excess.')]));
K.push(...callout('Fix',[
  'A short side letter — or two inserted clauses — providing that (a) on full settlement of the Aggregate Debt the claim re-cedes to you automatically and the lender notifies the purchasers in writing within 5 business days, and (b) the lender accounts to you for any amount received in excess of the Aggregate Debt within 5 business days of receipt.',
  [r('If the lender genuinely takes this cession only as security, neither clause costs them anything.',{italics:true})]
]));

K.push(new Paragraph({children:[new PageBreak()]}));

// 6
K.push(H1('6.  Blocking item 4 — the AOD is the wrong debtor'));
K.push(p([r('This is new, and it is the item that most directly cuts against the instruction not to create exposure beyond this transaction.')]));
K.push(p([r('What it does. ',{bold:true}),
  r('SB Innovative Construction (Pty) Ltd acknowledges owing Plane Tree R74 750 (R65 000 + VAT), payable by 15 September 2026, with 21% p.a. compounded and capitalised daily on any unpaid balance thereafter.')]));
K.push(H2('Why this is a problem'));
K.push(num([r('Wrong debtor. ',{bold:true}),
  r('SB Innovative is not a party to the loan, receives none of the R2.4m, and gets no benefit from it. The debt being acknowledged is the cost of drafting Tyron’s personal facility.')]));
K.push(num([r('It looks like a workaround. ',{bold:true}),
  r('In the margin comments on the 13 August draft, the lender’s own drafter recorded that these drafting costs cannot lawfully be charged to the consumer. Loan clause 16.1 nevertheless still says the Borrower pays all drafting costs. Moving the same cost into a separate acknowledgement against a company — where the NCA’s consumer protections may not reach — is the obvious explanation for this document’s existence, and it should be named as such in your reply.')]));
K.push(num([r('The renunciations are aggressive for a debtor in this position. ',{bold:true}),
  r('Clause 6.1 has SB Innovative renounce non causa debiti (it cannot later argue there is no underlying cause for the claim) and non numeratae pecuniae (it cannot argue it received no value) — precisely the two defences a company in SB Innovative’s position would otherwise have. It also renounces errore calculi and revision of accounts. The clause repeatedly refers to a “surety” although there is no surety anywhere in the document — sloppy drafting that should itself be corrected.')]));
K.push(num([r('Consent to judgment without notice. ',{bold:true}),
  r('Clause 9.1 has SB Innovative consent to the agreement being made an order of court by ex parte application, without notice, at SB Innovative’s expense. Combined with the clause 7 certificate provision, that is a fast route to an enforceable judgment against a group company over a R74 750 fee dispute.')]));
K.push(num([r('A pure-discretion default trigger. ',{bold:true}),
  r('Clause 4.1.8 makes it a breach if SB Innovative “causes or allows a situation to arise wherein the Creditor in its sole discretion considers its position as creditor in any way prejudiced or threatened either now or at any time in the future.” No cure period attaches to it. That is not a default clause; it is an at-will acceleration right.')]));
K.push(H2('Recommended position, in order of preference'));
K.push(bul([r('First choice. ',{bold:true,color:GRN}),r('The legal fee is Plane Tree’s own cost of putting up the facility and should be absorbed, or netted off the advance as a properly disclosed charge inside the loan agreement where the NCA governs it. Decline the separate AOD.')]));
K.push(bul([r('Second choice. ',{bold:true,color:PRESS}),r('If a fee is genuinely agreed, pay it as a once-off invoice on drawdown. There is no reason for a twelve-page acknowledgement of debt with consent to judgment over R74 750.')]));
K.push(bul([r('Last resort, if it must be signed. ',{bold:true,color:CRIT}),r('Delete clause 9 (ex parte order of court) entirely, delete clause 4.1.8, delete the non causa debiti and non numeratae pecuniae renunciations, correct the “surety” references, and make the debtor Tyron personally rather than SB Innovative — so the exposure stays inside the transaction it belongs to.')]));
K.push(...callout('Also confirm',[
  [r('Whether the R74 750 is inside or outside the R99 613.33 disclosed in the loan’s Cost of Credit table. '),
   r('If it is inside, you are being asked to pay it twice.',{bold:true})]
],CRITBG,CRIT));

K.push(new Paragraph({children:[new PageBreak()]}));

// 7
K.push(H1('7.  Items to accept with eyes open'));
K.push(p('Unattractive but ordinary in secured lending, and unlikely to be conceded. Listed so the decision is deliberate rather than accidental.'));
K.push(table([1700,7326],[
  ['Clause','Effect'],
  ['Pledge 5.1','Security enforceable on default “without the need for prior notice… or any prior authorisation from any court or arbitrator”. The Pledge does not mention the NCA anywhere — the word does not appear in the document. The loan’s s129 machinery does not on its face reach it. Legal view needed on whether s91 pulls the Pledge in as a supplementary agreement.'],
  ['Pledge 6.1','No ordinary-course-of-business carve-out. Your book debts and the credit balance in your FNB account are ceded, and cl 6.1.6 bars you from dealing with any payment except through a “payment flow approved by the Lender” — a flow that does not yet exist. Ask for it in writing before signature, or for an express ordinary-course carve-out.'],
  ['Pledge 12.6','Plane Tree may cede its rights to any third party without notice to you or your consent; the security follows automatically. You may not cede anything without their consent.'],
  ['Loan 18','Calculation disputes go to the lender’s own accountant, whose determination is “final and binding”. Given section 3, this is the clause you would need to use — and it sends the dispute to the other side’s advisers. Press for an independent auditor agreed between the parties.'],
  ['Loan 12.1.7','Negative pledge over all your assets for the whole term. Check against any other facility or supplier arrangement you have.'],
  ['Loan 11','Broad audit and inspection rights over your books, at your cost, with failure to provide information a material breach.'],
  ['Pledge 7.1.6 / 7.1.11','You warrant the ceded claims are “free from dispute” with no set-offs or counterclaims, and indemnify the lender for any breach — an absolute warranty about how third parties will behave.'],
  ['Loan 1.16','The cooling-off clause is still drafted backwards: it keys off “the registered business premises of the Borrower” where s121 keys off the credit provider’s premises. As drafted it is unlikely to give you a usable 5-business-day right, and would expire before funding. Worth a one-word correction on principle.'],
  ['Loan 16.1 / Pledge 9.1','You pay all drafting, implementation and cancellation costs. See section 6.']
],{boldCol0:true}));

K.push(new Paragraph({children:[new PageBreak()]}));

// 8
K.push(H1('8.  Pre-signature verification — facts, not drafting'));
K.push(p('Confirm each before initialling. Signing warrants them.'));
K.push(num([r('Unencumbered title to all four pledged assets. ',{bold:true}),
  r('Pledge cl 7.1.1–7.1.2 warrant sole ownership and no prior encumbrance. Any existing finance on the Amarok or the CAT 416F makes that warranty false on signature.')]));
K.push(num([r('The TLB and rock hammer are in Zambia ',{bold:true}),
  r('(Annexure B). Pledging South African-law security over movables physically outside the country raises real perfection and enforcement questions — a pledge normally requires delivery. Flag to the attorney; also check whether their location affects the warranty in cl 7.1.8 that all pledged property complies with applicable law.')]));
K.push(num([r('The Amarok licence expires 31 August 2026 ',{bold:true}),
  r('per Annexure B — days away. Renew before signature.')]));
K.push(num([r('The Sale of Shares Agreement of 27 November 2025. ',{bold:true}),
  r('Read clause 2(c) yourself. Loan cl 8.4 and Pledge Annexure A both hinge on it, and the amounts and timing of that lump sum drive whether this facility is serviceable at all.')]));
K.push(num([r('Annexure A requires four third-party signatures ',{bold:true}),
  r('within 7 days of signature (Pledge cl 4.3). If Mila, Megan, Liam Daniel De Jongh and Andries Jacobus Nel do not sign, you are in breach of the Pledge. Confirm they are willing before you sign, not after.')]));
K.push(num([r('The affordability assessment and pre-agreement quotation ',{bold:true}),
  r('(s81(2), s92 NCA) — the lender’s own draft comments flagged both as outstanding. Confirm they are complete and that you have received the pre-agreement statement and quotation.')]));
K.push(num([r('SB Innovative’s authority. ',{bold:true}),
  r('The AOD signature block requires a warranted authorised signatory. A directors’ resolution is needed, and the directors should be satisfied the company is receiving value for the R74 750 before passing it.')]));

// 9
K.push(H1('9.  Suggested reply to Plane Tree'));
K.push(...quote('Duncan / Toivo,','')); 
K.push(...quote('Thank you for the final documents. We are close, and we appreciate the cure periods in clause 14 and the limits now placed on the power of attorney in the Pledge.',''));
K.push(...quote('Four items before we can sign:',''));
K.push(...quote('1. Cost of Credit. Please send the amortisation schedule behind the disclosed interest of R588,399.99, showing the assumed drawdown date and how each R100,000 instalment is applied. On clauses 8 and 9 as drafted we calculate interest of roughly R405,000, not R588,000. Please also itemise the R99,613.33 recorded as “Fees & Charges”, which sits directly beneath NIL entries for both the service fee and the initiation fee.',''));
K.push(...quote('2. First instalment date. Clause 8.1.1 falls due on 31 August, before clause 6.2 requires the advance to be paid. Please amend so the first instalment falls on the last day of the first full calendar month after actual drawdown, with subsequent dates following. We would also ask for a long-stop date on funding.',''));
K.push(...quote('3. Sale of Shares cession. We are comfortable with the cession as security. Please add (a) automatic re-cession on full settlement with written notice to the purchasers within 5 business days, and (b) an obligation to account to the borrower for any amount received in excess of the Aggregate Debt.',''));
K.push(...quote('4. AOD. We are not able to put SB Innovative Construction (Pty) Ltd forward as debtor for the costs of drafting Mr Bos’s personal facility. The company is not a party to the loan and receives no benefit from it. Please confirm how you would like to deal with the fee within the facility itself.',''));
K.push(...quote('Once these are settled we will revert with signature dates.','Draft only — not sent'));

// 10
K.push(H1('10.  Items requiring the attorney, not this memo'));
K.push(p('Ten items were flagged for legal verification in the 18 August memo and remain open. The most important for this signature decision:'));
K.push(bul([r('Whether s91 of the NCA pulls the Pledge in as a supplementary agreement, ',{bold:true}),
  r('notwithstanding that it never mentions the Act. This determines whether the “no notice, no court” enforcement clause in Pledge 5.1 survives. The authority relied on for this in the earlier memo (Absa Bank Ltd v Serfontein) has no confirmed neutral citation and must be verified before it is relied on.')]));
K.push(bul([r('Whether the disclosure defects in section 3 engage s92 / s100–102, ',{bold:true}),r('and if so what the consequence is.')]));
K.push(bul([r('Whether the ex parte consent to judgment in AOD clause 9 is enforceable, ',{bold:true}),
  r('and whether the NCA applies to SB Innovative at all — which turns on its asset value and turnover against the R1m threshold in s4.')]));
K.push(bul([r('Whether daily capitalisation of interest complies with Regulation 40.',{bold:true})]));
K.push(...callout('Conflict note',[
  [r('Labuschagne Attorneys (Niel de Jongh) must not be instructed on this matter. ',{bold:true,color:CRIT}),
   r('They are already conflict-flagged on the adviser directory, and are independently conflicted here because the counterparties to the ceded Sale of Shares Agreement are Mila, Megan and Liam Daniel De Jongh. Route to CST Law (HJ Taljaard).')]
],CRITBG,CRIT));

// approval
K.push(new Paragraph({children:[new PageBreak()]}));
K.push(H1('Required human approval'));
K.push(table([2600,6426],[
  ['Approver','Dreyer Hoffman (principal), with Tyron Bos as signatory'],
  ['Adviser sign-off needed','CST Law (HJ Taljaard) — before any signature. Labuschagne Attorneys (Niel de Jongh) CONFLICTED — do not instruct.'],
  ['Live holds affecting this','None (no 18A / GAAR content)'],
  ['Figures to verify before use','The R588 399.99 interest and R99 613.33 fees & charges disclosed by the lender; all amortisation figures in section 3.1 are model outputs on the agreement’s own terms and are pending the lender’s own schedule; the clause 2(c) lump sum under the Sale of Shares Agreement of 27 November 2025 has not been sighted.']
],{header:false,boldCol0:true}));
K.push(spacer(160));
K.push(new Paragraph({spacing:{before:60,after:120},
  border:{top:{style:BorderStyle.SINGLE,size:6,color:CRIT,space:8},bottom:{style:BorderStyle.SINGLE,size:6,color:CRIT,space:8}},
  shading:{type:'clear',fill:CRITBG,color:'auto'},
  children:[r('This draft is NOT executed, sent, or committed. No document has been signed. The reply in section 9 has NOT been sent.',{bold:true,color:CRIT})]}));
K.push(p('Prepared 22 August 2026 from the three final agreements circulated by Plane Tree Capital on 21 August 2026, compared against the 12/13 August drafts. Commercial and risk review only — not a legal opinion, and not a substitute for sign-off by our own attorney.',
  {size:17,color:MUT,italics:true}));

// ---------- DOC ----------
const doc = new Document({
  creator:'Habari / PI Advertising Holding Company',
  title:'Plane Tree Capital — final documents, signature report',
  description:'Borrower-side signature report on the final Loan Facility Agreement, Cession and Pledge, and AOD for legal fees. Draft — not for execution.',
  styles:{default:{document:{run:{font:'Calibri',size:20,color:INK}}}},
  numbering:{config:[
    {reference:'bul',levels:[
      {level:0,format:LevelFormat.BULLET,text:'•',alignment:AlignmentType.LEFT,
       style:{paragraph:{indent:{left:400,hanging:220}}}},
      {level:1,format:LevelFormat.BULLET,text:'◦',alignment:AlignmentType.LEFT,
       style:{paragraph:{indent:{left:760,hanging:220}}}}]},
    {reference:'num',levels:[
      {level:0,format:LevelFormat.DECIMAL,text:'%1.',alignment:AlignmentType.LEFT,
       style:{paragraph:{indent:{left:400,hanging:260}}}}]}
  ]},
  sections:[{
    properties:{page:{margin:{top:1440,bottom:1440,left:1440,right:1440}}},
    footers:{default:new Footer({children:[new Paragraph({
      alignment:AlignmentType.CENTER,
      border:{top:{style:BorderStyle.SINGLE,size:4,color:RULE,space:6}},
      children:[
        r('Plane Tree Capital — signature report  ·  DRAFT — not for execution  ·  page ',{size:15,color:MUT}),
        new TextRun({children:[PageNumber.CURRENT],size:15,color:MUT}),
        r(' of ',{size:15,color:MUT}),
        new TextRun({children:[PageNumber.TOTAL_PAGES],size:15,color:MUT})
      ]})]})},
    children:K
  }]
});

Packer.toBuffer(doc).then(b=>{
  fs.writeFileSync('sig-raw.docx', b);
  console.log('written', b.length, 'bytes;', K.length, 'blocks');
});
