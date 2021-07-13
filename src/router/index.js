import { createRouter, createWebHistory } from 'vue-router';
const routes = [
    {
        path: '',
        redirect: '/login'
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/login.vue')
    },
    {
        path: '/admin',
        name: 'Admin',
        component: () => import('../views/admin/admin.vue'),
        children: [
            {
                path: 'department',
                component: () => import('../views/admin/department.vue')
            },
            {
                path: 'teacher',
                component: () => import('../views/admin/teacher.vue')
            },
            {
                path: 'staff',
                component: () => import('../views/admin/staff.vue')
            },
            {
                path: 'course',
                component: () => import('../views/admin/course.vue')
            },
            {
                path: 'clazz',
                component: () => import('../views/admin/clazz.vue')
            },
            {
                path: 'clazzCourse',
                component: () => import('../views/admin/clazzCourse.vue')
            },
            {
                path: 'evenStudyCheck',
                component: () => import('../views/admin/evenStudyCheck.vue')
            },
            {
                path: 'homeworkCheck',
                component: () => import('../views/admin/homeworkCheck.vue')
            },
            {
                path: 'teachingPlanCheck',
                component: () => import('../views/admin/teachingPlanCheck.vue')
            },
            {
                path: 'teachingPlanEvaluation',
                component: () => import('../views/admin/teachingPlanEvaluation.vue')
            },
            {
                path: 'term',
                component: () => import('../views/admin/term.vue')
            },
            {
                path: 'system',
                component: () => import('../views/admin/system.vue')
            },
        ]
    },
    {
        path: '/teacher',
        name: 'teacher',
        component: () => import('../views/teacher/teacher.vue'),
        children: [
            {
                path: 'evenStudyCheck',
                component: () => import('../views/teacher/evenStudyCheck.vue')
            },
            {
                path: 'teachingPlanCheck',
                component: () => import('../views/teacher/teachingPlanCheck.vue')
            },
            {
                path: 'homeworkCheck',
                component: () => import('../views/teacher/homeworkCheck.vue')
            },
            {
                path: '/staffleader/evenStudyCheck',
                component: () => import('../views/teacher/staffleader/evenStudyCheck.vue')
            },
            {
                path: '/staffleader/teachingPlanCheck',
                component: () => import('../views/teacher/staffleader/teachingPlanCheck.vue')
            },
            {
                path: '/staffleader/teachingPlanEvaluation',
                component: () => import('../views/teacher/staffleader/teachingPlanEvaluation.vue')
            },
            {
                path: '/staffleader/teachingPlanEvaluationTotal',
                component: () => import('../views/teacher/staffleader/teachingPlanEvaluationTotal.vue')
            },
            {
                path: '/staffleader/homeworkCheck',
                component: () => import('../views/teacher/staffleader/homeworkCheck.vue')
            },
        ]
    },
];
const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});
export default router;
//# sourceMappingURL=index.js.map