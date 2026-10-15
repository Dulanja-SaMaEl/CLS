export interface Member {
  id: number;
  sc_en: string; // Supreme Court Enrolment
  ba_en: string; // Bar Association Enrolment
  name: string;
  email: string;
  mobile: string;
  nic: string;
  gender: string;
  city: string;
  practiceArea: string;
  expertise: string[];
  membershipTier: "Ordinary" | "Life" | "None";
  status: "Active" | "Inactive" | "Suspended";
  registeredDate: string;
  membershipStartDate: string;
  membershipEndDate: string;
  avatarUrl: string;
}

export interface CLSEvent {
  id: number;
  title: string;
  category: string;
  venue: string;
  location: string;
  startDateTime: string;
  endDateTime: string;
  price: number;
  status: "Upcoming" | "Ongoing" | "Completed" | "Cancelled";
  description: string;
  posterUrl: string;
  speakers?: string[];
  attendeeCount?: number;
  isMeeting?: boolean;
  meetingLink?: string;
  agenda?: string[];
  color?: string; // hex or tailwind badge style
}

export interface BroadcastLog {
  id: number;
  title: string;
  content: string;
  channel: "EMAIL" | "SMS" | "BOTH";
  targetTier: "All Members" | "Ordinary Member" | "Life Member";
  recipientsCount: number;
  sentAt: string;
  status: "Delivered" | "Queued" | "Failed";
}

export const initialMembers: Member[] = [
  {
    id: 999,
    sc_en: "SC/ADMIN/001",
    ba_en: "BASL/ADMIN/001",
    name: "Chambers Executive Administrator",
    email: "admin@cls.com",
    mobile: "+94 71 192 3531",
    nic: "198000000000",
    gender: "Male",
    city: "Colombo 12 (Hulftsdorp / Superior Courts)",
    practiceArea: "Judicial Administration & Bar Governance",
    expertise: ["Bar Governance", "Court Administration", "Supreme Court Registry"],
    membershipTier: "Life",
    status: "Active",
    registeredDate: "01 Jan, 2024",
    membershipStartDate: "01 Jan, 2024",
    membershipEndDate: "31 Dec, 2125",
    avatarUrl: "/images/branding/cls-crest-gold.png",
  },
  {
    id: 1,
    sc_en: "SC/EN/2012/1042",
    ba_en: "BASL/8492",
    name: "Dr. Asoka De Silva, PC",
    email: "asoka.desilva@lawchambers.lk",
    mobile: "+94 77 123 4567",
    nic: "196812403921",
    gender: "Male",
    city: "Colombo 07",
    practiceArea: "Constitutional & Fundamental Rights",
    expertise: ["Appellate Advocacy", "Judicial Review", "Administrative Law"],
    membershipTier: "Life",
    status: "Active",
    registeredDate: "12 Jan, 2015",
    membershipStartDate: "12 Jan, 2015",
    membershipEndDate: "12 Jan, 2114",
    avatarUrl: "/images/branding/cls-crest-gold.png",
  },
  {
    id: 2,
    sc_en: "SC/EN/2018/2210",
    ba_en: "BASL/11204",
    name: "Naveen Shanaka, AAG",
    email: "naveen.shanaka@colombolaw.org",
    mobile: "+94 71 892 3341",
    nic: "198829104422",
    gender: "Male",
    city: "Colombo 03",
    practiceArea: "Commercial & Corporate Law",
    expertise: ["Cross-Border Mergers", "Commercial Arbitration", "Banking Litigation"],
    membershipTier: "Ordinary",
    status: "Active",
    registeredDate: "18 Mar, 2019",
    membershipStartDate: "01 Jan, 2026",
    membershipEndDate: "31 Dec, 2026",
    avatarUrl: "/images/team/naveen-shanaka.jpg",
  },
  {
    id: 3,
    sc_en: "SC/EN/2021/3491",
    ba_en: "BASL/14981",
    name: "Wardani Karunaratne",
    email: "wardani.k@chambers.lk",
    mobile: "+94 76 591 7189",
    nic: "199468201944",
    gender: "Female",
    city: "Nugegoda",
    practiceArea: "Intellectual Property & IT Law",
    expertise: ["Copyright Law", "Fintech Regulation", "Cybercrime Defense"],
    membershipTier: "Ordinary",
    status: "Active",
    registeredDate: "04 May, 2022",
    membershipStartDate: "15 Apr, 2025",
    membershipEndDate: "14 Apr, 2026",
    avatarUrl: "/images/team/wardani-karunaratne.jpg",
  },
  {
    id: 4,
    sc_en: "SC/EN/2023/4102",
    ba_en: "BASL/16290",
    name: "Kunchana Samarakoon",
    email: "kunchana.samarakoon@gmail.com",
    mobile: "+94 70 334 1189",
    nic: "199718402219",
    gender: "Male",
    city: "Dehiwala",
    practiceArea: "Criminal Defense & Trial Advocacy",
    expertise: ["White Collar Crimes", "High Court Trials", "Forensic Evidence"],
    membershipTier: "None",
    status: "Inactive",
    registeredDate: "10 Oct, 2025",
    membershipStartDate: "-",
    membershipEndDate: "-",
    avatarUrl: "/images/team/kunchana-samarakoon.jpg",
  },
];

