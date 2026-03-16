const PROGRAMS = {
      1: { id: 1, name: "CalFresh / Supplemental Nutrition Assistance Program (SNAP)", description: "Pre-loaded debit card for food purchases.", category: "food", icon: "leaf", link: "https://www.getcalfresh.org/" },
      2: { id: 2, name: "Unemployment Benefits (EDD)", description: "Temporary income for people who meet each of the following criteria:\nTotally or partially unemployed\nUnemployed through no fault of your own\nPhysically able to work\nAvailable for work\nRead and willing to accept work immediately.", category: "income", icon: "dollar", link: "https://edd.ca.gov/Unemployment/Filing_a_Claim.htm" },
      3: { id: 3, name: "Supplemental Security Income (SSI)", description: "Income for people who have \"limited income,\" \"limited resources,\" and meet one of the following criteria: aged 65 and older, blind, or disabled.  Please note that there is a complicated equation for calculating \"limited income\" and \"limited resources.\"", category: "income", icon: "dollar", link: "https://www.ssa.gov/benefits/ssi/#anchor3" },
      4: { id: 4, name: "Social Security Disability Insurance (SSDI)", description: "Income for people who have accrued enough Social Security credits and are either permanently or temporarily disabled.", category: "income", icon: "dollar", link: "https://www.ssa.gov/benefits/disability/" },
      5: { id: 5, name: "Medi-Cal (Medicaid)", description: "Low- and no-cost medical insurance for individuals who meet any of the following criteria:\nAged 20 years or younger\nAged 65 years and older\nBlind\nDisabled\nPregnant\nIn a skilled nursing or intermediate care facility\nParent or caregiver of an age-eligible child\nScreened for breast or cervical cancer\nEnrolled in Cal Fresh (SNAP), SSI/ SSP, or CalWORKs (TANF)\nIn foster care or adoption assistance program.", category: "healthcare", icon: "heart", link: "https://www.healthforcalifornia.com/medical-quote" },
      6: { id: 6, name: "Covered California", description: "Affordable medical insurance coverage.", category: "healthcare", icon: "heart", link: "https://www.healthforcalifornia.com/medical-quote" },
      7: { id: 7, name: "California LifeLine", description: "Low to no cost landline or mobile phone service.\n\nNOTE:  can be combined with, or used separately from, Federal Lifeline.", category: "utility", icon: "spark", link: "https://www.californialifeline.com/en" },
      8: { id: 8, name: "Federal Lifeline", description: "Low- and no-cost, phone and/or internet, mobile and/or at-home service.  Can be used with or separate from the state LifeLine.", category: "utility", icon: "spark", link: "https://www.lifelinesupport.org/" },
      9: { id: 9, name: "California LifeLine Foster Program", description: "No-cost mobile phone and internet service for youth in foster care.", category: "utility", icon: "spark", link: "https://www.californialifeline.com/Foster/en" },
      10: { id: 10, name: "California Alternative Rates for Energy (CARE)", description: "30-35% discount on electric bill and 20% discount on gas bill for qualifying households.", category: "utility", icon: "spark", link: "https://www.cpuc.ca.gov/industries-and-topics/electrical-energy/electric-costs/care-fera-program" },
      11: { id: 11, name: "Family Electric Rate Assistance (FERA)", description: "18% discount on electricity bill for qualifying households.", category: "utility", icon: "spark", link: "https://www.cpuc.ca.gov/industries-and-topics/electrical-energy/electric-costs/care-fera-program" },
      12: { id: 12, name: "Arrearage Management Payment (AMP) Plan", description: "Up to $8,000 in debt forgiveness for gas and electricity bills pass due by at least 90 days and with balances of at least $250.", category: "utility", icon: "spark", link: "Contact your energy utility." },
      13: { id: 13, name: "San Diego County General Relief", description: "Temporary cash assistance for people who meet the following criteria:\nSan Diego resident for at least 15 days with the intent to reside in San Diego County\nAge between 18 and 64, with rare exceptions\nMonthly income less than $598 (individual) or $819 (married)\nNo real property\nLess than $50 in liquid assets\nLess than $1,500 in total assets, excluding one vehicle valued at no more than $4,650", category: "income", icon: "dollar", link: "https://www.sandiegocounty.gov/content/sdc/hhsa/programs/ssp/general_relief.html" },
      14: { id: 14, name: "Medicare - Part D (Prescription Coverage)", description: "Prescription discount for people who meet any of the following criteria:\nAge 65 and older\nDisabled\nHave end-stage Renal Disease (permanent kidney failure requiring dialysis or transplant)\nHave ALS (Lou Gehrig's disease)", category: "healthcare", icon: "heart", link: "https://www.medicare.gov/" },
      15: { id: 15, name: "Medicare - Part A (Hospital Insurance)", description: "Insurance to cover inpatient care in hospitals, skilled nursing facility care, hospice care, and home health care for people who meet any of the following criteria:\nAge 65 and older\nDisabled\nHave end-stage Renal Disease (permanent kidney failure requiring dialysis or transplant)\nHave ALS (Lou Gehrig's disease)", category: "healthcare", icon: "heart", link: "https://www.medicare.gov/" },
      16: { id: 16, name: "Medicare - Part B (Medical Insurance)", description: "Insurance to cover doctor and other health providers services, outpatient care, home health care, durable medical equipment (i.e. wheelchairs), and many preventative services (i.e. screenings, vaccines, and annual wellness visits) for people who meet any of the following criteria:\nAge 65 and older\nDisabled\nHave end-stage Renal Disease (permanent kidney failure requiring dialysis or transplant)\nHave ALS (Lou Gehrig's disease)", category: "healthcare", icon: "heart", link: "https://www.medicare.gov/" },
      17: { id: 17, name: "Medicare - Part C (Medicare Advantage Plans)", description: "A Medicare-approved insurance plan from a Medicare-approved private company that offer an alternative to Original Medicare (Medicare Parts A (hospital), B (medical), and usually D (prescription)) for people who meet any of the following criteria:\nAge 65 and older\nDisabled\nHave end-stage Renal Disease (permanent kidney failure requiring dialysis or transplant)\nHave ALS (Lou Gehrig's disease)", category: "healthcare", icon: "heart", link: "https://www.medicare.gov/" },
      18: { id: 18, name: "Medicare - Supplemental Coverage (i.e. Medigap)", description: "Extra insurance you can by from a private company to help pay patient's share of cost under Original Medicare (Medicare Parts A (hospital) and B (medical)) for people who meet any of the following criteria:\nAge 65 and older\nDisabled\nHave end-stage Renal Disease (permanent kidney failure requiring dialysis or transplant)\nHave ALS (Lou Gehrig's disease)", category: "healthcare", icon: "heart", link: "https://www.medicare.gov/" },
      19: { id: 19, name: "AIDS Drug Assistance Program (ADAP)", description: "No-cost medication and premium assistance for people who meet all of the following criteria:\nCalifornia resident\nDiagnosed with HIV or AIDS\nAge 18 years and older\nMedication and premiums is not fully covered by Medi-Cal (Medicaid) or any third-party provider.", category: "healthcare", icon: "heart", link: "https://www.cdph.ca.gov/Programs/CID/DOA/Pages/OAadap.aspx" },
      20: { id: 20, name: "San Diego County Medical Services (CMS)", description: "Healthcare of last resort for people who meet all of the following criteria:\nImmediate or long-term medical need\nAge between 21 and 64 years\nResident of San Diego County\nSign lien form for services covered by CMS\nMeet CMS financial requirements or recieve San Diego County General Relief", category: "healthcare", icon: "heart", link: "https://www.sandiegocounty.gov/content/sdc/hhsa/programs/ssp/county_medical_services/faq.html" },
      21: { id: 21, name: "Low-Income Home Energy Assistance Program (LIHEAP)", description: "Multi-part program:\n\u2022 one-time financial assistnace to help pay balance of utility bill; \n\u2022 assistance for crisis (i.e. 24-48 hour disconnection notice); \n\u2022 free energy efficiency upgrades; AND\n\u2022 education energy efficiency practices and energy budget counseling.", category: "utility", icon: "spark", link: "https://www.csd.ca.gov/pages/liheapprogram.aspx" },
      22: { id: 22, name: "Energy Savings Assistance Program (ESA)", description: "Energy-saving home improvements (i.e. applicances, lighting, insulation).", category: "utility", icon: "spark", link: "https://www.cpuc.ca.gov/consumer-support/financial-assistance-savings-and-discounts/energy-savings-assistance" },
      23: { id: 23, name: "Cash Assistance Program for Immigrants (CAPI)", description: "Income for people who are age 65 and older, blind, or disabled and meet the following criteria:\nare not eligible for SSI and SSP due solely to immigration status\ncertain immigrants who entered the U.S. before August 22, 1996\nspronsored immigrants who entered the U.S. after August 21, 1996, and the sponsor is not deceased, disabled, or abusive\ncertain immigrants who entered the U.S. after August 21, 1996, and do not have a sponsor or have a sponsor who is deceased, disabled, or abusive.", category: "income", icon: "dollar", link: "https://www.sandiegocounty.gov/content/sdc/hhsa/programs/ssp/capi.html" },
      24: { id: 24, name: "Women, Infants & Children (WIC)", description: "Food for women who are pregnant or breastfeeding, or were pregnant in the last six months (including pregnancy loss), and children under age 5.", category: "food", icon: "leaf", link: "https://www.cdph.ca.gov/Programs/CFH/DWICSN/Pages/HowCanIGetWIC.aspx" },
      25: { id: 25, name: "Community-Based Adult Services (CBAS) / Adult Day Health Center (ADHC)", description: "Day program for senior and adults with chronic medical, cognitive, or behavioral health conditions or disabilities, who meet all of the following criteria:\nAge 18 and older\nHave a chronic medical, cognitive, or behavioral health condition or disability that makes them at risk of needing institutional care\nEnrolled in Medi-Cal", category: "caretaker", icon: "heart", link: "https://aging.ca.gov/Programs_and_Services/Community-Based_Adult_Services/" },
      26: { id: 26, name: "In-Home Supportive Service (IHSS)", description: "In-home assistance for people who meet all of the following criteria:\nCalifornia resident\nQualified for full-scope Medi-Cal (Medicaid)\nAge 65 or older, blind, or disabled\nUnable to live at home safely without help", category: "caretaker", icon: "heart", link: "https://www.sandiegocounty.gov/content/sdc/hhsa/programs/ais/Services/In-Home-Supportive-Services.html" },
      27: { id: 27, name: "California Advanced Services Fund - Line Extension Program (LEP)", description: "Line extension infrastructure for phone and/or internet service to connect a property to existing or proposed facilities-based telecommunications infrastructure. The customer or a representative (i.e., the internet or phone provider) may apply on behalf of a customer or a group of eligible customers.", category: "utility", icon: "spark", link: "https://www.cpuc.ca.gov/industries-and-topics/internet-and-phone/california-advanced-services-fund/casf-line-extension-program" },
      28: { id: 28, name: "California Work Opportunity and Responsibility to Kids (CalWORKs)/ California's Temporary Assistance for Needy Families (TANF)", description: "Temporary cash aid for eligible families with at least one child, and for eligible students who meet any of the following requirements:\nFamilies where either parent is absent, disabled, or deceased\nFamilies where the primary income-earner is unemployed\nFamilies with relatives who are the caretaker for foster child(ren)", category: "income", icon: "dollar", link: "https://www.calworks.org/eligibility-process" },
      29: { id: 29, name: "MTS Reduced Fares", description: "Low- or no-cost public transportation fare for people who meet any of the following criteria:\nPeople age 65 and older\nMedicare recipients\nPeople with disabilities\nPeople age 6 through 18 (effective through June 30, 2026)\nChildren age 5 and younger ride free when traveling with a paying passenger", category: "transportation", icon: "spark", link: "https://www.sdmts.com/fares/reduced-fares" },
      30: { id: 30, name: "San Diego County Museums - Free or Reduced Admission", description: "Low- or no-cost admission to participating museums, aquariums, science centers, and botanical gardens for individuals who participate in the following programs:\nSupplemental Nutrition Assistance Program (SNAP)/ Cal Fresh", category: "entertainment", icon: "spark", link: "https://sandiegomuseumcouncil.org/specials/free-or-reduced-admission-san-diego-museums/" },
      31: { id: 31, name: "Older Californians Nutrition Program - County of San Diego", description: "Low- or no-cost meal service for people aged 60 and older.  Some services are on-site only, and some services are to-go.  Transportation may be available.", category: "food", icon: "leaf", link: "https://www.sandiegocounty.gov/content/dam/sdc/hhsa/programs/ais/ais_advisory_council/documents/County%20of%20San%20Diego%20Senior%20Nutrition%20Centers%20OCNP_8.27.25.pdf" },
      32: { id: 32, name: "Home-Delivered Meals - County of San Diego", description: "Low- or no-cost home-delivered meals for people aged 60 and older who are homebound due to illness or disability.", category: "food", icon: "leaf", link: "https://www.sandiegocounty.gov/content/dam/sdc/hhsa/programs/ais/ais_advisory_council/documents/County%20of%20San%20Diego%20Home%20Delivered%20Meal%20Providers.pdf" },
      33: { id: 33, name: "Medical Baseline", description: "Charged the lowest residential rate for gas and electricity bills, may be eligible for up to 20% off electric charges, and receive advanced notice of power outages, for people who are dependent on gas and electricity for medical reasons.", category: "utility", icon: "spark", link: "https://www.cpuc.ca.gov/consumer-support/financial-assistance-savings-and-discounts/medical-baseline" },
      34: { id: 34, name: "Weatherization Assistance Program (WAP)", description: "Energy-saving home improvements (i.e., weatherization to improve energy efficiency and reduce energy bill.", category: "utility", icon: "spark", link: "https://www.csd.ca.gov/Pages/Residential-Energy-Efficiency.aspx" },
      35: { id: 35, name: "National School Lunch Program (NSLP) and National School Breakfast Program (NSBP)", description: "Free or reduced-price breakfasts and lunches for qualifying school children.", category: "food", icon: "leaf", link: "https://www.cde.ca.gov/ls/nu/rs/scales2526.asp" },
      36: { id: 36, name: "Summer EBT (SUN Bucks)", description: "Prepaid debit card for food purchases for students, aged 6 through 18, on summer break.", category: "food", icon: "leaf", link: "https://www.summerebt.org/" },
      37: { id: 37, name: "Section 8 Housing Choice Voucher", description: "Rental assistance.", category: "housing", icon: "home", link: "https://www.sandiegocounty.gov/content/sdc/sdhcd/rental-assistance/section-8-hcv-overview.html" },
      38: { id: 38, name: "Public Housing", description: "Public housing for eligible families, senior citizens, and disabled persons who reside in the unincorporated areas of San Diego County, or the cities of Chula Vista, Coronado, Del Mar, El Cajon, Escondido, Imperial Beach, La Mesa, Lemon Grove, Poway, San Marcos, Santee, Solano Beach, or Vista.", category: "housing", icon: "home", link: "https://www.sandiegocounty.gov/content/sdc/sdhcd/rental-assistance/public-housing.html" },
      39: { id: 39, name: "California Children's Health Insurance Program (C-CHIP)", description: "Healthcare for children up to age 18.", category: "healthcare", icon: "heart", link: "https://www.healthforcalifornia.com/covered-california/income-limits" },
      40: { id: 40, name: "Medi-Cal (Medicaid) for Pregnant Individuals", description: "Healthcare for people who are pregnant.", category: "healthcare", icon: "heart", link: "https://www.healthforcalifornia.com/covered-california/income-limits" },
      41: { id: 41, name: "Medi-Cal (Medicaid) Access Program for Pregnant Individuals", description: "Reduced cost healthcare for people who are pregnant.", category: "healthcare", icon: "heart", link: "https://www.healthforcalifornia.com/covered-california/income-limits" },
      42: { id: 42, name: "Federal Lifeline - Domestic Violence Survivor Benefit", description: "Temporary low-cost or no-cost phone and internet services for domestic violence survivors.", category: "utility", icon: "spark", link: "https://www.lifelinesupport.org/survivor-benefit/" },
      43: { id: 43, name: "Early Head Start and Head Start", description: "Child care and early education support for children up to age 5.", category: "day care", icon: "heart", link: "https://headstart.gov/how-apply" },
      44: { id: 44, name: "California's Tribal Temporary Assistance for Needy Families (Tribal TANF)", description: "Temporary cash aid and supportive services for families with at least one person in the household who has proof of membership in a federally-recognized tribe through enrollment or lineal descent from the California Judgment rolls.", category: "income", icon: "dollar", link: "https://www.cdss.ca.gov/tribal-tanf" },
      45: { id: 45, name: "BrightLife Kids", description: "No-cost mental health support and coaching for children up to age 12.", category: "healthcare", icon: "heart", link: "https://www.hellobrightline.com/brightlifekids/?utm_medium=referral&utm_source=calhopewebsite" },
      46: { id: 46, name: "Soluna", description: "No-cost mental health support and coaching for people ages 13 through 25.", category: "healthcare", icon: "heart", link: "https://solunaapp.com/" },
      47: { id: 47, name: "CalHope Red Line", description: "Peer support to find national, state, and county resources, referrals, and trauma-informed support for Urban Indians and Tribal populations.", category: "healthcare", icon: "heart", link: "https://ccuih.org/redline/" },
      48: { id: 48, name: "Refugee Cash Assistance (RCA)", description: "Temporary cash aid for certain refugees who would otherwise qualify for CalWORKs but for any of the following immigration statues:  refugee, asylee, Cuban or Haitian entrant, Special Immigration Visa (SIV) holder, Afghan and Ukrainian parolee, Amerasian, certain victims of human trafficking.", category: "income", icon: "dollar", link: "https://www.cdss.ca.gov/refugees" },
      49: { id: 49, name: "Federal Special Veterans Benefit (SVB) and California Veterans Cash Benefit (CVCB)", description: "Cash assistance for veterans who meet all of the following criteria:\neligible for California's State Supplementary Payment in December 1999\nmember of the Philippines military force in the service of the United States during World War II\nreside in the Republic of the Philippines", category: "income", icon: "dollar", link: "https://www.cdss.ca.gov/veterans-cash-benefit" },
      50: { id: 50, name: "Trafficking and Crime Victim Assistance Program (TCVAP)", description: "Temporary assistance for non-citizen survivors of human trafficking, domestic violence, and other serious crimes.", category: "income", icon: "dollar", link: "https://www.cdss.ca.gov/inforesources/tcvap" },
      51: { id: 51, name: "Office of Military & Veterans Affairs - San Diego County", description: "Assistance for military veterans and their dependents to receive benefits counseling, prepare and submit claims, and appeal as needed.", category: "income", icon: "dollar", link: "https://www.sandiegocounty.gov/content/sdc/hhsa/programs/ssp/veterans_services.html" },
      52: { id: 52, name: "Solid Waste Management Fee Financial Assistance Program", description: "Reduced out-of-pocket costs (50%) for trash and recycling fees for eligible homeowners who own and live in their own home as their primary residence, and receives San Diego City trash and recycling services.  Participation is limited and available on a first come, first serve basis.", category: "utility", icon: "spark", link: "https://www.sandiego.gov/environmental-services/trash-service-updates/financial-assistance" },
      53: { id: 53, name: "California Disability Insurance (EDD)", description: "Temporary income (up to 52 weeks) for people who cannot work or who lose wages due to illness, injury, surgery, pregnancy, or childbirth, and who meet the following criteria:\nCannot do regular work for at least eight days\nLost wages due to disability\nAre working or looking for work at the time the disability began\nEarned at least $300 with State Disability Insurance (SDI) deduced from paycheck", category: "income", icon: "dollar", link: "https://edd.ca.gov/en/disability/SDI_Online/" },
      54: { id: 54, name: "California State Supplementary Payment (SSP)", description: "California-funded supplemental income for people who are enrolled in the federal Supplementary Security Income (SSI) program.", category: "income", icon: "dollar", link: "https://cdss.ca.gov/inforesources/ssi-ssp", dependsOnProgram: 3 },
      55: { id: 55, name: "Program of All-Inclusive Care for Elderly (PACE)", description: "Coordinated care for people who meet all of the following criteria:\nAge 55 and older\nCan live in the community without jeopardizing personal health or safety\nMeets requirement for needing skilled nursing care", category: "caretaker", icon: "heart", link: "https://www.dhcs.ca.gov/services/ltc/Pages/programofall-inclusivecarefortheelderly.aspx" },
      56: { id: 56, name: "Migrant and Seasonal Head Start", description: "Child care and early education support for children up to age 5 who have at least one family member whose income comes primarily from agricultural employment.", category: "day care", icon: "heart", link: "https://acf.gov/ohs/about/head-start" },
      57: { id: 57, name: "American Indian and Alaska Native (AIAN) Head Start/ Tribal Head Start", description: "Child care and early education support for children up to age 5 for people who are American Indian and Alaskan Native.", category: "day care", icon: "heart", link: "https://acf.gov/ohs/about/head-start" },
      58: { id: 58, name: "California Low Cost Automobile (CLCA) Insurance", description: "Low-cost automobile insurance for people who meet all of the following criteria:\nAge 16 and older\nHave a valid California driver's license\nOwn a vehicle valued at $25,000 or less\nHave a good driving record (no more than one at-fault property damage-only accident or no more than one point for a moving violation within the last 3 years, no at-fault accidents involving bodily injury or death within the last 3 years, and no felony or misdemeanor convictions for violations of the Vehicle Code).", category: "transportation", icon: "spark", link: "https://www.mylowcostauto.com/" },
      59: { id: 59, name: "San Diego Public Library's Discover & Go", description: "No-cost admission fee to participating museums, Aztec games, the San Diego Zoo and Safari Park, and other locations for individual and their families with a valid San Diego Public Library Card.  Supplies are limited.", category: "entertainment", icon: "spark", link: "https://www.sdcl.org/discoverandgo/" },
      60: { id: 60, name: "CA State Library Parks Pass and CA State Parks Pass Backpack", description: "No-cost vehicle pass to over 200 participating California state parks, permitting entry of one passenger vehicle with a capacity of 9 people or fewer, or one motorcycle.  Daytripper and trailblazer backpacks are equipped with binoculars, a compass, field guides, and other outdoor gear.  California state park passes and backpacks are available for check-out at San Diego Public Library branches with a valid library card.  Supplies are limited.", category: "entertainment", icon: "spark", link: "https://www.sandiego.gov/public-library/check-out-nature" },
      61: { id: 61, name: "Thomas Jefferson School of Law - Veterans' Legal Assistance Clinic", description: "No-cost legal assistance for veterans with a variety of legal needs including family law, government benefits, and estate planning.", category: "legal", icon: "file", link: "https://www.tjsl.edu/academics/clinics-internships/veterans-legal-assistance-clinic/" },
      62: { id: 62, name: "Thomas Jefferson School of Law - Patent & Trademark Clinics", description: "No-cost legal assistance for obtaining patents and trademakes from the United States Patent & Trademark Office.", category: "legal", icon: "file", link: "https://www.tjsl.edu/academics/clinics-internships/small-business-law-center/the-patent-trademark-clinic/" },
      63: { id: 63, name: "Thomas Jefferson School of Law - Non-Profit & Small Business Law Clinic", description: "No-cost assistance with business formation and contracting needs.", category: "legal", icon: "file", link: "https://www.tjsl.edu/academics/clinics-internships/small-business-law-center/nonprofit-small-business-law-clinic/" },
      64: { id: 64, name: "Cal Western School of Law - Innocence and Justice Clinics", description: "Assistance for wrongly incarcerated individuals.", category: "legal", icon: "file", link: "https://www.cwsl.edu/experiential_learning/clinics/california_western_innocence_and_justice_clinic/index.html" },
      65: { id: 65, name: "Cal Western School of Law - Community Law Project", description: "Assistance for a variety of legal issues, including landlord-tenant, housing, immigration, employment, bankruptcy, and personal injury.", category: "legal", icon: "file", link: "https://www.cwsl.edu/experiential_learning/clinics/community_law_project.html" },
      66: { id: 66, name: "Cal Western School of Law - New Media Rights", description: "Assistance for entrepreneurs, journalists, and innovators whose project require internet, intellectual property, privacy, and media law assistance.", category: "legal", icon: "file", link: "https://www.cwsl.edu/experiential_learning/clinics/new_media_rights.html" },
      67: { id: 67, name: "Cal Western School of Law - Trademark Clinic", description: "Assitance for individuals and small businesses seeking trademark from the United States Patent and Trademake Office.", category: "legal", icon: "file", link: "https://www.cwsl.edu/experiential_learning/clinics/trademark_clinic.html" },
      68: { id: 68, name: "USD Law Legal Clinics", description: "Twelve clinics providing free services to low-income residents of San Diego County.", category: "legal", icon: "file", link: "https://www.sandiego.edu/law/clinics/" },
      69: { id: 69, name: "San Diego Volunteer Lawyers of San Diego", description: "Assistance with family law and domestic violence, micorbusiness and nonprofit support, guardianship, restraining orders, landlord/tenant, education rights, HIV/AID legal services, Vision for Justice Collaborative, Special Immigrant Juvenile Status, Record Relief for Survivors.", category: "legal", icon: "file", link: "https://sdvlp.org/" },
      70: { id: 70, name: "Legal Aid of San Diego", description: "Assitance with civil appeals, conservatorship, consumer protection and bankruptcy, education rights, eviction defense, family law, health coverage and access to care, housing discrimination, immigration, landlord-tenant issues, foreclosure, public housing, name or gender marker changes, outpatient behavioral health grievances and appeals, public assistance, restraining orders, SSI benefits, taxpayer rights and education.", category: "legal", icon: "file", link: "https://www.lassd.org/" },
      71: { id: 71, name: "Property Tax Postponement", description: "Deferment of current-year property taxes on principal residence for people who meet all of the following criteria:\nAge 62 or older, blind or disabled,\nHousehold income of $55,181 or less,\nOwns and occupies the property as the principal place of residence,\nHas at least 40 percent equity in the property, and\nHas not had a reverse mortgage on the property.", category: "housing", icon: "home", link: "https://www.sco.ca.gov/ardtax_prop_tax_postponement.html" },
      72: { id: 72, name: "California State Board of Equalization - Homeowners Exemption", description: "Homeowners may receive up to $7000 off the full value of the property to reduce property tax liability for the principal place of residence.", category: "taxes", icon: "file", link: "https://boe.ca.gov/proptaxes/homeexem.htm" },
      73: { id: 73, name: "California State Board of Equalization - Disabled Veterans Exemption", description: "Disabled veterans may receive up to $150,000 off the full value of the property to reduce property tax liability for the principal pace of residence.", category: "taxes", icon: "file", link: "https://boe.ca.gov/proptaxes/homeexem.htm" },
      74: { id: 74, name: "Utility Consumer Protection -- Emergency Disaster Relief", description: "Consumer protections and disaster relief programs for utilites customers:  electricity, natural gas, landline phone, mobile phone, water, and sewer.", category: "utility", icon: "spark", link: "https://www.cpuc.ca.gov/consumer-support/psps/consumer-protections-and-resources-for-wildfire-victims" },
      75: { id: 75, name: "California State Parks - Adventure Pass", description: "No-cost entry to 54 select state parks for 4th graders and their families.", category: "entertainment", icon: "spark", link: "https://www.parks.ca.gov/AdventurePass" },
      76: { id: 76, name: "California State Parks - Disabled Discount Pass", description: "Lifetime pass to state parks for individuals with permanent disabilities at a 50% discounted rate for vehicle-day use, family camping, and boat-use fees.", category: "entertainment", icon: "spark", link: "https://www.parks.ca.gov/?page_id=30959" },
      77: { id: 77, name: "California State Parks - Distinguished Veteran Pass", description: "No-cost lifetime pass for California residents who were honorably discharged to use all basic facilities, including day-use, camping, and boating.", category: "entertainment", icon: "spark", link: "https://www.parks.ca.gov/?page_id=30958" },
      78: { id: 78, name: "California State Parks - Golden Bear Pass", description: "No-cost annual pass for people age 62 and older with limited incomes, or participants in any of the following programs:  CalWORKs, SSI, or Tribal TANF.", category: "entertainment", icon: "spark", link: "https://www.parks.ca.gov/?page_id=30960" },
      79: { id: 79, name: "California State Parks - Senior Golden Bear Pass (fka Limited Use Golden Bear)", description: "No-cost annual pass for people age 62 and older to many parks during non-peak seasons.", category: "entertainment", icon: "spark", link: "https://www.parks.ca.gov/?page_id=30961" },
      80: { id: 80, name: "National Parks - Senior Annual Pass", description: "Low-cost annual pass for people age 62 and older.", category: "entertainment", icon: "spark", link: "https://www.recreation.gov/interagency-pass/types/senior-annual" },
      81: { id: 81, name: "National Parks - Senior Lifetime Pass", description: "Low-cost lifetime pass for people age 62 and older.", category: "entertainment", icon: "spark", link: "https://www.recreation.gov/interagency-pass/types/senior-lifetime" },
      82: { id: 82, name: "National Parks - Military Annual Pass", description: "No-cost annual pass for people currently in the U.S. military and their dependents.", category: "entertainment", icon: "spark", link: "https://www.recreation.gov/interagency-pass/types/military-annual" },
      83: { id: 83, name: "National Parks - Military Lifetime Pass", description: "No-cost lifetime pass for Gold Star Family members and veterans.", category: "entertainment", icon: "spark", link: "https://www.recreation.gov/interagency-pass/types/military-lifetime" },
      84: { id: 84, name: "National Parks - Access Pass", description: "No-cost lifetime pass for people with permanent disabilities.", category: "entertainment", icon: "spark", link: "https://www.recreation.gov/interagency-pass/types/access" },
      85: { id: 85, name: "National Parks - 4th Grade Pass", description: "No-cost annual pass for 4th graders and their families.", category: "entertainment", icon: "spark", link: "https://www.recreation.gov/interagency-pass/types/fourth-grade" },
      86: { id: 86, name: "National Parks - Volunteer Pass", description: "No-cost annual pass for federal recreational site volunteers with at least 250 volunteer hours.", category: "entertainment", icon: "spark", link: "https://store.usgs.gov/faq##Volunteer-Pass" },
    };

