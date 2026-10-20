import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'i1a7e64v',
    dataset: 'production'
  },
  deployment: {
    appId: 'renlm914v7qn6e386cexhj8l',
    autoUpdates: true,
  },
})