export const initialEvents: CLSEvent[] = [
  {
    id: 1,
    title: "Annual Law Conference 2026: The Digital Frontiers of Jurisprudence",
    category: "Annual Symposium",
    venue: "Main Auditorium, Superior Courts Complex",
    location: "Hulftsdorp, Colombo 12",
    startDateTime: "2026-11-20T09:00:00",
    endDateTime: "2026-11-20T17:30:00",
    price: 3500.00,
    status: "Upcoming",
    description: "The premier gathering of Sri Lanka's Supreme Court bar, exploring AI evidence admissibility, cross-border commercial dispute enforcement, and constitutional protection in the electronic age.",
    posterUrl: "/images/events/cls-actual-event.jpg",
    speakers: ["Hon. Chief Justice of Sri Lanka", "President of the Court of Appeal", "Senior Counsel Panel"],
    attendeeCount: 184,
  },
  {
    id: 2,
    title: "Masterclass: Appellate Brief Crafting & Oral Argumentation",
    category: "Continuing Legal Education",
    venue: "Law Society Auditorium",
    location: "Hulftsdorp St, Colombo 12",
    startDateTime: "2026-11-05T14:00:00",
    endDateTime: "2026-11-05T18:00:00",
    price: 1500.00,
    status: "Upcoming",
    description: "A focused, interactive training session designed for junior and mid-career counsel on preparing concise written submissions and handling court questioning during appellate hearings.",
    posterUrl: "/images/sri-lanka/hero-old-parliament.jpg",
    speakers: ["President's Counsel Faculty"],
    attendeeCount: 96,
  },
  {
    id: 3,
    title: "Symposium on Fundamental Rights & Public Interest Litigation",
    category: "Constitutional Law",
    venue: "BMICH Committee Lounge",
    location: "Bauddhaloka Mawatha, Colombo 07",
    startDateTime: "2026-10-28T09:30:00",
    endDateTime: "2026-10-28T16:00:00",
    price: 2500.00,
    status: "Upcoming",
    description: "Analyzing recent milestone judgments under Article 126 of the Constitution, environmental justice petitions, and remedies for regulatory inaction.",
    posterUrl: "/images/sri-lanka/independence-hall.jpg",
    speakers: ["Eminent Human Rights Jurists"],
    attendeeCount: 140,
  },
];

export const initialBroadcastLogs: BroadcastLog[] = [
  {
    id: 101,
    title: "Notice of Annual Ordinary Membership Renewal 2026/2027",
    content: "Dear Member, This is an official notice that Ordinary Memberships expire on 31 Dec. Kindly complete renewal via the member portal to maintain library & bar privileges.",
    channel: "BOTH",
    targetTier: "Ordinary Member",
    recipientsCount: 428,
    sentAt: "10 Oct, 2026 08:30 AM",
    status: "Delivered",
  },
  {
    id: 102,
    title: "Urgent: Court Sittings Schedule During Supreme Court Recess",
    content: "Notice from the Registrar regarding motion hearings and vacation court rosters available now on the CLS bulletin.",
    channel: "EMAIL",
    targetTier: "All Members",
    recipientsCount: 890,
    sentAt: "04 Oct, 2026 11:15 AM",
    status: "Delivered",
  },
  {
    id: 103,
    title: "Invitation: Annual Law Dinner & Junior Bar Welcome",
    content: "The Colombo Law Society cordially invites members to the 2026 Annual Law Dinner at the Galle Face Hotel.",
    channel: "SMS",
    targetTier: "All Members",
    recipientsCount: 750,
    sentAt: "28 Sep, 2026 16:45 PM",
    status: "Delivered",
  },
];

