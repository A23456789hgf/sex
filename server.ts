import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express, { NextFunction, Request, Response } from 'express';
import {
  arrestsStore,
  enrichArrest,
  enrichPersonalData,
  enrichReport,
  enrichSuspect,
  getDashboardData,
  getNextId,
  lookups,
  personalDataStore,
  securityReportsStore,
  suspectsStore,
  UserRecord,
  users,
} from './src/store.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT || 3000);
const APP_NAME = process.env.APP_NAME || 'نظام المعلومات';

interface SessionData {
  user: UserRecord;
  flashSuccess?: string;
}

const sessions = new Map<string, SessionData>();

function parseCookies(cookieHeader: string | undefined): Record<string, string> {
  const result: Record<string, string> = {};
  if (!cookieHeader) return result;
  for (const part of cookieHeader.split(';')) {
    const idx = part.indexOf('=');
    if (idx === -1) continue;
    const key = part.slice(0, idx).trim();
    const val = decodeURIComponent(part.slice(idx + 1).trim());
    result[key] = val;
  }
  return result;
}

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Support HTML form _method override (? _method=PUT / DELETE)
app.use((req: Request, _res: Response, next: NextFunction) => {
  const override = (req.query._method as string | undefined) || (req.body?._method as string | undefined);
  if (override && ['PUT', 'PATCH', 'DELETE'].includes(override.toUpperCase())) {
    req.method = override.toUpperCase();
  }
  next();
});

// Attach session, currentUser, appName, currentPath, and flash messages to locals
app.use((req: Request, res: Response, next: NextFunction) => {
  const cookies = parseCookies(req.headers.cookie);
  const sid = cookies.sid;
  const session = sid ? sessions.get(sid) : undefined;
  res.locals.appName = APP_NAME;
  res.locals.currentPath = req.path;
  res.locals.currentUser = session?.user ?? null;
  res.locals.flashSuccess = session?.flashSuccess ?? null;
  if (session?.flashSuccess) {
    delete session.flashSuccess;
  }
  (req as Request & { sessionData?: SessionData }).sessionData = session;
  next();
});

function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const session = (req as Request & { sessionData?: SessionData }).sessionData;
  if (!session) {
    res.redirect('/login');
    return;
  }
  next();
}

function setFlashSuccess(req: Request, msg: string): void {
  const session = (req as Request & { sessionData?: SessionData }).sessionData;
  if (session) {
    session.flashSuccess = msg;
  }
}

// ── Auth Routes ────────────────────────────────────────────────────────────
app.get('/login', (req: Request, res: Response) => {
  const session = (req as Request & { sessionData?: SessionData }).sessionData;
  if (session) {
    res.redirect('/dashboard');
    return;
  }
  res.render('auth/login', { error: null, username: '' });
});

app.post('/login', (req: Request, res: Response) => {
  const username = String(req.body?.username || '').trim();
  const password = String(req.body?.password || '');

  const found = users.find(
    (u) => (u.username === username || u.email === username) && u.password === password && u.is_active
  );

  if (!found) {
    res.status(422).render('auth/login', {
      error: 'بيانات الاعتماد غير صحيحة. استخدم superadmin / password.',
      username,
    });
    return;
  }

  const sid = crypto.randomBytes(24).toString('hex');
  sessions.set(sid, { user: found });
  res.setHeader('Set-Cookie', `sid=${encodeURIComponent(sid)}; Path=/; HttpOnly; SameSite=Lax`);
  res.redirect('/dashboard');
});

app.post('/logout', (req: Request, res: Response) => {
  const cookies = parseCookies(req.headers.cookie);
  if (cookies.sid) {
    sessions.delete(cookies.sid);
  }
  res.setHeader('Set-Cookie', 'sid=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax');
  res.redirect('/login');
});

app.get('/', (_req: Request, res: Response) => {
  res.redirect('/dashboard');
});

