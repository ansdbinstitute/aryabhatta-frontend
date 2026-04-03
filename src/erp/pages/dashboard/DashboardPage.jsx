import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../../stores/authStore';
import usePermission from '../../hooks/usePermission';
import useStudentStore from '../../stores/studentStore';
import useBatchStore from '../../stores/batchStore';
import usePaymentStore from '../../stores/paymentStore';
import useNoticeStore from '../../stores/noticeStore';
import useAttendanceStore from '../../stores/attendanceStore';
import useStaffStore from '../../stores/staffStore';
import PageHeader from '../../components/common/PageHeader';
import { ROLES } from '../../utils/constants';
import {
  ArrowRight,
  Bell,
  BookOpen,
  Briefcase,
  CheckCircle2,
  CircleAlert,
  ClipboardCheck,
  Clock3,
  CreditCard,
  FileSpreadsheet,
  GraduationCap,
  Landmark,
  Layers3,
  Receipt,
  Sparkles,
  Users,
} from 'lucide-react';

const DASHBOARD_REFRESH_MS = 15000;

const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(amount || 0));

const getInitials = (firstName, lastName) =>
  `${firstName?.[0] || ''}${lastName?.[0] || ''}` || 'U';

const getActiveBatchCount = (batches) =>
  batches.filter((batch) => ['ongoing', 'active'].includes(batch.status)).length;

const buildStudentPaymentMap = (payments) => {
  // Payments come from the raw Strapi response (not extractData-processed),
  // so payment.student has both an integer `id` AND a `documentId` string.
  // Students in the store have been processed by extractData(), which sets
  // student.id = documentId and student.integerId = original integer.
  // We key the map by BOTH so lookups work regardless of which id is used.
  const totals = {};

  payments.forEach((payment) => {
    if (!payment.student || payment.status !== 'completed') return;
    const amt = Number(payment.amount || 0);
    const docId = payment.student.documentId;
    const intId = payment.student.id; // raw integer from Strapi response

    if (docId) totals[docId] = (totals[docId] || 0) + amt;
    if (intId) totals[intId] = (totals[intId] || 0) + amt;
  });

  return totals;
};

const clampPercent = (value) => Math.max(0, Math.min(100, Math.round(value || 0)));

const QuickAction = ({ to, icon: Icon, title, subtitle, accent = 'bg-slate-900' }) => (
  <Link
    to={to}
    className="group relative overflow-hidden rounded-2xl border border-white/60 bg-white/80 p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
  >
    <div className={`absolute inset-x-0 top-0 h-1 ${accent}`}></div>
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-sm font-semibold text-slate-800">{title}</p>
        <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
      </div>
      <div className="rounded-xl bg-slate-100 p-2 text-slate-700">
        <Icon className="h-4 w-4" />
      </div>
    </div>
    <div className="mt-4 flex items-center gap-1 text-xs font-medium text-primary">
      Open
      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
    </div>
  </Link>
);

const PulseMetric = ({ label, value, hint, icon: Icon, tone = 'slate' }) => {
  const toneClasses = {
    blue: 'bg-blue-50 text-blue-700 border-blue-100',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    amber: 'bg-amber-50 text-amber-700 border-amber-100',
    rose: 'bg-rose-50 text-rose-700 border-rose-100',
    slate: 'bg-slate-50 text-slate-700 border-slate-100',
    violet: 'bg-violet-50 text-violet-700 border-violet-100',
  };

  return (
    <div className={`rounded-2xl border p-4 ${toneClasses[tone] || toneClasses.slate}`}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] opacity-80">{label}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight">{value}</p>
          {hint && <p className="mt-1 text-xs opacity-80">{hint}</p>}
        </div>
        <div className="rounded-2xl bg-white/70 p-3">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
};