export const executiveCommittee = [
  {
    id: 1,
    name: "Mr. Sandun Nagahawatta",
    title: "President",
    credentials: "Attorney-at-Law",
    court: "Supreme Court Bar & Hulftsdorp",
    image: "/images/team/sandun-nagahawatta.jpg",
    bio: "Leading the Colombo Law Society with a vision of judicial modernization, advocate welfare, and constitutional independence of the Bar.",
    email: "president@colombolawsociety.com",
    phone: "+94 77 123 4567"
  },
  {
    id: 2,
    name: "Mr. Lahiru Welgama",
    title: "Secretary",
    credentials: "Attorney-at-Law, LL.B (Hons)",
    court: "Superior Courts Complex",
    image: "/images/team/lahiru-walgama.jpg",
    bio: "Coordinating society administration, registrar liaisons, continuing legal education symposia, and Bar Association relations.",
    email: "secretary@colombolawsociety.com",
    phone: "+94 71 892 3341"
  },
  {
    id: 3,
    name: "Ms. Gamali Amarathunga",
    title: "Treasurer",
    credentials: "Attorney-at-Law",
    court: "Colombo Bar & Commercial Benches",
    image: "/images/team/gamali-amarathunga.jpg",
    bio: "Managing the Society's fiscal governance, advocate benevolent trusts, member relief endowments, and annual subscriptions.",
    email: "treasurer@colombolawsociety.com",
    phone: "+94 77 443 2190"
  },
  {
    id: 4,
    name: "Mr. Dilum Jayanath",
    title: "Deputy President",
    credentials: "Attorney-at-Law",
    court: "Appellate & Commercial Courts",
    image: "/images/team/dilum-jayanath.jpg",
    bio: "Overseeing professional standards, courtroom infrastructure initiatives, and judicial service working committee dialogues.",
    email: "deputy.president@colombolawsociety.com",
    phone: "+94 76 554 8192"
  },
  {
    id: 5,
    name: "Ms. Wardani Karunaratne",
    title: "Assistant Secretary",
    credentials: "Attorney-at-Law",
    court: "Commercial High Court & IP Tribunals",
    image: "/images/team/wardani-karunaratne.jpg",
    bio: "Directing junior bar mentorship programs, publications, member communication bulletins, and legal research archives.",
    email: "asst.secretary@colombolawsociety.com",
    phone: "+94 77 912 3456"
  },
  {
    id: 6,
    name: "Mr. Kunchana Samarakoon",
    title: "Assistant Treasurer",
    credentials: "Attorney-at-Law",
    court: "Trial Advocacy & High Courts",
    image: "/images/team/kunchana-samarakoon.jpg",
    bio: "Administering member dues reconciliation, conference ticket logistics, and library acquisition endowments.",
    email: "asst.treasurer@colombolawsociety.com",
    phone: "+94 70 334 1189"
  },
  {
    id: 7,
    name: "Ms. Vindika Subasinghe",
    title: "Immediate Past President",
    credentials: "Attorney-at-Law, LL.M",
    court: "Supreme Court Bar",
    image: "/images/team/vindika-subasinghe.jpg",
    bio: "Distinguished past president providing senior counsel on constitutional governance, BASL liaison, and Bar welfare.",
    email: "vindika.subasinghe@colombolawsociety.com",
    phone: "+94 71 223 8899"
  },
  {
    id: 8,
    name: "Mr. Naveen Shanaka",
    title: "Past Secretary & Senior Council Member",
    credentials: "Attorney-at-Law",
    court: "Commercial High Court",
    image: "/images/team/naveen-shanaka.jpg",
    bio: "Former Secretary and dedicated senior council member directing arbitration symposia and practitioner support.",
    email: "naveen.shanaka@colombolawsociety.com",
    phone: "+94 71 892 3341"
  }
];

export interface PastPresident {
  year: string;
  name: string;
  credentials?: string;
  tenure: string;
  highlight?: string;
  image?: string;
}

