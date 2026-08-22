const M = require('./build3.js');
const {K,p,r,H1,H2,H3,LBL,bul,num,quote,callout,chip,table,spacer,
       INK,MUT,ACC,CRIT,PRESS,RULE,SOFT,CRITBG,ACCBG,
       PageBreak,Paragraph,TextRun,AlignmentType,Document,Packer,Footer,PageNumber,LevelFormat,BorderStyle} = M;
const fs=require('fs');

// ---------- 9 AUTHORITIES ----------
K.push(new Paragraph({children:[new PageBreak()]}));
K.push(H1('9.  Legal position — authorities relied on, and what is not verified'));
K.push(...callout('Read this before citing anything below',[
  [r('Two research passes were run against South African primary sources. The research tooling could not open primary documents directly — SAFLII, gov.za and law-firm sites were all blocked at the network layer — so everything below comes from search-index extraction of those sources rather than from reading the judgments and the Gazette. '),
   r('It is good enough to negotiate from and to brief our attorney with. It is not good enough to cite in correspondence without CST Law confirming the citations first.',{bold:true})]
],CRITBG,CRIT));

K.push(H2('9.1  Interest — why Regulation 40 is the argument, not the rate cap'));
K.push(table([2600,6426],[
  ['Point','Position'],
  ['Reg 42 maximum rates (agreements from 6 May 2016, GN R1080 GG 39379)','Mortgage RR+12% · Credit facility RR+14% · Unsecured RR+21% · Developmental RR+27% · Other credit agreement RR+17% · Short-term 5%/month first loan · Incidental 2%/month'],
  ['Repo rate','7.00% (prime 10.50%). Last MPC 23 July 2026 — hold, on a 4–2 split. Previous move 28 May 2026, +25bp from 6.75%.'],
  ['Resulting caps','Credit facility 21.00% · Other credit agreement 24.00%'],
  ['Reg 40 — capitalisation','Interest must be calculated daily but added to the deferred amount only once, at the end of the month. Daily capitalisation is not permitted.'],
  ['Nominal or effective?','Unresolved. No NCR circular, guidance note or reported decision found either way.']
],{boldCol0:true}));
K.push(spacer(120));
K.push(p('Three things follow, and one is a question for Plane Tree:'));
K.push(bul([r('Their attorney has applied the credit facility cap',{bold:true}),
  r(' (RR+14% = 21.00%). But this is a once-off R2.4m secured loan repayable in instalments, which looks much more like a secured loan or "other credit agreement" (RR+17% = 24.00%) than a credit facility under s8(3). Either their cap reasoning is wrong, or the agreement is mis-classified. Worth asking — not to invite a higher rate, but because it tells us how carefully this has been thought through.')]));
K.push(bul([r('At 21.00% the headline sits exactly on the credit-facility cap. There is zero headroom',{bold:true}),
  r(' — and the cap is fixed by the repo rate at the time credit is granted, not today’s. If drawdown had fallen before 28 May 2026 (repo 6.75%) the cap would have been 20.75% and 21% would already have been over it. Establish the grant date before running any of this arithmetic.')]));
K.push(bul([r('So do not argue the cap — argue Reg 40.',{bold:true}),
  r(' Daily capitalisation is impermissible whatever the rate, and the excess it produces is an amount charged in contravention of s100(1)(c). In '),
  r('Loan Company (Pty) Ltd v NCR',{italics:true}),
  r(' [2025] ZASCA 40 the SCA measured a s100(1)(c)/(d) contravention by what was actually charged under the Reg 40 mechanics, not by the stated rate. Tribunal remedies in that line run to declaring agreements void, ordering refunds, and a s151 administrative fine. This argument does not depend on the unresolved nominal/effective question.')]));

