export interface LookupItem {
  id: number;
  name: string;
  [key: string]: string | number | undefined;
}

export interface UserRecord {
  id: number;
  username: string;
  name: string;
  email: string;
  password: string;
  role: string;
  is_active: boolean;
}

export interface PersonalDataRecord {
  id: number;
  name: string;
  jihadi_name: string;
  national_id_number: string;
  military_number: string;
  jihadist_number: string;
  phone_1: string;
  phone_2: string;
  date_of_birth_gregorian: string;
  date_of_birth_hijri: string;
  blood_type_id: number | null;
  marital_status_id: number | null;
  qualification_id: number | null;
  job_status_id: number | null;
  rank_id: number | null;
  military_district_id: number | null;
  division_id: number | null;
  financial_status_id: number | null;
  governorate_id: number | null;
  directorate_id: number | null;
  sub_area_id: number | null;
  village_id: number | null;
  internal_entity_id: number | null;
  current_address: string;
  unit: string;
  job: string;
  workplace: string;
  job_specialty: string;
  health_status: string;
  join_date: string;
  notes: string;
  main_profile_photo: string | null;
  created_at: string;
}

export interface SecurityReportRecord {
  id: number;
  personal_data_id: number | null;
  full_name: string;
  id_number: string;
  phone: string;
  report_type: string;
  report_topic: string;
  reporting_entity: string;
  area: string;
  military_number: string;
  residence_village: string;
  notes: string;
  report_date: string;
  classification: string;
  internal_entity_id: number | null;
  created_at: string;
}

export interface ArrestRecord {
  id: number;
  personal_data_id: number;
  arresting_authority_id: number | null;
  case_type_id: number | null;
  arrest_date: string;
  location: string;
  arrest_location: string;
  case_details: string;
  seized_items: string;
  case_follow_up_results: string;
  related_information: string;
  status: string;
  duration_period: string;
  conclusion: string;
  investigation_reports: string;
  release_date: string;
  release_reason: string;
  notes: string;
  created_at: string;
}

export interface SuspectRecord {
  id: number;
  personal_data_id: number;
  suspect_number: string;
  suspicion_date: string;
  suspicion_type: string;
  suspicion_location: string;
  suspicion_level: string;
  status: string;
  information_source: string;
  is_arrested: boolean;
  suspicion_details: string;
  monitoring_results: string;
  suspicion_follower: string;
  suspicion_report: string;
  observations: string;
  created_at: string;
}

function isoDaysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

export const users: UserRecord[] = [
  {
    id: 1,
    username: 'superadmin',
    name: 'المسؤول العام',
    email: 'admin@system.com',
    password: 'password',
    role: 'super-admin',
    is_active: true,
  },
  {
    id: 2,
    username: 'admin',
    name: 'مدير النظام',
    email: 'manager@system.com',
    password: 'password',
    role: 'admin',
    is_active: true,
  },
];