export const pastPresidents: PastPresident[] = [
  { year: "2024", name: "Ms. Vindika Subasinghe", credentials: "Attorney-at-Law", tenure: "2024", highlight: "Digital transformation of the Colombo Law Society & 50th Anniversary initiatives.", image: "/images/team/vindika-subasinghe.jpg" },
  { year: "2022-2023", name: "Mr. Sanjeewa Dasanayake", credentials: "Attorney-at-Law", tenure: "2022 – 2023", highlight: "Strengthening bar welfare endowments and court accessibility." },
  { year: "2020-2021", name: "Mr. Vijaya Gamage", credentials: "Attorney-at-Law", tenure: "2020 – 2021", highlight: "Guided the Bar through pandemic court closures and remote hearings implementation." },
  { year: "2019", name: "Mr. Tivanka Ekaratne", credentials: "Attorney-at-Law", tenure: "2019", highlight: "Championed junior bar training and appellate masterclasses." },
  { year: "2018", name: "Mr. Jagath Wickramanayake", credentials: "President's Counsel", tenure: "2018", highlight: "Eminent appellate advocate and constitutional law leader." },
  { year: "2017", name: "Mr. Kaushalya Nawaratne", credentials: "President's Counsel", tenure: "2017", highlight: "Later elected President of the Bar Association of Sri Lanka (BASL)." },
  { year: "2015-2017", name: "Mr. Athula Perera", credentials: "Attorney-at-Law", tenure: "2015 – 2017", highlight: "Two-term president leading Hulftsdorp court complex infrastructure improvements." },
  { year: "2013-2014", name: "Mr. Amal Randeniya", credentials: "Attorney-at-Law", tenure: "2013 – 2014", highlight: "Expanded continuing legal education seminars for corporate practitioners." },
  { year: "2012", name: "Mr. Binara Gunasekera", credentials: "Attorney-at-Law", tenure: "2012", highlight: "Reformed the Colombo Law Society Constitution and working committee structure." },
  { year: "2010-2011", name: "Mr. Kamal Goonesinghe", credentials: "Attorney-at-Law", tenure: "2010 – 2011", highlight: "Established the annual National Law Symposium." },
  { year: "2008-2009", name: "Mr. Janaprith Fernando", credentials: "Attorney-at-Law", tenure: "2008 – 2009", highlight: "Fostered international bar associations liaison and human rights awareness." },
  { year: "2007", name: "Mr. Upul Jayasuriya", credentials: "President's Counsel", tenure: "2007", highlight: "Prominent defender of the independence of the Judiciary and later BASL President." },
  { year: "2006", name: "Mr. Mahinda B.K. Lokuge", credentials: "Attorney-at-Law", tenure: "2006", highlight: "Spearheaded advocate welfare funds and judicial service commission liaisons." },
  { year: "2005", name: "Mr. K.S. Ratnavale", credentials: "Attorney-at-Law", tenure: "2005", highlight: "Eminent fundamental rights practitioner and civil liberties advocate." },
  { year: "2003-2004", name: "Mr. Palitha Kumarasinghe", credentials: "President's Counsel", tenure: "2003 – 2004", highlight: "Distinguished appellate jurist and legal scholar." },
  { year: "2002", name: "Mr. Gamini Prematilleke", credentials: "Attorney-at-Law", tenure: "2002", highlight: "Strengthened Colombo Bar Library collections and research support." },
  { year: "2000-2001", name: "Mr. S. Bagirathan", credentials: "Attorney-at-Law", tenure: "2000 – 2001", highlight: "Turn of the millennium legal reforms and electronic court reporting advocacy." },
  { year: "1998-1999", name: "Mr. Nihal Pieris", credentials: "Attorney-at-Law", tenure: "1998 – 1999", highlight: "Pioneered early advocate computerization and court archive programs." },
  { year: "1997", name: "Mrs. Anoma Goonetilleke", credentials: "Attorney-at-Law", tenure: "1997", highlight: "Eminent female bar leader championing gender equality in legal practice." },
  { year: "1996", name: "Mr. K. Jayasekera", credentials: "Attorney-at-Law", tenure: "1996", highlight: "Advanced legal education and trial practice workshops." },
  { year: "1995", name: "Mr. Ajantha Athukorale", credentials: "Attorney-at-Law", tenure: "1995", highlight: "Former Secretary and dedicated champion of practitioner welfare." },
  { year: "1993-1994", name: "Mr. Gamani Jayasinghe", credentials: "Attorney-at-Law", tenure: "1993 – 1994", highlight: "Presided over the expansion of the Hulftsdorp Bar Library." },
  { year: "1991-1992", name: "Mr. G.P. Mahinkanda", credentials: "Attorney-at-Law", tenure: "1991 – 1992", highlight: "Honoris Causa recipient and legendary Bar stalwart." },
  { year: "1989-1990", name: "Mr. W. Dayaratne", credentials: "President's Counsel", tenure: "1989 – 1990", highlight: "Eminent legal luminary and later BASL President." },
  { year: "1988", name: "Mr. Palitha Mathew", credentials: "Attorney-at-Law", tenure: "1988", highlight: "Dedicated advocate for court administration reform." },
  { year: "1986-1987", name: "Mrs. Lena Fernando", credentials: "Attorney-at-Law", tenure: "1986 – 1987", highlight: "Historic first female President of the Colombo Law Society." },
  { year: "1985", name: "Mr. K. Balapatabendi", credentials: "Attorney-at-Law", tenure: "1985", highlight: "High Court trial practitioner and defender of civil justice." },
  { year: "1984", name: "Mr. R.B. Seneviratne", credentials: "Attorney-at-Law", tenure: "1984", highlight: "Fortified the working committee framework of the Society." },
  { year: "1979-1983", name: "Mr. Siva Rajaratnam", credentials: "Attorney-at-Law", tenure: "1979 – 1983", highlight: "Longest-serving early president across four vital formative years." },
  { year: "1977-1979", name: "Mr. Hermon J.C. Perera", credentials: "Attorney-at-Law", tenure: "1977 – 1979", highlight: "Consolidated the Society's membership across the Greater Colombo district." },
  { year: "1975-1976", name: "Mr. Nimal Senanayake", credentials: "President's Counsel", tenure: "1975 – 1976", highlight: "Founding President of the Colombo Law Society; titan of the Sri Lankan Bar." }
];

