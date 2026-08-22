const M = require('./build2.js');
const {K,p,r,H1,H2,H3,LBL,bul,num,quote,callout,chip,table,spacer,
       INK,MUT,ACC,CRIT,PRESS,RULE,SOFT,CRITBG,ACCBG,
       PageBreak,Paragraph,TextRun,AlignmentType,Document,Packer,Footer,PageNumber,LevelFormat,BorderStyle} = M;
const fs=require('fs');

// ---------- 6 ERRORS ----------
K.push(new Paragraph({children:[new PageBreak()]}));
K.push(H1('6.  Errors, blanks and things to verify before signature'));
K.push(H2('Factual errors — these matter, because we warrant their accuracy'));
K.push(table([6026,3000],[
  ['Issue','Where'],
  ['The Amarok has two different registration numbers. Loan cl 5.1.4.1.1 and Pledge cl 1.1.10.1 say HKK160K; Annexure B says HT22DTGP. Same VIN (WV1ZZZ2HZJA047809). One is wrong. A misdescribed asset weakens the pledge and breaches our accuracy warranty — and would defeat a special notarial bond on Ikea Trading.','Loan cl 5.1.4.1.1; Pledge cl 1.1.10.1 and Annexure B'],
  ['The furnace is described as "(brand new)" but also "Purchased Jan 2022". Inconsistent — and four years of depreciation is material to its value as security.','Annexure B'],
  ['"the Purchasers Nel" — stray word, appears three times.','Annexure A'],
  ['"the terms of this Agreement are in plan language" — should be "plain". Ironic in a clause designed to defeat a plain-language challenge.','Loan cl 12.1.4'],
  ['"determined by an the Lender’s auditor" and "pay such the Lender’s auditor’s charges" — broken grammar in the single most commercially significant clause of the Pledge.','Pledge cl 5.2.9'],
  ['"sell, transfer, release, remove, redirect or otherwise dispose of any or all of the Secured Property,;" — stray punctuation.','Pledge cl 6.1.2'],
  ['Refers to "any permitted debt expressly allowed in terms of this Agreement" — but the agreement contains no permitted-debt regime at all. Either add a schedule (useful to us) or delete.','Loan cl 6.4'],
  ['Their comment 37 flags that clause 2.2(c) of the underlying Sale of Shares Agreement describes Tyron (the Seller) as selling Naomi Street and Pebble Creek, and assumes this is a typo for "Purchaser". We must confirm this against the actual signed agreement. If it is not a typo, the cession is describing rights that may not exist as assumed.','Loan cl 5.1.4.2']
]));

K.push(H2('Blanks that must be completed before signature'));
K.push(bul('Borrower’s residential address, email address and bank account — both documents, and both domicilium tables'));
K.push(bul([r('TOTAL INTEREST, FEES AND CHARGES',{bold:true}),r(' — R[●], Loan Cost of Credit table')]));
K.push(bul([r('TOTAL COST OF CREDIT',{bold:true}),r(' — R[●], Loan Cost of Credit table')]));
K.push(bul('Lender’s complaints telephone number and complaints email — Loan cl 1.9'));
K.push(bul([r('"Address at which asset is stored" — blank for all four assets',{bold:true}),
  r(', Pledge Annexure B. Not cosmetic: Loan cl 1.10 records the NCA s97(2) duty to notify exactly this, so the schedule meant to record it leaves us technically non-compliant from day one.')]));
K.push(p([r('Do not sign while the Cost of Credit table reads R[●].',{bold:true}),
  r(' A disclosure document with its two headline numbers blank is not a disclosure — and their comment 7 concedes the ss92–93 pre-agreement statement and quotation position is unresolved.')]));

K.push(H2('Verify before Tyron signs anything'));
K.push(num([r('Is the Amarok subject to existing bank or instalment-sale finance? ',{bold:true}),
  r('If so, Pledge cl 7.1.1 ("sole and lawful owner") and cl 7.1.2 ("not previously encumbered") are false on signature.')]));
K.push(num([r('Same for the CAT 416F and the rock hammer. ',{bold:true}),
  r('Obtain settlement letters or written confirmation of unencumbered title for all four assets.')]));
K.push(num([r('Was the furnace bought subject to reservation of ownership or supplier credit? ',{bold:true}),
  r('Same warranty problem.')]));
K.push(num([r('Obtain and read the signed Sale of Shares Agreement of 27 November 2025. ',{bold:true}),
  r('We are ceding its proceeds outright and cannot assess cl 4.2 without seeing clause 2 and clause 2.2(c).')]));
K.push(num([r('Confirm whether the De Jonghs and Nel will actually sign Annexure A ',{bold:true}),
  r('before we contract to procure it within 7 days.')]));
K.push(num([r('Confirm any existing SARS position ',{bold:true}),
  r('before warranting full tax compliance under Loan cl 12.1.6.')]));

// ---------- 7 POSITION ----------
K.push(H1('7.  Negotiating position'));
K.push(H2('Must have — do not sign without these'));
K.push(num([r('Payment dates keyed to the Drawdown Date',{bold:true}),r(', not fixed calendar dates.  (Loan cl 8.1)')]));
K.push(num([r('Materiality qualifier and a 10 business day cure period',{bold:true}),r(' on all non-payment Events of Default.  (Loan cl 14.1)')]));
K.push(num([r('Pledge cl 4.2 changed to in securitatem debiti',{bold:true}),r(' — or express re-cession, surplus-accounting and a cap at the Secured Obligations.')]));
K.push(num([r('An express ordinary-course carve-out',{bold:true}),r(' permitting collection of book debts and operation of the bank account until an Event of Default is continuing.  (Pledge cl 6.1)')]));
K.push(num([r('A clause making the Pledge subject to the NCA',{bold:true}),r(', with the NCA and Loan cl 1 and 19 prevailing.  (Pledge cl 5.1)')]));
K.push(num([r('A release and re-cession clause',{bold:true}),r(' on discharge, within 10 business days, at their cost.  (Pledge — new clause)')]));
K.push(num([r('Interest not compounded daily',{bold:true}),r(', the effective annual rate on the face of the agreement, and the Cost of Credit table completed.  (Loan cl 1 and 9)')]));