// ── Dashboard ──────────────────────────────────────────────────────────────
app.get('/dashboard', requireAuth, (_req: Request, res: Response) => {
  const data = getDashboardData();
  res.render('dashboard', data);
});

// ── Personal Data CRUD + Print ─────────────────────────────────────────────
app.get('/system/personal-data', requireAuth, (req: Request, res: Response) => {
  const search = String(req.query.search || '').trim().toLowerCase();
  const filtered = personalDataStore
    .filter((p) => {
      if (!search) return true;
      return (
        p.name.toLowerCase().includes(search) ||
        p.jihadi_name.toLowerCase().includes(search) ||
        p.national_id_number.toLowerCase().includes(search) ||
        p.military_number.toLowerCase().includes(search)
      );
    })
    .sort((a, b) => b.id - a.id)
    .map(enrichPersonalData);

  const todayStr = new Date().toISOString().slice(0, 10);
  const todayCount = personalDataStore.filter((p) => p.created_at === todayStr).length;

  res.render('personal_data/index', {
    records: filtered,
    total: filtered.length,
    todayCount,
    search: req.query.search || '',
  });
});

app.get('/system/personal-data/create', requireAuth, (_req: Request, res: Response) => {
  res.render('personal_data/create', { lookups });
});

app.post('/system/personal-data', requireAuth, (req: Request, res: Response) => {
  const body = req.body || {};
  const id = getNextId('personalData');
  personalDataStore.push({
    id,
    name: String(body.name || 'منتسب جديد').trim(),
    jihadi_name: String(body.jihadi_name || '').trim(),
    national_id_number: String(body.national_id_number || '').trim(),
    military_number: String(body.military_number || '').trim(),
    jihadist_number: '',
    phone_1: String(body.phone_1 || '').trim(),
    phone_2: '',
    date_of_birth_gregorian: String(body.date_of_birth_gregorian || '').trim(),
    date_of_birth_hijri: '',
    blood_type_id: body.blood_type_id ? Number(body.blood_type_id) : null,
    marital_status_id: body.marital_status_id ? Number(body.marital_status_id) : null,
    qualification_id: body.qualification_id ? Number(body.qualification_id) : null,
    job_status_id: 1,
    rank_id: body.rank_id ? Number(body.rank_id) : null,
    military_district_id: 1,
    division_id: 1,
    financial_status_id: 1,
    governorate_id: body.governorate_id ? Number(body.governorate_id) : null,
    directorate_id: null,
    sub_area_id: null,
    village_id: null,
    internal_entity_id: body.internal_entity_id ? Number(body.internal_entity_id) : null,
    current_address: String(body.current_address || '').trim(),
    unit: '',
    job: '',
    workplace: '',
    job_specialty: '',
    health_status: 'لائق',
    join_date: new Date().toISOString().slice(0, 10),
    notes: String(body.notes || '').trim(),
    main_profile_photo: null,
    created_at: new Date().toISOString().slice(0, 10),
  });
  setFlashSuccess(req, 'تمت إضافة السجل الشخصي بنجاح.');
  res.redirect('/system/personal-data');
});

app.get('/system/personal-data/:id', requireAuth, (req: Request, res: Response) => {
  const found = personalDataStore.find((p) => p.id === Number(req.params.id));
  if (!found) {
    res.status(404).send('السجل غير موجود');
    return;
  }
  res.render('personal_data/show', { personalData: enrichPersonalData(found) });
});

app.get('/system/personal-data/:id/edit', requireAuth, (req: Request, res: Response) => {
  const found = personalDataStore.find((p) => p.id === Number(req.params.id));
  if (!found) {
    res.status(404).send('السجل غير موجود');
    return;
  }
  res.render('personal_data/edit', { record: found, lookups });
});