export interface VicePresident {
  name: string;
  tenure: string;
  role: string;
  portfolio: string;
  court: string;
  bio: string;
  image?: string;
}

export const vicePresidents: VicePresident[] = [
  {
    name: "Mr. Sandun Nagahawatta",
    tenure: "2023 – 2024",
    role: "Deputy President 1",
    portfolio: "Executive Direction & Bar Welfare",
    court: "Supreme Court Bar",
    image: "/images/team/sandun-nagahawatta.jpg",
    bio: "Served as Senior Deputy President spearheading judicial welfare trusts and subsequently elevated to President."
  },
  {
    name: "Mr. Dilum Jayanath",
    tenure: "2024 – Present",
    role: "Deputy President 2",
    portfolio: "Judicial Liaison & Practice Standards",
    court: "Appellate & Commercial Benches",
    image: "/images/team/dilum-jayanath.jpg",
    bio: "Coordinating bench-and-bar symposia, courtroom infrastructure projects, and registry digital integrations."
  },
  {
    name: "Mr. Kaushalya Nawaratne, PC",
    tenure: "2016 – 2017",
    role: "Vice President",
    portfolio: "Continuing Legal Education",
    court: "Superior Courts Enclave",
    bio: "Championed high-impact appellate workshops and judicial advocacy colloquiums before assuming the Presidency."
  },
  {
    name: "Mr. Tivanka Ekaratne",
    tenure: "2017 – 2018",
    role: "Vice President",
    portfolio: "Junior Bar & Chambers Development",
    court: "Colombo Bar",
    bio: "Led initiatives providing research grants, pupilage support, and court attire subsidies for junior practitioners."
  },
  {
    name: "Mr. Athula Perera",
    tenure: "2014 – 2015",
    role: "Vice President",
    portfolio: "Constitutional & Professional Ethics",
    court: "Hulftsdorp Superior Courts",
    bio: "Instrumental in reforming the society's internal governance and strengthening branch solidarity across the country."
  },
  {
    name: "Mr. Kamal Goonesinghe",
    tenure: "2009 – 2010",
    role: "Vice President",
    portfolio: "Bar Library & Archive Modernization",
    court: "Commercial High Court",
    bio: "Expanded access to rare Law Reports, New Law Reports (NLR), and legal scholarship for practicing advocates."
  },
  {
    name: "Mr. Janaprith Fernando",
    tenure: "2007 – 2008",
    role: "Vice President",
    portfolio: "International Relations & Youth Advocates",
    court: "Appellate Court",
    bio: "Established global dialogues with Commonwealth law societies and youth bar exchange initiatives."
  },
  {
    name: "Mrs. Anoma Goonetilleke",
    tenure: "1996 – 1997",
    role: "Vice President",
    portfolio: "Equality & Legal Aid",
    court: "Supreme Court",
    bio: "Trailblazing legal advocate who led fundamental rights aid missions before being elected Society President."
  }
];