export const lookups = {
  bloodTypes: ['O+', 'A+', 'B+', 'O-', 'A-', 'B-', 'AB+', 'AB-'].map((name, idx) => ({ id: idx + 1, name })),
  maritalStatuses: ['أعزب', 'متزوج', 'مطلق', 'أرمل'].map((name, idx) => ({ id: idx + 1, name })),
  qualifications: ['بدون مؤهل', 'ابتدائية', 'إعدادية', 'ثانوية', 'دبلوم', 'بكالوريوس', 'ماجستير', 'دكتوراه'].map((name, idx) => ({ id: idx + 1, name })),
  jobStatuses: ['نشط', 'متقاعد', 'موقوف مؤقتاً', 'مفصول'].map((name, idx) => ({ id: idx + 1, name })),
  ranks: ['جندي', 'عريف', 'رقيب', 'ملازم أول', 'نقيب', 'رائد', 'مقدم', 'عقيد'].map((name, idx) => ({ id: idx + 1, name })),
  financialStatuses: ['معتمد', 'غير معتمد', 'تحت المراجعة', 'موقوف'].map((name, idx) => ({ id: idx + 1, name })),
  militaryDistricts: ['المنطقة الأولى', 'المنطقة الثانية', 'المنطقة الثالثة', 'المنطقة الرابعة'].map((name, idx) => ({ id: idx + 1, name })),
  divisions: [
    { id: 1, name: 'الشعبة الأولى أفراد', military_district_id: 1 },
    { id: 2, name: 'الشعبة الثانية عمليات', military_district_id: 1 },
    { id: 3, name: 'شعبة التدريب', military_district_id: 2 },
    { id: 4, name: 'شعبة الاستخبارات', military_district_id: 3 },
  ] as LookupItem[],
  countries: [{ id: 1, name: 'اليمن' }] as LookupItem[],
  governorates: ['عدن', 'صنعاء', 'تعز', 'حضرموت', 'لحج', 'أبين'].map((name, idx) => ({ id: idx + 1, name })),
  directorates: [
    { id: 1, name: 'المنصورة', governorate_id: 1 },
    { id: 2, name: 'الشيخ عثمان', governorate_id: 1 },
    { id: 3, name: 'خورمكسر', governorate_id: 1 },
    { id: 4, name: 'السبعين', governorate_id: 2 },
    { id: 5, name: 'صالة', governorate_id: 3 },
    { id: 6, name: 'المكلا', governorate_id: 4 },
  ] as LookupItem[],
  subAreas: [
    { id: 1, name: 'العزلة الأولى', directorate_id: 1, governorate_id: 1 },
    { id: 2, name: 'المنطقة السكنية أ', directorate_id: 2, governorate_id: 1 },
    { id: 3, name: 'المنطقة السكنية ب', directorate_id: 3, governorate_id: 1 },
    { id: 4, name: 'حي الوحدة', directorate_id: 4, governorate_id: 2 },
  ] as LookupItem[],
  villages: [
    { id: 1, name: 'قرية السلام', sub_area_id: 1 },
    { id: 2, name: 'حي النصر', sub_area_id: 2 },
    { id: 3, name: 'حي الرشيد', sub_area_id: 3 },
    { id: 4, name: 'شارع الخمسين', sub_area_id: 4 },
  ] as LookupItem[],
  internalEntities: [
    { id: 1, name: 'الشعبة الأولى أفراد' },
    { id: 2, name: 'الشعبة الثانية عمليات' },
    { id: 3, name: 'شعبة التدريب الفني' },
  ] as LookupItem[],
  arrestingAuthorities: [
    { id: 1, name: 'إدارة البحث الجنائي' },
    { id: 2, name: 'جهاز الأمن والمخابرات' },
    { id: 3, name: 'الشرطة العسكرية' },
    { id: 4, name: 'إدارة أمن المحافظة' },
  ] as LookupItem[],
  caseTypes: [
    { id: 1, name: 'جنائية' },
    { id: 2, name: 'عسكرية' },
    { id: 3, name: 'سياسية' },
    { id: 4, name: 'إرهاب' },
    { id: 5, name: 'مخدرات' },
  ] as LookupItem[],
};

const sampleNames = [
  'محمد أحمد علي الجابري',
  'عبد الرحمن حسين محمود',
  'أحمد سعيد صالح اليافعي',
  'خالد عبدالله عمر باوزير',
  'ياسر علي ناصر اليافعي',
  'صالح محمد قاسم العمري',
  'عبد العزيز مانع حسين',
  'عمر فاروق عثمان بن عفيف',
  'سالم علي مسعد العامري',
  'حسن عبد الله حسن علوي',
  'حسين محمد علي فضل',
  'فهد صالح مسعد مقبل',
  'عبد اللطيف أحمد قاسم',
  'سعيد علي ناجي الحارثي',
  'جمال عبد الناصر حسين',
];