const PROGRAM_CRITERIA = {
  1: {
    1: [
      {
        incomeLimit: 31320,
      },
    ],
    2: [
      {
        incomeLimit: 42312,
      },
    ],
    3: [
      {
        incomeLimit: 53304,
      },
    ],
    4: [
      {
        incomeLimit: 64320,
      },
    ],
    5: [
      {
        incomeLimit: 75312,
      },
    ],
    6: [
      {
        incomeLimit: 86304,
      },
    ],
    7: [
      {
        incomeLimit: 97320,
      },
    ],
  },
  2: {
  },
  3: {
    1: [
      {
      },
    ],
    2: [
      {
      },
    ],
  },
  4: {
  },
  5: {
    1: [
      {
        incomeLimit: 21597,
      },
    ],
    2: [
      {
        incomeLimit: 29187,
      },
    ],
    3: [
      {
        incomeLimit: 36777,
      },
    ],
    4: [
      {
        incomeLimit: 44367,
      },
    ],
    5: [
      {
        incomeLimit: 51957,
      },
    ],
    6: [
      {
        incomeLimit: 59547,
      },
    ],
    7: [
      {
        incomeLimit: 67137,
      },
    ],
  },
  6: {
    1: [
      {
        incomeLimit: 62600,
      },
    ],
    2: [
      {
        incomeLimit: 84600,
      },
    ],
    3: [
      {
        incomeLimit: 106600,
      },
    ],
    4: [
      {
        incomeLimit: 128600,
      },
    ],
    5: [
      {
        incomeLimit: 150600,
      },
    ],
    6: [
      {
        incomeLimit: 172600,
      },
    ],
    7: [
      {
        incomeLimit: 194600,
      },
    ],
  },
  7: {
    1: [
      {
        incomeLimit: 24200,
      },
    ],
    2: [
      {
        incomeLimit: 32600,
      },
    ],
    3: [
      {
        incomeLimit: 41100,
      },
    ],
    4: [
      {
        incomeLimit: 49600,
      },
    ],
    5: [
      {
        incomeLimit: 58100,
      },
    ],
    6: [
      {
        incomeLimit: 66600,
      },
    ],
    7: [
      {
        incomeLimit: 75100,
      },
    ],
  },
  8: {
    1: [
      {
        incomeLimit: 21128,
      },
    ],
    2: [
      {
        incomeLimit: 28553,
      },
    ],
    3: [
      {
        incomeLimit: 35978,
      },
    ],
    4: [
      {
        incomeLimit: 43403,
      },
    ],
    5: [
      {
        incomeLimit: 50828,
      },
    ],
    6: [
      {
        incomeLimit: 58253,
      },
    ],
    7: [
      {
        incomeLimit: 65678,
      },
    ],
  },
  9: {
  },
  10: {
    1: [
      {
        incomeLimit: 42300,
      },
    ],
    2: [
      {
        incomeLimit: 42300,
      },
    ],
    3: [
      {
        incomeLimit: 53300,
      },
    ],
    4: [
      {
        incomeLimit: 64300,
      },
    ],
    5: [
      {
        incomeLimit: 75300,
      },
    ],
    6: [
      {
        incomeLimit: 86300,
      },
    ],
    7: [
      {
        incomeLimit: 97300,
      },
    ],
  },
  11: {
    1: [
      {
        incomeLimit: 52875,
      },
    ],
    2: [
      {
        incomeLimit: 52875,
      },
    ],
    3: [
      {
        incomeLimit: 66625,
      },
    ],
    4: [
      {
        incomeLimit: 80375,
      },
    ],
    5: [
      {
        incomeLimit: 94125,
      },
    ],
    6: [
      {
        incomeLimit: 107875,
      },
    ],
    7: [
      {
        incomeLimit: 121625,
      },
    ],
  },
  12: {
    1: [
      {
        incomeLimit: 52875,
      },
    ],
    2: [
      {
        incomeLimit: 52875,
      },
    ],
    3: [
      {
        incomeLimit: 66625,
      },
    ],
    4: [
      {
        incomeLimit: 80375,
      },
    ],
    5: [
      {
        incomeLimit: 94125,
      },
    ],
    6: [
      {
        incomeLimit: 107875,
      },
    ],
    7: [
      {
        incomeLimit: 121625,
      },
    ],
  },
  13: {
    1: [
      {
      },
    ],
    2: [
      {
      },
    ],
  },
  14: {
  },
  15: {
  },
  16: {
  },
  17: {
  },
  18: {
  },
  19: {
    1: [
      {
        incomeLimit: 93900,
        ageMin: 18, ageMax: null,
      },
    ],
    2: [
      {
        incomeLimit: 126900,
        ageMin: 18, ageMax: null,
      },
    ],
    3: [
      {
        incomeLimit: 159900,
        ageMin: 18, ageMax: null,
      },
    ],
    4: [
      {
        incomeLimit: 192900,
        ageMin: 18, ageMax: null,
      },
    ],
    5: [
      {
        incomeLimit: 225900,
        ageMin: 18, ageMax: null,
      },
    ],
    6: [
      {
        incomeLimit: 258900,
        ageMin: 18, ageMax: null,
      },
    ],
    7: [
      {
        incomeLimit: 291900,
        ageMin: 18, ageMax: null,
      },
    ],
  },
  20: {
    1: [
      {
        incomeLimit: 25823,
        ageMin: 21, ageMax: 64,
      },
      {
        incomeLimit: 55860,
        ageMin: 21, ageMax: 64,
        other: "Request a CMS Hardship Evaluation",
      },
    ],
    2: [
      {
        incomeLimit: 34898,
        ageMin: 21, ageMax: 64,
      },
      {
        incomeLimit: 75740,
        ageMin: 21, ageMax: 64,
        other: "Request a CMS Hardship Evaluation",
      },
    ],
    3: [
      {
        incomeLimit: 43973,
        ageMin: 21, ageMax: 64,
      },
      {
        incomeLimit: 95620,
        ageMin: 21, ageMax: 64,
        other: "Request a CMS Hardship Evaluation",
      },
    ],
    4: [
      {
        incomeLimit: 53048,
        ageMin: 21, ageMax: 64,
      },
      {
        incomeLimit: 115500,
        ageMin: 21, ageMax: 64,
        other: "Request a CMS Hardship Evaluation",
      },
    ],
    5: [
      {
        incomeLimit: 62123,
        ageMin: 21, ageMax: 64,
      },
      {
        incomeLimit: 135380,
        ageMin: 21, ageMax: 64,
        other: "Request a CMS Hardship Evaluation",
      },
    ],
    6: [
      {
        incomeLimit: 71198,
        ageMin: 21, ageMax: 64,
      },
      {
        incomeLimit: 155260,
        ageMin: 21, ageMax: 64,
        other: "Request a CMS Hardship Evaluation",
      },
    ],
    7: [
      {
        incomeLimit: 80273,
        ageMin: 21, ageMax: 64,
      },
      {
        incomeLimit: 175140,
        ageMin: 21, ageMax: 64,
        other: "Request a CMS Hardship Evaluation",
      },
    ],
  },
  21: {
    1: [
      {
        incomeLimit: 39980,
      },
    ],
    2: [
      {
        incomeLimit: 52282,
      },
    ],
    3: [
      {
        incomeLimit: 64584,
      },
    ],
    4: [
      {
        incomeLimit: 76886,
      },
    ],
    5: [
      {
        incomeLimit: 89187,
      },
    ],
    6: [
      {
        incomeLimit: 101489,
      },
    ],
    7: [
      {
        incomeLimit: 103796,
      },
    ],
  },
  22: {
    1: [
      {
        incomeLimit: 39125,
      },
    ],
    2: [
      {
        incomeLimit: 52875,
      },
    ],
    3: [
      {
        incomeLimit: 66625,
      },
    ],
    4: [
      {
        incomeLimit: 80375,
      },
    ],
    5: [
      {
        incomeLimit: 94125,
      },
    ],
    6: [
      {
        incomeLimit: 107875,
      },
    ],
    7: [
      {
        incomeLimit: 121625,
      },
    ],
  },
  23: {
  },
  24: {
    1: [
      {
        incomeLimit: 28953,
      },
    ],
    2: [
      {
        incomeLimit: 39128,
      },
    ],
    3: [
      {
        incomeLimit: 49303,
      },
    ],
    4: [
      {
        incomeLimit: 59478,
      },
    ],
    5: [
      {
        incomeLimit: 69653,
      },
    ],
    6: [
      {
        incomeLimit: 79828,
      },
    ],
    7: [
      {
        incomeLimit: 90003,
      },
    ],
  },
  25: {
    1: [
      {
        incomeLimit: 21597,
        ageMin: 18, ageMax: null,
      },
    ],
    2: [
      {
        incomeLimit: 29187,
        ageMin: 18, ageMax: null,
      },
    ],
    3: [
      {
        incomeLimit: 36777,
        ageMin: 18, ageMax: null,
      },
    ],
    4: [
      {
        incomeLimit: 44367,
        ageMin: 18, ageMax: null,
      },
    ],
    5: [
      {
        incomeLimit: 51957,
        ageMin: 18, ageMax: null,
      },
    ],
    6: [
      {
        incomeLimit: 59547,
        ageMin: 18, ageMax: null,
      },
    ],
    7: [
      {
        incomeLimit: 67137,
        ageMin: 18, ageMax: null,
      },
    ],
  },
  26: {
    1: [
      {
        incomeLimit: 21597,
        ageMin: 65, ageMax: null,
      },
      {
        incomeLimit: 21597,
        disabled: true,
      },
    ],
    2: [
      {
        incomeLimit: 29187,
        ageMin: 65, ageMax: null,
      },
      {
        incomeLimit: 29187,
        disabled: true,
      },
    ],
    3: [
      {
        incomeLimit: 36777,
        ageMin: 65, ageMax: null,
      },
      {
        incomeLimit: 36777,
        disabled: true,
      },
    ],
    4: [
      {
        incomeLimit: 44367,
        ageMin: 65, ageMax: null,
      },
      {
        incomeLimit: 44367,
        disabled: true,
      },
    ],
    5: [
      {
        incomeLimit: 51957,
        ageMin: 65, ageMax: null,
      },
      {
        incomeLimit: 51957,
        disabled: true,
      },
    ],
    6: [
      {
        incomeLimit: 59547,
        ageMin: 65, ageMax: null,
      },
      {
        incomeLimit: 59547,
        disabled: true,
      },
    ],
    7: [
      {
        incomeLimit: 67137,
        ageMin: 65, ageMax: null,
      },
      {
        incomeLimit: 67137,
        disabled: true,
      },
    ],
  },
  27: {
    1: [
      {
        incomeLimit: 42300,
        other: "The person residing at the location to be served must qualify for either California LifeLine or California Alternative Rates for Energy (CARE)",
      },
    ],
    2: [
      {
        incomeLimit: 42300,
        other: "The person residing at the location to be served must qualify for either California LifeLine or California Alternative Rates for Energy (CARE)",
      },
    ],
    3: [
      {
        incomeLimit: 53300,
        other: "The person residing at the location to be served must qualify for either California LifeLine or California Alternative Rates for Energy (CARE)",
      },
    ],
    4: [
      {
        incomeLimit: 64300,
        other: "The person residing at the location to be served must qualify for either California LifeLine or California Alternative Rates for Energy (CARE)",
      },
    ],
    5: [
      {
        incomeLimit: 75300,
        other: "The person residing at the location to be served must qualify for either California LifeLine or California Alternative Rates for Energy (CARE)",
      },
    ],
    6: [
      {
        incomeLimit: 86300,
        other: "The person residing at the location to be served must qualify for either California LifeLine or California Alternative Rates for Energy (CARE)",
      },
    ],
    7: [
      {
        incomeLimit: 97300,
        other: "The person residing at the location to be served must qualify for either California LifeLine or California Alternative Rates for Energy (CARE)",
      },
    ],
  },
  28: {
    1: [
      {
        incomeLimit: 20352,
      },
    ],
    2: [
      {
        incomeLimit: 27504,
      },
    ],
    3: [
      {
        incomeLimit: 34656,
      },
    ],
    4: [
      {
        incomeLimit: 41796,
      },
    ],
    5: [
      {
        incomeLimit: 48948,
      },
    ],
    6: [
      {
        incomeLimit: 56100,
      },
    ],
    7: [
      {
        incomeLimit: 63252,
      },
    ],
  },
  29: {
  },
  30: {
    1: [
      {
        incomeLimit: 31320,
        other: "Must participate in Cal Fresh/ SNAP",
      },
    ],
    2: [
      {
        incomeLimit: 42312,
        other: "Must participate in Cal Fresh/ SNAP",
      },
    ],
    3: [
      {
        incomeLimit: 53304,
        other: "Must participate in Cal Fresh/ SNAP",
      },
    ],
    4: [
      {
        incomeLimit: 64300,
        other: "Must participate in Cal Fresh/ SNAP",
      },
    ],
    5: [
      {
        incomeLimit: 75312,
        other: "Must participate in Cal Fresh/ SNAP",
      },
    ],
    6: [
      {
        incomeLimit: 86304,
        other: "Must participate in Cal Fresh/ SNAP",
      },
    ],
    7: [
      {
        incomeLimit: 97320,
        other: "Must participate in Cal Fresh/ SNAP",
      },
    ],
  },
  31: {
  },
  32: {
  },
  33: {
  },
  34: {
    1: [
      {
        incomeLimit: 31320,
      },
    ],
    2: [
      {
        incomeLimit: 42312,
        other: "Compromised immune system or life-threatening illness",
      },
    ],
    3: [
      {
        incomeLimit: 53304,
        other: "Hemiplegia",
      },
    ],
    4: [
      {
        incomeLimit: 64320,
        other: "Multiple Sclerosis",
      },
    ],
    5: [
      {
        incomeLimit: 75312,
        other: "Paraplegia",
      },
    ],
    6: [
      {
        incomeLimit: 86304,
        other: "Quadriplegia",
      },
    ],
    7: [
      {
        incomeLimit: 97320,
        other: "Scleroderma",
      },
    ],
  },
  35: {
    1: [
      {
        incomeLimit: 20345,
      },
    ],
    2: [
      {
        incomeLimit: 27495,
        other: "Or qualifying medical equipment (home-use):",
      },
    ],
    3: [
      {
        incomeLimit: 34645,
      },
    ],
    4: [
      {
        incomeLimit: 41795,
        other: "Air mattress/ hospital beds",
      },
    ],
    5: [
      {
        incomeLimit: 48945,
        other: "Apnea monitors",
      },
    ],
    6: [
      {
        incomeLimit: 56095,
        other: "Breather machines (IPPB)",
      },
    ],
    7: [
      {
        incomeLimit: 63245,
        other: "Compressors/ concentrators",
      },
    ],
  },
  36: {
    1: [
      {
        incomeLimit: 31320,
        ageMin: 6, ageMax: 18,
        other: "Continuous Positive Airway Pressure (CPAP)",
      },
    ],
    2: [
      {
        incomeLimit: 42312,
        ageMin: 6, ageMax: 18,
        other: "Dialysis machines",
      },
    ],
    3: [
      {
        incomeLimit: 53304,
        ageMin: 6, ageMax: 18,
        other: "Electrostatic Nebulizers",
      },
    ],
    4: [
      {
        incomeLimit: 64320,
        ageMin: 6, ageMax: 18,
        other: "Electric Nerve Stimulators",
      },
    ],
    5: [
      {
        incomeLimit: 75312,
        ageMin: 6, ageMax: 18,
        other: "Hemodialysis machines",
      },
    ],
    6: [
      {
        incomeLimit: 86304,
        ageMin: 6, ageMax: 18,
        other: "Infusion pumps",
      },
    ],
    7: [
      {
        incomeLimit: 97320,
        ageMin: 6, ageMax: 18,
        other: "Inhalation pulmonary pressure",
      },
    ],
  },
  37: {
    1: [
      {
        incomeLimit: 92700,
        other: "Iron lungs",
      },
    ],
    2: [
      {
        incomeLimit: 105950,
        other: "Left Ventricular Assist Devices (LVAD)",
      },
    ],
    3: [
      {
        incomeLimit: 119200,
        other: "Lympha Press Devices",
      },
    ],
    4: [
      {
        incomeLimit: 132400,
        other: "Motorized wheelchairs",
      },
    ],
    5: [
      {
        incomeLimit: 143000,
        other: "Oxygen generators",
      },
    ],
    6: [
      {
        incomeLimit: 153600,
        other: "Pacemaker monitor/ defibrillator",
      },
    ],
    7: [
      {
        incomeLimit: 164200,
        other: "Pressure pads",
      },
    ],
  },
  38: {
    1: [
      {
        incomeLimit: 57900,
        other: "Pressure pumps",
      },
    ],
    2: [
      {
        incomeLimit: 66150,
        other: "Pulse oximeters/ monitors (must be used with other medical devices; cannot be battery powered)",
      },
    ],
    3: [
      {
        incomeLimit: 74450,
        other: "Respirators (all types)",
      },
    ],
    4: [
      {
        incomeLimit: 82700,
        other: "Suction machines",
      },
    ],
    5: [
      {
        incomeLimit: 89350,
      },
    ],
    6: [
      {
        incomeLimit: 95950,
      },
    ],
    7: [
      {
        incomeLimit: 102550,
      },
    ],
  },
  39: {
    1: [
      {
        incomeLimit: 41629,
        ageMin: null, ageMax: 18,
      },
    ],
    2: [
      {
        incomeLimit: 56259,
        ageMin: null, ageMax: 18,
      },
    ],
    3: [
      {
        incomeLimit: 70889,
        ageMin: null, ageMax: 18,
      },
    ],
    4: [
      {
        incomeLimit: 85519,
        ageMin: null, ageMax: 18,
      },
    ],
    5: [
      {
        incomeLimit: 100149,
        ageMin: null, ageMax: 18,
      },
    ],
    6: [
      {
        incomeLimit: 114779,
        ageMin: null, ageMax: 18,
      },
    ],
    7: [
      {
        incomeLimit: 129409,
        ageMin: null, ageMax: 18,
      },
    ],
  },
  40: {
    1: [
      {
        incomeLimit: 33335,
      },
    ],
    2: [
      {
        incomeLimit: 45050,
      },
    ],
    3: [
      {
        incomeLimit: 56765,
      },
    ],
    4: [
      {
        incomeLimit: 68480,
      },
    ],
    5: [
      {
        incomeLimit: 80195,
      },
    ],
    6: [
      {
        incomeLimit: 91910,
      },
    ],
    7: [
      {
        incomeLimit: 103625,
      },
    ],
  },
  41: {
    1: [
      {
        incomeLimit: 50393,
      },
    ],
    2: [
      {
        incomeLimit: 68103,
      },
    ],
    3: [
      {
        incomeLimit: 85813,
      },
    ],
    4: [
      {
        incomeLimit: 103523,
      },
    ],
    5: [
      {
        incomeLimit: 121233,
      },
    ],
    6: [
      {
        incomeLimit: 138943,
      },
    ],
    7: [
      {
        incomeLimit: 156653,
      },
    ],
  },
  42: {
    1: [
      {
        incomeLimit: 31300,
      },
    ],
    2: [
      {
        incomeLimit: 42300,
      },
    ],
    3: [
      {
        incomeLimit: 53300,
      },
    ],
    4: [
      {
        incomeLimit: 64300,
      },
    ],
    5: [
      {
        incomeLimit: 75300,
      },
    ],
    6: [
      {
        incomeLimit: 86300,
      },
    ],
    7: [
      {
        incomeLimit: 97300,
      },
    ],
  },
  43: {
    1: [
      {
        incomeLimit: 31320,
        ageMin: null, ageMax: 5,
      },
    ],
    2: [
      {
        incomeLimit: 42312,
        ageMin: null, ageMax: 5,
      },
    ],
    3: [
      {
        incomeLimit: 53304,
        ageMin: null, ageMax: 5,
      },
    ],
    4: [
      {
        incomeLimit: 64320,
        ageMin: null, ageMax: 5,
      },
    ],
    5: [
      {
        incomeLimit: 75312,
        ageMin: null, ageMax: 5,
      },
    ],
    6: [
      {
        incomeLimit: 86304,
        ageMin: null, ageMax: 5,
      },
    ],
    7: [
      {
        incomeLimit: 97320,
        ageMin: null, ageMax: 5,
      },
    ],
  },
  44: {
    1: [
      {
        incomeLimit: 31300,
        tribalMember: true,
      },
    ],
    2: [
      {
        incomeLimit: 42300,
        tribalMember: true,
      },
    ],
    3: [
      {
        incomeLimit: 53300,
        tribalMember: true,
      },
    ],
    4: [
      {
        incomeLimit: 64300,
        tribalMember: true,
      },
    ],
    5: [
      {
        incomeLimit: 75300,
        tribalMember: true,
      },
    ],
    6: [
      {
        incomeLimit: 86300,
        tribalMember: true,
      },
    ],
    7: [
      {
        incomeLimit: 97300,
        tribalMember: true,
      },
    ],
  },
  45: {
  },
  46: {
  },
  47: {
  },
  48: {
  },
  49: {
  },
  50: {
  },
  51: {
  },
  52: {
    1: [
      {
        incomeLimit: 39980,
      },
    ],
    2: [
      {
        incomeLimit: 52282,
      },
    ],
    3: [
      {
        incomeLimit: 64584,
      },
    ],
    4: [
      {
        incomeLimit: 76886,
      },
    ],
    5: [
      {
        incomeLimit: 89187,
      },
    ],
    6: [
      {
        incomeLimit: 101489,
      },
    ],
    7: [
      {
        incomeLimit: 103796,
      },
    ],
  },
  53: {
  },
  54: {
    1: [
      {
      },
    ],
    2: [
      {
      },
    ],
  },
  55: {
  },
  56: {
  },
  57: {
  },
  58: {
    1: [
      {
        incomeLimit: 39900,
        ageMin: 16, ageMax: null,
      },
    ],
    2: [
      {
        incomeLimit: 54100,
        ageMin: 16, ageMax: null,
      },
    ],
    3: [
      {
        incomeLimit: 68300,
        ageMin: 16, ageMax: null,
      },
    ],
    4: [
      {
        incomeLimit: 82500,
        ageMin: 16, ageMax: null,
      },
    ],
    5: [
      {
        incomeLimit: 96700,
        ageMin: 16, ageMax: null,
      },
    ],
    6: [
      {
        incomeLimit: 110900,
        ageMin: 16, ageMax: null,
      },
    ],
    7: [
      {
        incomeLimit: 125100,
        ageMin: 16, ageMax: null,
      },
    ],
  },
  59: {
  },
  60: {
  },
  61: {
  },
  62: {
  },
  63: {
  },
  64: {
  },
  65: {
  },
  66: {
  },
  67: {
  },
  68: {
  },
  69: {
  },
  70: {
  },
  71: {
    1: [
      {
        incomeLimit: 55181,
        ageMin: 62, ageMax: null,
      },
      {
        incomeLimit: 55181,
        disabled: true,
      },
    ],
    2: [
      {
        incomeLimit: 55181,
        ageMin: 62, ageMax: null,
      },
      {
        incomeLimit: 55181,
        disabled: true,
      },
    ],
  },
  72: {
  },
  73: {
  },
  74: {
  },
  75: {
  },
  76: {
    1: [{ disabled: true }],
    2: [{ disabled: true }],
    3: [{ disabled: true }],
    4: [{ disabled: true }],
    5: [{ disabled: true }],
    6: [{ disabled: true }],
    7: [{ disabled: true }],
  },
  77: {
    1: [{ veteran: true }],
    2: [{ veteran: true }],
    3: [{ veteran: true }],
    4: [{ veteran: true }],
    5: [{ veteran: true }],
    6: [{ veteran: true }],
    7: [{ veteran: true }],
  },
  78: {
    1: [{ ageMin: 62 }],
    2: [{ ageMin: 62 }],
    3: [{ ageMin: 62 }],
    4: [{ ageMin: 62 }],
    5: [{ ageMin: 62 }],
    6: [{ ageMin: 62 }],
    7: [{ ageMin: 62 }],
  },
  79: {
    1: [{ ageMin: 62 }],
    2: [{ ageMin: 62 }],
    3: [{ ageMin: 62 }],
    4: [{ ageMin: 62 }],
    5: [{ ageMin: 62 }],
    6: [{ ageMin: 62 }],
    7: [{ ageMin: 62 }],
  },
  80: {
    1: [{ ageMin: 62 }],
    2: [{ ageMin: 62 }],
    3: [{ ageMin: 62 }],
    4: [{ ageMin: 62 }],
    5: [{ ageMin: 62 }],
    6: [{ ageMin: 62 }],
    7: [{ ageMin: 62 }],
  },
  81: {
    1: [{ ageMin: 62 }],
    2: [{ ageMin: 62 }],
    3: [{ ageMin: 62 }],
    4: [{ ageMin: 62 }],
    5: [{ ageMin: 62 }],
    6: [{ ageMin: 62 }],
    7: [{ ageMin: 62 }],
  },
  82: {
    1: [{ veteran: true }],
    2: [{ veteran: true }],
    3: [{ veteran: true }],
    4: [{ veteran: true }],
    5: [{ veteran: true }],
    6: [{ veteran: true }],
    7: [{ veteran: true }],
  },
  83: {
    1: [{ veteran: true }],
    2: [{ veteran: true }],
    3: [{ veteran: true }],
    4: [{ veteran: true }],
    5: [{ veteran: true }],
    6: [{ veteran: true }],
    7: [{ veteran: true }],
  },
  84: {
    1: [{ disabled: true }],
    2: [{ disabled: true }],
    3: [{ disabled: true }],
    4: [{ disabled: true }],
    5: [{ disabled: true }],
    6: [{ disabled: true }],
    7: [{ disabled: true }],
  },
  85: {
  },
  86: {
  },
};

