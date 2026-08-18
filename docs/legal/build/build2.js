const M = require('./build.js');
const {K,p,r,H1,H2,H3,LBL,bul,num,quote,callout,chip,table,spacer,RULEP,
       INK,MUT,ACC,CRIT,PRESS,RULE,SOFT,CRITBG,ACCBG,
       PageBreak,Paragraph,TextRun,AlignmentType,Document,Packer,Footer,PageNumber,LevelFormat,BorderStyle} = M;
const fs=require('fs');

// ---------- 4 LOAN ----------
K.push(H1('4.  Loan Facility Agreement — provisions that harm us'));
K.push(p('Ranked by exposure. Three severity levels are used throughout: MUST CHANGE, PRESS HARD, RAISE & TRADE.',{color:MUT,size:18}));

K.push(H2('4.1  Fixed calendar payment dates vs. floating drawdown  (cl 5.1, 6.2, 8.1, 14.1.2)'));
K.push(p([chip('MUST CHANGE'),r(' Covered in section 2. The first instalment can fall due before funding. Fix: all dates keyed to the Drawdown Date; add a longstop date by which Plane Tree must fund, failing which we may walk away without cost.')]));

K.push(H2('4.2  "Any breach" is an Event of Default — no materiality, no cure period  (cl 14.1)'));
K.push(p([chip('MUST CHANGE'),r(' Clause 14.1.3 makes any breach of any term an Event of Default, and there is no remedy period anywhere in the agreement. Layered with:')]));
K.push(bul([r('cl 11.1.4',{bold:true}),r(' — any failure to provide "accurate, complete or timely" information is a material breach;')]));
K.push(bul([r('cl 14.1.9',{bold:true}),r(' — "does anything which may prejudice the Lender’s rights… or omits to take steps to prevent such prejudice" — open-ended and subjective;')]));
K.push(bul([r('cl 14.1.7',{bold:true}),r(' — "or becomes financially distressed", a Companies Act s128 concept with no defined meaning for a natural person.')]));
K.push(...callout('Ask for',[ 'A materiality qualifier and a 10 business day written remedy period for all non-payment breaches (5 for payment). Delete "financially distressed". Narrow or delete cl 14.1.9.' ]));

K.push(H2('4.3  Warranties we cannot truthfully give for twelve months  (cl 12.1)'));
K.push(p([chip('MUST CHANGE'),r(' Each is absolute and continuing, and breach is an Event of Default under cl 14.1.8.')]));
K.push(table([1100,2800,5126],[
  ['Clause','Warranty','Why it is dangerous'],
  ['12.1.6','Full tax compliance — all returns filed, all amounts paid to SARS','Any assessment, objection or late return, however small, becomes an untrue representation and accelerates the loan. Qualify to "in all material respects, save as disclosed in writing".'],
  ['12.1.3','"not over indebted"','Drafted to destroy our reckless-credit defence before it can be used — while their comment 31 admits the affordability assessment has not been done. Delete, or reduce to a statement of belief at signature only.'],
  ['12.1.7','No security over any asset in favour of any other creditor, for the whole term','Blanket negative pledge, no basket, no carve-outs. Freezes all other finance — including asset finance on new equipment — for 12+ months.'],
  ['12.1.4','"an experienced businessman… the terms are in plan language"','Drafted to defeat a plain-language challenge under NCA s64. Low cost to leave, but know what it is doing. (And it says "plan".)'],
  ['12.1.13','Capable of performing obligations under this agreement and every collateral agreement','Extends the warranty into agreements we may not fully control. Limit to this agreement.']
],{boldCol0:true}));

K.push(H2('4.4  Electronic instructions — we carry 100% of the fraud risk  (cl 15)'));
K.push(p([chip('MUST CHANGE'),r(' Plane Tree will act on an instruction '),r('"without verifying"',{bold:true}),
  r(' that it came from us, and we indemnify them for any loss arising from acting on an instruction that merely "appears to have been issued" by us. In the current business-email-compromise environment that is a live, uncapped exposure: a spoofed email redirecting a payment or changing banking details lands on us in full, even where a simple callback would have caught it.')]));
