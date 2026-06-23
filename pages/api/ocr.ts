import type { NextApiRequest, NextApiResponse } from 'next'
import formidable from 'formidable'
import { execFile } from 'child_process'
import { promisify } from 'util'
import path from 'path'
import fs from 'fs/promises'
import os from 'os'
import sharp from 'sharp'


// 配置项提取
const OCR_CONFIG = {
  resizeWidth:undefined,
  tesseractArgs: ['--oem', '1', '--psm', '6'],
}

export const config = {
  api: { bodyParser: false },
}

const execFileAsync = promisify(execFile)

// 环境变量配置
const TESSERACT_PATH = process.env.TESSERACT_PATH || 'D:\\tesseract\\tesseract.exe'
const LANG = process.env.OCR_LANG || 'chi_sim+eng'
const TMP_DIR = os.tmpdir()

// 支持的 MIME 类型
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/tiff']

// 安全删除文件（忽略“文件不存在”错误）
async function fsUnlinkSafe(filePath: string): Promise<void> {
  try {
    await fs.unlink(filePath)
  } catch (err: any) {
    if (err.code !== 'ENOENT') {
      console.warn(`Failed to delete file: ${filePath}`, err.message)
    }
  }
}

// 图像预处理
async function preprocessImage(inputPath: string, outputPath: string): Promise<void> {
  await sharp(inputPath)
    // .resize({ width: OCR_CONFIG.resizeWidth, kernel: sharp.kernel.lanczos2,  })
    // .grayscale()
    // .normalize()
    // .modulate({ brightness: 1.2, saturation: 1.5 })
    // .threshold(128, { grayscale: true }) // 二值化
    // .sharpen({ sigma: 1.0, gain: 1.5 })
    .toFile(outputPath)
}

// 执行 Tesseract OCR
async function runTesseract(inputPath: string, outputPrefix: string): Promise<string> {
  const { stdout, stderr } = await execFileAsync(TESSERACT_PATH, [
    inputPath,
    outputPrefix,
    '-l',
    LANG,
    ...OCR_CONFIG.tesseractArgs,
  ])

  if (stderr) {
    throw new Error(`Tesseract error: ${stderr}`)
  }

  return `${outputPrefix}.txt`
}

// 读取 OCR 结果
async function readOCRResult(filePath: string): Promise<string> {
  return await fs.readFile(filePath, 'utf-8')
}

// 清理临时文件
async function cleanupFiles(paths: string[]): Promise<void> {
  await Promise.all(paths.map(fsUnlinkSafe))
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST method allowed' })
  }

  // 初始化表单解析器
  const form = new formidable.IncomingForm({
    keepExtensions: true,
    uploadDir: TMP_DIR,
  })

  // 解析表单数据
  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Form parsing failed:', err)
      return res.status(500).json({ error: 'Form parsing failed', details: err.message })
    }

    const uploadedFile = files.file
    const file = Array.isArray(uploadedFile) ? uploadedFile[0] : uploadedFile
    if (!file || !file.filepath) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    // 文件类型验证
    if (!file.mimetype || !ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      return res.status(400).json({ error: 'Unsupported file type' })
    }

    const originalPath = file.filepath
    const ext = path.extname(originalPath)
    const processedPath = path.join(TMP_DIR, `${Date.now()}_processed${ext}`)
    const outputTxtPrefix = path.join(TMP_DIR, `${Date.now()}_output`)

    try {
      console.log(`Preprocessing image: ${originalPath} -> ${processedPath}`)
      await preprocessImage(originalPath, processedPath)

      console.log(`Running Tesseract OCR: ${processedPath} -> ${outputTxtPrefix}.txt`)
      const resultFilePath = await runTesseract(processedPath, outputTxtPrefix)

      console.log(`Reading OCR result from: ${resultFilePath}`)
      const result = await readOCRResult(resultFilePath)

      // 清理临时文件
      await cleanupFiles([originalPath, processedPath, resultFilePath])
      res.status(200).json({ text: result })
    } catch (error: any) {
      console.error('OCR processing error:', error)
      await cleanupFiles([originalPath, processedPath, `${outputTxtPrefix}.txt`])
      res.status(500).json({ error: 'OCR failed', details: error.message })
    }
  })
}