// ── QUALIFY PATHS ──────────────────────────────────────────────────────────
    // Each program has an array of paths. A person qualifies if they match ANY path.
    // tier:'likely' = quiz answers confirm eligibility
    // tier:'may'    = might qualify but quiz can't fully verify
    // Conditions within a path are AND logic (all must be true).
    // income:true → check PROGRAM_CRITERIA income limit for household size
    // enrolledAny → user must be enrolled in at least one listed program key
    const QUALIFY_PATHS = {
      1:  [{ tier:'likely', income:true }],
      2:  [{ tier:'likely', unemployed:true },
           { tier:'may', notEmployedFullTime:true, label:'Partially unemployed or complex situation' }],
      3:  [{ tier:'likely', ageMin:65 },
           { tier:'likely', disabled:true },
           { tier:'may', label:'Limited income/resources – contact SSA to verify' }],
      4:  [{ tier:'likely', disabled:true },
           { tier:'may', label:'Must have enough Social Security work credits – contact SSA' }],
      5:  [{ tier:'likely', income:true },
           { tier:'likely', ageMax:20 },
           { tier:'likely', ageMin:65 },
           { tier:'likely', disabled:true },
           { tier:'likely', pregnant:true },
           { tier:'likely', fosterCare:true },
           { tier:'likely', hasChildren:true },
           { tier:'likely', enrolledAny:['calfresh','ssi','calworks'] }],
      6:  [{ tier:'likely', income:true }],
      7:  [{ tier:'likely', income:true },
           { tier:'likely', enrolledAny:['wic','liheap','calfresh','medi-cal','ssi','section8','calworks'] }],
      8:  [{ tier:'likely', income:true },
           { tier:'likely', enrolledAny:['calfresh','medi-cal','ssi','section8','calworks','wic','liheap'] },
           { tier:'likely', fosterCare:true }],
      9:  [{ tier:'likely', fosterCare:true, ageMin:13, ageMax:20 }],
      10: [{ tier:'likely', income:true }],
      11: [{ tier:'likely', income:true }],
      12: [{ tier:'likely', enrolledAny:['care-fera'], income:true },
           { tier:'may', label:'Requires enrollment in CARE or FERA and past-due balance ≥$250' }],
      13: [{ tier:'may', label:'Must meet all criteria including age 18–64, monthly income under $598 (individual) or $819 (married), no real property, under $50 liquid assets, and under $1,500 total assets – contact San Diego County' }],
      14: [{ tier:'likely', ageMin:65 },
           { tier:'may', label:'May qualify if disabled (requires SSA determination), or with end-stage renal disease or ALS – contact Medicare' }],
      15: [{ tier:'likely', ageMin:65 },
           { tier:'may', label:'May qualify if disabled (requires SSA determination), or with end-stage renal disease or ALS – contact Medicare' }],
      16: [{ tier:'likely', ageMin:65 },
           { tier:'may', label:'May qualify if disabled (requires SSA determination), or with end-stage renal disease or ALS – contact Medicare' }],
      17: [{ tier:'likely', ageMin:65 },
           { tier:'may', label:'May qualify if disabled (requires SSA determination), or with end-stage renal disease or ALS – contact Medicare' }],
      18: [{ tier:'likely', ageMin:65 },
           { tier:'may', label:'May qualify if disabled (requires SSA determination), or with end-stage renal disease or ALS – contact Medicare' }],
      19: [{ tier:'may', label:'Must be CA resident age 18+, diagnosed with HIV/AIDS, and medication not fully covered by Medi-Cal – contact CDPH' }],
      20: [{ tier:'may', label:'Must meet all criteria: immediate medical need, age 21–64, San Diego County resident, sign lien form, and meet CMS financial requirements. Higher incomes may request a Hardship Evaluation – contact San Diego County Medical Services' }],
      21: [{ tier:'likely', income:true }],
      22: [{ tier:'likely', income:true }],
      23: [{ tier:'may', label:'For eligible immigrants age 65+, blind, or disabled who are ineligible for SSI/SSP due to immigration status – contact HHSA' }],
      24: [{ tier:'likely', pregnant:true, income:true },
           { tier:'likely', hasChildren:true, income:true }],
      25: [{ tier:'may', label:'Must meet all criteria: age 18+, have a chronic medical/cognitive/behavioral condition putting you at risk of needing institutional care, and be enrolled in Medi-Cal – contact CBAS' }],
      26: [{ tier:'may', label:'Must meet all criteria: California resident, enrolled in full-scope Medi-Cal, age 65+ or blind or disabled, and unable to live at home safely without help – contact San Diego County IHSS' }],
      27: [{ tier:'likely', enrolledAny:['care-fera'] },
           { tier:'may', label:'Must qualify for California LifeLine or CARE – contact CPUC' }],
      28: [{ tier:'likely', hasChildren:true, income:true }],
      29: [{ tier:'likely', ageMin:65 },
           { tier:'likely', enrolledAny:['medicare'] },
           { tier:'likely', disabled:true },
           { tier:'likely', ageMin:6, ageMax:18 }],
      30: [{ tier:'likely', enrolledAny:['calfresh'] }],
      31: [{ tier:'likely', ageMin:60 }],
      32: [{ tier:'likely', ageMin:60, disabled:true },
           { tier:'may', label:'For people age 60+ who are homebound due to illness or disability – contact San Diego County' }],
      33: [{ tier:'may', label:'Must be dependent on gas/electricity for qualifying medical conditions or equipment – contact your utility provider' }],
      34: [{ tier:'likely', income:true }],
      35: [{ tier:'likely', hasChildren:true, income:true }],
      36: [{ tier:'likely', hasChildren:true, income:true }],
      37: [{ tier:'likely', income:true }],
      38: [{ tier:'likely', income:true }],
      39: [{ tier:'likely', hasChildren:true, income:true }],
      40: [{ tier:'likely', pregnant:true, income:true }],
      41: [{ tier:'likely', pregnant:true, income:true }],
      42: [{ tier:'likely', dvSurvivor:true, income:true },
           { tier:'may', label:'For domestic violence survivors – contact Federal Lifeline program' }],
      43: [{ tier:'likely', hasChildren:true, income:true, ageMax:5 },
           { tier:'likely', hasChildren:true, fosterCare:true, ageMax:5 },
           { tier:'likely', hasChildren:true, enrolledAny:['calworks','ssi','calfresh'], ageMax:5 }],
      44: [{ tier:'likely', tribal:true, hasChildren:true, income:true }],
      45: [{ tier:'likely', hasChildren:true }],
      46: [{ tier:'likely', ageMin:13, ageMax:25 }],
      47: [{ tier:'may', tribal:true, label:'For Urban Indians and Tribal populations – contact CalHope Red Line' }],
      48: [{ tier:'likely', refugee:true }],
      49: [{ tier:'may', label:'Very specific eligibility for Philippines WWII veterans – contact CDSS' }],
      50: [{ tier:'may', label:'For non-citizen survivors of trafficking, domestic violence, or serious crimes – contact CDSS' }],
      51: [{ tier:'likely', veteran:true }],
      52: [{ tier:'likely', income:true },
           { tier:'likely', enrolledAny:['medi-cal','calfresh','calworks','liheap'] }],
      53: [{ tier:'likely', disabled:true },
           { tier:'may', label:'Must have lost wages due to disability and be within the past 52 weeks of work – contact EDD' }],
      54: [{ tier:'likely', enrolledAny:['ssi'] }],
      55: [{ tier:'may', label:'Must meet all criteria: age 55+, able to live safely in the community, and meet the requirement for needing skilled nursing care. Only available in PACE center service areas – contact DHCS' }],
      56: [{ tier:'may', label:'For children under 5 with at least one family member whose income comes primarily from agricultural employment' }],
      57: [{ tier:'may', label:'For American Indian and Alaska Native children under 5 – contact Head Start' }],
      58: [{ tier:"may", label:"Must meet all criteria: age 16+, valid CA driver's license, vehicle valued at $25,000 or less, and a good driving record (no at-fault bodily injury accidents in last 3 years, no felony/misdemeanor Vehicle Code convictions) – contact CLCA" }],
      59: [{ tier:'likely', label:'Available to anyone with a San Diego Public Library card' }],
      60: [{ tier:'likely', label:'Available to anyone with a San Diego Public Library card' }],
      61: [{ tier:'likely', veteran:true, needsLegal:true }],
      62: [{ tier:'likely', needsLegal:true, label:'Available to anyone seeking patent or trademark assistance' }],
      63: [{ tier:'likely', needsLegal:true, label:'Available to anyone with business formation or contracting needs' }],
      64: [{ tier:'may', needsLegal:true, label:'For wrongly incarcerated individuals – contact Cal Western' }],
      65: [{ tier:'likely', needsLegal:true, label:'Available for landlord-tenant, housing, immigration, employment, bankruptcy, and other legal issues' }],
      66: [{ tier:'likely', needsLegal:true, label:'For entrepreneurs, journalists, and innovators needing internet or IP law help' }],
      67: [{ tier:'likely', needsLegal:true, label:'For individuals and small businesses seeking trademark registration' }],
      68: [{ tier:'may', needsLegal:true, label:'For low-income residents of San Diego County — contact USD Law to confirm eligibility for their specific clinics' }],
      69: [{ tier:'likely', needsLegal:true, label:'Available for qualifying legal issues including family law, housing, and immigration' }],
      70: [{ tier:'likely', needsLegal:true, label:'Available for qualifying civil legal issues – contact Legal Aid of San Diego' }],
      71: [{ tier:'may', label:'Must meet all criteria: age 62+ or blind/disabled, household income $55,181 or less, own and occupy the property, have at least 40% equity, and no reverse mortgage – contact California State Controller' }],
      72: [{ tier:'likely', label:'Available to all homeowners for their principal residence' }],
      73: [{ tier:'likely', veteran:true, disabled:true }],
      74: [{ tier:'likely', label:'Available to all utility customers affected by a disaster' }],
      75: [{ tier:'likely', hasChildren:true }],
      76: [{ tier:'likely', disabled:true }],
      77: [{ tier:'likely', veteran:true }],
      78: [{ tier:'likely', ageMin:62 },
           { tier:'likely', ageMin:62, enrolledAny:['calworks','ssi'] }],
      79: [{ tier:'likely', ageMin:62 }],
      80: [{ tier:'likely', ageMin:62 }],
      81: [{ tier:'likely', ageMin:62 }],
      82: [{ tier:'likely', veteran:true }],
      83: [{ tier:'likely', veteran:true }],
      84: [{ tier:'likely', disabled:true }],
      85: [{ tier:'likely', hasChildren:true }],
      86: [{ tier:'may', label:'For federal recreational site volunteers with at least 250 volunteer hours' }],
    };