K.push(H2('9.2  Authorities relied on elsewhere in this review'));
K.push(table([1500,5626,1900],[
  ['Area','Authority','Used at'],
  ['Charges and fees','NCR v National Consumer Tribunal [2025] ZASCA 132; 2026 (2) SA 455 (SCA) — s101(1) with s102(1) is a closed list; substance over label','3'],
  ['','Uys NO v NCR [2025] ZASCA 34 — structuring to avoid the NCA is not per se unlawful; simulation needs shared dishonest intent','3'],
  ['','Bayport Securitisation v University of Stellenbosch Law Clinic [2021] ZASCA 156 (CC leave refused) — collection costs are not litigation costs; s103(5) does not apply post-judgment','4.7'],
  ['','s103(5) — statutory in duplum is wider than the common-law rule: caps all of s101(1)(b)–(g) in aggregate at the unpaid principal as at the moment default occurs. Mapping: (f) is default administration charges, (g) is collection costs','4.7'],
  ['Enforcement and unlawful provisions','s130(3) — "despite any provision of law or contract to the contrary"; s130(4) requires adjournment','5.3'],
  ['','Chief Lesapo v North West Agricultural Bank [1999] ZACC 16; 2000 (1) SA 409 (CC) — seizure from a debtor in possession without a court order infringes s34 of the Constitution','5.3'],
  ['','Juglal NO v Shoprite Checkers 2004 (5) SA 248 (SCA) — parate executie clauses valid, but a court refuses effect to unconscionable implementation','5.3'],
  ['','Absa Bank Ltd v Serfontein (SCA, 10 Feb 2025) — separate AOD and POA an unlawful supplementary agreement under s91; s90(2)(j), (k), (a)(i); unseverable; sale void ab initio','3, 5.3, 5.7'],
  ['','s90(3)/(4) — an unlawful provision is void from inception; the court may sever it or declare the whole agreement unlawful','5.3'],
  ['','Ex parte Minister of Justice: In re Nedbank v Abstein Distributors [1995] ZASCA 40; 1995 (3) SA 1 (A) — a conclusive-proof clause authored by the creditor is void; prima facie clauses survive','4.5, 5.6'],
  ['','NCR v Standard Bank [2019] ZAGPJHC 182; 2019 (5) SA 512 (GJ) — common-law set-off ousted for NCA agreements by ss90(2)(n) and 124','5.11'],
  ['Cession and pledge','Grobler v Oosthuizen [2009] ZASCA 51; 2009 (5) SA 500 (SCA) — the two constructions; absent clear contrary intention the pledge construction applies; substance over form, following National Bank v Cohen’s Trustee 1911 AD 235','5.1'],
  ['','Picardi Hotels v Thekweni Properties [2008] ZASCA 128; 2009 (1) SA 493 (SCA) — a security cession deprives the cedent of the right to recover the ceded debt','5.1'],
  ['','First National Bank v Lynn NO [1995] ZASCA 158; 1996 (2) SA 339 (A) — a cession of future rights takes effect only as the right comes into existence','5.1'],
  ['','Vasco Dry Cleaners v Twycross 1979 (1) SA 603 (A) — constitutum possessorium not permitted; no delivery, no real security right','5.5'],
  ['','Ikea Trading und Design AG v BOE Bank [2004] ZASCA 27; 2005 (2) SA 7 (SCA) — a special notarial bond must describe property so it is "readily recognisable from the bond alone"','5.5'],
  ['','Development Bank of Southern Africa v Van Rensburg NO [2002] ZASCA 39 — a general notarial bond gives no real right until perfected by taking possession','5.5'],
  ['','Mapenduka v Ashington 1919 AD 343 · Graf v Buechel [2003] ZASCA 29 · Bock v Duburoro Investments [2003] ZASCA 94 — pactum commissorium void, but take-over at a fair price with surplus paid over is valid','5.6'],
  ['Reckless credit','s80(1)(a), s82, Reg 23A; s83(2)–(3) relief; s84 — during suspension no interest, fee or charge may be charged; s81(4) defence requires that requests for information were actually made','4.11']
]));

