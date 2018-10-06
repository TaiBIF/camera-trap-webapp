
import IndexComponent from '../views/Index'
import ProjectComponent from '../views/Project'
import SiteComponent from '../views/Site'
import ErrorComponent from '../views/Error'


export const routes = [
  {
    path: '/',
    name: 'index',
    components: {
      default: IndexComponent
    }
  },
  {
    path: '/project/:project_id',
    name: 'project',
    components: {
      default: ProjectComponent
    }
  },
  {
    path: '/project/:project_id/site/:site_id',
    name: 'site',
    components: {
      default: SiteComponent
    }
  },
  {
    path: '/project/:project_id/error',
    name: 'error',
    components: {
      default: ErrorComponent
    }
  }
]