K.push(...callout('Ask for',[ 'Telephonic callback verification to a pre-agreed number for any payment instruction or change of banking details, and the Lender’s own negligence carved out of the indemnity.' ]));

K.push(H2('4.5  Disputes about what we owe are decided by their accountant  (cl 18)'));
K.push(p([chip('PRESS HARD'),r(' Any dispute about the Aggregate Debt, the interest or the rate goes to "the Lender’s accountant appointed to the review or audit of its financial statements", whose determination is "final and binding" and reviewable only for "manifest typographical and/or arithmetical error".')]));
K.push(p([r('That mechanic is probably void.',{bold:true}),
  r(' In '),r('Ex parte Minister of Justice: In re Nedbank v Abstein Distributors',{italics:true}),
  r(' 1995 (3) SA 1 (A) the Appellate Division held that a conclusive-proof clause of which the creditor is the author is per se contrary to public policy and void, because it precludes the debtor from challenging quantum. "The Lender’s accountant… final and binding" is the creditor’s own instrument producing a binding number.')]));
K.push(p([r('Distinguish cl 14.4: it says '),r('prima facie',{italics:true,bold:true}),
  r(' proof, which leaves rebuttal open and on Abstein survives. That one we can live with.')]));
K.push(...callout('Ask for',[ 'An independent expert nominated by SAICA (or the chairman of the relevant professional body) if the parties cannot agree; costs shared; both parties entitled to written representations; manifest error generally, not only arithmetic.' ]));

K.push(H2('4.6  Suspensive conditions run entirely their way  (cl 5)'));
K.push(p([chip('PRESS HARD')]));
K.push(bul([r('cl 5.1',{bold:true}),r(' — conditions must satisfy them within 14 days, "or such longer period as the Lender may, in its sole and absolute discretion, decide". We stay bound indefinitely while they decide.')]));
K.push(bul([r('cl 5.4',{bold:true}),r(' — they may waive any condition "with or without notice" to us. We may not know what agreement we are in.')]));
K.push(bul([r('cl 5.3',{bold:true}),r(' — our failure is "an Event of Default alternatively this Agreement shall not come into force". These are mutually exclusive and they pick. You cannot default on an agreement that never came into force.')]));
K.push(...callout('Ask for',[ 'A hard longstop date; either party free to walk away if unfulfilled; waiver on written notice; and "Event of Default" deleted from cl 5.3 — a failed suspensive condition should make the agreement lapse, nothing more.' ]));

K.push(H2('4.7  Attorney-and-own-client costs "irrespective of whether legal action results"  (cl 14.3)'));
K.push(p([chip('PRESS HARD'),r(' Costs on the highest scale, including pre-litigation costs, whether or not anything is ever litigated. The clause ignores a line the law draws:')]));
K.push(bul([r('Pre-litigation recovery costs are "collection costs"',{bold:true}),
  r(' under s101(1)(g), capped at the prescribed maximum and counted toward the s103(5) in duplum ceiling while we are in default. A pre-agreed consent to enforcement costs is separately caught by s90(2)(k).')]));
K.push(bul([r('Litigation costs sit outside that machinery',{bold:true}),
  r(' after Bayport Securitisation v University of Stellenbosch Law Clinic [2021] ZASCA 156 (leave to appeal refused by the Constitutional Court), which held collection costs do not include litigation fees. But an attorney-and-own-client stipulation still does not bind a court — costs remain in the court’s discretion, subject to taxation.')]));
K.push(...callout('Ask for',[ 'Split the clause. Pre-litigation costs "limited to the maximum permitted by ss101 and 103 of the NCA"; litigation costs "such costs as a court may award, on taxation"; and delete "irrespective of whether or not legal action results".' ]));