K.push(H2('9.3  What could NOT be verified — flag these to CST Law'));
K.push(p('Neither research pass could open a primary document. The following need checking against the Gazette and SAFLII before any of it goes into correspondence:'));
K.push(num([r('The Absa Bank Ltd v Serfontein citation. ',{bold:true,color:CRIT}),
  r('The name, date (10 February 2025) and holdings come from three independent law-firm commentaries; the neutral citation and case number were not found and the judgment was not read. This is the authority doing the most work in sections 3, 5.3 and 5.7 — confirm it first.')]));
K.push(num([r('Verbatim Regulation 40, ',{bold:true}),
  r('including sub-regulation numbering. The daily-calculation / monthly-capitalisation rule is consistently reported by the Tribunal and the SCA, but the primary text was never seen.')]));
K.push(num([r('The full s90(2) paragraph letters. ',{bold:true}),
  r('Only (a)(i), (c), (f), (j), (k) and (n) were confirmed; (l), (m) and (o) could not be identified. Do not cite paragraph letters without checking the Act.')]));
K.push(num([r('Regulation 42 entries for "other credit agreements" (RR+17%) and developmental credit (RR+27%) ',{bold:true}),
  r('— fewer corroborating sources than the mortgage, facility and unsecured entries. And whether Reg 42 has been amended at all since 6 May 2016 could not be confirmed as a negative.')]));
K.push(num([r('Whether the Reg 42 cap attaches to the nominal or the effective annual rate ',{bold:true}),
  r('— a genuine gap in the material. Hence the Regulation 40 framing in section 9.1.')]));
K.push(num([r('Exact wording of s101(2), the full s102(1) item list, s84, and the s92(3) binding period.',{bold:true})]));
K.push(num([r('No authority found either way on a valuation by the creditor’s own auditor. ',{bold:true}),
  r('The Abstein analogy in section 5.6 is reasoning, not a holding.')]));
K.push(num([r('No authority found on invoicing an associated company to circumvent s100. ',{bold:true}),
  r('The section 3 analysis is inferential from s90(2)(a)(i), s100(1), NCR v NCT and Uys.')]));
K.push(num([r('Current initiation and service fee caps for 2026 ',{bold:true}),
  r('— sources conflicted. Relevant if Plane Tree tries to reinstate a fee.')]));
K.push(num([r('s164 ',{bold:true}),
  r('— sources conflict on whether it is "Agents" or "Civil actions and jurisdiction". Do not cite it.')]));

// ---------- 10 FINE ----------
K.push(H1('10.  What is genuinely fine'));
K.push(p('To keep this balanced — the drafting is competent and much of it is unobjectionable:'));
K.push(bul([r('Early settlement without penalty',{bold:true}),r(' (cl 8.5) and the settlement-amount right (cl 1.12) are real and useful to us.')]));
K.push(bul([r('The NCA disclosure block',{bold:true}),r(' (cl 1), debt-counselling and complaints provisions are properly done, and cl 1’s statement that it prevails over conflicting provisions of the Loan Agreement is genuinely protective. We just need the same protection extended to the Pledge.')]));
K.push(bul([r('The s129/s130 enforcement procedure',{bold:true}),r(' in Loan cl 19.2–19.5 is correctly stated, including the concurrent running of the periods and the s129(3) reinstatement right at cl 19.7.')]));
K.push(bul([r('The payment waterfall',{bold:true}),r(' (interest, then fees, then capital — cl 8.3) is conventional, even if it is what drives the balloon.')]));
K.push(bul([r('Interest is fixed, not linked to prime',{bold:true}),r(' — genuinely good for us in a rising-rate environment.')]));
K.push(bul([r('Their attorney’s margin comments are candid',{bold:true}),r(' and, in two places, actively unhelpful to his own client. That suggests they are drafting in good faith rather than trying to slip something past us — a reason to negotiate hard, but not adversarially.')]));

