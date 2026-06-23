// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import compressing from "compressing"
import fs from 'fs'
import path from 'path'

const pathFile = './modules/build/vue3'


export default function handler(
  req: NextApiRequest,
  res: any
) {
  const {  fileName } = req.query
    const url =pathFile+'/'+fileName
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