app.put('/system/personal-data/:id', requireAuth, (req: Request, res: Response) => {
  const found = personalDataStore.find((p) => p.id === Number(req.params.id));
  if (!found) {
    res.status(404).send('السجل غير موجود');
    return;
  }
  const body = req.body || {};
  found.name = String(body.name || found.name).trim();
  found.national_id_number = String(body.national_id_number ?? found.national_id_number).trim();
  found.jihadi_name = String(body.jihadi_name ?? found.jihadi_name).trim();
  found.military_number = String(body.military_number ?? found.military_number).trim();
  found.date_of_birth_gregorian = String(body.date_of_birth_gregorian ?? found.date_of_birth_gregorian).trim();
  found.phone_1 = String(body.phone_1 ?? found.phone_1).trim();
  found.blood_type_id = body.blood_type_id ? Number(body.blood_type_id) : null;
  found.rank_id = body.rank_id ? Number(body.rank_id) : null;
  found.current_address = String(body.current_address ?? found.current_address).trim();
  found.notes = String(body.notes ?? found.notes).trim();
  setFlashSuccess(req, 'تم تحديث السجل الشخصي بنجاح.');
  res.redirect(`/system/personal-data/${found.id}`);
});

app.delete('/system/personal-data/:id', requireAuth, (req: Request, res: Response) => {
  const idx = personalDataStore.findIndex((p) => p.id === Number(req.params.id));
  if (idx !== -1) {
    personalDataStore.splice(idx, 1);
  }
  setFlashSuccess(req, 'تم حذف السجل بنجاح.');
  res.redirect('/system/personal-data');
});

app.get('/system/personal-data/:id/print', requireAuth, (req: Request, res: Response) => {
  const found = personalDataStore.find((p) => p.id === Number(req.params.id));
  if (!found) {
    res.status(404).send('السجل غير موجود');
    return;
  }
  res.render('personal_data/print', { personalData: enrichPersonalData(found) });
});

// ── Security Reports ───────────────────────────────────────────────────────
app.get('/system/security-reports', requireAuth, (req: Request, res: Response) => {
  const search = String(req.query.search || '').trim().toLowerCase();
  const reports = securityReportsStore
    .filter((r) => {
      if (!search) return true;
      return (
        r.full_name.toLowerCase().includes(search) ||
        r.report_topic.toLowerCase().includes(search) ||
        r.military_number.toLowerCase().includes(search) ||
        r.id_number.toLowerCase().includes(search)
      );
    })
    .sort((a, b) => b.id - a.id)
    .map(enrichReport);

  res.render('security_reports/index', { reports, search: req.query.search || '' });
});

app.get('/system/security-reports/create', requireAuth, (_req: Request, res: Response) => {
  res.render('security_reports/create', {
    people: personalDataStore,
    entities: lookups.internalEntities,
  });
});

app.post('/system/security-reports', requireAuth, (req: Request, res: Response) => {
  const body = req.body || {};
  const person = body.personal_data_id
    ? personalDataStore.find((p) => p.id === Number(body.personal_data_id))
    : undefined;
  securityReportsStore.push({
    id: getNextId('reports'),
    personal_data_id: person ? person.id : null,
    full_name: String(body.full_name || person?.name || '').trim(),
    id_number: person?.national_id_number || '',
    phone: person?.phone_1 || '',
    report_type: String(body.report_type || 'اشتباه أمني'),
    report_topic: String(body.report_topic || '').trim(),
    reporting_entity: lookups.internalEntities.find((e) => e.id === Number(body.internal_entity_id))?.name || 'عام',
    area: String(body.area || '').trim(),
    military_number: person?.military_number || '',
    residence_village: '',
    notes: String(body.notes || '').trim(),
    report_date: String(body.report_date || new Date().toISOString().slice(0, 10)),
    classification: 'نشط',
    internal_entity_id: body.internal_entity_id ? Number(body.internal_entity_id) : null,
    created_at: new Date().toISOString().slice(0, 10),
  });
  setFlashSuccess(req, 'تم تسجيل البلاغ الأمني بنجاح.');
  res.redirect('/system/security-reports');
});