export const personalDataStore: PersonalDataRecord[] = sampleNames.map((name, i) => ({
  id: i + 1,
  name,
  jihadi_name: `أبو ${name.split(' ')[1] || 'أحمد'}`,
  national_id_number: `10${String(i + 1).padStart(8, '0')}`,
  military_number: `M-${1000 + i}`,
  jihadist_number: `J-${9000 + i}`,
  phone_1: `77${String(i + 1).padStart(7, '0')}`,
  phone_2: `73${String(i + 1).padStart(7, '0')}`,
  date_of_birth_gregorian: `${1982 + (i % 15)}-0${(i % 9) + 1}-15`,
  date_of_birth_hijri: `${1402 + (i % 15)}/01/01`,
  blood_type_id: (i % lookups.bloodTypes.length) + 1,
  marital_status_id: (i % lookups.maritalStatuses.length) + 1,
  qualification_id: (i % lookups.qualifications.length) + 1,
  job_status_id: (i % lookups.jobStatuses.length) + 1,
  rank_id: (i % lookups.ranks.length) + 1,
  military_district_id: (i % lookups.militaryDistricts.length) + 1,
  division_id: (i % lookups.divisions.length) + 1,
  financial_status_id: (i % lookups.financialStatuses.length) + 1,
  governorate_id: (i % lookups.governorates.length) + 1,
  directorate_id: (i % lookups.directorates.length) + 1,
  sub_area_id: (i % lookups.subAreas.length) + 1,
  village_id: (i % lookups.villages.length) + 1,
  internal_entity_id: (i % lookups.internalEntities.length) + 1,
  current_address: `حي ${i % 2 === 0 ? 'المنصورة' : 'الشيخ عثمان'} - مربع ${(i % 5) + 1}`,
  unit: `الكتيبة ${(i % 10) + 1} - السرية ${(i % 3) + 1}`,
  job: `قائد فصيل ${(i % 5) + 1}`,
  workplace: `محافظة عدن - قطاع ${i % 3 === 0 ? 'شمال عدن' : i % 3 === 1 ? 'البريقة' : 'المنصورة'}`,
  job_specialty: i % 2 === 0 ? 'مخابرات وأمن' : 'مدفعية وإسناد ناري',
  health_status: 'لائق',
  join_date: `${2016 + (i % 7)}-03-01`,
  notes: 'سجل مستوفى ومطابق للوثائق الرسمية المعتمدة.',
  main_profile_photo: null,
  created_at: i < 2 ? isoDaysAgo(0) : isoDaysAgo(i % 7),
}));

export const securityReportsStore: SecurityReportRecord[] = [
  {
    id: 1,
    personal_data_id: 1,
    full_name: sampleNames[0],
    id_number: '3000000001',
    phone: '710000001',
    report_type: 'اشتباه أمني',
    report_topic: 'متابعة تحركات ميدانية غير اعتيادية',
    reporting_entity: 'الشعبة الثانية عمليات',
    area: 'مديرية المنصورة - مربع 1',
    military_number: 'M-1000',
    residence_village: 'قرية السلام',
    notes: 'بلاغ وارد من قيادة القطاع الشمالي بخصوص مراجعة السيرة والسلوك.',
    report_date: isoDaysAgo(0),
    classification: 'نشط',
    internal_entity_id: 2,
    created_at: isoDaysAgo(0),
  },
  {
    id: 2,
    personal_data_id: 3,
    full_name: sampleNames[2],
    id_number: '3000000003',
    phone: '710000003',
    report_type: 'بلاغ إداري',
    report_topic: 'تحديث بيانات العهدة والتنقلات',
    reporting_entity: 'الشعبة الأولى أفراد',
    area: 'مديرية الشيخ عثمان - مربع 2',
    military_number: 'M-1002',
    residence_village: 'حي النصر',
    notes: 'يرجى استكمال مستندات النقل بين الوحدات.',
    report_date: isoDaysAgo(1),
    classification: 'قيد المتابعة والبحث الأولي',
    internal_entity_id: 1,
    created_at: isoDaysAgo(1),
  },
  {
    id: 3,
    personal_data_id: 5,
    full_name: sampleNames[4],
    id_number: '3000000005',
    phone: '710000005',
    report_type: 'شكوى جنائية',
    report_topic: 'التحقق من وثائق هوية مكررة',
    reporting_entity: 'جهاز الأمن والمخابرات',
    area: 'مديرية خورمكسر - مربع 3',
    military_number: 'M-1004',
    residence_village: 'حي الرشيد',
    notes: 'تم فتح محضر فحص ومطابقة في السجل المركزي.',
    report_date: isoDaysAgo(2),
    classification: 'نشط',
    internal_entity_id: 2,
    created_at: isoDaysAgo(2),
  },
  {
    id: 4,
    personal_data_id: 7,
    full_name: sampleNames[6],
    id_number: '3000000007',
    phone: '710000007',
    report_type: 'اشتباه أمني',
    report_topic: 'رصد اتصالات خارج النطاق المصرح',
    reporting_entity: 'شعبة الاستخبارات',
    area: 'مديرية السبعين - مربع 4',
    military_number: 'M-1006',
    residence_village: 'شارع الخمسين',
    notes: 'متابعة مستمرة بالتنسيق مع الضابط الميداني.',
    report_date: isoDaysAgo(4),
    classification: 'قيد المتابعة والبحث الأولي',
    internal_entity_id: 3,
    created_at: isoDaysAgo(4),
  },
  {
    id: 5,
    personal_data_id: 9,
    full_name: sampleNames[8],
    id_number: '3000000009',
    phone: '710000009',
    report_type: 'بلاغ إداري',
    report_topic: 'انقطاع عن الخدمة دون إذن مسبق',
    reporting_entity: 'الشعبة الأولى أفراد',
    area: 'مديرية المنصورة - مربع 2',
    military_number: 'M-1008',
    residence_village: 'قرية السلام',
    notes: 'تم رفع التقرير للجهة المختصة لاتخاذ الإجراء النظامي.',
    report_date: isoDaysAgo(5),
    classification: 'نشط',
    internal_entity_id: 1,
    created_at: isoDaysAgo(5),
  },
];

