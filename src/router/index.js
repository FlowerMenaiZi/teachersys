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
        meta: {
            roles: 3,
            requireLogin: true
        },
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
        name: 'Teacher',
        component: () => import('../views/teacher/teacher.vue'),
        meta: {
            roles: 1,
            roleB: 2,
            requireLogin: true
        },
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
    {
        path: '/clazz',
        name: 'Clazz',
        component: () => import('../views/clazz/clazz.vue'),
        meta: {
            roles: 4,
            requireLogin: true
        },
        children: [
            {
                path: 'evenStudyCheck',
                component: () => import('../views/clazz/evenStudyCheck.vue')
            },
        ]
    },
    {
        path: '/404',
        name: '404',
        component: () => import('../views/404.vue')
    },
];
const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});
import $store from "../store/index";
router.beforeEach(((to, from, next) => {
    if (to.meta.requireLogin) {
        if ($store.state.userInfo.isLogin) {
            // console.log(1);
            if ($store.state.userInfo.role === to.meta.roles) {
                next();
            }
            else if ($store.state.userInfo.role === to.meta.roleB) {
                next();
            }
            else {
                router.back();
            }
        }
        else {
            next({ name: 'Login' });
        }
    }
    else {
        if (to.matched.length === 0) {
            from.name ? next({
                name: from.name
            }) : next('/404');
        }
        else {
            next();
        }
    }
}));
export default router;
//# sourceMappingURL=index.js.map