K.push(H2('4.8  Surety benefits renounced in a loan where we are the principal debtor  (cl 8.4)'));
K.push(p([chip('PRESS HARD'),r(' We renounce excussion, division and cession of actions — all surety defences. Tyron is the principal debtor, not a surety. Either this is copy-paste from a suretyship precedent, or it is laying groundwork to treat him as surety for someone else’s obligation later. Delete it; if a suretyship is genuinely intended it must be a separate, disclosed document. Note that under NCA s8(5) a suretyship securing a credit agreement is itself a credit agreement.')]));

K.push(H2('4.9  They can sell our debt to anyone; we can assign nothing  (Loan cl 21.5, Pledge cl 12.5)'));
K.push(p([chip('PRESS HARD'),r(' Loan cl 21.5 restricts our cession. Nothing restricts theirs — and Pledge cl 12.5 expressly provides that if Plane Tree cedes the loan, the entire security package follows "without need for notice to or prior consent of the Borrower". We could find this facility, and every pledge over Tyron’s assets, in the hands of a debt-collection house or a competitor without ever being told. Ask for written notice at minimum; ideally consent not unreasonably withheld, and a bar on cession to a party that is not a registered credit provider.')]));

K.push(H2('4.10  Three smaller ones worth raising'));
K.push(p([chip('RAISE & TRADE')]));
K.push(bul([r('s129 default notices by registered post (cl 13.3). ',{bold:true}),
  r('Registered post to an address nobody attends is still deemed delivery, and it starts the 10-business-day clock before they may litigate. Ask for email and registered post, running from the later of the two.')]));
K.push(bul([r('Shortfall risk with no control over the sale (cl 1.15). ',{bold:true}),
  r('They may sell by "any other commercially reasonable method determined by the Lender", with no obligation to obtain a valuation or set a reserve, and we carry the shortfall. Ask for an independent valuation before any sale, a reserve at not less than 70% of it, and 10 business days’ notice so we can find a buyer ourselves.')]));
K.push(bul([r('"Underlying Transaction" is undefined in substance. ',{bold:true}),
  r('Defined only as "the investments and underlying projects relating to copper". Yet cl 6.3.4 requires proceeds be applied solely to it, cl 14.1.3 makes any breach a default, and the Pledge uses the same phrase to sweep in every book debt "in connection with any Underlying Transaction". Schedule the specific transaction and define the term by reference to that schedule.')]));

K.push(H2('4.11  Missing NCA prerequisites — their problem, our leverage'));
K.push(p('Their comment 7 concedes the pre-agreement statement and quotation required by NCA ss92–93 may not have been given, and notes: "A credit agreement cannot be entered into without it." Their comment 31 concedes the s81 affordability assessment has not been done and warns "a failure to do so may render the credit agreement void and/or reckless credit."'));
K.push(p([r('Calibrate the s92 point honestly. ',{bold:true}),
  r('A s92 breach is not among the grounds in NCA s89 that make a credit agreement unlawful. So it is prohibited conduct — NCR complaint, Tribunal referral, compliance notice, s151 fine — rather than something that voids the agreement of itself. Real leverage in negotiation and a real problem for Plane Tree’s compliance record; not a get-out.')]));
K.push(p([r('The reckless-credit point is the one with teeth. ',{bold:true}),
  r('Under s80(1)(a) an agreement is reckless if the credit provider failed to conduct the s81(2) assessment, "irrespective of what the outcome of such an assessment might have concluded". A warranty from us cannot cure their omission — and s90(2)(b) makes void any provision purporting to waive or deprive a consumer of a right under the Act. Their s81(4) defence requires that requests for information were actually made in a genuine assessment; a credit provider that conducted no assessment has none to point to. Relief under s83(2)–(3) runs to setting aside our rights and obligations or suspending the agreement — and during a suspension no interest, fee or charge may be charged at all.')]));

