import type { NextApiRequest, NextApiResponse } from 'next'
import crypto from 'crypto'
import { LDAP } from 'common/ldap'

type AccountAddition = {
  email: string
}

type AccountDeletion = {
  name: string
}

type AccountModification = {
  name: string
  password: string
  newPassword: string
  rePassword: string
}

type Response = {
  code: number
  msg: string
  data?: {
    name: string
  }
}

function decodePassword(str: string | undefined) {
  if (str === undefined) return ''
  const b64 = str.substring('{MD5}'.length)
  const buffer = Buffer.from(b64, 'base64')
  return buffer.toString('hex')
}

function encodePassword(str: string) {
  const hash = crypto.createHash('md5').update(str).digest()
  return `{MD5}${hash.toString('base64')}`
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  let ldap = new LDAP({ address: [process.env.LDAP_HOST || ''] })
  if (req.method === 'POST') {
    try {
      await ldap.connect(
        process.env.LDAP_ACCOUNT || '',
        process.env.LDAP_PASSOWRD || ''
      )
      const accounts = await ldap.getAllAccounts()
      // 计算最大员工号
      const largestID = accounts
        .map((e) => e.name)
        .reduce<number>((pre, e) => {
          if (e !== undefined && e !== '' && e.indexOf('of') !== -1) {
            const id = parseInt(e.substring(2))
            if (id > pre) return id
          }
          return pre
        }, 0)
      const newLargestID = largestID > 4999 ? largestID + 1 : 5000
      await ldap.add(
        `of${newLargestID}`,
        (JSON.parse(req.body) as AccountAddition).email,
        encodePassword('123456')
      )
      res
        .status(200)
        .json({ code: 1, msg: '添加成功', data: { name: `of${newLargestID}` } })
    } catch (e) {
      res.status(200).json({ code: 0, msg: `添加失败${e}` })
    } finally {
      ldap.disconnect()
    }
    return
  }
  if (req.method === 'DELETE') {
    try {
      await ldap.connect(
        process.env.LDAP_ACCOUNT || '',
        process.env.LDAP_PASSOWRD || ''
      )
      await ldap.delete((req.body as AccountDeletion).name)
      res.status(200).json({ code: 1, msg: '删除成功' })
    } catch (e) {
      res.status(200).json({ code: 0, msg: `删除失败${e}` })
    } finally {
      ldap.disconnect()
    }
    return
  }
  if (req.method === 'PUT') {
    try {
      await ldap.connect(
        process.env.LDAP_ACCOUNT || '',
        process.env.LDAP_PASSOWRD || ''
      )
      const body: AccountModification = JSON.parse(req.body)
      const accounts = await ldap.getAllAccounts()
      const account = accounts.find((e) => e.name === body.name)
      if (!account) {
        return res.status(200).json({ code: 0, msg: '用户不存在' })
      }
      const pwd = encodePassword(body.password)
      if (pwd !== account.password) {
        return res.status(200).json({ code: 0, msg: '密码不正确' })
      }
      await ldap.update(`cn=${body.name},cn=developer,dc=bm001,dc=com`, {
        operation: 'replace',
        modification: { userPassword: encodePassword(body.newPassword) },
      })
      res.status(200).json({ code: 1, msg: '修改成功' })
    } catch (e) {
      res.status(200).json({ code: 0, msg: `修改失败${e}` })
    } finally {
      ldap.disconnect()
    }
    return
  }
}
