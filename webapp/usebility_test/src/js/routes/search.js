
import SearchComponent from '../views/Search'
import ResultComponent from '../views/Result'


export const routes = [
  {
    path: '/',
    name: 'search',
    components: {
      default: SearchComponent
    }
  },
  {
    path: '/result',
    name: 'result',
    components: {
      default: ResultComponent
    }
  },
  {
    path: '/result/:site_id',
    name: 'resultSite',
    components: {
      default: ResultComponent
    }
  },
]