// ---------- 5 PLEDGE ----------
K.push(new Paragraph({children:[new PageBreak()]}));
K.push(H1('5.  Pledge and Cession of Claims — provisions that harm us'));

K.push(H2('5.1  The out-and-out cession of the Sale of Shares proceeds  (cl 4.2, 4.4, Annexure A)'));
K.push(p([chip('MUST CHANGE'),r(' This is the most damaging clause in the package.')]));
K.push(p([r('Everything else in the document is ceded '),r('in securitatem debiti',{italics:true}),
  r(' — as security, ownership stays with Tyron. But cl 4.2 alone cedes the De Jongh / Nel share-sale proceeds '),
  r('"out and out on an outright basis"',{bold:true}),
  r(' — an absolute transfer of the claim, effective from signature date, not on default.')]));
K.push(bul([r('Those proceeds stop being Tyron’s asset the moment he signs — before a cent is drawn down.')]));
K.push(bul([r('There is no re-cession clause, and that matters more than it looks. ',{bold:true}),
  r('SA law recognises two constructions ('),r('Grobler v Oosthuizen',{italics:true}),
  r(' [2009] ZASCA 51). Under the pledge construction the cedent keeps the reversionary interest and the claim reverts automatically on settlement. Under the out-and-out construction the cessionary takes full title and the cedent has only a personal contractual claim to have the right re-ceded. cl 4.9 ("until the Lender confirms in writing") is enough for the first and useless for the second. Substance can override a label ('),
  r('National Bank v Cohen’s Trustee',{italics:true}),
  r(' 1911 AD 235), but "out and out on an outright basis" is about as clear a contrary intention as can be drafted, so we cannot count on re-characterisation.')]));
K.push(bul([r('The risk nobody has flagged: if Plane Tree becomes insolvent, we lose the lot. ',{bold:true,color:CRIT}),
  r('On the out-and-out construction the ceded claim falls into the cessionary’s insolvent estate, and the cedent ranks as a concurrent creditor for its re-cession claim. Under the pledge construction it does not. If the share sale is worth materially more than R2.4m, Plane Tree’s insolvency would cost us the entire excess. This is the strongest single reason to insist on cl 4.2 being changed.')]));
K.push(bul([r('There is no surplus-accounting clause for this cession. ',{bold:true}),
  r('At common law a cessionary who realises more than the secured debt must refund the excess — but that duty is default, not peremptory, and can be contracted out of, and we found no decided case on an out-and-out cession silent on the point. cl 5.3 does oblige Plane Tree to credit net proceeds, but it sits in the enforcement clause and speaks to realising Secured Property after an Event of Default; the cl 4.2 cession operates from signature date and sits outside it.')]));
K.push(bul([r('We also lose standing to sue the De Jonghs. ',{bold:true}),
  r('On '),r('Picardi Hotels v Thekweni Properties',{italics:true}),
  r(' [2008] ZASCA 128 a security cession deprives the cedent of the right to recover the ceded debt. If Plane Tree is passive and the claim prescribes, Tyron has no direct remedy against the purchasers.')]));
K.push(bul([r('cl 4.4 then requires that if the De Jonghs pay Tyron directly, he must hand the money to Plane Tree within 48 hours — regardless of whether anything is due.')]));
K.push(...callout('Ask for — non-negotiable, in order of preference',[
  [r('1.  Change cl 4.2 to a cession '),r('in securitatem debiti',{italics:true}),r(', on the same footing as cl 4.1; or')],
  [r('2.  If they insist on out-and-out, then all three of: (i) an express automatic re-cession to the Borrower on discharge of the Secured Obligations, at Plane Tree’s cost and within 10 business days; (ii) an express obligation to account for and pay over any surplus above the Aggregate Debt within 5 business days of receipt; and (iii) an express statement that the cession secures only the Secured Obligations and no more.')]
],CRITBG,CRIT));

