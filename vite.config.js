import { defineConfig } from 'vite'
import fs from 'fs'
import path from 'path'

function copyStaticFolders(folders) {
  return {
    name: 'copy-static-folders',
    closeBundle() {
      const rootDir = path.resolve(__dirname, 'src')
      const outDir = path.resolve(__dirname, 'dist')

      for (const folder of folders) {
        const source = path.join(rootDir, folder)
        const dest = path.join(outDir, folder)

        if (fs.existsSync(source)) {
          fs.rmSync(dest, { recursive: true, force: true })
          fs.cpSync(source, dest, { recursive: true, force: true })
        }
      }

      const rootCss = path.join(rootDir, 'styles.css')
      const cssDest = path.join(outDir, 'styles.css')
      if (fs.existsSync(rootCss)) {
        fs.copyFileSync(rootCss, cssDest)
      }
    }
  }
}

export default defineConfig({
  root: 'src',
  base: '/proyecto-guia-turistica-vite/',
  build: {
    outDir: '../dist',
    emptyOutDir: true
  },
  plugins: [copyStaticFolders(['assets', 'data', 'css', 'components'])]
})