app.get('/system/security-reports/:id', requireAuth, (req: Request, res: Response) => {
  const found = securityReportsStore.find((r) => r.id === Number(req.params.id));
  if (!found) {
    res.status(404).send('البلاغ غير موجود');
    return;
  }
  res.render('security_reports/show', { report: enrichReport(found) });
});

app.delete('/system/security-reports/:id', requireAuth, (req: Request, res: Response) => {
  const idx = securityReportsStore.findIndex((r) => r.id === Number(req.params.id));
  if (idx !== -1) securityReportsStore.splice(idx, 1);
  setFlashSuccess(req, 'تم حذف البلاغ الأمني.');
  res.redirect('/system/security-reports');
});

// ── Arrests ────────────────────────────────────────────────────────────────
app.get('/system/arrests', requireAuth, (req: Request, res: Response) => {
  const search = String(req.query.search || '').trim().toLowerCase();
  const arrests = arrestsStore
    .map(enrichArrest)
    .filter((a) => {
      if (!search) return true;
      return (
        (a.personalData?.name || '').toLowerCase().includes(search) ||
        (a.caseType?.name || '').toLowerCase().includes(search) ||
        (a.arrestingAuthority?.name || '').toLowerCase().includes(search)
      );
    })
    .sort((a, b) => b.id - a.id);

  res.render('arrests/index', { arrests, search: req.query.search || '' });
});

app.get('/system/arrests/create', requireAuth, (_req: Request, res: Response) => {
  res.render('arrests/create', {
    people: personalDataStore,
    authorities: lookups.arrestingAuthorities,
    caseTypes: lookups.caseTypes,
  });
});

app.post('/system/arrests', requireAuth, (req: Request, res: Response) => {
  const body = req.body || {};
  arrestsStore.push({
    id: getNextId('arrests'),
    personal_data_id: Number(body.personal_data_id),
    arresting_authority_id: body.arresting_authority_id ? Number(body.arresting_authority_id) : null,
    case_type_id: body.case_type_id ? Number(body.case_type_id) : null,
    arrest_date: String(body.arrest_date || new Date().toISOString().slice(0, 10)),
    location: String(body.arrest_location || ''),
    arrest_location: String(body.arrest_location || ''),
    case_details: String(body.case_details || ''),
    seized_items: '',
    case_follow_up_results: '',
    related_information: '',
    status: String(body.status || 'قيد التحقيق'),
    duration_period: '',
    conclusion: '',
    investigation_reports: '',
    release_date: '',
    release_reason: '',
    notes: '',
    created_at: new Date().toISOString().slice(0, 10),
  });
  setFlashSuccess(req, 'تم تسجيل قيد التوقيف بنجاح.');
  res.redirect('/system/arrests');
});

app.get('/system/arrests/:id', requireAuth, (req: Request, res: Response) => {
  const found = arrestsStore.find((a) => a.id === Number(req.params.id));
  if (!found) {
    res.status(404).send('السجل غير موجود');
    return;
  }
  res.render('arrests/show', { arrest: enrichArrest(found) });
});

app.delete('/system/arrests/:id', requireAuth, (req: Request, res: Response) => {
  const idx = arrestsStore.findIndex((a) => a.id === Number(req.params.id));
  if (idx !== -1) arrestsStore.splice(idx, 1);
  setFlashSuccess(req, 'تم حذف قيد التوقيف.');
  res.redirect('/system/arrests');
});

// ── Suspects ───────────────────────────────────────────────────────────────
app.get('/system/suspicious', requireAuth, (req: Request, res: Response) => {
  const search = String(req.query.search || '').trim().toLowerCase();
  const suspects = suspectsStore
    .map(enrichSuspect)
    .filter((s) => {
      if (!search) return true;
      return (
        (s.personalData?.name || '').toLowerCase().includes(search) ||
        s.suspect_number.toLowerCase().includes(search) ||
        s.suspicion_type.toLowerCase().includes(search)
      );
    })
    .sort((a, b) => b.id - a.id);

  res.render('suspicious/index', { suspects, search: req.query.search || '' });
});