export const arrestsStore: ArrestRecord[] = [
  {
    id: 1,
    personal_data_id: 2,
    arresting_authority_id: 3,
    case_type_id: 2,
    arrest_date: isoDaysAgo(0),
    location: 'محافظة عدن - نقطة 1',
    arrest_location: 'نقطة العلم العسكرية',
    case_details: 'تم ضبطه للاشتباه في وجود مستندات غير مكتملة، وتمت مراجعة حالته أصولاً.',
    seized_items: 'هاتف ذكي، بطاقة عسكرية منتهية الصلاحية',
    case_follow_up_results: 'تم استيفاء البيانات المطلوبة والتحقق من المرجعية العسكرية.',
    related_information: 'يتبع للواء الاستخبارات العسكرية الفرقة الأولى.',
    status: 'قيد التحقيق',
    duration_period: '3 أيام',
    conclusion: 'قيد الاستكمال والمطابقة.',
    investigation_reports: 'تقرير أولي رقم 501 صادر عن إدارة التحريات.',
    release_date: '',
    release_reason: '',
    notes: 'سلوك منضبط أثناء فترة التواجد.',
    created_at: isoDaysAgo(0),
  },
  {
    id: 2,
    personal_data_id: 4,
    arresting_authority_id: 1,
    case_type_id: 1,
    arrest_date: isoDaysAgo(2),
    location: 'محافظة عدن - نقطة 2',
    arrest_location: 'نقطة الرباط',
    case_details: 'توقيف احترازي لحين التحقق من بلاغ إداري وارد.',
    seized_items: 'لا يوجد',
    case_follow_up_results: 'ثبتت سلامة الموقف النظامي.',
    related_information: 'ملف محال من الشعبة الأولى.',
    status: 'مفرج عنه',
    duration_period: '2 يوم',
    conclusion: 'لا توجد سوابق أمنية، تم الإفراج بضمانة.',
    investigation_reports: 'تقرير رقم 502',
    release_date: isoDaysAgo(1),
    release_reason: 'ثبوت سلامة الموقف الأمني بعد تقديم الضمانات',
    notes: 'أُغلق المحضر أصولاً.',
    created_at: isoDaysAgo(2),
  },
  {
    id: 3,
    personal_data_id: 6,
    arresting_authority_id: 2,
    case_type_id: 3,
    arrest_date: isoDaysAgo(4),
    location: 'محافظة صنعاء - قطاع السبعين',
    arrest_location: 'نقطة التفتيش المركزية',
    case_details: 'تحفظ إداري لاستكمال إجراءات التثبت من الهوية.',
    seized_items: 'جهاز محمول، أوراق ثبوتية',
    case_follow_up_results: 'تم الفحص الفني للأجهزة.',
    related_information: 'تنسيق مع وحدة نظم المعلومات.',
    status: 'قيد التحقيق',
    duration_period: '5 أيام',
    conclusion: 'بانتظار النتيجة النهائية.',
    investigation_reports: 'تقرير فني رقم 503',
    release_date: '',
    release_reason: '',
    notes: 'تحت المتابعة الدورية.',
    created_at: isoDaysAgo(4),
  },
];