export const honorisCausaMembers = [
  { name: "Mr. Nimal Senanayake, PC", title: "Founding President (1975)" },
  { name: "Mr. K. Kanag-Iswaran, PC", title: "Founding Secretary (1975) & Jurist" },
  { name: "Mr. W. Dayaratne, PC", title: "Past President & BASL President" },
  { name: "Mr. Upul Jayasuriya, PC", title: "Past President & Rule of Law Crusader" },
  { name: "Mr. Desmond Fernando, PC", title: "Past Secretary & International Jurist" },
  { name: "Mr. T.G. Guneratne", title: "Life Patron & Hulftsdorp Scholar" },
  { name: "Mr. Elliot Gunasekera", title: "Past Secretary & Treasurer" },
  { name: "Mr. G.P. Mahinkanda", title: "Past President" },
  { name: "Mr. Nihal Pieris", title: "Past President" },
  { name: "Mr. A.R.M. Khaleel", title: "Senior Hulftsdorp Counsel" },
  { name: "Mrs. Anoma Goonetilleke", title: "Past President & Pioneer" },
  { name: "Mrs. Lena Fernando", title: "First Female President (1986)" },
  { name: "Mr. S. Bagirathan", title: "Past President & Treasurer" },
  { name: "Mr. Palitha Mathew", title: "Past President & Secretary" },
  { name: "Mr. Janaprith Fernando", title: "Past President & Global Leader" },
  { name: "Mr. K. Kaneshayogan", title: "Past Secretary & Bar Patron" },
  { name: "Mr. Ajantha Athukorala", title: "Past President & Secretary" },
  { name: "Mr. Binara Gunasekera", title: "Past President & Constitutionalist" }
];


export const practiceDisciplines = [
  {
    number: "01",
    title: "Supreme Court Advocacy & Constitutional Writs",
    description: "Milestone jurisprudence representation in Fundamental Rights, special determination of bills, and constitutional interpretation before the highest bench.",
    image: "/images/sri-lanka/hero-old-parliament.jpg"
  },
  {
    number: "02",
    title: "Commercial Arbitration & Cross-Border Contracts",
    description: "International domestic tribunal hearings under UNCITRAL and ICLP rules governing maritime, construction, and high-stakes corporate disputes.",
    image: "/images/sri-lanka/colombo-skyline.jpg"
  },
  {
    number: "03",
    title: "Appellate & High Court Criminal Trial Practice",
    description: "Rigorous defense advocacy in serious fiscal offenses, money laundering tribunals, and Court of Appeal capital revisions.",
    image: "/images/sri-lanka/hulftsdorp-supreme-court.jpg"
  },
  {
    number: "04",
    title: "Intellectual Property, Fintech & Corporate Governance",
    description: "Defending technological trademarks, digital banking compliance, patents, and enterprise shareholder rights across the Commercial High Court.",
    image: "/images/sri-lanka/hulftsdorp-historic-court.jpg"
  }
];

export const faqsList = [
  {
    question: "WHAT ARE THE ELIGIBILITY CRITERIA FOR ORDINARY MEMBERSHIP?",
    answer: "Any Attorney-at-Law enrolled in the Supreme Court of the Democratic Socialist Republic of Sri Lanka who maintains a regular professional practice or residence within the judicial district of Colombo is eligible upon submission of their SC Enrolment Number and annual fee of LKR 2,000."
  },
  {
    question: "HOW CAN AN ADVOCATE UPGRADE TO PERMANENT LIFE MEMBERSHIP?",
    answer: "Attorneys-at-Law with at least five years of standing at the Bar may apply for Life Membership for a one-time fee of LKR 5,000. Life members receive lifetime library access, voting rights at the Annual General Meeting, and permanent waiver of annual renewals."
  },
  {
    question: "HOW DO MEMBERS ACCESS CONTINUING LEGAL EDUCATION CREDITS?",
    answer: "All symposiums, lectures, and masterclasses hosted at the Superior Courts Complex or BMICH are automatically recorded in your member portal dashboard upon attendance scan. Certificates of participation are issued digitally."
  },
  {
    question: "WHAT PRIVILEGES ARE ACCORDED TO COLOMBO LAW SOCIETY MEMBERS?",
    answer: "Members enjoy exclusive access to the CLS Hulftsdorp Bar Library, legal research databases, benevolent fund protections, robing room access at the Superior Courts, and direct liaison with the Judiciary on court scheduling."
  }
];

export const sriLankaCities = [
  "Colombo 01 (Fort)",
  "Colombo 02 (Slave Island)",
  "Colombo 03 (Kollupitiya)",
  "Colombo 04 (Bambalapitiya)",
  "Colombo 05 (Havelock / Kirulapone)",
  "Colombo 06 (Wellawatte)",
  "Colombo 07 (Cinnamon Gardens)",
  "Colombo 08 (Borella)",
  "Colombo 09 (Dematagoda)",
  "Colombo 10 (Maradana / Panchikawatte)",
  "Colombo 11 (Pettah)",
  "Colombo 12 (Hulftsdorp / Superior Courts)",
  "Colombo 13 (Kotahena)",
  "Colombo 14 (Grandpass)",
  "Colombo 15 (Mutwal)",
  "Nugegoda",
  "Dehiwala - Mount Lavinia",
  "Battaramulla",
  "Rajagiriya",
  "Kaduwela",
  "Maharagama",
  "Moratuwa",
  "Gampaha",
  "Negombo",
  "Kandy",
  "Galle",
  "Kurunegala"
];