K.push(H2('5.2  No "ordinary course" carve-out — we cannot run the business  (cl 4.1.1–4.1.2, 6.1)'));
K.push(p([chip('MUST CHANGE'),r(' The Ceded Claims include all present and future book debts and "all of the Borrower’s claims against the Borrower’s bankers for the net proceeds standing to the credit of the Borrower’s Account" — his bank balance. Clause 6.1 then prohibits, without prior written consent:')]));
K.push(bul([r('cl 6.1.2',{bold:true}),r(' — selling, transferring, releasing, removing, redirecting or disposing of any Secured Property;')]));
K.push(bul([r('cl 6.1.3',{bold:true}),r(' — any action, or omission, that "will, might or tends to in any way adversely affect" their interest;')]));
K.push(bul([r('cl 6.1.6',{bold:true}),r(' — "divert, redirect, withdraw, transfer, set off, compromise or otherwise deal with" any payment, proceeds, receivable or other amount other than per "the payment flow approved by the Lender".')]));
K.push(p('There is no ordinary-course permission anywhere in the document, and no payment flow has been agreed or attached. Read literally, from signature date Tyron may not collect a debtor or draw on his own bank account. A court would strain to avoid that reading. We should never rely on a court straining.'));
K.push(...callout('Ask for — non-negotiable',[
  'An express clause permitting the Borrower to collect the Ceded Claims and to operate the Borrower’s Account in the ordinary course of business, and to retain and apply the proceeds, until an Event of Default has occurred and is continuing and Plane Tree has given written notice invoking the cession. This is standard in every properly drafted security cession; its absence here is conspicuous.'
],CRITBG,CRIT));

K.push(H2('5.3  Enforcement "without notice and without any court"  (cl 5.1)'));
K.push(p([chip('MUST CHANGE'),r(' cl 5.1: on an Event of Default the security becomes "immediately enforceable by the Lender in its discretion without the need for prior notice to the Borrower or any prior authorisation from any court or arbitrator."')]));
K.push(p([r('This clause is unenforceable, and probably void. Three independent reasons:',{bold:true})]));
K.push(num([r('NCA s130(3) overrides it by its own terms. ',{bold:true}),
  r('It provides that "despite any provision of law or contract to the contrary", a court may determine a matter on an NCA credit agreement only if satisfied that the s127, s129 or s131 procedures have been complied with; s130(4) requires the court to adjourn otherwise. No drafting can get around a provision that expressly anticipates contrary drafting.')]));
K.push(num([r('Self-help seizure is unconstitutional. ',{bold:true}),
  r('In '),r('Chief Lesapo v North West Agricultural Bank',{italics:true}),
  r(' [1999] ZACC 16 the Constitutional Court struck down a statute allowing a creditor to attach and sell a defaulting debtor’s property on its own authority: taking property from a debtor in possession without a court order is self-help and infringes s34 of the Constitution. All four pledged assets are in Tyron’s possession.')]));
K.push(num([r('It is an unlawful provision under s90. ',{bold:true}),
  r('A term whose effect is to dispense with s129/s130/s131 defeats the purposes of the Act (s90(2)(a)(i)) and is caught by the s90(2)(k) family. Under s90(3) it is void from inception, and under s90(4) a court may sever it or declare the whole agreement unlawful.')]));
K.push(p([r('And the "the NCA isn’t mentioned" gap cuts the opposite way to how it first looks. ',{bold:true}),
  r('The words "National Credit Act" and "NCA" appear nowhere in the Pledge, and the Loan Agreement’s cl 1 prevalence clause does not reach a separate contract. But NCA s91(a) provides that a credit provider must not require or induce a consumer to enter a supplementary agreement containing a provision that would be unlawful if it were in a credit agreement. A pledge and cession taken by the credit provider from the same consumer as a condition of the credit is the paradigm supplementary agreement — so the NCA reaches this document whether or not it says so. That was decided on closely comparable facts in '),
  r('Absa Bank Ltd v Serfontein',{italics:true}),r(' (SCA, 10 February 2025).')]));
