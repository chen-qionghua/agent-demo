// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import compressing from "compressing"
import fs from 'fs'
import path from 'path'
import {
  upperFirstChar,
} from '@/common/utilsNode'
const pathFile = './modules/build/ts'


export default function handler(
  req: NextApiRequest,
  res: any
) {

    // const {  fileName } =  JSON.parse(req.body)
  const fileName:any= req.query.fileName
  const _fileName = upperFirstChar(fileName)


    const url =pathFile+'/'+ _fileName
    compressing.zip.compressDir(url, url+ '.zip')
      .then( async(data) => {
        let {fileName, buffer} = await download(url+ '.zip');
        res.setHeader('Content-Type', 'application/octet-stream');
        res.setHeader('Content-Disposition', `attachment;filename=${fileName}`);
        res.status(200).send(buffer);
      })
      .catch(err => {
        console.log(err);
      });
    // res.render('index',{selectData: []})
  
}

const download = (filePath:string) => {
    let buffer = fs.readFileSync(filePath);
    let fileName = path.basename(filePath);
    return {fileName, buffer};
  }