export const practiceAreasCatalog = [
  "Constitutional & Fundamental Rights",
  "Commercial & Corporate Law",
  "Banking, Finance & Securities",
  "Criminal Defense & Trial Advocacy",
  "Intellectual Property & IT Law",
  "Family, Custody & Testamentary Law",
  "Labour & Industrial Disputes",
  "Admiralty & Maritime Law",
  "Taxation, Customs & Revenue Law",
  "Land, Real Estate & Conveyancing",
  "Environmental & Public Interest Law",
  "International Arbitration & Mediation"
];

export const specializationAreas = [
  "Appellate Court Advocacy",
  "Commercial High Court Trials",
  "Supreme Court Special Determinations",
  "Cross-Border M&A Advisory",
  "Fintech, Digital Assets & AI Law",
  "White-Collar Financial Crime Defense",
  "Judicial Review & Writs of Certiorari",
  "Arbitration Tribunal Representation",
  "Customs Inquiries & Fiscal Tribunals",
  "Patent & Trademark Enforcement",
  "Civil Appellate Revisions",
  "International Human Rights Petitions"
];

export interface MemberPortalProfile {
  id: number;
  sc_en: string;
  ba_en: string;
  salutation: string;
  name: string;
  initials: string;
  email: string;
  mobile: string;
  officePhone: string;
  nic: string;
  dob: string;
  gender: string;
  chamberAddress: string;
  city: string;
  primaryPractice: string;
  expertise: string[];
  membershipTier: "Ordinary" | "Life";
  membershipId: string;
  joinedDate: string;
  validUntil: string;
  cpdCreditsEarned: number;
  cpdCreditsTarget: number;
  status: "Active" | "Pending Renewal" | "Suspended";
  avatarUrl: string;
  recentTransactions: {
    receiptNo: string;
    description: string;
    amount: number;
    date: string;
    method: string;
    status: "Completed" | "Pending";
  }[];
  registeredEvents: {
    eventId: number;
    eventTitle: string;
    venue: string;
    date: string;
    ticketType: string;
    status: "Confirmed" | "Attended" | "Waitlisted";
    qrCode: string;
  }[];
}

export const currentMockMember: MemberPortalProfile = {
  id: 2,
  sc_en: "SC/EN/2018/2210",
  ba_en: "BASL/11204",
  salutation: "Mr.",
  name: "Naveen Shanaka",
  initials: "N. Shanaka",
  email: "naveen.shanaka@colombolaw.org",
  mobile: "+94 71 892 3341",
  officePhone: "+94 11 243 8912",
  nic: "198829104422",
  dob: "1988-08-14",
  gender: "Male",
  chamberAddress: "No. 42/B, Hulftsdorp Street, Superior Courts Enclave",
  city: "Colombo 12 (Hulftsdorp / Superior Courts)",
  primaryPractice: "Commercial & Corporate Law",
  expertise: [
    "Cross-Border Mergers",
    "Commercial Arbitration",
    "Banking Litigation",
    "Fintech, Digital Assets & AI Law"
  ],
  membershipTier: "Ordinary",
  membershipId: "CLS-ORD-2026-0842",
  joinedDate: "18 Mar, 2019",
  validUntil: "31 Dec, 2026",
  cpdCreditsEarned: 18,
  cpdCreditsTarget: 25,
  status: "Active",
  avatarUrl: "/images/team/naveen-shanaka.jpg",
  recentTransactions: [
    {
      receiptNo: "CLS-REC-2026-9042",
      description: "Annual Ordinary Membership Subscription (2026/2027)",
      amount: 2000.00,
      date: "02 Jan, 2026",
      method: "Mastercard •••• 4421",
      status: "Completed"
    },
    {
      receiptNo: "CLS-REC-2025-7819",
      description: "Annual Law Conference 2025 Delegate Pass",
      amount: 3000.00,
      date: "14 Nov, 2025",
      method: "Direct Bank Transfer",
      status: "Completed"
    },
    {
      receiptNo: "CLS-REC-2025-6102",
      description: "Supreme Court Library Access Card Re-issuance",
      amount: 500.00,
      date: "04 Jun, 2025",
      method: "Cash at Secretariat Counter",
      status: "Completed"
    }
  ],
  registeredEvents: [
    {
      eventId: 1,
      eventTitle: "Annual Law Conference 2026: The Digital Frontiers of Jurisprudence",
      venue: "Main Auditorium, Superior Courts Complex, Hulftsdorp",
      date: "20 Nov, 2026 • 09:00 AM",
      ticketType: "Member Delegate Pass",
      status: "Confirmed",
      qrCode: "CLS-TKT-2026-ALC-0092"
    }
  ]
};