K.push(...callout('The argument to make',[
  [r('We should not be frightened by cl 5.1 — it will not do what it says. More usefully, '),
   r('Plane Tree should be more worried about it than we are',{bold:true}),
   r(': on s90(4) an unseverable cluster of unlawful terms in this document (cl 5.1, the cl 6.3 power of attorney, the cl 5.2.9 auditor valuation) could take the entire security package down with it, leaving them unsecured. It is in their own interest to fix.')],
  [r('Fix — cheap for them to give: ',{bold:true}),
   r('insert "This Agreement is subject to the National Credit Act 34 of 2005. To the extent of any conflict between this Agreement and the National Credit Act, or clauses 1 or 19 of the Loan Facility Agreement, the National Credit Act and those clauses shall prevail."')]
]));

K.push(H2('5.4  Perfection on demand — they can take the operating equipment at any time  (cl 4.13, 4.14)'));
K.push(p([chip('MUST CHANGE'),r(' cl 4.13 obliges us, immediately upon request and with no reference to default, to procure physical or constructive delivery, control, attornment, endorsement of documents and release instructions over the Pledged Property. cl 4.14 requires original NATIS documents on request. The Pledged Property is not idle collateral — it is the Amarok, the 1TPH induction furnace, the CAT 416F backhoe loader, the rock hammer, and "its inventory from time to time". That is the operating plant. A perfection demand made before any default would stop the business, which would then cause a default.')]));
K.push(...callout('Ask for',[ 'Every perfection obligation exercisable only after an Event of Default that is continuing. Before that, we deliver copies of documents, not possession.' ]));

K.push(H2('5.5  The pledge creates no real security at all — over anything  (cl 1.1.10.5)'));
K.push(p([chip('PRESS HARD'),r(' Under South African law a pledge of movables requires delivery to be perfected, and '),
  r('constitutum possessorium',{italics:true}),r(' is not permitted: in '),
  r('Vasco Dry Cleaners v Twycross',{italics:true}),
  r(' 1979 (1) SA 603 (A) the Appellate Division held that a "pledge" where the article remains with the pledgor creates no real security right at all. That is true here not just of the inventory but of all four identified assets, which stay in Tyron’s possession. Plane Tree therefore has, today, a personal right only. This is why cl 4.13 is drafted so aggressively — the delivery demand is the whole security. Expect that to be where the pressure comes from, and expect it early.')]));
K.push(...callout('The constructive counter-offer',[
  [r('A '),r('special notarial bond',{bold:true}),
   r(' over the four identified assets under s1(1) of the Security by Means of Movable Property Act 57 of 1993, which deems specified movables pledged notwithstanding non-delivery once registered. It gives them registrable, real security without stripping us of the operating plant — a better outcome for both sides than a perfection fight.')],
  [r('Two caveats: '),r('Ikea Trading und Design AG v BOE Bank',{italics:true}),
   r(' [2004] ZASCA 27 requires the assets to be "readily recognisable from the bond alone", so the VIN, engine and serial descriptions must be exact (see the Amarok registration error in section 6) — and fluctuating inventory will not satisfy that test, so stock cannot go into a special notarial bond. Offer the four assets; resist the inventory.')]
]));

K.push(H2('5.6  They may take our assets into their own name, valued by their own auditor  (cl 5.2.9)'));
K.push(p([chip('PRESS HARD'),r(' Plane Tree may elect to transfer the Secured Property into its own name as beneficial owner at "fair market value". A '),
  r('pactum commissorium',{italics:true}),
  r(' — a creditor simply keeping the security on default — is void. But a creditor taking the pledge over at a fair price, crediting the debtor with that value and paying over the surplus, is valid: '),
  r('Mapenduka v Ashington',{italics:true}),r(' 1919 AD 343, and the "quasi-conditional sale" recognised in '),
  r('Graf v Buechel',{italics:true}),r(' [2003] ZASCA 29 and applied in '),
  r('Bock v Duburoro Investments',{italics:true}),r(' [2003] ZASCA 94.')]));