const ChartMetricCard = ({
  label,
  value,
  hint,
  icon: Icon,
  tone = 'blue',
  progress = 0,
  bars = [],
  breakdown = [],
}) => {
  const tones = {
    blue: {
      shell: 'border-cyan-400/20 bg-white/10',
      badge: 'bg-cyan-400/15 text-cyan-100',
      ring: '#22d3ee',
      fill: 'bg-cyan-300',
      subfill: 'bg-cyan-200/70',
    },
    emerald: {
      shell: 'border-emerald-400/20 bg-white/10',
      badge: 'bg-emerald-400/15 text-emerald-100',
      ring: '#34d399',
      fill: 'bg-emerald-300',
      subfill: 'bg-emerald-200/70',
    },
    amber: {
      shell: 'border-amber-400/20 bg-white/10',
      badge: 'bg-amber-400/15 text-amber-100',
      ring: '#fbbf24',
      fill: 'bg-amber-300',
      subfill: 'bg-amber-200/70',
    },
    violet: {
      shell: 'border-violet-400/20 bg-white/10',
      badge: 'bg-violet-400/15 text-violet-100',
      ring: '#a78bfa',
      fill: 'bg-violet-300',
      subfill: 'bg-violet-200/70',
    },
  };

  const palette = tones[tone] || tones.blue;
  const safeProgress = clampPercent(progress);
  const circumference = 2 * Math.PI * 24;
  const dashOffset = circumference - (safeProgress / 100) * circumference;

  return (
    <div className={`rounded-[1.4rem] border p-4 backdrop-blur-sm ${palette.shell}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${palette.badge}`}>
            <Icon className="h-3.5 w-3.5" />
            {label}
          </div>
          <p className="mt-3 text-3xl font-bold tracking-tight text-white">{value}</p>
          <p className="mt-1 text-xs text-slate-300">{hint}</p>
        </div>
        <div className="relative flex h-16 w-16 items-center justify-center">
          <svg className="h-16 w-16 -rotate-90" viewBox="0 0 64 64">
            <circle cx="32" cy="32" r="24" stroke="rgba(255,255,255,0.14)" strokeWidth="6" fill="none" />
            <circle
              cx="32"
              cy="32"
              r="24"
              stroke={palette.ring}
              strokeWidth="6"
              strokeLinecap="round"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
            />
          </svg>
          <span className="absolute text-xs font-semibold text-white">{safeProgress}%</span>
        </div>
      </div>

      {bars.length > 0 && (
        <div className="mt-4 flex h-16 items-end gap-1.5">
          {bars.map((bar, index) => (
            <div key={`${label}-${index}`} className="flex-1">
              <div className="rounded-t-full bg-white/10" style={{ height: `${Math.max(clampPercent(bar), 12)}%` }}>
                <div className={`w-full rounded-t-full ${index % 2 === 0 ? palette.fill : palette.subfill}`} style={{ height: '100%' }}></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {breakdown.length > 0 && (
        <div className="mt-4 space-y-2">
          {breakdown.map((item) => (
            <div key={`${label}-${item.label}`} className="space-y-1">
              <div className="flex items-center justify-between text-[11px] text-slate-200">
                <span>{item.label}</span>
                <span>{item.value}</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/10">
                <div className={`${palette.fill} h-1.5 rounded-full`} style={{ width: `${clampPercent(item.percent)}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const SectionCard = ({ title, eyebrow, action, children }) => (
  <div className="rounded-3xl border border-slate-200/70 bg-white/85 p-5 shadow-sm">
    <div className="mb-4 flex items-start justify-between gap-4">
      <div>
        {eyebrow && <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">{eyebrow}</p>}
        <h3 className="mt-1 text-lg font-bold text-slate-800">{title}</h3>
      </div>
      {action}
    </div>
    {children}
  </div>
);

const ProgressStrip = ({ label, value, max, hint, color = 'bg-primary' }) => {
  const safeMax = Math.max(Number(max || 0), 1);
  const width = Math.min((Number(value || 0) / safeMax) * 100, 100);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-medium text-slate-700">{label}</p>
        <p className="text-xs text-slate-500">{hint}</p>
      </div>
      <div className="h-2 rounded-full bg-slate-100">
        <div className={`h-2 rounded-full ${color}`} style={{ width: `${width}%` }}></div>
      </div>
    </div>
  );
};

const ListItem = ({ title, subtitle, meta, initials, tone = 'bg-slate-100 text-slate-700' }) => (
  <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 px-4 py-3">
    <div className="flex min-w-0 items-center gap-3">
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-sm font-bold ${tone}`}>
        {initials}
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-slate-800">{title}</p>
        <p className="truncate text-xs text-slate-500">{subtitle}</p>
      </div>
    </div>
    {meta && <div className="text-right text-xs font-medium text-slate-500">{meta}</div>}
  </div>
);

const EmptyBlock = ({ title }) => (
  <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-4 py-8 text-center text-sm text-slate-400">
    {title}
  </div>
);

const DashboardHero = ({ title, subtitle, quickActions, insight }) => (
  <div className="relative overflow-hidden rounded-[2rem] border border-slate-200/70 bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.18),_transparent_35%),radial-gradient(circle_at_top_right,_rgba(250,204,21,0.22),_transparent_30%),linear-gradient(135deg,#0f172a_0%,#172554_50%,#0f766e_100%)] p-6 text-white shadow-xl">
    <div className="absolute right-0 top-0 h-44 w-44 rounded-full bg-white/10 blur-3xl"></div>
    <div className="relative grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-100">
          <Sparkles className="h-3.5 w-3.5" />
          ERP Command Center
        </div>
        <h2 className="mt-4 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
        <p className="mt-3 max-w-2xl text-sm text-slate-200 sm:text-base">{subtitle}</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {quickActions}
        </div>
      </div>
      <div className="rounded-[1.5rem] border border-white/10 bg-white/10 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-200">Today's Snapshot</p>
        <div className="mt-4 grid gap-3">{insight}</div>
      </div>
    </div>
  </div>
);

const useDashboardAutoRefresh = (options = {}) => {
  const {
    fetchStudents: studentOptions,
    fetchBatches: batchOptions,
    fetchPayments: paymentOptions,
    fetchNotices: noticeOptions,
    fetchAttendance: attendanceOptions,
    fetchStaffs: staffOptions,
  } = options;

  useEffect(() => {
    let mounted = true;
    let intervalId = null;
    let isAuthChecked = false;

    const doRefresh = () => {
      if (!mounted) return;
      
      // Check if authenticated via auth store
      const authState = useAuthStore.getState();
      if (!authState.isAuthenticated) {
        return; // Don't fetch if not authenticated
      }

      if (studentOptions !== false) {
        useStudentStore.getState().fetchStudents(studentOptions || { 'pagination[pageSize]': 200 });
      }
      if (batchOptions !== false) {
        useBatchStore.getState().fetchBatches(batchOptions || { 'pagination[pageSize]': 100 });
      }
      if (paymentOptions !== false) {
        usePaymentStore.getState().fetchPayments(paymentOptions || { 'pagination[pageSize]': 200 });
      }
      if (noticeOptions !== false) {
        useNoticeStore.getState().fetchNotices(noticeOptions || { 'pagination[pageSize]': 20 });
      }
      if (attendanceOptions !== false) {
        useAttendanceStore.getState().fetchAttendance(attendanceOptions || { 'pagination[pageSize]': 300 });
      }
      if (staffOptions !== false) {
        useStaffStore.getState().fetchStaffs(staffOptions || { 'pagination[pageSize]': 100 });
      }
    };

    // Check auth and start refresh cycle
    const checkAuthAndStart = () => {
      const authState = useAuthStore.getState();
      if (authState.isAuthenticated) {
        doRefresh();
        intervalId = window.setInterval(doRefresh, DASHBOARD_REFRESH_MS);
        return true;
      }
      return false;
    };

    // Try immediately
    if (checkAuthAndStart()) {
      isAuthChecked = true;
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && useAuthStore.getState().isAuthenticated) {
        doRefresh();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      mounted = false;
      if (intervalId) window.clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
};

const AdminDashboard = () => {
  const { user } = useAuthStore();
  const students = useStudentStore((s) => s.students);
  const batches = useBatchStore((s) => s.batches);
  const payments = usePaymentStore((s) => s.payments);
  const notices = useNoticeStore((s) => s.notices);
  const attendanceRecords = useAttendanceStore((s) => s.attendanceRecords);
  const staffs = useStaffStore((s) => s.staffs);

  useDashboardAutoRefresh();

  const activeBatches = getActiveBatchCount(batches);
  const completedPayments = payments.filter((payment) => payment.status === 'completed');
  const pendingPayments = payments.filter((payment) => payment.status === 'pending');
  const totalRevenue = completedPayments.reduce((sum, p) => sum + Number(p.amount || 0), 0);
  const pendingPaymentsAmount = pendingPayments.reduce((sum, p) => sum + Number(p.amount || 0), 0);

  // ── Core formula: Due = Sum of all student fees − total collected ──
  const totalFeesAllStudents = students.reduce((sum, s) => sum + Number(s.totalFee || 0), 0);
  const totalDue = Math.max(totalFeesAllStudents - totalRevenue, 0);

  // Per-student breakdown for the dues list (still uses paymentMap for individual amounts)
  const paymentMap = buildStudentPaymentMap(payments);
  const studentsWithDues = students
    .map((student) => {
      const totalFee = Number(student.totalFee || 0);
      const paid = paymentMap[student.id] || paymentMap[student.integerId] || 0;
      const due = Math.max(totalFee - paid, 0);
      return { ...student, totalFee, paid, due };
    })
    .filter((student) => student.totalFee > 0)
    .sort((a, b) => b.due - a.due);

  const today = new Date().toISOString().split('T')[0];
  const todayAttendance = attendanceRecords.filter((record) => record.date === today);
  const attendanceRate = todayAttendance.length
    ? Math.round((todayAttendance.filter((record) => record.status === 'present').length / todayAttendance.length) * 100)
    : 0;
  const activeStudents = students.filter((student) => student.status === 'active').length;
  const completionRate = students.length ? Math.round((activeStudents / students.length) * 100) : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome back, ${user?.firstName || 'Admin'}`}
        subtitle="A more connected view of admissions, batches, fees, notices, and attendance."
      />

      <DashboardHero
        title="Run the institute from one live workspace"
        subtitle="Track enrollments, revenue, dues, notices, and daily academic activity without leaving the ERP."
        quickActions={
          <>
            <QuickAction to="/erp/students/new" icon={GraduationCap} title="Enroll Student" subtitle="Create a new admission record" accent="bg-blue-500" />
            <QuickAction to="/erp/payments/new" icon={Receipt} title="Record Payment" subtitle="Add a new fee transaction" accent="bg-emerald-500" />
            <QuickAction to="/erp/notices/new" icon={Bell} title="Broadcast Notice" subtitle="Publish an institute update" accent="bg-amber-500" />
            <QuickAction to="/erp/batches/new" icon={Layers3} title="Launch Batch" subtitle="Create a new active training batch" accent="bg-violet-500" />
          </>
        }
        insight={
          <>
            <ChartMetricCard
              label="Enrollment Base"
              value={students.length}
              hint={`${activeStudents} active learners`}
              icon={Users}
              tone="blue"
              progress={completionRate}
              bars={[
                completionRate * 0.45,
                completionRate * 0.62,
                completionRate * 0.88,
                completionRate * 0.72,
                completionRate,
              ]}
            />
            <ChartMetricCard
              label="Cash Flow"
              value={formatCurrency(totalRevenue)}
              hint={`${completedPayments.length} completed payments`}
              icon={Landmark}
              tone="emerald"
              progress={totalFeesAllStudents > 0 ? (totalRevenue / totalFeesAllStudents) * 100 : 0}
              breakdown={[
                { label: 'Collected', value: formatCurrency(totalRevenue), percent: totalFeesAllStudents > 0 ? (totalRevenue / totalFeesAllStudents) * 100 : 0 },
                { label: 'Outstanding', value: formatCurrency(totalDue), percent: totalFeesAllStudents > 0 ? (totalDue / totalFeesAllStudents) * 100 : 0 },
              ]}
            />
            <ChartMetricCard
              label="Open Dues"
              value={formatCurrency(totalDue)}
              hint={`${studentsWithDues.filter((student) => student.due > 0).length} students pending`}
              icon={CircleAlert}
              tone="amber"
              progress={totalFeesAllStudents > 0 ? (totalDue / totalFeesAllStudents) * 100 : 0}
              bars={studentsWithDues.slice(0, 5).map((student) => totalDue > 0 ? (student.due / totalDue) * 100 : 0)}
            />
          </>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <PulseMetric label="Active Batches" value={activeBatches} hint={`${batches.length} total tracked`} icon={Layers3} tone="violet" />
        <PulseMetric label="Staff Strength" value={staffs.length} hint="Faculty and operational team" icon={Briefcase} tone="blue" />
        <PulseMetric label="Attendance Today" value={`${attendanceRate}%`} hint={`${todayAttendance.length} records logged`} icon={ClipboardCheck} tone="emerald" />
        <PulseMetric label="Pending Transactions" value={formatCurrency(pendingPaymentsAmount)} hint={`${pendingPayments.length} marked pending status`} icon={Clock3} tone="amber" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <SectionCard
          eyebrow="Performance"
          title="Operations pulse"
          action={<Link to="/erp/attendance/report" className="text-sm font-medium text-primary hover:underline">Attendance report</Link>}
        >
          <div className="space-y-5">
            <ProgressStrip label="Student activation" value={activeStudents} max={students.length || 1} hint={`${completionRate}% active`} color="bg-blue-500" />
            <ProgressStrip label="Today's attendance completion" value={todayAttendance.length} max={Math.max(activeStudents, 1)} hint={`${todayAttendance.length}/${activeStudents || 0} marked`} color="bg-emerald-500" />
            <ProgressStrip label="Revenue coverage" value={totalRevenue} max={Math.max(totalFeesAllStudents, 1)} hint={`${formatCurrency(totalDue)} outstanding`} color="bg-violet-500" />
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Notices Live</p>
              <p className="mt-2 text-2xl font-bold text-slate-800">{notices.length}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Fee Risk</p>
              <p className="mt-2 text-2xl font-bold text-slate-800">{studentsWithDues.filter((student) => student.due > 0).length}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Collection Velocity</p>
              <p className="mt-2 text-2xl font-bold text-slate-800">{completedPayments.length}</p>
            </div>
          </div>
        </SectionCard>

        <SectionCard
          eyebrow="Urgency"
          title="Students with highest dues"
          action={<Link to="/erp/payments" className="text-sm font-medium text-primary hover:underline">Open ledger</Link>}
        >
          <div className="space-y-3">
            {studentsWithDues.filter((student) => student.due > 0).slice(0, 5).map((student) => (
              <ListItem
                key={student.id}
                title={`${student.firstName} ${student.lastName}`}
                subtitle={`${student.course?.title || 'No course'} | UID ${student.uid || student.id}`}
                meta={<div><p className="font-semibold text-rose-600">{formatCurrency(student.due)}</p><p>{formatCurrency(student.paid)} paid</p></div>}
                initials={getInitials(student.firstName, student.lastName)}
                tone="bg-rose-50 text-rose-700"
              />
            ))}
            {studentsWithDues.filter((student) => student.due > 0).length === 0 && <EmptyBlock title="No student dues are pending right now." />}
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard eyebrow="Enrollment" title="Recent students" action={<Link to="/erp/students" className="text-sm font-medium text-primary hover:underline">View all students</Link>}>
          <div className="space-y-3">
            {students.slice(0, 6).map((student) => (
              <ListItem
                key={student.id}
                title={`${student.firstName} ${student.lastName}`}
                subtitle={`${student.course?.title || 'No course'} | ${student.batch?.name || 'No batch'}`}
                meta={student.status || 'active'}
                initials={getInitials(student.firstName, student.lastName)}
                tone="bg-blue-50 text-blue-700"
              />
            ))}
            {students.length === 0 && <EmptyBlock title="No student enrollments found yet." />}
          </div>
        </SectionCard>

        <SectionCard eyebrow="Communication" title="Recent notices" action={<Link to="/erp/notices" className="text-sm font-medium text-primary hover:underline">Notice board</Link>}>
          <div className="space-y-3">
            {notices.slice(0, 6).map((notice) => (
              <div key={notice.id} className="rounded-2xl border border-slate-100 bg-slate-50/70 px-4 py-3">
                <div className="flex items-start gap-3">
                  <div className="mt-1 rounded-xl bg-amber-50 p-2 text-amber-700">
                    <Bell className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-800">{notice.title}</p>
                    <p className="mt-1 line-clamp-2 text-xs text-slate-500">{notice.description || notice.content || 'No summary available'}</p>
                  </div>
                </div>
              </div>
            ))}
            {notices.length === 0 && <EmptyBlock title="No recent notices have been published." />}
          </div>
        </SectionCard>
      </div>
    </div>
  );
};

const BranchAdminDashboard = () => {
  const { user } = useAuthStore();
  const students = useStudentStore((s) => s.students);
  const batches = useBatchStore((s) => s.batches);
  const payments = usePaymentStore((s) => s.payments);
  const attendanceRecords = useAttendanceStore((s) => s.attendanceRecords);

  useDashboardAutoRefresh();

  const myBranchStudents = students.filter((student) => student.branch?.id === user?.branch?.id);
  const myBranchBatches = batches.filter((batch) => batch.branch?.id === user?.branch?.id);
  const myBranchPayments = payments.filter((payment) => payment.branch?.id === user?.branch?.id);
  const myBranchAttendance = attendanceRecords.filter((record) => record.batch?.branch?.id === user?.branch?.id);
  
  const collected = myBranchPayments
    .filter((payment) => payment.status === 'completed')
    .reduce((sum, p) => sum + Number(p.amount || 0), 0);

  // ── Branch Formula: Outstanding = Sum of branch student fees − total collected ──
  const branchTotalFees = myBranchStudents.reduce((sum, s) => sum + Number(s.totalFee || 0), 0);
  const branchOutstanding = Math.max(branchTotalFees - collected, 0);

  const activeBatches = getActiveBatchCount(myBranchBatches);
  const today = new Date().toISOString().split('T')[0];
  const todayAttendance = myBranchAttendance.filter((record) => record.date === today);
  const attendanceRate = todayAttendance.length ? Math.round((todayAttendance.filter((record) => record.status === 'present').length / todayAttendance.length) * 100) : 0;
  const enrollmentRate = myBranchStudents.length > 0 ? (myBranchStudents.filter((student) => student.status === 'active').length / myBranchStudents.length) * 100 : 0;
  const branchCollectionRate = branchTotalFees > 0 ? (collected / branchTotalFees) * 100 : 0;

  const paymentMap = buildStudentPaymentMap(payments);
  const studentsWithDues = myBranchStudents
    .map((student) => {
      const totalFee = Number(student.totalFee || 0);
      const paid = paymentMap[student.id] || paymentMap[student.integerId] || 0;
      const due = Math.max(totalFee - paid, 0);
      return { ...student, due, paid };
    })
    .filter((student) => student.due > 0)
    .sort((a, b) => b.due - a.due);

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Branch control: ${user?.branch?.name || 'Assigned branch'}`}
        subtitle="See your branch throughput, collections, attendance, and active batches in one place."
      />

      <DashboardHero
        title="Keep your branch moving day by day"
        subtitle="Use the ERP as a local operations cockpit for admissions, fee follow-ups, attendance, and batch health."
        quickActions={
          <>
            <QuickAction to="/erp/students" icon={Users} title="Students" subtitle="Open branch student list" accent="bg-blue-500" />
            <QuickAction to="/erp/payments" icon={Receipt} title="Payments" subtitle="Check collected and pending dues" accent="bg-emerald-500" />
            <QuickAction to="/erp/attendance" icon={ClipboardCheck} title="Attendance" subtitle="Mark or review today's attendance" accent="bg-amber-500" />
            <QuickAction to="/erp/batches" icon={Layers3} title="Batches" subtitle="Track current branch batches" accent="bg-violet-500" />
          </>
        }
        insight={
          <>
            <ChartMetricCard
              label="Branch Students"
              value={myBranchStudents.length}
              hint={`${activeBatches} active batches`}
              icon={GraduationCap}
              tone="blue"
              progress={enrollmentRate}
              bars={[
                enrollmentRate * 0.5,
                enrollmentRate * 0.7,
                enrollmentRate * 0.9,
                enrollmentRate * 0.8,
              ]}
            />
            <ChartMetricCard
              label="Collected"
              value={formatCurrency(collected)}
              hint="Branch completed payments"
              icon={Landmark}
              tone="emerald"
              progress={branchCollectionRate}
              breakdown={[
                { label: 'Collected', value: formatCurrency(collected), percent: branchCollectionRate },
                { label: 'Outstanding', value: formatCurrency(branchOutstanding), percent: Math.max(100 - branchCollectionRate, 0) },
              ]}
            />
            <ChartMetricCard
              label="Attendance"
              value={`${attendanceRate}%`}
              hint={`${todayAttendance.length} records logged`}
              icon={ClipboardCheck}
              tone="amber"
              progress={attendanceRate}
              bars={[
                attendanceRate * 0.35,
                attendanceRate * 0.55,
                attendanceRate * 0.78,
                attendanceRate,
              ]}
            />
          </>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <PulseMetric label="Attendance Today" value={`${attendanceRate}%`} hint={`${todayAttendance.length} records logged`} icon={ClipboardCheck} tone="emerald" />
        <PulseMetric label="Students" value={myBranchStudents.length} hint="Branch-level enrollment" icon={Users} tone="blue" />
        <PulseMetric label="Active Batches" value={activeBatches} hint={`${myBranchBatches.length} branch batches total`} icon={Layers3} tone="violet" />
        <PulseMetric label="Outstanding" value={formatCurrency(branchOutstanding)} hint="Fees minus collections" icon={CreditCard} tone="amber" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
        <SectionCard eyebrow="Monitoring" title="Branch activity">
          <div className="space-y-5">
            <ProgressStrip label="Attendance coverage" value={todayAttendance.length} max={Math.max(myBranchStudents.length, 1)} hint={`${todayAttendance.length}/${myBranchStudents.length || 0} students marked`} color="bg-emerald-500" />
            <ProgressStrip label="Collection health" value={collected} max={Math.max(branchTotalFees, 1)} hint={`${formatCurrency(branchOutstanding)} still open`} color="bg-blue-500" />
            <ProgressStrip label="Batch density" value={myBranchStudents.length} max={Math.max(activeBatches * 40, 1)} hint={`${activeBatches || 0} active batches`} color="bg-violet-500" />
          </div>
        </SectionCard>

        <SectionCard eyebrow="Urgency" title="Top due students" action={<Link to="/erp/students" className="text-sm font-medium text-primary hover:underline">Open students</Link>}>
          <div className="space-y-3">
            {studentsWithDues.slice(0, 5).map((student) => (
              <ListItem
                key={student.id}
                title={`${student.firstName} ${student.lastName}`}
                subtitle={`${student.batch?.name || 'No batch'} | ${student.course?.title || 'No course'}`}
                meta={<div><p className="font-semibold text-rose-600">{formatCurrency(student.due)}</p><p>{formatCurrency(student.paid)} paid</p></div>}
                initials={getInitials(student.firstName, student.lastName)}
                tone="bg-rose-50 text-rose-700"
              />
            ))}
            {studentsWithDues.length === 0 && <EmptyBlock title="No student dues are pending at this branch." />}
          </div>
        </SectionCard>
      </div>
    </div>
  );
};

const TeacherDashboard = () => {
  const { user } = useAuthStore();
  const students = useStudentStore((s) => s.students);
  const batches = useBatchStore((s) => s.batches);
  const attendanceRecords = useAttendanceStore((s) => s.attendanceRecords);

  useDashboardAutoRefresh();

  const today = new Date().toISOString().split('T')[0];
  const todayAttendance = attendanceRecords.filter((record) => record.date === today);
  const presentCount = todayAttendance.filter((record) => record.status === 'present').length;
  const attendanceRate = todayAttendance.length ? Math.round((presentCount / todayAttendance.length) * 100) : 0;
  const learnerFlow = students.length > 0 ? (presentCount / Math.max(students.length, 1)) * 100 : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Hello, ${user?.firstName || 'Teacher'}`}
        subtitle="Focus on attendance, learners, class rhythm, and your next academic actions."
      />

      <DashboardHero
        title="Your classroom command center"
        subtitle="Move quickly between attendance, student follow-up, exams, and notices from one focused teacher dashboard."
        quickActions={
          <>
            <QuickAction to="/erp/attendance" icon={ClipboardCheck} title="Mark Attendance" subtitle="Open today's attendance desk" accent="bg-emerald-500" />
            <QuickAction to="/erp/students" icon={GraduationCap} title="Students" subtitle="See learner profiles and records" accent="bg-blue-500" />
            <QuickAction to="/erp/exams" icon={FileSpreadsheet} title="Exams" subtitle="Review schedules and results" accent="bg-violet-500" />
            <QuickAction to="/erp/notices" icon={Bell} title="Notices" subtitle="Read latest announcements" accent="bg-amber-500" />
          </>
        }
        insight={
          <>
            <ChartMetricCard
              label="Today's Attendance"
              value={`${presentCount}/${todayAttendance.length || 0}`}
              hint={`${attendanceRate}% present`}
              icon={ClipboardCheck}
              tone="emerald"
              progress={attendanceRate}
              bars={[
                attendanceRate * 0.4,
                attendanceRate * 0.65,
                attendanceRate * 0.82,
                attendanceRate,
              ]}
            />
            <ChartMetricCard
              label="Students Visible"
              value={students.length}
              hint="Current learner records"
              icon={Users}
              tone="blue"
              progress={learnerFlow}
              bars={[
                learnerFlow * 0.55,
                learnerFlow * 0.72,
                learnerFlow * 0.94,
                learnerFlow * 0.8,
              ]}
            />
            <ChartMetricCard
              label="Batches"
              value={batches.length}
              hint="Teaching assignments loaded"
              icon={Layers3}
              tone="violet"
              progress={batches.length * 12}
              bars={[
                batches.length * 8,
                batches.length * 10,
                batches.length * 12,
                batches.length * 9,
              ]}
            />
          </>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <PulseMetric label="Attendance Rate" value={`${attendanceRate}%`} hint="From today's logged attendance" icon={CheckCircle2} tone="emerald" />
        <PulseMetric label="Class Load" value={batches.length} hint="Batches under view" icon={BookOpen} tone="blue" />
        <PulseMetric label="Students" value={students.length} hint="Current active learner base" icon={GraduationCap} tone="violet" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard eyebrow="Students" title="Recent learners" action={<Link to="/erp/students" className="text-sm font-medium text-primary hover:underline">Open students</Link>}>
          <div className="space-y-3">
            {students.slice(0, 6).map((student) => (
              <ListItem
                key={student.id}
                title={`${student.firstName} ${student.lastName}`}
                subtitle={`${student.batch?.name || 'No batch'} | ${student.course?.title || 'No course'}`}
                meta={student.uid || `#${student.id}`}
                initials={getInitials(student.firstName, student.lastName)}
                tone="bg-blue-50 text-blue-700"
              />
            ))}
            {students.length === 0 && <EmptyBlock title="No learner records available right now." />}
          </div>
        </SectionCard>

        <SectionCard eyebrow="Teaching pulse" title="Classroom momentum">
          <div className="space-y-5">
            <ProgressStrip label="Attendance entered today" value={todayAttendance.length} max={Math.max(students.length, 1)} hint={`${todayAttendance.length}/${students.length || 0} marked`} color="bg-emerald-500" />
            <ProgressStrip label="Present students" value={presentCount} max={Math.max(todayAttendance.length, 1)} hint={`${attendanceRate}% of today's entries`} color="bg-blue-500" />
            <ProgressStrip label="Batch coverage" value={batches.length} max={Math.max(8, batches.length)} hint="Active teaching lanes" color="bg-violet-500" />
          </div>
        </SectionCard>
      </div>
    </div>
  );
};

const AccountantDashboard = () => {
  const { user } = useAuthStore();
  const payments = usePaymentStore((s) => s.payments);
  const students = useStudentStore((s) => s.students);

  useDashboardAutoRefresh();

  const completedPayments = payments.filter((payment) => payment.status === 'completed');
  const pendingPayments = payments.filter((payment) => payment.status === 'pending');
  const totalCollected = completedPayments.reduce((sum, p) => sum + Number(p.amount || 0), 0);

  // ── Core formula: Outstanding = Sum of all student fees − total collected ──
  const totalFeesAllStudents = students.reduce((sum, s) => sum + Number(s.totalFee || 0), 0);
  const totalOutstanding = Math.max(totalFeesAllStudents - totalCollected, 0);
  const collectionRate = totalFeesAllStudents > 0 ? (totalCollected / totalFeesAllStudents) * 100 : 0;

  // Per-student breakdown for the dues list
  const paymentMap = buildStudentPaymentMap(payments);
  const studentsWithDues = students
    .map((student) => {
      const totalFee = Number(student.totalFee || 0);
      const paid = paymentMap[student.id] || paymentMap[student.integerId] || 0;
      const due = Math.max(totalFee - paid, 0);
      return { ...student, due, paid };
    })
    .filter((student) => student.due > 0)
    .sort((a, b) => b.due - a.due);

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Finance desk: ${user?.firstName || 'Accountant'}`}
        subtitle="Use this panel to track collections, open dues, receipts, and next payment actions."
      />

      <DashboardHero
        title="Live financial control from the ERP"
        subtitle="Review cash flow, pending amounts, payment receipts, and the highest dues without switching screens."
        quickActions={
          <>
            <QuickAction to="/erp/payments/new" icon={Receipt} title="Record Payment" subtitle="Add a new transaction" accent="bg-emerald-500" />
            <QuickAction to="/erp/payments" icon={CreditCard} title="Payment Ledger" subtitle="Open searchable payment history" accent="bg-blue-500" />
            <QuickAction to="/erp/fees" icon={Landmark} title="Fee Structures" subtitle="Manage course billing setup" accent="bg-violet-500" />
            <QuickAction to="/erp/students" icon={GraduationCap} title="Student Profiles" subtitle="Open fee and dues summaries" accent="bg-amber-500" />
          </>
        }
        insight={
          <>
            <ChartMetricCard
              label="Collected"
              value={formatCurrency(totalCollected)}
              hint={`${completedPayments.length} completed receipts`}
              icon={Landmark}
              tone="emerald"
              progress={collectionRate}
              breakdown={[
                { label: 'Collected', value: formatCurrency(totalCollected), percent: collectionRate },
                { label: 'Outstanding', value: formatCurrency(totalOutstanding), percent: Math.max(100 - collectionRate, 0) },
              ]}
            />
            <ChartMetricCard
              label="Outstanding"
              value={formatCurrency(totalOutstanding)}
              hint={`₹${formatCurrency(totalFeesAllStudents)} total fees − collected`}
              icon={CircleAlert}
              tone="amber"
              progress={students.length > 0 ? (studentsWithDues.length / students.length) * 100 : 0}
              bars={studentsWithDues.slice(0, 5).map((student) => totalOutstanding > 0 ? (student.due / Math.max(totalOutstanding, 1)) * 100 : 0)}
            />
            <ChartMetricCard
              label="Students With Dues"
              value={studentsWithDues.length}
              hint="Needs follow-up"
              icon={Users}
              tone="blue"
              progress={students.length > 0 ? (studentsWithDues.length / students.length) * 100 : 0}
              bars={[
                studentsWithDues.length * 10,
                studentsWithDues.length * 14,
                studentsWithDues.length * 18,
                studentsWithDues.length * 12,
              ]}
            />
          </>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <PulseMetric label="Total Collected" value={formatCurrency(totalCollected)} hint="Completed payment entries" icon={CheckCircle2} tone="emerald" />
        <PulseMetric label="Outstanding" value={formatCurrency(totalOutstanding)} hint="Total fees minus collected" icon={Clock3} tone="amber" />
        <PulseMetric label="Total Fees" value={formatCurrency(totalFeesAllStudents)} hint="Sum of all student fees" icon={Receipt} tone="blue" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <SectionCard eyebrow="Collection flow" title="Financial pressure map">
          <div className="space-y-5">
            <ProgressStrip label="Collected vs outstanding" value={totalCollected} max={Math.max(totalFeesAllStudents, 1)} hint={`${formatCurrency(totalOutstanding)} still outstanding`} color="bg-emerald-500" />
            <ProgressStrip label="Students needing follow-up" value={studentsWithDues.length} max={Math.max(students.length, 1)} hint={`${students.length} students tracked`} color="bg-amber-500" />
            <ProgressStrip label="Receipt completion" value={completedPayments.length} max={Math.max(payments.length, 1)} hint={`${pendingPayments.length} still pending status`} color="bg-blue-500" />
          </div>
        </SectionCard>

        <SectionCard eyebrow="Urgency" title="Top due students" action={<Link to="/erp/students" className="text-sm font-medium text-primary hover:underline">Open profiles</Link>}>
          <div className="space-y-3">
            {studentsWithDues.slice(0, 5).map((student) => (
              <ListItem
                key={student.id}
                title={`${student.firstName} ${student.lastName}`}
                subtitle={`${student.course?.title || 'No course'} | UID ${student.uid || student.id}`}
                meta={<div><p className="font-semibold text-rose-600">{formatCurrency(student.due)}</p><p>{formatCurrency(student.paid)} paid</p></div>}
                initials={getInitials(student.firstName, student.lastName)}
                tone="bg-rose-50 text-rose-700"
              />
            ))}
            {studentsWithDues.length === 0 && <EmptyBlock title="No outstanding dues right now." />}
          </div>
        </SectionCard>
      </div>

      <SectionCard eyebrow="Ledger" title="Recent payments" action={<Link to="/erp/payments" className="text-sm font-medium text-primary hover:underline">View full ledger</Link>}>
        <div className="grid gap-3 lg:grid-cols-2">
          {payments.slice(0, 6).map((payment) => (
            <ListItem
              key={payment.id}
              title={`${payment.student?.firstName || 'Student'} ${payment.student?.lastName || ''}`.trim()}
              subtitle={`${payment.paymentMethod?.replace('_', ' ') || 'Payment'} | Receipt ${payment.receiptNumber || payment.id}`}
              meta={<div><p className="font-semibold text-slate-700">{formatCurrency(payment.amount)}</p><p className={payment.status === 'completed' ? 'text-emerald-600' : 'text-amber-600'}>{payment.status}</p></div>}
              initials={payment.status === 'completed' ? 'OK' : 'PD'}
              tone={payment.status === 'completed' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}
            />
          ))}
          {payments.length === 0 && <EmptyBlock title="No payment rows available yet." />}
        </div>
      </SectionCard>
    </div>
  );
};

const StudentDashboard = ({ basePath = '/erp' }) => {
  const { user } = useAuthStore();
  const notices = useNoticeStore((s) => s.notices);

  useDashboardAutoRefresh({
    fetchStudents: false,
    fetchBatches: false,
    fetchPayments: false,
    fetchAttendance: false,
    fetchStaffs: false,
    fetchNotices: { 'pagination[pageSize]': 10, 'filters[isPublic][$eq]': true },
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome, ${user?.firstName || 'Student'}`}
        subtitle="Your ERP home now acts like a student hub with faster access to requests, notices, and academic navigation."
      />

      <DashboardHero
        title="Stay on top of your learning from one place"
        subtitle="Move between exam requests, notices, results, and your profile without hunting through menus."
        quickActions={
          <>
            <QuickAction to={`${basePath}/my-exam-requests`} icon={FileSpreadsheet} title="Exam Requests" subtitle="Request and track approvals" accent="bg-violet-500" />
            <QuickAction to={`${basePath}/notices`} icon={Bell} title="Notice Board" subtitle="Read the latest announcements" accent="bg-amber-500" />
            <QuickAction to={`${basePath}/results`} icon={ClipboardCheck} title="Results" subtitle="Check published exam results" accent="bg-emerald-500" />
            <QuickAction to={`${basePath}/profile`} icon={Users} title="My Profile" subtitle="Review account details" accent="bg-blue-500" />
          </>
        }
        insight={
          <>
            <ChartMetricCard
              label="Portal Access"
              value="Active"
              hint="You are signed in to the ERP"
              icon={CheckCircle2}
              tone="emerald"
              progress={100}
              bars={[50, 70, 88, 100]}
            />
            <ChartMetricCard
              label="Updates"
              value={notices.length}
              hint="Recent notices available"
              icon={Bell}
              tone="amber"
              progress={notices.length * 16}
              bars={[notices.length * 8, notices.length * 12, notices.length * 16, notices.length * 10]}
            />
            <ChartMetricCard
              label="Next Step"
              value="Stay Ready"
              hint="Use the quick actions to move faster"
              icon={Sparkles}
              tone="blue"
              progress={84}
              breakdown={[
                { label: 'Requests', value: 'Track', percent: 70 },
                { label: 'Results', value: 'Review', percent: 85 },
              ]}
            />
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard eyebrow="Updates" title="Recent notices" action={<Link to={`${basePath}/notices`} className="text-sm font-medium text-primary hover:underline">Open notice board</Link>}>
          <div className="space-y-3">
            {notices.slice(0, 5).map((notice) => (
              <div key={notice.id} className="rounded-2xl border border-slate-100 bg-slate-50/70 px-4 py-3">
                <p className="text-sm font-semibold text-slate-800">{notice.title}</p>
                <p className="mt-1 text-xs text-slate-500 line-clamp-2">{notice.description || notice.content || 'No summary available'}</p>
              </div>
            ))}
            {notices.length === 0 && <EmptyBlock title="No notices are available at the moment." />}
          </div>
        </SectionCard>

        <SectionCard eyebrow="Shortcuts" title="Academic actions">
          <div className="grid gap-3 sm:grid-cols-2">
            <QuickAction to={`${basePath}/my-exam-requests`} icon={FileSpreadsheet} title="Exam Requests" subtitle="Track approval status" accent="bg-violet-500" />
            <QuickAction to={`${basePath}/notices`} icon={Bell} title="Notices" subtitle="Read institute updates" accent="bg-amber-500" />
            <QuickAction to={`${basePath}/results`} icon={ClipboardCheck} title="Results" subtitle="See available results" accent="bg-emerald-500" />
            <QuickAction to={`${basePath}/profile`} icon={Users} title="Profile" subtitle="Review account details" accent="bg-blue-500" />
          </div>
        </SectionCard>
      </div>
    </div>
  );
};

const DashboardPage = ({ studentBasePath = '/erp' }) => {
  const { role, isBranchAdmin, isTeacher, isAccountant, isStudent } = usePermission();

  switch (role) {
    case ROLES.INSTITUTE_ADMIN:
      return <AdminDashboard />;
    case ROLES.BRANCH_ADMIN:
      return <BranchAdminDashboard />;
    case ROLES.TEACHER:
      return <TeacherDashboard />;
    case ROLES.ACCOUNTANT:
      return <AccountantDashboard />;
    case ROLES.STUDENT:
      return <StudentDashboard basePath={studentBasePath} />;
    default:
      if (isBranchAdmin) return <BranchAdminDashboard />;
      if (isTeacher) return <TeacherDashboard />;
      if (isAccountant) return <AccountantDashboard />;
      if (isStudent) return <StudentDashboard basePath={studentBasePath} />;
      return <AdminDashboard />;
  }
};

export default DashboardPage;
