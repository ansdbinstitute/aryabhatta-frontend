// ─── Roles (Matches Backend roleType field) ───
export const ROLES = {
  INSTITUTE_ADMIN: 'institute_admin',
  BRANCH_ADMIN: 'branch_admin',
  TEACHER: 'teacher',
  ACCOUNTANT: 'accountant',
  STUDENT: 'student',
};

export const ROLE_LABELS = {
  [ROLES.INSTITUTE_ADMIN]: 'Institute Admin',
  [ROLES.BRANCH_ADMIN]: 'Branch Admin',
  [ROLES.TEACHER]: 'Teacher',
  [ROLES.ACCOUNTANT]: 'Accountant',
  [ROLES.STUDENT]: 'Student',
};

// Staff role types for creating users
export const STAFF_ROLES = [
  { value: ROLES.BRANCH_ADMIN, label: 'Branch Admin' },
  { value: ROLES.TEACHER, label: 'Teacher' },
  { value: ROLES.ACCOUNTANT, label: 'Accountant' },
];

// ─── Student Status ───
export const STUDENT_STATUS = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  DROPPED: 'dropped',
  SUSPENDED: 'suspended',
};

export const STUDENT_STATUS_LABELS = {
  [STUDENT_STATUS.ACTIVE]: 'Active',
  [STUDENT_STATUS.COMPLETED]: 'Completed',
  [STUDENT_STATUS.DROPPED]: 'Dropped',
  [STUDENT_STATUS.SUSPENDED]: 'Suspended',
};

// ─── Batch Status ───
export const BATCH_STATUS = {
  UPCOMING: 'upcoming',
  ONGOING: 'ongoing',
  COMPLETED: 'completed',
};

export const BATCH_STATUS_LABELS = {
  [BATCH_STATUS.UPCOMING]: 'Upcoming',
  [BATCH_STATUS.ONGOING]: 'Ongoing',
  [BATCH_STATUS.COMPLETED]: 'Completed',
};

// ─── Attendance Status ───
export const ATTENDANCE_STATUS = {
  PRESENT: 'present',
  ABSENT: 'absent',
  LATE: 'late',
  EXCUSED: 'excused',
};

export const ATTENDANCE_STATUS_LABELS = {
  [ATTENDANCE_STATUS.PRESENT]: 'Present',
  [ATTENDANCE_STATUS.ABSENT]: 'Absent',
  [ATTENDANCE_STATUS.LATE]: 'Late',
  [ATTENDANCE_STATUS.EXCUSED]: 'Excused',
};

// ─── Fee Type ───
export const FEE_TYPE = {
  TUITION: 'tuition',
  REGISTRATION: 'registration',
  EXAM: 'exam',
  MATERIAL: 'material',
  OTHER: 'other',
};

export const FEE_TYPE_LABELS = {
  [FEE_TYPE.TUITION]: 'Tuition Fee',
  [FEE_TYPE.REGISTRATION]: 'Registration Fee',
  [FEE_TYPE.EXAM]: 'Exam Fee',
  [FEE_TYPE.MATERIAL]: 'Material Fee',
  [FEE_TYPE.OTHER]: 'Other',
};

// ─── Payment Method ───
export const PAYMENT_METHOD = {
  CASH: 'cash',
  UPI: 'upi',
  BANK_TRANSFER: 'bank_transfer',
  CHEQUE: 'cheque',
  ONLINE: 'online',
};

export const PAYMENT_METHOD_LABELS = {
  [PAYMENT_METHOD.CASH]: 'Cash',
  [PAYMENT_METHOD.UPI]: 'UPI',
  [PAYMENT_METHOD.BANK_TRANSFER]: 'Bank Transfer',
  [PAYMENT_METHOD.CHEQUE]: 'Cheque',
  [PAYMENT_METHOD.ONLINE]: 'Online',
};

// ─── Payment Status ───
export const PAYMENT_STATUS = {
  COMPLETED: 'completed',
  PENDING: 'pending',
  FAILED: 'failed',
  REFUNDED: 'refunded',
};

