/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

const path = require('path')
const { applyConfigForLinkedDependencies } = require('@carimus/metro-symlinked-deps')
const rush = require('@microsoft/rush-lib')

function getConfig(appDir) {
  const rushConf = rush.RushConfiguration.loadFromDefaultLocation({
    startingFolder: process.cwd(),
  })

  const node_modules = path.resolve(rushConf.commonFolder, './temp/node_modules/.pnpm')
  const workspaceDirs = rushConf.projects
    .map(project => path.resolve(rushConf.rushJsonFolder, project.projectRelativeFolder))
    .filter(dir => dir !== appDir)

  const watchFolders = [
    node_modules,
    ...workspaceDirs
  ]
  console.log('watchFolders:', watchFolders)

  return applyConfigForLinkedDependencies(
    {
      transformer: {
        getTransformOptions: async () => ({
          transform: {
            experimentalImportSupport: false,
            inlineRequires: true,
          },
        }),
      },
    },
    {
      projectRoot: appDir,
      blacklistLinkedModules: ['react-native'],
      additionalWatchFolders: watchFolders,
    }
  )
}

module.exports = getConfig(__dirname)
