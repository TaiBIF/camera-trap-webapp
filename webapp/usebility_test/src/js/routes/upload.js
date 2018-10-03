
import UploadComponent from '../views/Upload'
import ResultComponent from '../views/UploadResult'


export const routes = [
  {
    path: '/',
    name: 'upload',
    components: {
      default: UploadComponent
    }
  },
  {
    path: '/result/:type',
    name: 'uploadResult',
    components: {
      default: ResultComponent
    }
  },
]