app.get('/system/suspicious/create', requireAuth, (_req: Request, res: Response) => {
  res.render('suspicious/create', { people: personalDataStore });
});

app.post('/system/suspicious', requireAuth, (req: Request, res: Response) => {
  const body = req.body || {};
  suspectsStore.push({
    id: getNextId('suspects'),
    personal_data_id: Number(body.personal_data_id),
    suspect_number: String(body.suspect_number || `S-${7000 + suspectsStore.length + 1}`),
    suspicion_date: String(body.suspicion_date || new Date().toISOString().slice(0, 10)),
    suspicion_type: String(body.suspicion_type || 'اشتباه أمني'),
    suspicion_location: String(body.suspicion_location || ''),
    suspicion_level: body.status === 'حرج' ? 'مرتفع' : body.status === 'تحذير' ? 'متوسط' : 'منخفض',
    status: String(body.status || 'تحذير'),
    information_source: 'إدخال مباشر',
    is_arrested: false,
    suspicion_details: String(body.suspicion_details || ''),
    monitoring_results: '',
    suspicion_follower: '',
    suspicion_report: '',
    observations: '',
    created_at: new Date().toISOString().slice(0, 10),
  });
  setFlashSuccess(req, 'تمت إضافة ملف المشتبه به بنجاح.');
  res.redirect('/system/suspicious');
});

app.get('/system/suspicious/:id', requireAuth, (req: Request, res: Response) => {
  const found = suspectsStore.find((s) => s.id === Number(req.params.id));
  if (!found) {
    res.status(404).send('السجل غير موجود');
    return;
  }
  res.render('suspicious/show', { suspect: enrichSuspect(found) });
});

app.delete('/system/suspicious/:id', requireAuth, (req: Request, res: Response) => {
  const idx = suspectsStore.findIndex((s) => s.id === Number(req.params.id));
  if (idx !== -1) suspectsStore.splice(idx, 1);
  setFlashSuccess(req, 'تم حذف ملف المشتبه به.');
  res.redirect('/system/suspicious');
});

// ── Dependent Geo API Endpoints ────────────────────────────────────────────
app.get('/api/geo/directorates/:governorate', requireAuth, (req: Request, res: Response) => {
  const govId = Number(req.params.governorate);
  const items = Object.fromEntries(
    lookups.directorates.filter((d) => d.governorate_id === govId).map((d) => [d.id, d.name])
  );
  res.json(items);
});

app.get('/api/geo/sub-areas/:directorate', requireAuth, (req: Request, res: Response) => {
  const dirId = Number(req.params.directorate);
  const items = Object.fromEntries(
    lookups.subAreas.filter((s) => s.directorate_id === dirId).map((s) => [s.id, s.name])
  );
  res.json(items);
});

app.get('/api/geo/villages/:subArea', requireAuth, (req: Request, res: Response) => {
  const subId = Number(req.params.subArea);
  const items = Object.fromEntries(
    lookups.villages.filter((v) => v.sub_area_id === subId).map((v) => [v.id, v.name])
  );
  res.json(items);
});

app.get('/api/geo/divisions/:district', requireAuth, (req: Request, res: Response) => {
  const distId = Number(req.params.district);
  const items = Object.fromEntries(
    lookups.divisions.filter((d) => d.military_district_id === distId).map((d) => [d.id, d.name])
  );
  res.json(items);
});

// ── Stub Remaining Unmigrated Routes ───────────────────────────────────────
app.use(['/system', '/configuration', '/data'], (_req: Request, res: Response) => {
  res.status(501).json({ error: 'Not yet migrated' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on http://0.0.0.0:${PORT}`);
});
