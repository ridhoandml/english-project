import fs from "fs"
import path from "path"
import process from "process"

export interface TestEnglishGrammarLesson {
  source: string
  id: string
  title: string
  category: string
  level: string
  total: number
  images: string[]
}

const projectRoot = process.cwd()

const imageDirName = "test-english"
const baseDir = path.join(projectRoot, "public", imageDirName, "image")

try {
  if (!fs.existsSync(baseDir)) throw Error(`Directory not found: ${baseDir}`)

  const levelFolders: string[] = fs.readdirSync(baseDir, { withFileTypes: true })
  .filter((dirent: any) => dirent.isDirectory())
  .map((dirent: any) => dirent.name)

  const outputDir = path.join(projectRoot, "public", imageDirName, "json")
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true })

  fs.writeFileSync(path.join(outputDir, `menu.json`), JSON.stringify(levelFolders, null, 2))

  for (const levelFolder of levelFolders) {
    const lessonsData: TestEnglishGrammarLesson[] = []

    const lessonFolders = fs.readdirSync(`${baseDir}/${levelFolder}`, { withFileTypes: true })
    .filter((dirent: any) => dirent.isDirectory())
    .map((dirent: any) => dirent.name)

    for (const lessonFolder of lessonFolders) {
      const lessonImagesPath = path.join(baseDir, levelFolder, lessonFolder)
      const imageFiles: string[] = fs.readdirSync(lessonImagesPath)
        .filter((file: any) => /\.(jpg|jpeg|png|gif)$/i.test(file))
        .map((file: any) => `/${imageDirName}/image/${levelFolder}/${lessonFolder}/${file}`)
  
      if (imageFiles.length > 0) {
        const title = lessonFolder
          .replace(/_/g, " ")
          .replace(/-/g, " ")
          .replace(/\b\w/g, (char: any) => char.toUpperCase())
        const level = levelFolder.replace("grammar-", "")

        lessonsData.push({ 
          title,
          level,
          id: lessonFolder,
          category: "grammar",
          images: imageFiles,
          total: imageFiles.length,
          source: imageDirName
        })
      }
    }

    fs.writeFileSync(path.join(outputDir, `${levelFolder}.json`), JSON.stringify(lessonsData, null, 2))
  }
} catch (error) {
  console.log("Error generate JSON: ", error)
}