K.push(p([r('So the structure is sound in principle. The load-bearing element is the fairness of the valuation',{bold:true}),
  r(' — which is exactly what was contested in Bock. And here: the valuer, failing agreement in five business days, is "the Lender’s auditor"; we pay that auditor’s fees; and the same auditor is the cl 18 arbiter of what we owe. The party enforcing chooses the valuer, we fund the valuer, and the valuer’s number is final. On Abstein reasoning (section 4.5) a binding determination authored by the creditor is vulnerable — and if the fair-value safeguard is illusory, the arrangement collapses back into a void pactum commissorium. That is a risk for them as much as us, which makes it a realistic ask.')]));
K.push(...callout('Ask for',[ 'An independent valuer jointly appointed, or nominated by the relevant professional body if agreement fails within 10 business days; costs shared; and a right for us to obtain and submit a counter-valuation.' ]));

K.push(H2('5.7  Irrevocable power of attorney in rem suam to any director of the Lender  (cl 6.3)'));
K.push(p([chip('PRESS HARD')]));
K.push(...quote('The Borrower hereby irrevocably appoints any director of the Lender as its agent with power of attorney in rem suam to be its lawful attorney and agent, to sign all such documents and do all such things as may be necessary to give effect to this Agreement.','Pledge cl 6.3'));
K.push(p('Unlimited in subject matter, unlimited in time, irrevocable, exercisable before any default, and held by any director. It would let a Plane Tree director sign documents in Tyron’s own name.'));
K.push(p([r('This is not merely aggressive — on current SCA authority it is likely unlawful. ',{bold:true}),
  r('In '),r('Absa Bank Ltd v Serfontein',{italics:true}),
  r(' (SCA, 10 February 2025) an acknowledgement of debt incorporating a power of attorney, giving the bank an irrevocable ability to execute without recourse to court, was held to fall within s90(2)(k) and s90(2)(j), with the NCA-exclusion element contravening s90(2)(a)(i). The provisions were held unseverable; the agreement was declared unlawful and the resulting sale void from the outset. An in rem suam power of attorney is by definition irrevocable and in the grantee’s own interest, which aggravates rather than cures the problem. (Citation to be confirmed — see section 9.3.)')]));
K.push(...callout('Ask for',[ 'Exercisable only after an Event of Default that is continuing; confined to specified perfection and transfer documents we have already failed to sign within 5 business days of written request; written notice of each exercise. And put the s90(2)(j)/(k) point to them — a compliance-conscious registered credit provider will drop this rather than defend it.' ]));

K.push(H2('5.8  Warranties that cannot be kept, behind an uncapped indemnity  (cl 7.1)'));
K.push(p([chip('PRESS HARD')]));
K.push(table([1100,3400,4526],[
  ['Clause','Warranty','Problem'],
  ['7.1.6','Ceded Claims are "valid, enforceable, and free from dispute… no existing or threatened claims, set-offs, counterclaims, defences"','The Ceded Claims include all future book debts. Nobody can warrant that no future customer will ever dispute an invoice. Every disputed invoice is a breach, then a default, then acceleration. Qualify to "so far as the Borrower is aware, as at Signature Date", limited to material claims.'],
  ['7.1.1 / 7.1.2','Sole and lawful owner; nothing previously encumbered','Must be verified before signature. If the Amarok or the CAT is under an instalment-sale or bank finance agreement, this warranty is false on day one and exposes Tyron to a misrepresentation claim, not just a breach.'],
  ['7.1.8','All Pledged Property "complies and will comply with all applicable laws, licensing… health and safety… storage and transport requirements"','An absolute, forward-looking regulatory warranty over an 800 kW induction furnace and heavy plant. Qualify to "in all material respects, so far as the Borrower is aware".'],
  ['7.1.11','Indemnity for any loss from breach of any of the above','Uncapped, and sits on top of impossible warranties — potential liability well beyond R2.4m. Cap at the Aggregate Debt; exclude consequential loss; carve out Plane Tree’s own negligence.']
],{boldCol0:true}));
K.push(p('Note the internal contradiction: cl 4.7 contemplates that some Secured Property may already be encumbered (and cedes the reversionary interest), while cl 7.1.2 warrants that none of it is. They can rely on whichever suits them. Make cl 7.1.2 expressly subject to a disclosure schedule.'));