export const suspectsStore: SuspectRecord[] = [
  {
    id: 1,
    personal_data_id: 1,
    suspect_number: 'S-7001',
    suspicion_date: isoDaysAgo(1),
    suspicion_type: 'اشتباه أمني وعسكري',
    suspicion_location: 'قطاع بئر أحمد العسكري',
    suspicion_level: 'مرتفع',
    status: 'حرج',
    information_source: 'بلاغات استخباراتية واردة من نقطة الرباط',
    is_arrested: false,
    suspicion_details: 'تكرار تحركات غير مصرح بها خارج أوقات الخدمة الرسمية.',
    monitoring_results: 'الرقابة الميدانية مستمرة.',
    suspicion_follower: 'الضابط المسؤول صالح أحمد محسن',
    suspicion_report: 'تقرير الاشتباه الأمني الدوري رقم 301',
    observations: 'الحالة قيد الاستقصاء والمتابعة المستمرة.',
    created_at: isoDaysAgo(1),
  },
  {
    id: 2,
    personal_data_id: 5,
    suspect_number: 'S-7002',
    suspicion_date: isoDaysAgo(3),
    suspicion_type: 'اشتباه مالي وإداري',
    suspicion_location: 'قطاع المنصورة',
    suspicion_level: 'متوسط',
    status: 'تحذير',
    information_source: 'تقرير مراجعة داخلية',
    is_arrested: false,
    suspicion_details: 'تباين في سجلات الصرف والعهدة.',
    monitoring_results: 'تم استدعاء المعني للمراجعة.',
    suspicion_follower: 'الضابط المسؤول علوي محمد فضل',
    suspicion_report: 'تقرير رقم 302',
    observations: 'مطلوب استيفاء المستندات.',
    created_at: isoDaysAgo(3),
  },
  {
    id: 3,
    personal_data_id: 8,
    suspect_number: 'S-7003',
    suspicion_date: isoDaysAgo(6),
    suspicion_type: 'اشتباه إداري',
    suspicion_location: 'الشيخ عثمان',
    suspicion_level: 'منخفض',
    status: 'عادي',
    information_source: 'ملاحظة ميدانية',
    is_arrested: false,
    suspicion_details: 'تأخر متكرر عن الطابور الصباحي.',
    monitoring_results: 'تم التنبيه والتوجيه.',
    suspicion_follower: 'الضابط المسؤول ماجد علي شاهر',
    suspicion_report: 'تقرير رقم 303',
    observations: 'التزم لاحقاً بالدوام الرسمي.',
    created_at: isoDaysAgo(6),
  },
  {
    id: 4,
    personal_data_id: 11,
    suspect_number: 'S-7004',
    suspicion_date: isoDaysAgo(2),
    suspicion_type: 'اشتباه أمني وعسكري',
    suspicion_location: 'نقطة العلم',
    suspicion_level: 'مرتفع',
    status: 'حرج',
    information_source: 'بلاغ سري موثق',
    is_arrested: true,
    suspicion_details: 'محاولة عبور دون تصريح مهمات ساري.',
    monitoring_results: 'تم التحفظ وفتح محضر.',
    suspicion_follower: 'الضابط المسؤول رائد عبدالله مسعد',
    suspicion_report: 'تقرير رقم 304',
    observations: 'محال للتحقيق.',
    created_at: isoDaysAgo(2),
  },
];

let nextIds = {
  personalData: personalDataStore.length + 1,
  reports: securityReportsStore.length + 1,
  arrests: arrestsStore.length + 1,
  suspects: suspectsStore.length + 1,
};

export function getNextId(kind: keyof typeof nextIds): number {
  return nextIds[kind]++;
}

export function findLookupName(list: LookupItem[], id: number | null | undefined): string | null {
  if (!id) return null;
  return list.find((item) => item.id === Number(id))?.name ?? null;
}

