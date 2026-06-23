import type { NextApiRequest, NextApiResponse } from 'next'
import { LDAP } from 'common/ldap'

type Data = {
  name: string
  password: string
  newPassword: string
  rePassword: string
}

type Account = {
  name: string
  email: string
  password: string
}

type Response = {
  code: number
  msg: string
  data?: any[]
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  let ldap = new LDAP({ address: [process.env.LDAP_HOST || ''] })
  try {
    await ldap.connect(
      process.env.LDAP_ACCOUNT || '',
      process.env.LDAP_PASSOWRD || ''
    )
    const accounts = await ldap.getAllAccounts()
    res
      .status(200)
      .json({
        code: 1,
        msg: '获取成功',
        data: accounts.filter(
          (v) =>
            v.email !== undefined &&
            v.email !== '' &&
            v.email.indexOf('bm001.com') !== -1
        ),
      })
  } catch (e) {
    res.status(200).json({ code: 0, msg: '获取失败' })
  } finally {
    ldap.disconnect()
  }
}