K.push(H2('5.9  We must deliver a third party’s signature within 7 days  (cl 4.3, Annexure A)'));
K.push(p([chip('PRESS HARD'),r(' cl 4.3 obliges us to procure that Mila De Jongh, Megan De Jongh, Liam Daniel De Jongh and Andries Jacobus Nel sign the Annexure A acknowledgement within 7 days of signature. They are not parties to this agreement and are perfectly entitled to refuse. If they refuse, we breach the Pledge, which is an Event of Default under the Loan, which accelerates R2.4m. We are being made to guarantee the conduct of people we do not control — and Annexure A also records that "the Borrower shall retain any obligations to the Purchasers": we keep the burden of that share sale and lose the benefit.')]));
K.push(...callout('Ask for',[ 'Reduce to "use reasonable endeavours to procure", extend to 20 business days, and state expressly that failure of the Purchasers to sign is not an Event of Default (their refusal may, at most, entitle Plane Tree to require substitute security).' ]));

K.push(H2('5.10  No release mechanism on repayment'));
K.push(p([chip('MUST CHANGE'),r(' There is no clause obliging Plane Tree, once the debt is paid, to release the security, cancel the cession, re-cede the ceded claims and return NATIS documents and documents of title. cl 4.9 makes the agreement run "until the Lender confirms in writing" — which puts the trigger entirely in their hands, with no deadline and no obligation to act. Long term, this is how a settled facility leaves a lingering encumbrance across an entire estate.')]));
K.push(...callout('Ask for — non-negotiable',[
  '"Within 10 business days of the Secured Obligations being discharged in full, the Lender shall, at its own cost, deliver to the Borrower a written release and cancellation of this Agreement, re-cede to the Borrower all Ceded Claims, release all Pledged Property, and return all documents of title, NATIS documents and other documents delivered to it under this Agreement."'
],CRITBG,CRIT));

K.push(H2('5.11  Two more worth raising'));
K.push(p([chip('RAISE & TRADE')]));
K.push(bul([r('No representations outside the document — including negligent ones (cl 12.4). ',{bold:true}),
  r('Neither party is bound by any representation not recorded in the agreement, "irrespective of whether the representation induced the Parties to conclude the Agreement and irrespective of whether it was made negligently or not". This kills any claim based on what Plane Tree told us verbally about flexibility on the balloon or the availability of refinance. Ask for fraudulent and reckless misrepresentation to be carved out expressly.')]));
K.push(bul([r('Continuing security survives Plane Tree’s own failures (cl 4.10). ',{bold:true}),
  r('The security survives "the Lender failing to procure or perfect any other form of collateral", "abandoning, terminating or releasing any other form of collateral", and "any other action or omission on the part of the Lender… which might prejudice or adversely affect the rights of the Borrower". Standard in bank documents, but press for a carve-out for gross negligence or wilful misconduct.')]));
K.push(bul([r('Set-off (cl 8.6.2, and Pledge cl 6.1.6). ',{bold:true}),
  r('On '),r('NCR v Standard Bank',{italics:true}),
  r(' [2019] ZAGPJHC 182 the common-law right of set-off does not apply to NCA credit agreements at all — ss90(2)(n) and 124 displace it. So the waiver is largely inert, and a clause conferring set-off on the credit provider would be unlawful.')]));

fs.writeFileSync('/tmp/part2.flag','ok');
module.exports = M;