export function enrichPersonalData(p: PersonalDataRecord) {
  return {
    ...p,
    bloodType: p.blood_type_id ? { id: p.blood_type_id, type: findLookupName(lookups.bloodTypes, p.blood_type_id) } : null,
    blood_type: findLookupName(lookups.bloodTypes, p.blood_type_id),
    maritalStatus: p.marital_status_id ? { id: p.marital_status_id, name: findLookupName(lookups.maritalStatuses, p.marital_status_id) } : null,
    qualification: p.qualification_id ? { id: p.qualification_id, name: findLookupName(lookups.qualifications, p.qualification_id) } : null,
    jobStatus: p.job_status_id ? { id: p.job_status_id, name: findLookupName(lookups.jobStatuses, p.job_status_id) } : null,
    rankObj: p.rank_id ? { id: p.rank_id, name: findLookupName(lookups.ranks, p.rank_id) } : null,
    rank: findLookupName(lookups.ranks, p.rank_id) || 'غير محدد',
    militaryDistrict: p.military_district_id ? { id: p.military_district_id, name: findLookupName(lookups.militaryDistricts, p.military_district_id) } : null,
    division: p.division_id ? { id: p.division_id, name: findLookupName(lookups.divisions, p.division_id) } : null,
    financialStatus: p.financial_status_id ? { id: p.financial_status_id, name: findLookupName(lookups.financialStatuses, p.financial_status_id) } : null,
    governorate: p.governorate_id ? { id: p.governorate_id, name: findLookupName(lookups.governorates, p.governorate_id) } : null,
    directorate: p.directorate_id ? { id: p.directorate_id, name: findLookupName(lookups.directorates, p.directorate_id) } : null,
    subArea: p.sub_area_id ? { id: p.sub_area_id, name: findLookupName(lookups.subAreas, p.sub_area_id) } : null,
    village: p.village_id ? { id: p.village_id, name: findLookupName(lookups.villages, p.village_id) } : null,
    internal_entity: p.internal_entity_id ? { id: p.internal_entity_id, name: findLookupName(lookups.internalEntities, p.internal_entity_id) } : null,
  };
}

export function enrichArrest(a: ArrestRecord) {
  const person = personalDataStore.find((p) => p.id === a.personal_data_id);
  return {
    ...a,
    personalData: person ? enrichPersonalData(person) : null,
    arrestingAuthority: a.arresting_authority_id ? { id: a.arresting_authority_id, name: findLookupName(lookups.arrestingAuthorities, a.arresting_authority_id) } : null,
    caseType: a.case_type_id ? { id: a.case_type_id, name: findLookupName(lookups.caseTypes, a.case_type_id) } : null,
  };
}

export function enrichSuspect(s: SuspectRecord) {
  const person = personalDataStore.find((p) => p.id === s.personal_data_id);
  return {
    ...s,
    personalData: person ? enrichPersonalData(person) : null,
  };
}

export function enrichReport(r: SecurityReportRecord) {
  const person = r.personal_data_id ? personalDataStore.find((p) => p.id === r.personal_data_id) : null;
  return {
    ...r,
    personalData: person ? enrichPersonalData(person) : null,
    internalEntity: r.internal_entity_id ? { id: r.internal_entity_id, name: findLookupName(lookups.internalEntities, r.internal_entity_id) } : null,
  };
}

export function getDashboardData() {
  const todayStr = new Date().toISOString().slice(0, 10);
  const todayPersonal = personalDataStore.filter((p) => p.created_at === todayStr).length;
  const todayReports = securityReportsStore.filter((r) => r.created_at === todayStr).length;
  const todayArrests = arrestsStore.filter((a) => a.created_at === todayStr).length;

  const daysMap = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  const labels: string[] = [];
  const reportsDaily: number[] = [];
  const arrestsDaily: number[] = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const ds = d.toISOString().slice(0, 10);
    labels.push(daysMap[d.getDay()]);
    reportsDaily.push(securityReportsStore.filter((r) => r.created_at === ds).length);
    arrestsDaily.push(arrestsStore.filter((a) => a.created_at === ds).length);
  }

  const critical = suspectsStore.filter((s) => s.status === 'حرج').length;
  const warning = suspectsStore.filter((s) => s.status === 'تحذير').length;
  const normal = suspectsStore.filter((s) => s.status !== 'حرج' && s.status !== 'تحذير').length;

  return {
    stats: {
      total_today: todayPersonal + todayReports + todayArrests,
      personal_data_count: personalDataStore.length,
      reports_count: securityReportsStore.length,
      arrests_count: arrestsStore.length,
      suspicious_count: suspectsStore.length,
      critical_suspects: critical,
      courses_count: 15,
      security_files_count: 12,
      wives_count: 15,
      relatives_count: 30,
    },
    chart_data: {
      labels,
      reports_daily: reportsDaily,
      arrests_daily: arrestsDaily,
      suspects_breakdown: { critical, warning, normal },
    },
    recent_entries: [...personalDataStore]
      .sort((a, b) => b.id - a.id)
      .slice(0, 6)
      .map(enrichPersonalData),
  };
}