export interface GalleryImage {
  id: number;
  title: string;
  category: "Annual Law Dinner" | "CLE Masterclass" | "National Conference" | "Ceremonial Sittings" | "Sports & Social";
  imageUrl: string;
  thumbnailUrl?: string;
  date: string;
  venue: string;
  description?: string;
  featured: boolean;
  photographer?: string;
  eventId?: number;
}

export const initialGalleryImages: GalleryImage[] = [
  {
    id: 1,
    title: "50th Golden Jubilee Commemoration & Law Conference",
    category: "National Conference",
    imageUrl: "/images/events/cls-actual-event.jpg",
    date: "12 Oct, 2025",
    venue: "Main Auditorium, Superior Courts Complex, Hulftsdorp",
    description: "Inaugural plenary session addressed by the Supreme Court bench and executive officers of the Colombo Law Society.",
    featured: true,
    photographer: "Official Secretariat Media",
    eventId: 1
  },
  {
    id: 2,
    title: "Opening of the Legal Year Ceremonial Assembly",
    category: "Ceremonial Sittings",
    imageUrl: "/images/sri-lanka/hero-old-parliament.jpg",
    date: "15 Jan, 2026",
    venue: "Ceremonial Courtroom & Hulftsdorp Forecourt",
    description: "Annual traditional procession of the Colombo Bar welcoming new practitioners and honoring senior advocates of over 50 years standing.",
    featured: true,
    photographer: "Chambers Archive"
  },
  {
    id: 3,
    title: "Annual Law Dinner & Bar Excellence Awards Gala",
    category: "Annual Law Dinner",
    imageUrl: "/images/sri-lanka/colombo-civic-palace.jpg",
    date: "28 Nov, 2025",
    venue: "The Grand Ballroom, Galle Face Hotel, Colombo",
    description: "Gala evening celebrating bar milestones with attendance of judicial officers, legal luminaries, and foreign delegates.",
    featured: true,
    photographer: "Colombo Society Media"
  },
  {
    id: 4,
    title: "Constitution Day Colloquium & Public Law Review",
    category: "CLE Masterclass",
    imageUrl: "/images/sri-lanka/independence-hall.jpg",
    date: "04 Feb, 2026",
    venue: "Independence Memorial Hall, Colombo 07",
    description: "Symposium on constitutional guarantees, fundamental rights adjudication, and judicial independence in South Asia.",
    featured: false,
    photographer: "Constitutional Law Forum"
  },
  {
    id: 5,
    title: "Junior Bar Robing & Professional Induction Seminar",
    category: "CLE Masterclass",
    imageUrl: "/images/sri-lanka/hulftsdorp-historic-court.jpg",
    date: "22 Mar, 2026",
    venue: "Law Society Auditorium, Hulftsdorp",
    description: "Intensive advocacy workshop and ethics induction for newly admitted Attorneys-at-Law entering Colombo chambers.",
    featured: false,
    photographer: "Junior Bar Committee",
    eventId: 2
  },
  {
    id: 6,
    title: "Maritime & Commercial Arbitration International Forum",
    category: "National Conference",
    imageUrl: "/images/sri-lanka/colombo-skyline.jpg",
    date: "18 May, 2026",
    venue: "Colombo International Financial Centre Auditorium",
    description: "Deliberations on admiralty law enforcement, cross-border corporate arbitration, and international commercial mediation rules.",
    featured: true,
    photographer: "Commercial Bar Bureau"
  },
  {
    id: 7,
    title: "Executive Committee Annual Induction & Swearing-In",
    category: "Ceremonial Sittings",
    imageUrl: "/images/team/sandun-nagahawatta.jpg",
    date: "05 Apr, 2026",
    venue: "Superior Courts Enclave, Colombo 12",
    description: "President Sandun Nagahawatta and the 2026/2027 Executive Committee taking official society charge.",
    featured: false,
    photographer: "Secretariat Records"
  },
  {
    id: 8,
    title: "Golden Jubilee Charter Commemoration Ceremony",
    category: "National Conference",
    imageUrl: "/images/branding/cls-50th-anniversary.jpg",
    date: "1975 – 2025 Celebration",
    venue: "Hulftsdorp Judicial Hub, Colombo",
    description: "Celebrating 50 years as the premier branch association of the Bar Association of Sri Lanka.",
    featured: true,
    photographer: "Charter Committee"
  }
];


