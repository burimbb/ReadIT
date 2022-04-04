import Home from './pages/Home.vue'
import Main from './pages/Main.vue'
import NotFound from './pages/NotFound.vue'
import Documents from "./pages/Documents"
import ShowDocument from "./pages/ShowDocument"
import Train from "./pages/Train"
import Companies from "./pages/Companies"
import ShowCompany from "./pages/ShowCompany"

export default [{
        path: '/',
        component: Home
    },
    {
        path: '/scan',
        component: Main
    },
    {
        path: '/train',
        component: Train
    },
    {
        path: '/companies',
        component: Companies
    },
    {
        path: '/companies/:id',
        component: ShowCompany
    },
    {
        path: '/documents',
        component: Documents
    },
    {
        path: '/documents/:id',
        component: ShowDocument
    },
    {
        path: '*',
        component: NotFound
    },
]