const quizSteps = [
      {
        id: "household_size",
        title: "How many people are in your household?",
        subtitle: "Include everyone you live with and share resources with.",
        explanation: "Household size determines income limits and benefit amounts for most programs.",
        type: "choice",
        options: ["1 person", "2 people", "3 people", "4 people", "5 people", "6 people", "7+ people"]
      },
      {
        id: "age",
        title: "What are the ages of people in your household?",
        subtitle: "Select all age ranges that apply to everyone in your household.",
        explanation: "Different programs serve different age groups - seniors get different benefits than families with children or working-age adults.",
        type: "choice",
        options: ["Under 6", "6–13", "13–17", "18", "19–25", "26–59", "60–61", "62–64", "65+"]
      },
      {
        id: "annual_income",
        title: "What is your total household annual income?",
        subtitle: "Include all income before taxes—wages, self-employment, benefits, child support, disability payments, etc. (yearly total)",
        explanation: "Income is the main factor for most benefit programs. This helps us find programs with income limits you qualify for.",
        type: "choice",
        options: ["No income", "Under $20,000", "$20,000–$40,000", "$40,000–$60,000", "$60,000–$80,000", "$80,000–$120,000", "$120,000–$180,000", "Over $180,000"]
      },
      {
        id: "employment",
        title: "What is your current employment status?",
        subtitle: "Select what best describes your situation.",
        explanation: "Employment status affects eligibility for unemployment benefits, job training, and work-related programs.",
        type: "choice",
        options: ["Employed full-time", "Employed part-time", "Self-employed", "Unemployed (looking for work)", "Unable to work (disability/medical)"]
      },
      {
        id: "special_status",
        title: "Do any of these apply to you? (Select all that apply)",
        subtitle: "These help us find additional programs you may qualify for.",
        explanation: "Veterans, refugees, foster youth, people with disabilities, and families with children have access to specialized programs.",
        type: "choice",
        options: ["Veteran or military", "Refugee or recent immigrant", "Tribal member", "Disabled, blind, or have a chronic illness", "Foster youth or in foster care", "Pregnant or nursing", "Caring for children under 18", "Domestic violence survivor", "Need legal assistance", "None of these"]
      },
      {
        id: "enrolled_programs",
        title: "Are you currently enrolled in any of these programs? (Select all that apply)",
        subtitle: "Enrollment in some programs can qualify you for others.",
        explanation: "Many benefit programs extend eligibility to people already enrolled in related programs — selecting what you\'re currently enrolled in helps us find more programs you qualify for.",
        type: "choice",
        options: ["CalFresh or Supplemental Nutrition Assistance Program (SNAP)", "Medi-Cal (Medicaid)", "Medicare", "Supplemental Security Income (SSI) and State Supplementary Program (SSP)", "CalWORKs or Temporary Assistance for Needy Families (TANF)", "Low Income Home Energy Assistance Program (LIHEAP)", "California Alternate Rates for Energy (CARE) or Family Electric Rate Assistance Program (FERA)", "Section 8 / Federal Public Housing", "Women, Infants, and Children (WIC)", "San Diego County General Relief", "None of the above"]
      },
    ];


// Categories requiring a qualifying signal before showing any results
    // All categories are gated — require a qualifying signal before showing results

const NON_GATED_CATEGORIES = new Set(['taxes']);
const GATED_CATEGORIES = new Set(
  Object.values(PROGRAMS)
    .map(p => p.category)
    .filter(c => !NON_GATED_CATEGORIES.has(c))
);


// Programs exempt from the category gate (available to all regardless of signals)
    // #59 Discover & Go, #60 Parks Pass — anyone with a library card
    // #86 Volunteer Pass — volunteer hours not captured by quiz
    // #33 Medical Baseline — requires medical condition/equipment not in quiz
    // #74 Utility Consumer Protection — disaster relief available to all utility customers
    const GATE_EXEMPT = new Set([33, 59, 60, 74, 86]);
