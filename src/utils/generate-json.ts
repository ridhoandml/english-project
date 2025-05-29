import fs from "fs"
import path from "path"
import process from "process"

interface Lesson {
  source: string
  title: string
  category: string
  level: string
  total: number
  images: string[]
}

const projectRoot = process.cwd()

const imageDirName = "test-english-grammar"
const baseDir = path.join(projectRoot, "public", imageDirName, "image")

try {
  if (!fs.existsSync(baseDir)) throw Error(`Directory not found: ${baseDir}`)

  const levelFolders: string[] = fs.readdirSync(baseDir, { withFileTypes: true })
  .filter((dirent: any) => dirent.isDirectory())
  .map((dirent: any) => dirent.name)

  for (const levelFolder of levelFolders) {
    const lessonsData: Lesson[] = []

    const lessonFolders = fs.readdirSync(`${baseDir}/${levelFolder}`, { withFileTypes: true })
    .filter((dirent: any) => dirent.isDirectory())
    .map((dirent: any) => dirent.name)

    for (const lessonFolder of lessonFolders) {
      const lessonImagesPath = path.join(baseDir, levelFolder, lessonFolder)
      const imageFiles: string[] = fs.readdirSync(lessonImagesPath)
        .filter((file: any) => /\.(jpg|jpeg|png|gif)$/i.test(file))
        .map((file: any) => `/${imageDirName}/${levelFolder}/${lessonFolder}/${file}`)
  
      if (imageFiles.length > 0) {
        const title = lessonFolder
          .replace(/_/g, " ")
          .replace(/-/g, " ")
          .replace(/\b\w/g, (char: any) => char.toUpperCase())
        const level = levelFolder.replace("grammar-", "")

        lessonsData.push({ 
          title,
          level,
          category: "grammar",
          images: imageFiles,
          total: imageFiles.length,
          source: imageDirName
        })
      }
    }
    const outputDir = path.join(projectRoot, "public", imageDirName, "json")
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true })

    const outputFilePath = path.join(outputDir, `${levelFolder}.json`)
    fs.writeFileSync(outputFilePath, JSON.stringify(lessonsData, null, 2))
  }
} catch (error) {
  console.log("Error generate JSON: ", error)
}