K.push(H2('Strongly press'));
K.push(bul('Perfection obligations (delivery, NATIS, attornment) only after a continuing Event of Default.  (Pledge cl 4.13–4.14)'));
K.push(bul('Power of attorney narrowed and made post-default only.  (Pledge cl 6.3)'));
K.push(bul('Independent expert for balance disputes and for fair-market valuation; costs shared.  (Loan cl 18; Pledge cl 5.2.9)'));
K.push(bul('Warranties qualified by knowledge, materiality and disclosure; indemnity capped at the Aggregate Debt.  (Pledge cl 7.1)'));
K.push(bul('Callback verification and a negligence carve-out on the electronic-instructions indemnity.  (Loan cl 15)'));
K.push(bul('Negative pledge carved out for asset finance, existing security and a de-minimis basket.  (Loan cl 12.1.7)'));
K.push(bul('Annexure A obligation reduced to reasonable endeavours; non-signature expressly not a default.  (Pledge cl 4.3)'));
K.push(bul('Restriction on Plane Tree ceding the facility and security onward.  (Loan cl 21.5; Pledge cl 12.5)'));
K.push(bul('Longstop date on the suspensive conditions, and "Event of Default" deleted from Loan cl 5.3.'));

K.push(H2('Trade away if needed'));
K.push(p('The plain-language warranty (cl 12.1.4), the contra proferentem exclusion, the counterparts and witness provisions, and most of the interpretation clause. These cost us little and give them the sense of a negotiation.'));

K.push(H2('A structural question worth putting on the table'));
K.push(p([r('Almost every problem above flows from one decision: '),
  r('this is a personal loan to a natural person for what is plainly a business transaction.',{bold:true}),
  r(' If the copper venture sits in a company, borrowing through that company — with a capped, defined suretyship from Tyron if they insist — would ring-fence the exposure, remove the personal negative pledge over all his assets, take the reckless-credit and affordability problem off the table for both sides, and dispose of the s100 legal-fees problem cleanly.')]));
K.push(p([r('But note the trade-off honestly: the NCA protections that currently apply '),r('because',{italics:true}),
  r(' the borrower is a natural person — s129 notice, debt review, in duplum, the prescribed rate caps — would fall away for a company above the NCA threshold. '),
  r('This is a judgement call for Dreyer and our attorney, not one to settle in correspondence with Plane Tree.',{bold:true})]));

// ---------- 8 REPLY ----------
K.push(H1('8.  Suggested reply to Toivo'));
K.push(p('Hold the substantive mark-up until our attorney has been through this. Reply now only on the fee request, and to buy time.'));
const eb={style:BorderStyle.SINGLE,size:6,color:RULE,space:10};
const email=[
  'Hi Toivo,',
  'Thanks for sending these through, and for the detail in the drafts.',
  'We’re working through both agreements with our attorney and will come back to you with a consolidated mark-up rather than piecemeal comments. Realistically that will be with you by [date].',
  'Two things in the meantime.',
  'First, could you please complete the Cost of Credit table before we go further — TOTAL INTEREST, FEES AND CHARGES and TOTAL COST OF CREDIT are both still shown as R[●], and we’d also like the effective annual rate stated alongside the nominal 21%, given interest is compounding daily. On our modelling the structure leaves a balloon of roughly R1.63m falling due on 31 August 2027, which we’d want reflected clearly on the face of the agreement. Could you also confirm whether a pre-agreement statement and quotation under sections 92 and 93 have been issued.',
  'Second, on the AOD and invoice for legal fees — before we provide company details, could you let us know (a) the quantum, (b) the basis on which the Borrower is liable for the Lender’s drafting costs given section 100 of the NCA, and (c) why this is being handled through a separate acknowledgement of debt rather than disclosed in the Cost of Credit table, which currently records both the initiation fee and the service fee as nil. We’d prefer to keep everything inside the one agreement.',
  'Happy to jump on a call if that’s quicker.',
  'Kind regards,'
];
K.push(new Paragraph({spacing:{before:100,after:60},border:{top:eb,left:eb,right:eb},
  shading:{type:'clear',fill:SOFT,color:'auto'},
  children:[r('DRAFT · TO TOIVO@PLANE-TREE.COM · NOT SENT',{size:15,bold:true,color:MUT,characterSpacing:30})]}));
email.forEach((t,i)=>K.push(new Paragraph({spacing:{after:i===email.length-1?0:120,line:280},
  border:{left:eb,bottom:i===email.length-1?eb:undefined,right:eb},
  shading:{type:'clear',fill:SOFT,color:'auto'},
  children:[r(t,{size:20})]})));
K.push(spacer(160));
K.push(...callout('What this does',[
  'Puts the s100 problem back on their side of the table without accusing anyone, declines the AOD without saying "no", uses their own nil-fee disclosure against the request, and signals we have modelled the deal properly — which changes the tone of everything that follows.',
  [r('Do not send company details, and do not sign an AOD for legal fees, until our attorney has advised.',{bold:true,color:CRIT})]
],CRITBG,CRIT));

fs.writeFileSync('/tmp/part3.flag','ok');
module.exports=M;
