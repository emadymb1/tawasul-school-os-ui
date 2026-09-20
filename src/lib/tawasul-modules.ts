// Auto-generated from the live Tawasul admin menu (se.fiksutilitoimisto.fi).
export type TawasulKind = "manage" | "report" | "settings" | "view" | "page";
export type TawasulGroup = "admin" | "care" | "assess" | "learn" | "people" | "other";
export type TawasulPageDef = { slug: string; file: string; title: string; kind: TawasulKind };
export type TawasulModule = { slug: string; title: string; group: TawasulGroup; pages: TawasulPageDef[] };

export const TAWASUL_GROUPS: { key: TawasulGroup; title: string }[] = [
  { key: "admin", title: "الإدارة" },
  { key: "care", title: "رعاية تربوية" },
  { key: "assess", title: "التقييم" },
  { key: "learn", title: "تعلم" },
  { key: "people", title: "الأشخاص" },
  { key: "other", title: "أخرى" },
];

export const TAWASUL_MODULES: TawasulModule[] = [
  {
    "slug": "api-insights",
    "title": "تحليلات واجهة البرمجة",
    "group": "admin",
    "pages": [
      {
        "slug": "insights-dashboard",
        "file": "insights_dashboard",
        "title": "لوحة تحليلات واجهة البرمجة",
        "kind": "page"
      },
      {
        "slug": "insights-keys",
        "file": "insights_keys",
        "title": "مفاتيح واجهة البرمجة",
        "kind": "page"
      },
      {
        "slug": "insights-webhooks",
        "file": "insights_webhooks",
        "title": "تحليلات إشعارات الربط",
        "kind": "page"
      }
    ]
  },
  {
    "slug": "activities",
    "title": "الأنْشطة",
    "group": "learn",
    "pages": [
      {
        "slug": "explore",
        "file": "explore",
        "title": "إستكشف الأنشطة",
        "kind": "page"
      },
      {
        "slug": "activities-my",
        "file": "activities_my",
        "title": "أنشطتي",
        "kind": "page"
      },
      {
        "slug": "activities-view",
        "file": "activities_view",
        "title": "معاينة الأنشطة",
        "kind": "view"
      },
      {
        "slug": "activities-payment",
        "file": "activities_payment",
        "title": "إصدار الفواتير",
        "kind": "page"
      },
      {
        "slug": "activities-manage",
        "file": "activities_manage",
        "title": "إدارة الأنشطة",
        "kind": "manage"
      },
      {
        "slug": "activities-categories",
        "file": "activities_categories",
        "title": "ادارة الأصناف",
        "kind": "page"
      },
      {
        "slug": "report-attendance",
        "file": "report_attendance",
        "title": "سجل الحضور حسب النشاط",
        "kind": "report"
      },
      {
        "slug": "activities-attendance",
        "file": "activities_attendance",
        "title": "ادخال حضور مهمة",
        "kind": "page"
      },
      {
        "slug": "activities-attendance-sheet",
        "file": "activities_attendance_sheet",
        "title": "كشف الحضور للطباعة",
        "kind": "page"
      },
      {
        "slug": "choices-manage",
        "file": "choices_manage",
        "title": "إدارة الخيارات",
        "kind": "manage"
      },
      {
        "slug": "enrolment-manage",
        "file": "enrolment_manage",
        "title": "إدارة الإلتحاق",
        "kind": "manage"
      },
      {
        "slug": "enrolment-manage-staffing",
        "file": "enrolment_manage_staffing",
        "title": "إدارة التوظيف",
        "kind": "manage"
      },
      {
        "slug": "report-notenrolled",
        "file": "report_notEnrolled",
        "title": "طلبة لم يلتحقوا",
        "kind": "report"
      },
      {
        "slug": "report-notsignedup",
        "file": "report_notSignedUp",
        "title": "طلبة لم يسجلوا",
        "kind": "report"
      },
      {
        "slug": "report-unassigned",
        "file": "report_unassigned",
        "title": "عرض الموظفين غير المعينين",
        "kind": "report"
      },
      {
        "slug": "report-overview",
        "file": "report_overview",
        "title": "نظرة عامة للأنشطة",
        "kind": "report"
      },
      {
        "slug": "report-attendance-bydate",
        "file": "report_attendance_byDate",
        "title": "حضور المهام حسب التاريخ",
        "kind": "report"
      },
      {
        "slug": "report-activitychoices-byformgroup",
        "file": "report_activityChoices_byFormGroup",
        "title": "اختيارات الأنشطة حسب المجموعة",
        "kind": "report"
      },
      {
        "slug": "report-activitychoices-bystudent",
        "file": "report_activityChoices_byStudent",
        "title": "اختيارات النشاط حسب الطالب",
        "kind": "report"
      },
      {
        "slug": "report-activityenrollmentsummary",
        "file": "report_activityEnrollmentSummary",
        "title": "ملخص الالتحاق بالنشاط",
        "kind": "report"
      },
      {
        "slug": "report-activityspread-formgroup",
        "file": "report_activitySpread_formGroup",
        "title": "توزيع الأنشطة حسب الصف الدراسي",
        "kind": "report"
      },
      {
        "slug": "report-activitytype-formgroup",
        "file": "report_activityType_formGroup",
        "title": "نوع النشاط حسب الصف الدراسي",
        "kind": "report"
      },
      {
        "slug": "report-participants",
        "file": "report_participants",
        "title": "المشاركين حسب النشاط",
        "kind": "report"
      }
    ]
  },
  {
    "slug": "admissions",
    "title": "القبول",
    "group": "people",
    "pages": [
      {
        "slug": "studentenrolment-manage",
        "file": "studentEnrolment_manage",
        "title": "إلتحاق الطالب",
        "kind": "manage"
      },
      {
        "slug": "student-withdraw",
        "file": "student_withdraw",
        "title": "فصل طالب",
        "kind": "page"
      },
      {
        "slug": "admissions-manage",
        "file": "admissions_manage",
        "title": "حسابات القبول",
        "kind": "manage"
      },
      {
        "slug": "applications-manage",
        "file": "applications_manage",
        "title": "إدارة نماذج التسجيل",
        "kind": "manage"
      },
      {
        "slug": "report-students-left",
        "file": "report_students_left",
        "title": "الطلبة المغادرون",
        "kind": "report"
      },
      {
        "slug": "report-students-new",
        "file": "report_students_new",
        "title": "الطلبة الجدد",
        "kind": "report"
      },
      {
        "slug": "report-graph-studentenrolment",
        "file": "report_graph_studentEnrolment",
        "title": "تحليل بيانات التحاق الطلبة",
        "kind": "report"
      },
      {
        "slug": "report-students-new",
        "file": "report_students_new",
        "title": "استعراض الكل",
        "kind": "report"
      },
      {
        "slug": "report-students-left",
        "file": "report_students_left",
        "title": "استعراض الكل",
        "kind": "report"
      }
    ]
  },
  {
    "slug": "attendance",
    "title": "الحضور",
    "group": "care",
    "pages": [
      {
        "slug": "attendance-future-byperson",
        "file": "attendance_future_byPerson",
        "title": "تعيين التغيب المستقبلي",
        "kind": "page"
      },
      {
        "slug": "report-summary-bydate",
        "file": "report_summary_byDate",
        "title": "تفاصيل الحضور حسب التاريخ",
        "kind": "report"
      },
      {
        "slug": "report-graph-bytype",
        "file": "report_graph_byType",
        "title": "تحليل بيانات الحضور",
        "kind": "report"
      },
      {
        "slug": "report-courseclassesnotregistered-bydate",
        "file": "report_courseClassesNotRegistered_byDate",
        "title": "الحصص غير المسجلة",
        "kind": "report"
      },
      {
        "slug": "report-consecutiveabsences",
        "file": "report_consecutiveAbsences",
        "title": "الغياب المتتالي",
        "kind": "report"
      },
      {
        "slug": "report-formgroupsnotregistered-bydate",
        "file": "report_formGroupsNotRegistered_byDate",
        "title": "الفصول الدراسية غير المسجلة",
        "kind": "report"
      },
      {
        "slug": "report-studenthistory",
        "file": "report_studentHistory",
        "title": "سجل الطالب",
        "kind": "report"
      },
      {
        "slug": "report-studentsnotinclass-bydate",
        "file": "report_studentsNotInClass_byDate",
        "title": "الطلاب المتغيبين عن الحصص",
        "kind": "report"
      },
      {
        "slug": "report-studentsnotonsite-bydate",
        "file": "report_studentsNotOnsite_byDate",
        "title": "طلبة غير المتواجدين في الموقع",
        "kind": "report"
      },
      {
        "slug": "report-studentsnotpresent-bydate",
        "file": "report_studentsNotPresent_byDate",
        "title": "طلبة غير الحاضرين",
        "kind": "report"
      },
      {
        "slug": "attendance-take-adhoc",
        "file": "attendance_take_adHoc",
        "title": "الحضور العاجل",
        "kind": "page"
      },
      {
        "slug": "attendance-take-bycourseclass",
        "file": "attendance_take_byCourseClass",
        "title": "الحضور حسب الفصل",
        "kind": "page"
      },
      {
        "slug": "attendance-take-byformgroup",
        "file": "attendance_take_byFormGroup",
        "title": "الحضور حسب الصف الدراسي",
        "kind": "page"
      },
      {
        "slug": "attendance-take-byperson",
        "file": "attendance_take_byPerson",
        "title": "حضور حسب الشخص",
        "kind": "page"
      },
      {
        "slug": "attendance",
        "file": "attendance",
        "title": "عرض الحضور اليومي",
        "kind": "page"
      }
    ]
  },
  {
    "slug": "behaviour",
    "title": "السلوك",
    "group": "care",
    "pages": [
      {
        "slug": "behaviour-manage",
        "file": "behaviour_manage",
        "title": "إدارة سجلات السلوك",
        "kind": "manage"
      },
      {
        "slug": "behaviour-view",
        "file": "behaviour_view",
        "title": "عرض سجلات السلوك",
        "kind": "view"
      },
      {
        "slug": "behaviour-pattern",
        "file": "behaviour_pattern",
        "title": "البحث عن أنماط السلوك",
        "kind": "page"
      },
      {
        "slug": "behaviour-letters",
        "file": "behaviour_letters",
        "title": "عرض رسائل السلوك",
        "kind": "page"
      }
    ]
  },
  {
    "slug": "bulk-data-processor",
    "title": "معالجة البيانات المجمعة",
    "group": "admin",
    "pages": [
      {
        "slug": "bulk-jobs",
        "file": "bulk_jobs",
        "title": "معالجة البيانات المجمعة",
        "kind": "page"
      }
    ]
  },
  {
    "slug": "calendar",
    "title": "تقويم",
    "group": "other",
    "pages": [
      {
        "slug": "calendar-manage",
        "file": "calendar_manage",
        "title": "إدارة تقويمات",
        "kind": "manage"
      },
      {
        "slug": "calendar-event-manage",
        "file": "calendar_event_manage",
        "title": "إدارة فعاليات",
        "kind": "manage"
      },
      {
        "slug": "calendar-view",
        "file": "calendar_view",
        "title": "عرض التقويم",
        "kind": "view"
      }
    ]
  },
  {
    "slug": "communication-hub",
    "title": "مركز التواصل",
    "group": "admin",
    "pages": [
      {
        "slug": "messages-view",
        "file": "messages_view",
        "title": "صندوق الرسائل الواردة",
        "kind": "view"
      },
      {
        "slug": "templates-manage",
        "file": "templates_manage",
        "title": "قوالب الرسائل",
        "kind": "manage"
      },
      {
        "slug": "scheduled-messages",
        "file": "scheduled_messages",
        "title": "الرسائل المجدولة",
        "kind": "page"
      }
    ]
  },
  {
    "slug": "credentials",
    "title": "بيانات الاعتماد",
    "group": "admin",
    "pages": [
      {
        "slug": "import-credentials",
        "file": "import_credentials",
        "title": "استيراد بيانات الاعتماد",
        "kind": "page"
      },
      {
        "slug": "credentials",
        "file": "credentials",
        "title": "إدارة بيانات الاعتماد",
        "kind": "page"
      },
      {
        "slug": "credentials-view",
        "file": "credentials_view",
        "title": "عرض بيانات الاعتماد",
        "kind": "view"
      },
      {
        "slug": "websites",
        "file": "websites",
        "title": "إدارة المواقع",
        "kind": "page"
      }
    ]
  },
  {
    "slug": "crowd-assessment",
    "title": "التقييم الجماعي",
    "group": "assess",
    "pages": [
      {
        "slug": "crowdassess",
        "file": "crowdAssess",
        "title": "التقييم",
        "kind": "page"
      }
    ]
  },
  {
    "slug": "data-exporter",
    "title": "تصدير البيانات",
    "group": "admin",
    "pages": [
      {
        "slug": "exporter-dashboard",
        "file": "exporter_dashboard",
        "title": "لوحة تصدير البيانات",
        "kind": "page"
      }
    ]
  },
  {
    "slug": "data-updater",
    "title": "محدث البيانات",
    "group": "people",
    "pages": [
      {
        "slug": "data-family-manage",
        "file": "data_family_manage",
        "title": "تحديثات بيانات الأسرة",
        "kind": "manage"
      },
      {
        "slug": "data-finance-manage",
        "file": "data_finance_manage",
        "title": "تحديثات البيانات المالية",
        "kind": "manage"
      },
      {
        "slug": "data-medical-manage",
        "file": "data_medical_manage",
        "title": "تحديثات النموذج الطبي",
        "kind": "manage"
      },
      {
        "slug": "data-personal-manage",
        "file": "data_personal_manage",
        "title": "تحديث البيانات الشخصية",
        "kind": "manage"
      },
      {
        "slug": "data-staff-manage",
        "file": "data_staff_manage",
        "title": "تحديثات بيانات الموظفين",
        "kind": "manage"
      },
      {
        "slug": "report-family-dataupdaterhistory",
        "file": "report_family_dataUpdaterHistory",
        "title": "سجل تحديثات بيانات العائلة",
        "kind": "report"
      },
      {
        "slug": "report-student-dataupdaterhistory",
        "file": "report_student_dataUpdaterHistory",
        "title": "سجل محدث بيانات الطالب",
        "kind": "report"
      },
      {
        "slug": "data-updates",
        "file": "data_updates",
        "title": "تحديثات بياناتي",
        "kind": "page"
      },
      {
        "slug": "data-family",
        "file": "data_family",
        "title": "تحديث بيانات الأسرة",
        "kind": "page"
      },
      {
        "slug": "data-finance",
        "file": "data_finance",
        "title": "تحديث البيانات المالية",
        "kind": "page"
      },
      {
        "slug": "data-medical",
        "file": "data_medical",
        "title": "تحديث البيانات الطبية",
        "kind": "page"
      },
      {
        "slug": "data-personal",
        "file": "data_personal",
        "title": "تحديث البيانات الشخصية",
        "kind": "page"
      },
      {
        "slug": "data-staff",
        "file": "data_staff",
        "title": "تحديث بيانات الموظفين",
        "kind": "page"
      }
    ]
  },
  {
    "slug": "deep-learning",
    "title": "التعلم المتعمق",
    "group": "learn",
    "pages": [
      {
        "slug": "events-manage",
        "file": "events_manage",
        "title": "إدارة فعاليات",
        "kind": "manage"
      },
      {
        "slug": "experience-manage",
        "file": "experience_manage",
        "title": "إدارة الخبرات",
        "kind": "manage"
      },
      {
        "slug": "unit-manage",
        "file": "unit_manage",
        "title": "إدارة الوحدات",
        "kind": "manage"
      },
      {
        "slug": "settings",
        "file": "settings",
        "title": "الإعدادات",
        "kind": "settings"
      },
      {
        "slug": "choices-manage",
        "file": "choices_manage",
        "title": "إدارة الخيارات",
        "kind": "manage"
      },
      {
        "slug": "enrolment-manage-groups",
        "file": "enrolment_manage_groups",
        "title": "إدارة مجموعات التعلم المتعمق",
        "kind": "manage"
      },
      {
        "slug": "enrolment-manage-staffing",
        "file": "enrolment_manage_staffing",
        "title": "إدارة موظفي التعلم المتعمق",
        "kind": "manage"
      },
      {
        "slug": "enrolment-manage-byevent",
        "file": "enrolment_manage_byEvent",
        "title": "إدارة التسجيل حسب الفعالية",
        "kind": "manage"
      },
      {
        "slug": "enrolment-manage-byperson",
        "file": "enrolment_manage_byPerson",
        "title": "إدارة التسجيل حسب الشخص",
        "kind": "manage"
      },
      {
        "slug": "view",
        "file": "view",
        "title": "فعاليات التعلم المتعمق",
        "kind": "view"
      },
      {
        "slug": "viewmydl",
        "file": "viewMyDL",
        "title": "تعلمي المتعمق",
        "kind": "view"
      },
      {
        "slug": "report-overview",
        "file": "report_overview",
        "title": "نظرة عامة على التعلم المتعمق",
        "kind": "report"
      },
      {
        "slug": "report-attendance",
        "file": "report_attendance",
        "title": "حضور الطلاب حسب المجموعة",
        "kind": "report"
      },
      {
        "slug": "report-notenrolled",
        "file": "report_notEnrolled",
        "title": "طلبة لم يلتحقوا",
        "kind": "report"
      },
      {
        "slug": "report-notsignedup",
        "file": "report_notSignedUp",
        "title": "طلبة لم يسجلوا",
        "kind": "report"
      },
      {
        "slug": "report-staffing",
        "file": "report_staffing",
        "title": "عرض موظفي التعلم المتعمق",
        "kind": "report"
      },
      {
        "slug": "report-choices",
        "file": "report_choices",
        "title": "عرض اختيارات الطلاب",
        "kind": "report"
      },
      {
        "slug": "report-unassigned",
        "file": "report_unassigned",
        "title": "عرض الموظفين غير المعينين",
        "kind": "report"
      }
    ]
  },
  {
    "slug": "departments",
    "title": "الأقسام",
    "group": "learn",
    "pages": [
      {
        "slug": "departments",
        "file": "departments",
        "title": "عرض الأقسام",
        "kind": "page"
      }
    ]
  },
  {
    "slug": "finance",
    "title": "المالية",
    "group": "other",
    "pages": [
      {
        "slug": "billingschedule-manage",
        "file": "billingSchedule_manage",
        "title": "إدارة جدولة الفواتير",
        "kind": "manage"
      },
      {
        "slug": "feecategories-manage",
        "file": "feeCategories_manage",
        "title": "إدارة فئات الرسوم",
        "kind": "manage"
      },
      {
        "slug": "fees-manage",
        "file": "fees_manage",
        "title": "إدارة الرسوم",
        "kind": "manage"
      },
      {
        "slug": "invoicees-manage",
        "file": "invoicees_manage",
        "title": "إدارة مستلمي الفواتير",
        "kind": "manage"
      },
      {
        "slug": "invoices-manage",
        "file": "invoices_manage",
        "title": "إدارة الفواتير",
        "kind": "manage"
      },
      {
        "slug": "budgetcycles-manage",
        "file": "budgetCycles_manage",
        "title": "إدارة دورات الميزانية",
        "kind": "manage"
      },
      {
        "slug": "budgets-manage",
        "file": "budgets_manage",
        "title": "إدارة الميزانيات",
        "kind": "manage"
      },
      {
        "slug": "expenseapprovers-manage",
        "file": "expenseApprovers_manage",
        "title": "إدارة الموافقين على النفقات",
        "kind": "manage"
      },
      {
        "slug": "expenses-manage",
        "file": "expenses_manage",
        "title": "ادارة النفقات",
        "kind": "manage"
      },
      {
        "slug": "expenserequest-manage",
        "file": "expenseRequest_manage",
        "title": "نفقاتي المطلوبة",
        "kind": "manage"
      },
      {
        "slug": "pettycash",
        "file": "pettyCash",
        "title": "نثريات",
        "kind": "page"
      }
    ]
  },
  {
    "slug": "form-groups",
    "title": "الفصول الدراسية",
    "group": "people",
    "pages": [
      {
        "slug": "formgroups",
        "file": "formGroups",
        "title": "عرض الفصول الدراسية",
        "kind": "page"
      }
    ]
  },
  {
    "slug": "formal-assessment",
    "title": "التقويم الرسمي",
    "group": "assess",
    "pages": [
      {
        "slug": "externalassessment",
        "file": "externalAssessment",
        "title": "بيانات التقييم الخارجي",
        "kind": "page"
      },
      {
        "slug": "internalassessment-manage",
        "file": "internalAssessment_manage",
        "title": "إدارة التقويم الداخلي",
        "kind": "manage"
      },
      {
        "slug": "internalassessment-view",
        "file": "internalAssessment_view",
        "title": "عرض التقويم الداخلي",
        "kind": "view"
      },
      {
        "slug": "internalassessment-write",
        "file": "internalAssessment_write",
        "title": "كتابة التقويم الداخلي",
        "kind": "page"
      }
    ]
  },
  {
    "slug": "help-desk",
    "title": "مكتب المساعدة",
    "group": "other",
    "pages": [
      {
        "slug": "helpdesk-settings",
        "file": "helpDesk_settings",
        "title": "إعدادات مكتب المساعدة",
        "kind": "settings"
      },
      {
        "slug": "helpdesk-statistics",
        "file": "helpDesk_statistics",
        "title": "إحصائيات مكتب المساعدة",
        "kind": "page"
      },
      {
        "slug": "issues-create",
        "file": "issues_create",
        "title": "إنشاء طلب مساعدة",
        "kind": "page"
      },
      {
        "slug": "issues-view",
        "file": "issues_view",
        "title": "طلبات المساعدة",
        "kind": "view"
      },
      {
        "slug": "helpdesk-managereplytemplates",
        "file": "helpDesk_manageReplyTemplates",
        "title": "قوالب ردود مكتب المساعدة",
        "kind": "manage"
      },
      {
        "slug": "helpdesk-managedepartments",
        "file": "helpDesk_manageDepartments",
        "title": "إدارة الأقسام",
        "kind": "manage"
      },
      {
        "slug": "helpdesk-managetechniciangroup",
        "file": "helpDesk_manageTechnicianGroup",
        "title": "إدارة مجموعات الفنيين",
        "kind": "manage"
      },
      {
        "slug": "helpdesk-managetechnicians",
        "file": "helpDesk_manageTechnicians",
        "title": "إدارة الفنيين",
        "kind": "manage"
      }
    ]
  },
  {
    "slug": "individual-needs",
    "title": "الاحتياجات الفردية",
    "group": "care",
    "pages": [
      {
        "slug": "in-view",
        "file": "in_view",
        "title": "سجلات الاحتياجات الفردية",
        "kind": "view"
      },
      {
        "slug": "in-summary",
        "file": "in_summary",
        "title": "ملخص الاحتياجات الفردية",
        "kind": "page"
      },
      {
        "slug": "investigations-manage",
        "file": "investigations_manage",
        "title": "إدارة التحقيقات",
        "kind": "manage"
      },
      {
        "slug": "investigations-submit",
        "file": "investigations_submit",
        "title": "إرسال المساهمات",
        "kind": "page"
      },
      {
        "slug": "in-archive",
        "file": "in_archive",
        "title": "سجلات الارشيف",
        "kind": "page"
      },
      {
        "slug": "report-graph-overview",
        "file": "report_graph_overview",
        "title": "نظرة عامة على الاحتياجات الفردية",
        "kind": "report"
      }
    ]
  },
  {
    "slug": "info-grid",
    "title": "شبكة المعلومات",
    "group": "other",
    "pages": [
      {
        "slug": "infogrid-manage",
        "file": "infoGrid_manage",
        "title": "إدارة شبكة المعلومات",
        "kind": "manage"
      },
      {
        "slug": "infogrid-credits",
        "file": "infoGrid_credits",
        "title": "الاعتمادات والتراخيص",
        "kind": "page"
      }
    ]
  },
  {
    "slug": "library",
    "title": "المكتبة",
    "group": "learn",
    "pages": [
      {
        "slug": "library-browse",
        "file": "library_browse",
        "title": "تصفح المكتبة",
        "kind": "page"
      },
      {
        "slug": "library-lending",
        "file": "library_lending",
        "title": "سجل الإعارة والنشاط",
        "kind": "page"
      },
      {
        "slug": "library-manage-catalog",
        "file": "library_manage_catalog",
        "title": "إدارة الكتالوج",
        "kind": "manage"
      },
      {
        "slug": "library-manage-shelves",
        "file": "library_manage_shelves",
        "title": "أدر رفوف المكتبة",
        "kind": "manage"
      },
      {
        "slug": "report-catalogsummary",
        "file": "report_catalogSummary",
        "title": "ملخص الاصناف",
        "kind": "report"
      },
      {
        "slug": "report-studentborrowingrecord",
        "file": "report_studentBorrowingRecord",
        "title": "سجلات استعارة الطاالب",
        "kind": "report"
      },
      {
        "slug": "report-viewoverdueitems",
        "file": "report_viewOverdueItems",
        "title": "عرض العناصر المتأخرة",
        "kind": "report"
      }
    ]
  },
  {
    "slug": "markbook",
    "title": "سجل الدرجات",
    "group": "assess",
    "pages": [
      {
        "slug": "markbook-edit",
        "file": "markbook_edit",
        "title": "تعديل سجل الدرجات",
        "kind": "page"
      },
      {
        "slug": "markbook-view",
        "file": "markbook_view",
        "title": "معاينة سجل الدرجات",
        "kind": "view"
      }
    ]
  },
  {
    "slug": "messenger",
    "title": "مرْسال",
    "group": "other",
    "pages": [
      {
        "slug": "cannedresponse-manage",
        "file": "cannedResponse_manage",
        "title": "ردود جاهزة",
        "kind": "manage"
      },
      {
        "slug": "messenger-manage",
        "file": "messenger_manage",
        "title": "إدارة الرسائل",
        "kind": "manage"
      },
      {
        "slug": "messenger-post",
        "file": "messenger_post",
        "title": "رسالة جديدة",
        "kind": "page"
      },
      {
        "slug": "messenger-postquickwall",
        "file": "messenger_postQuickWall",
        "title": "رسالة حائط جديدة سريعة",
        "kind": "page"
      },
      {
        "slug": "groups-manage",
        "file": "groups_manage",
        "title": "إدارة المجموعات",
        "kind": "manage"
      },
      {
        "slug": "mailinglistrecipients-manage",
        "file": "mailingListRecipients_manage",
        "title": "إدارة قوائم بريد المستقبلين",
        "kind": "manage"
      },
      {
        "slug": "mailinglists-manage",
        "file": "mailingLists_manage",
        "title": "إدارة قوائم البريد",
        "kind": "manage"
      },
      {
        "slug": "messagewall-view",
        "file": "messageWall_view",
        "title": "عرض رسالة الحائط",
        "kind": "view"
      }
    ]
  },
  {
    "slug": "notification-center",
    "title": "مركز الإشعارات",
    "group": "admin",
    "pages": [
      {
        "slug": "notifications-manage",
        "file": "notifications_manage",
        "title": "إدارة قوالب الإشعارات",
        "kind": "manage"
      },
      {
        "slug": "notifications-analytics",
        "file": "notifications_analytics",
        "title": "تحليلات الإشعارات",
        "kind": "page"
      },
      {
        "slug": "notifications-view",
        "file": "notifications_view",
        "title": "صندوق الإشعارات",
        "kind": "view"
      }
    ]
  },
  {
    "slug": "planner",
    "title": "المُخطِط",
    "group": "learn",
    "pages": [
      {
        "slug": "conceptexplorer",
        "file": "conceptExplorer",
        "title": "استكشاف المفاهيم",
        "kind": "page"
      },
      {
        "slug": "scopeandsequence",
        "file": "scopeAndSequence",
        "title": "نطاق وتسلسل",
        "kind": "page"
      },
      {
        "slug": "outcomes",
        "file": "outcomes",
        "title": "إدارة النتائج",
        "kind": "page"
      },
      {
        "slug": "curriculummapping-outcomesbycourse",
        "file": "curriculumMapping_outcomesByCourse",
        "title": "النتائج حسب المنهج",
        "kind": "page"
      },
      {
        "slug": "planner",
        "file": "planner",
        "title": "مُخطط الدرس",
        "kind": "page"
      },
      {
        "slug": "units",
        "file": "units",
        "title": "مخطط الوحدة",
        "kind": "page"
      },
      {
        "slug": "report-parentweeklyemailsummaryconfirmation",
        "file": "report_parentWeeklyEmailSummaryConfirmation",
        "title": "ملخص البريد الإلكتروني الاسبوعي لولي الأمر",
        "kind": "report"
      },
      {
        "slug": "report-worksummary-byformgroup",
        "file": "report_workSummary_byFormGroup",
        "title": "ملخص العمل حسب الصف الدراسي",
        "kind": "report"
      },
      {
        "slug": "resources-manage",
        "file": "resources_manage",
        "title": "إدارة المصادر",
        "kind": "manage"
      },
      {
        "slug": "resources-view",
        "file": "resources_view",
        "title": "عرض المصادر",
        "kind": "view"
      },
      {
        "slug": "planner",
        "file": "planner",
        "title": "عرض المُخطِط",
        "kind": "page"
      }
    ]
  },
  {
    "slug": "policies",
    "title": "سياسات",
    "group": "other",
    "pages": [
      {
        "slug": "policies-manage",
        "file": "policies_manage",
        "title": "إدارة السياسات",
        "kind": "manage"
      },
      {
        "slug": "policies-view",
        "file": "policies_view",
        "title": "عرض السياسات",
        "kind": "view"
      }
    ]
  },
  {
    "slug": "reports",
    "title": "التقارير",
    "group": "assess",
    "pages": [
      {
        "slug": "reporting-access-manage",
        "file": "reporting_access_manage",
        "title": "إدارة الوصول",
        "kind": "report"
      },
      {
        "slug": "reporting-criteria-manage",
        "file": "reporting_criteria_manage",
        "title": "إدارة معايير التقييم",
        "kind": "report"
      },
      {
        "slug": "reporting-cycles-manage",
        "file": "reporting_cycles_manage",
        "title": "إدارة فترات التقارير",
        "kind": "report"
      },
      {
        "slug": "settings",
        "file": "settings",
        "title": "إعدادات التقارير",
        "kind": "settings"
      },
      {
        "slug": "notification-send",
        "file": "notification_send",
        "title": "إرسال الإشعارات",
        "kind": "page"
      },
      {
        "slug": "archive-manage",
        "file": "archive_manage",
        "title": "إدارة الأرشيف",
        "kind": "manage"
      },
      {
        "slug": "archive-manage-upload",
        "file": "archive_manage_upload",
        "title": "رفع التقارير",
        "kind": "manage"
      },
      {
        "slug": "archive-byreport",
        "file": "archive_byReport",
        "title": "عرض حسب التقرير",
        "kind": "page"
      },
      {
        "slug": "archive-bystudent",
        "file": "archive_byStudent",
        "title": "عرض حسب الطالب",
        "kind": "page"
      },
      {
        "slug": "reporting-my",
        "file": "reporting_my",
        "title": "تقاريري",
        "kind": "report"
      },
      {
        "slug": "reporting-proofread",
        "file": "reporting_proofread",
        "title": "مراجعة التقارير",
        "kind": "report"
      },
      {
        "slug": "reporting-write",
        "file": "reporting_write",
        "title": "كتابة تقارير",
        "kind": "report"
      },
      {
        "slug": "progress-bydepartment",
        "file": "progress_byDepartment",
        "title": "تقدم حسب الأقسام",
        "kind": "page"
      },
      {
        "slug": "progress-byperson",
        "file": "progress_byPerson",
        "title": "التقارير المنجزة حسب الشخص",
        "kind": "page"
      },
      {
        "slug": "progress-byreportingcycle",
        "file": "progress_byReportingCycle",
        "title": "التقارير المنجزة حسب فترات التقارير",
        "kind": "page"
      },
      {
        "slug": "progress-byproofreading",
        "file": "progress_byProofReading",
        "title": "تقدم قراءة الدليل",
        "kind": "page"
      },
      {
        "slug": "progress-studentnameconflicts",
        "file": "progress_studentNameConflicts",
        "title": "التضارب في أسماء الطلبة",
        "kind": "page"
      },
      {
        "slug": "reports-generate",
        "file": "reports_generate",
        "title": "إنشاء التقارير",
        "kind": "report"
      },
      {
        "slug": "reports-manage",
        "file": "reports_manage",
        "title": "إدارة التقارير",
        "kind": "report"
      },
      {
        "slug": "reports-send",
        "file": "reports_send",
        "title": "إرسال التقارير",
        "kind": "report"
      },
      {
        "slug": "templates-manage",
        "file": "templates_manage",
        "title": "منشئ القوالب",
        "kind": "manage"
      }
    ]
  },
  {
    "slug": "rest-api",
    "title": "واجهة برمجة التطبيقات",
    "group": "admin",
    "pages": [
      {
        "slug": "settings-manage",
        "file": "settings_manage",
        "title": "إدارة الإعدادات",
        "kind": "settings"
      },
      {
        "slug": "dashboard",
        "file": "dashboard",
        "title": "لوحة واجهة البرمجة",
        "kind": "page"
      },
      {
        "slug": "docs",
        "file": "docs",
        "title": "توثيق واجهة برمجة التطبيقات",
        "kind": "page"
      },
      {
        "slug": "keys-manage",
        "file": "keys_manage",
        "title": "إدارة مفاتيح واجهة برمجة التطبيقات",
        "kind": "manage"
      },
      {
        "slug": "webhooks-manage",
        "file": "webhooks_manage",
        "title": "إدارة إشعارات الربط",
        "kind": "manage"
      },
      {
        "slug": "logs-view",
        "file": "logs_view",
        "title": "عرض سجل الطلبات",
        "kind": "view"
      }
    ]
  },
  {
    "slug": "rubrics",
    "title": "سلالم التقييم",
    "group": "assess",
    "pages": [
      {
        "slug": "rubrics",
        "file": "rubrics",
        "title": "إدارة سلالم التقييم",
        "kind": "page"
      },
      {
        "slug": "rubrics-view",
        "file": "rubrics_view",
        "title": "عرض سلالم التقييم",
        "kind": "view"
      }
    ]
  },
  {
    "slug": "school-admin",
    "title": "إدارة المدرسة",
    "group": "admin",
    "pages": [
      {
        "slug": "formalassessmentsettings",
        "file": "formalAssessmentSettings",
        "title": "إعدادات التقويم الرسمي",
        "kind": "settings"
      },
      {
        "slug": "externalassessments-manage",
        "file": "externalAssessments_manage",
        "title": "إدارة التقييمات الخارجية",
        "kind": "manage"
      },
      {
        "slug": "gradescales-manage",
        "file": "gradeScales_manage",
        "title": "إدارة مقاييس الدرجات",
        "kind": "manage"
      },
      {
        "slug": "markbooksettings",
        "file": "markbookSettings",
        "title": "إعدادات سجل الدرجات",
        "kind": "settings"
      },
      {
        "slug": "trackingsettings",
        "file": "trackingSettings",
        "title": "إعدادات التتبع",
        "kind": "settings"
      },
      {
        "slug": "department-manage",
        "file": "department_manage",
        "title": "إدارة الأقسام",
        "kind": "manage"
      },
      {
        "slug": "formgroup-manage",
        "file": "formGroup_manage",
        "title": "إدارة الفصول الدراسية",
        "kind": "manage"
      },
      {
        "slug": "house-manage",
        "file": "house_manage",
        "title": "إدارة السكنات",
        "kind": "manage"
      },
      {
        "slug": "yeargroup-manage",
        "file": "yearGroup_manage",
        "title": "إدارة المراحل الدراسية",
        "kind": "manage"
      },
      {
        "slug": "activitysettings",
        "file": "activitySettings",
        "title": "إدارة إعدادات النشاط",
        "kind": "settings"
      },
      {
        "slug": "insettings",
        "file": "inSettings",
        "title": "اعدادات إدارة الاحتياجات الفردية",
        "kind": "settings"
      },
      {
        "slug": "librarysettings",
        "file": "librarySettings",
        "title": "إدارة إعدادات المكتبة",
        "kind": "settings"
      },
      {
        "slug": "plannersettings",
        "file": "plannerSettings",
        "title": "إعدادات المخطط",
        "kind": "settings"
      },
      {
        "slug": "resourcesettings",
        "file": "resourceSettings",
        "title": "إدارة إعدادات المصادر",
        "kind": "settings"
      },
      {
        "slug": "dashboardsettings",
        "file": "dashboardSettings",
        "title": "إعدادات اللوحة الرئيسية",
        "kind": "settings"
      },
      {
        "slug": "emailsummarysettings",
        "file": "emailSummarySettings",
        "title": "إعدادات ملخص البريد الإلكتروني",
        "kind": "settings"
      },
      {
        "slug": "spacesettings",
        "file": "spaceSettings",
        "title": "إعدادات المرفق",
        "kind": "settings"
      },
      {
        "slug": "financesettings",
        "file": "financeSettings",
        "title": "إدارة إعدادات المالية",
        "kind": "settings"
      },
      {
        "slug": "space-manage",
        "file": "space_manage",
        "title": "إدارة المرافق",
        "kind": "manage"
      },
      {
        "slug": "fileextensions-manage",
        "file": "fileExtensions_manage",
        "title": "إدارة امتدادات الملف",
        "kind": "manage"
      },
      {
        "slug": "messengersettings",
        "file": "messengerSettings",
        "title": "إدارة إعدادات المسنجر",
        "kind": "settings"
      },
      {
        "slug": "admissions-settings",
        "file": "admissions_settings",
        "title": "إدارة إعدادات القبول",
        "kind": "settings"
      },
      {
        "slug": "attendancesettings",
        "file": "attendanceSettings",
        "title": "إعدادات الحضور",
        "kind": "settings"
      },
      {
        "slug": "behavioursettings",
        "file": "behaviourSettings",
        "title": "إدارة إعدادات السلوك",
        "kind": "settings"
      },
      {
        "slug": "medicalconditions-manage",
        "file": "medicalConditions_manage",
        "title": "إدارة الحالات الطبية",
        "kind": "manage"
      },
      {
        "slug": "alertlevelsettings",
        "file": "alertLevelSettings",
        "title": "إعدادات تنبيه الطالب",
        "kind": "settings"
      },
      {
        "slug": "daysofweek-manage",
        "file": "daysOfWeek_manage",
        "title": "أيام الأسبوع",
        "kind": "manage"
      },
      {
        "slug": "schoolyear-manage",
        "file": "schoolYear_manage",
        "title": "إدارة سنوات المدرسة",
        "kind": "manage"
      },
      {
        "slug": "schoolyearspecialday-manage",
        "file": "schoolYearSpecialDay_manage",
        "title": "إدارة الأيام الخاصة",
        "kind": "manage"
      },
      {
        "slug": "schoolyearterm-manage",
        "file": "schoolYearTerm_manage",
        "title": "إدارة الفصول الدراسية",
        "kind": "manage"
      }
    ]
  },
  {
    "slug": "staff",
    "title": "الموظفون",
    "group": "people",
    "pages": [
      {
        "slug": "absences-approval",
        "file": "absences_approval",
        "title": "الموافقة على طلبات غياب الموظفين",
        "kind": "page"
      },
      {
        "slug": "absences-manage",
        "file": "absences_manage",
        "title": "إدارة غياب الموظفين",
        "kind": "manage"
      },
      {
        "slug": "absences-add",
        "file": "absences_add",
        "title": "غياب جديد",
        "kind": "page"
      },
      {
        "slug": "absences-view-byperson",
        "file": "absences_view_byPerson",
        "title": "عرض الغياب",
        "kind": "view"
      },
      {
        "slug": "coverage-planner",
        "file": "coverage_planner",
        "title": "مخطط التغطية اليومية",
        "kind": "page"
      },
      {
        "slug": "coverage-manage",
        "file": "coverage_manage",
        "title": "إدارة تغطية الموظفين",
        "kind": "manage"
      },
      {
        "slug": "coverage-my",
        "file": "coverage_my",
        "title": "تغطيتي",
        "kind": "page"
      },
      {
        "slug": "coverage-view",
        "file": "coverage_view",
        "title": "الطلبات المفتوحة",
        "kind": "view"
      },
      {
        "slug": "report-subs-availability",
        "file": "report_subs_availability",
        "title": "توافر البدلاء",
        "kind": "report"
      },
      {
        "slug": "staff-view",
        "file": "staff_view",
        "title": "دليل الموظفين",
        "kind": "view"
      },
      {
        "slug": "staff-duty",
        "file": "staff_duty",
        "title": "جدول المناوبة",
        "kind": "page"
      },
      {
        "slug": "report-absences-summary",
        "file": "report_absences_summary",
        "title": "ملخص غياب الموظفين",
        "kind": "report"
      },
      {
        "slug": "report-coverage-summary",
        "file": "report_coverage_summary",
        "title": "ملخص تغطية الموظفين",
        "kind": "report"
      },
      {
        "slug": "report-absences-weekly",
        "file": "report_absences_weekly",
        "title": "الغياب الأسبوعي",
        "kind": "report"
      },
      {
        "slug": "applicationform",
        "file": "applicationForm",
        "title": "نموذج تسجيل",
        "kind": "page"
      },
      {
        "slug": "jobopenings-manage",
        "file": "jobOpenings_manage",
        "title": "الوظائف المتاحة",
        "kind": "manage"
      },
      {
        "slug": "staff-manage",
        "file": "staff_manage",
        "title": "إدارة الموظفين",
        "kind": "manage"
      },
      {
        "slug": "substitutes-manage",
        "file": "substitutes_manage",
        "title": "إدارة البدلاء",
        "kind": "manage"
      },
      {
        "slug": "staff-view-details-p",
        "file": "staff_view_details.p",
        "title": "عرض تفاصيل الموظف",
        "kind": "view"
      }
    ]
  },
  {
    "slug": "student-alerts",
    "title": "تنبيهات الطالب",
    "group": "care",
    "pages": [
      {
        "slug": "studentalerts-manage",
        "file": "studentAlerts_manage",
        "title": "إدارة تنبيهات الطلاب",
        "kind": "manage"
      },
      {
        "slug": "report-alertsbyclass",
        "file": "report_alertsByClass",
        "title": "تنبيهات الطالب حسب الفصل",
        "kind": "report"
      },
      {
        "slug": "report-alertsbyformgroup",
        "file": "report_alertsByFormGroup",
        "title": "تنبيهات الطالب حسب الصف الدراسي",
        "kind": "report"
      }
    ]
  },
  {
    "slug": "students",
    "title": "الطلبة",
    "group": "people",
    "pages": [
      {
        "slug": "firstaidrecord",
        "file": "firstAidRecord",
        "title": "سجل الاسعافات الاولية",
        "kind": "page"
      },
      {
        "slug": "medicalform-manage",
        "file": "medicalForm_manage",
        "title": "إدارة النماذج الطبية",
        "kind": "manage"
      },
      {
        "slug": "student-view",
        "file": "student_view",
        "title": "عرض الملف الشخصي للطالب",
        "kind": "view"
      },
      {
        "slug": "report-students-agegendersummary",
        "file": "report_students_ageGenderSummary",
        "title": "ملخص العمر والجنس",
        "kind": "report"
      },
      {
        "slug": "report-student-emergencysummary",
        "file": "report_student_emergencySummary",
        "title": "ملخص بيانات الطوارئ",
        "kind": "report"
      },
      {
        "slug": "report-emergencysms-bytransport",
        "file": "report_emergencySMS_byTransport",
        "title": "الرسائل القصيرة الطارئة حسب النقل",
        "kind": "report"
      },
      {
        "slug": "report-emergencysms-byyeargroup",
        "file": "report_emergencySMS_byYearGroup",
        "title": "الرسائل القصيرة الطارئة حسب المرحلة الدراسية",
        "kind": "report"
      },
      {
        "slug": "report-familyaddress-bystudent",
        "file": "report_familyAddress_byStudent",
        "title": "عنوان الأسرة حسب الطالب",
        "kind": "report"
      },
      {
        "slug": "report-formgroupsummary",
        "file": "report_formGroupSummary",
        "title": "ملخص الصف الدراسي",
        "kind": "report"
      },
      {
        "slug": "report-lettershome-byformgroup",
        "file": "report_lettersHome_byFormGroup",
        "title": "فالرسائل إلى أولياء الأمور حسب الصف الدراسي",
        "kind": "report"
      },
      {
        "slug": "report-student-medicalsummary",
        "file": "report_student_medicalSummary",
        "title": "ملخص البيانات الطبية",
        "kind": "report"
      },
      {
        "slug": "report-student-personaldocumentsummary",
        "file": "report_student_personalDocumentSummary",
        "title": "موجز الوثيقة الشخصية",
        "kind": "report"
      },
      {
        "slug": "report-privacy-student",
        "file": "report_privacy_student",
        "title": "خيارات الخصوصية حسب الطالب",
        "kind": "report"
      },
      {
        "slug": "report-students-idcards",
        "file": "report_students_IDCards",
        "title": "بطاقات هوية الطالب",
        "kind": "report"
      },
      {
        "slug": "report-transport-student",
        "file": "report_transport_student",
        "title": "نقل الطالب",
        "kind": "report"
      },
      {
        "slug": "report-students-byformgroup",
        "file": "report_students_byFormGroup",
        "title": "الطلبة حسب الصف الدراسي",
        "kind": "report"
      },
      {
        "slug": "report-students-byhouse",
        "file": "report_students_byHouse",
        "title": "الطلاب حسب المنزل",
        "kind": "report"
      },
      {
        "slug": "report-mystudenthistory",
        "file": "report_myStudentHistory",
        "title": "تاريخ طلابي",
        "kind": "report"
      }
    ]
  },
  {
    "slug": "system-admin",
    "title": "إدارة النظام",
    "group": "admin",
    "pages": [
      {
        "slug": "alarm",
        "file": "alarm",
        "title": "صوت الجرس",
        "kind": "page"
      },
      {
        "slug": "customfields",
        "file": "customFields",
        "title": "حقول مخصصة",
        "kind": "page"
      },
      {
        "slug": "emailtemplates-manage",
        "file": "emailTemplates_manage",
        "title": "قوالب البريد الإلكتروني",
        "kind": "manage"
      },
      {
        "slug": "formbuilder",
        "file": "formBuilder",
        "title": "منشئ النموذج",
        "kind": "page"
      },
      {
        "slug": "notificationsettings",
        "file": "notificationSettings",
        "title": "إشعارات الأحداث",
        "kind": "settings"
      },
      {
        "slug": "stringreplacement-manage",
        "file": "stringReplacement_manage",
        "title": "استبدال النصوص",
        "kind": "manage"
      },
      {
        "slug": "import-manage",
        "file": "import_manage",
        "title": "استيراد من ملف",
        "kind": "manage"
      },
      {
        "slug": "file-upload",
        "file": "file_upload",
        "title": "تحميل الصور والملفات",
        "kind": "page"
      },
      {
        "slug": "logs-view",
        "file": "logs_view",
        "title": "عرض السجلات",
        "kind": "view"
      },
      {
        "slug": "i18n-manage",
        "file": "i18n_manage",
        "title": "إدارة اللغات",
        "kind": "manage"
      },
      {
        "slug": "module-manage",
        "file": "module_manage",
        "title": "إدارة الموديولز",
        "kind": "manage"
      },
      {
        "slug": "services-manage",
        "file": "services_manage",
        "title": "إدارة الخدمات الإضافية",
        "kind": "manage"
      },
      {
        "slug": "theme-manage",
        "file": "theme_manage",
        "title": "إدارة الثيمات",
        "kind": "manage"
      },
      {
        "slug": "update",
        "file": "update",
        "title": "تحديث",
        "kind": "page"
      },
      {
        "slug": "displaysettings",
        "file": "displaySettings",
        "title": "اعدادات العرض",
        "kind": "settings"
      },
      {
        "slug": "privacysettings",
        "file": "privacySettings",
        "title": "إعدادات الأمان والخصوصية",
        "kind": "settings"
      },
      {
        "slug": "systemsettings",
        "file": "systemSettings",
        "title": "إعدادات النظام",
        "kind": "settings"
      },
      {
        "slug": "thirdpartysettings",
        "file": "thirdPartySettings",
        "title": "إعدادات الطرف الثالث",
        "kind": "settings"
      },
      {
        "slug": "serverinfo",
        "file": "serverInfo",
        "title": "معلومات الخادم",
        "kind": "page"
      },
      {
        "slug": "systemcheck",
        "file": "systemCheck",
        "title": "فحص النظام",
        "kind": "page"
      },
      {
        "slug": "systemoverview",
        "file": "systemOverview",
        "title": "ملخص حالة النظام",
        "kind": "view"
      },
      {
        "slug": "activesessions",
        "file": "activeSessions",
        "title": "جلسات نشطة",
        "kind": "page"
      },
      {
        "slug": "cachemanager",
        "file": "cacheManager",
        "title": "مدير الذاكرة المخبأة",
        "kind": "page"
      },
      {
        "slug": "dataretention",
        "file": "dataRetention",
        "title": "الاحتفاظ بالبيانات",
        "kind": "page"
      },
      {
        "slug": "impersonateuser",
        "file": "impersonateUser",
        "title": "إنتحال مستخدم",
        "kind": "page"
      }
    ]
  },
  {
    "slug": "timetable",
    "title": "الجدول المدرسي",
    "group": "learn",
    "pages": [
      {
        "slug": "spacebooking-manage",
        "file": "spaceBooking_manage",
        "title": "ادارة حجوزات المرافق",
        "kind": "manage"
      },
      {
        "slug": "spacechange-manage",
        "file": "spaceChange_manage",
        "title": "تغيير حجز مرفق",
        "kind": "manage"
      },
      {
        "slug": "report-viewavailablespaces",
        "file": "report_viewAvailableSpaces",
        "title": "عرض المرافق المتاحة",
        "kind": "report"
      },
      {
        "slug": "report-viewavailableteachers",
        "file": "report_viewAvailableTeachers",
        "title": "عرض المعلمين المتاحين",
        "kind": "report"
      },
      {
        "slug": "tt-master",
        "file": "tt_master",
        "title": "عرض الجدول الدراسي الرئيسي",
        "kind": "page"
      },
      {
        "slug": "tt-space",
        "file": "tt_space",
        "title": "عرض الجدول الدراسي حسب المرافق",
        "kind": "page"
      },
      {
        "slug": "tt",
        "file": "tt",
        "title": "عرض الجدول المدرسي حسب الشخص",
        "kind": "page"
      }
    ]
  },
  {
    "slug": "timetable-admin",
    "title": "إدارة جدول المواعيد",
    "group": "admin",
    "pages": [
      {
        "slug": "courseenrolment-manage",
        "file": "courseEnrolment_manage",
        "title": "الالتحاق بالمنهج حسب الحصة",
        "kind": "manage"
      },
      {
        "slug": "courseenrolment-manage-byperson",
        "file": "courseEnrolment_manage_byPerson",
        "title": "الإلتحاق بالمنهج حسب الشخص",
        "kind": "manage"
      },
      {
        "slug": "course-rollover",
        "file": "course_rollover",
        "title": "تدوير تسجيل الدورات",
        "kind": "page"
      },
      {
        "slug": "course-manage",
        "file": "course_manage",
        "title": "إدارة المناهج والحصص",
        "kind": "manage"
      },
      {
        "slug": "courseenrolment-sync",
        "file": "courseEnrolment_sync",
        "title": "مزامنة تسجيل الدورات",
        "kind": "page"
      },
      {
        "slug": "report-classenrolment-byformgroup",
        "file": "report_classEnrolment_byFormGroup",
        "title": "الالتحاق بالحصة حسب الصف الدراسي",
        "kind": "report"
      },
      {
        "slug": "ttsettings",
        "file": "ttSettings",
        "title": "إعدادات الجدول المدرسي",
        "kind": "settings"
      },
      {
        "slug": "ttcolumn",
        "file": "ttColumn",
        "title": "إدارة الأعمدة",
        "kind": "page"
      },
      {
        "slug": "tt",
        "file": "tt",
        "title": "إدارة الجداول المدرسية",
        "kind": "page"
      },
      {
        "slug": "ttdates",
        "file": "ttDates",
        "title": "ربط الأيام بالتوايخ",
        "kind": "page"
      }
    ]
  },
  {
    "slug": "tracking",
    "title": "المتابعة",
    "group": "assess",
    "pages": [
      {
        "slug": "datapoints",
        "file": "dataPoints",
        "title": "نقاط البيانات",
        "kind": "page"
      },
      {
        "slug": "graphing",
        "file": "graphing",
        "title": "رسوم بيانية",
        "kind": "page"
      }
    ]
  },
  {
    "slug": "user-admin",
    "title": "إدارة المستخدم",
    "group": "admin",
    "pages": [
      {
        "slug": "staffapplicationformsettings",
        "file": "staffApplicationFormSettings",
        "title": "إعدادات نموذج تسجيل الموظفين",
        "kind": "settings"
      },
      {
        "slug": "publicregistrationsettings",
        "file": "publicRegistrationSettings",
        "title": "إعدادات التسجيل العام",
        "kind": "settings"
      },
      {
        "slug": "rollover",
        "file": "rollover",
        "title": "التدوير",
        "kind": "page"
      },
      {
        "slug": "district-manage",
        "file": "district_manage",
        "title": "إدارة المناطق",
        "kind": "manage"
      },
      {
        "slug": "family-manage",
        "file": "family_manage",
        "title": "إدارة الأسر",
        "kind": "manage"
      },
      {
        "slug": "permission-manage",
        "file": "permission_manage",
        "title": "إدارة الأذونات",
        "kind": "manage"
      },
      {
        "slug": "role-manage",
        "file": "role_manage",
        "title": "إدارة الأدوار",
        "kind": "manage"
      },
      {
        "slug": "user-manage",
        "file": "user_manage",
        "title": "إدارة المستخدمين",
        "kind": "manage"
      },
      {
        "slug": "dataupdatersettings",
        "file": "dataUpdaterSettings",
        "title": "إعدادات محدث البيانات",
        "kind": "settings"
      },
      {
        "slug": "personaldocumentsettings",
        "file": "personalDocumentSettings",
        "title": "إعدادات المستندات الشخصية",
        "kind": "settings"
      },
      {
        "slug": "staffsettings",
        "file": "staffSettings",
        "title": "إعدادات إدارة الموظفين",
        "kind": "settings"
      },
      {
        "slug": "studentssettings",
        "file": "studentsSettings",
        "title": "إعدادات الطلبة",
        "kind": "settings"
      },
      {
        "slug": "usersettings",
        "file": "userSettings",
        "title": "إعدادات المستخدم",
        "kind": "settings"
      }
    ]
  },
  {
    "slug": "visual-assessment",
    "title": "التقييم البصري",
    "group": "assess",
    "pages": [
      {
        "slug": "guides-manage",
        "file": "guides_manage",
        "title": "إدارة دلائل التقييم",
        "kind": "manage"
      }
    ]
  },
  {
    "slug": "workflow-engine",
    "title": "محرك سير العمل",
    "group": "admin",
    "pages": [
      {
        "slug": "workflows-manage",
        "file": "workflows_manage",
        "title": "إدارة مسارات العمل",
        "kind": "manage"
      },
      {
        "slug": "workflows-view",
        "file": "workflows_view",
        "title": "عمليات سير العمل",
        "kind": "view"
      }
    ]
  }
];

export function findModule(slug: string) {
  return TAWASUL_MODULES.find((m) => m.slug === slug);
}

export function findPage(moduleSlug: string, pageSlug: string) {
  const mod = findModule(moduleSlug);
  return { module: mod, page: mod?.pages.find((p) => p.slug === pageSlug) };
}

export const TAWASUL_PAGE_COUNT = TAWASUL_MODULES.reduce((n, m) => n + m.pages.length, 0);