// ─── Exam Type ───
export const EXAM_TYPE = {
  THEORY: 'theory',
  PRACTICAL: 'practical',
  VIVA: 'viva',
  PROJECT: 'project',
  INTERNAL: 'internal',
};

export const EXAM_TYPE_LABELS = {
  [EXAM_TYPE.THEORY]: 'Theory',
  [EXAM_TYPE.PRACTICAL]: 'Practical',
  [EXAM_TYPE.VIVA]: 'Viva',
  [EXAM_TYPE.PROJECT]: 'Project',
  [EXAM_TYPE.INTERNAL]: 'Internal',
};

// ─── Exam Status ───
export const EXAM_STATUS = {
  SCHEDULED: 'scheduled',
  ONGOING: 'ongoing',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

// ─── Result Status ───
export const RESULT_STATUS = {
  PASS: 'pass',
  FAIL: 'fail',
  ABSENT: 'absent',
  WITHHELD: 'withheld',
};

// ─── Notice Priority ───
export const NOTICE_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
};

export const NOTICE_PRIORITY_LABELS = {
  [NOTICE_PRIORITY.LOW]: 'Low',
  [NOTICE_PRIORITY.MEDIUM]: 'Medium',
  [NOTICE_PRIORITY.HIGH]: 'High',
  [NOTICE_PRIORITY.URGENT]: 'Urgent',
};

// ─── Notice Audience ───
export const NOTICE_AUDIENCE = {
  ALL: 'all',
  STUDENTS: 'students',
  TEACHERS: 'teachers',
  SPECIFIC_BATCHES: 'specific_batches',
};

// ─── Material Type ───
export const MATERIAL_TYPE = {
  NOTES: 'notes',
  ASSIGNMENT: 'assignment',
  REFERENCE: 'reference',
  VIDEO_LINK: 'video_link',
  SYLLABUS: 'syllabus',
  OTHER: 'other',
};

export const MATERIAL_TYPE_LABELS = {
  [MATERIAL_TYPE.NOTES]: 'Notes',
  [MATERIAL_TYPE.ASSIGNMENT]: 'Assignment',
  [MATERIAL_TYPE.REFERENCE]: 'Reference',
  [MATERIAL_TYPE.VIDEO_LINK]: 'Video Link',
  [MATERIAL_TYPE.SYLLABUS]: 'Syllabus',
  [MATERIAL_TYPE.OTHER]: 'Other',
};

// ─── Days of Week ───
export const DAYS_OF_WEEK = [
  'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
];

export const DAY_LABELS = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday',
};

// ─── Gender ───
export const GENDER = {
  MALE: 'male',
  FEMALE: 'female',
  OTHER: 'other',
};

// ─── Duration Unit ───
export const DURATION_UNIT = {
  DAYS: 'days',
  WEEKS: 'weeks',
  MONTHS: 'months',
  YEARS: 'years',
};

// ─── Pagination Defaults ───
export const DEFAULT_PAGE_SIZE = 25;
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

// ─── Local Storage Keys ───
export const STORAGE_KEYS = {
  TOKEN: 'ansdb_erp_token',
  USER: 'ansdb_erp_user',
  STUDENT_TOKEN: 'ansdb_student_token',
  STUDENT_USER: 'ansdb_student_user',
  SIDEBAR_COLLAPSED: 'ansdb_erp_sidebar',
};

// ─── Status Color Map ───
export const STATUS_COLORS = {
  active: 'success',
  ongoing: 'success',
  completed: 'info',
  upcoming: 'warning',
  cancelled: 'danger',
  dropped: 'danger',
  suspended: 'danger',
  present: 'success',
  absent: 'danger',
  late: 'warning',
  excused: 'info',
  pass: 'success',
  fail: 'danger',
  withheld: 'warning',
  pending: 'warning',
  refunded: 'info',
  failed: 'danger',
  low: 'info',
  neutral: 'neutral',
  medium: 'neutral',
  high: 'warning',
  urgent: 'danger',
};