// ---------- 11 APPROVAL ----------
K.push(H1('11.  Required human approval'));
const ab={style:BorderStyle.SINGLE,size:8,color:CRIT,space:10};
const arow=(label,body,warn)=>new Paragraph({spacing:{after:110,line:280},
  border:{left:ab,right:ab},shading:{type:'clear',fill:CRITBG,color:'auto'},
  children:[r(label+'  ',{bold:true,color:warn?CRIT:INK}),r(body,{color:warn?CRIT:INK})]});
K.push(new Paragraph({spacing:{before:60,after:110},border:{top:ab,left:ab,right:ab},
  shading:{type:'clear',fill:CRITBG,color:'auto'},
  children:[r('REQUIRED HUMAN APPROVAL',{size:18,bold:true,color:CRIT,characterSpacing:40})]}));
K.push(arow('Approver:','Dreyer Hoffman (principal).'));
K.push(arow('Adviser sign-off needed:','CST Law (HJ Taljaard) — primary legal. Must review before Tyron signs either document, and before any AOD or company details are provided for the legal-fee invoice.'));
K.push(arow('Conflict:','Labuschagne Attorneys (Niel de Jongh) must NOT be used on this matter — the counterparties to the ceded Sale of Shares Agreement are Mila, Megan and Liam Daniel De Jongh.',true));
K.push(arow('Live holds:','None of the standing holds apply directly. The Zambian Copper figures-verification gate applies to any IRR or return figure used to justify this cost of funds.'));
K.push(arow('Figures to verify:','The balloon at 31 Aug 2027 (~R1.63m) and total cost of credit (~R432k) are MODEL OUTPUTS from the agreement’s own terms — to be confirmed against Plane Tree’s own amortisation once they complete the Cost of Credit table. Repo rate 7.00% and the applicable maximum rate: their attorney asserts repo + 14% = 21% (the credit facility cap); if this is an "other credit agreement" the cap is repo + 17% = 24%. Classification and grant date both to be confirmed. Unencumbered title to all four pledged assets — NOT VERIFIED. Sale of Shares Agreement of 27 Nov 2025 — NOT SEEN.'));
K.push(arow('Legal authority:','The citations in section 9.2 come from search-index extraction, NOT from reading the judgments — primary sources were unreachable. Section 9.3 lists ten items to check before any of this goes into correspondence. In particular Absa Bank v Serfontein has NO CONFIRMED NEUTRAL CITATION.',true));
K.push(new Paragraph({spacing:{after:200},border:{left:ab,bottom:ab,right:ab},
  shading:{type:'clear',fill:CRITBG,color:'auto'},
  children:[r('This draft is NOT executed, sent, or committed.',{bold:true,color:CRIT})]}));
K.push(p('Prepared 18 August 2026 from the two draft agreements circulated by Plane Tree Capital, including the fourteen margin comments left in the files by the lender’s drafter. Commercial and risk review only — not a legal opinion, and not a substitute for sign-off by our own attorney.',
  {size:17,color:MUT,italics:true}));

// ---------- DOC ----------
const doc = new Document({
  creator:'Habari / PI Advertising Holding Company',
  title:'Plane Tree Capital facility and security package — borrower-side review',
  description:'Commercial and risk review of the Loan Facility Agreement and Agreement of Cession and Pledge circulated for Tyron Bos. Draft — not for execution.',
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
        r('Plane Tree Capital facility review  ·  DRAFT — not for execution  ·  page ',{size:15,color:MUT}),
        new TextRun({children:[PageNumber.CURRENT],size:15,color:MUT}),
        r(' of ',{size:15,color:MUT}),
        new TextRun({children:[PageNumber.TOTAL_PAGES],size:15,color:MUT})
      ]})]})},
    children:K
  }]
});

Packer.toBuffer(doc).then(b=>{
  fs.writeFileSync('Plane Tree Capital - facility review - DRAFT.docx', b);
  console.log('written', b.length, 'bytes;', K.length, 'blocks');
});
