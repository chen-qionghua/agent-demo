import ldap, { Attribute } from 'ldapjs'

export interface LDAPOpts {
	address: string[]
}
export interface LDAPConnectionOpts {
	dn: string
	password: string
}

export function getAttrVal(attr: Attribute[], type: string) {
	// type is private
	return attr.find((x) => (x as any).type === type)
}

export class LDAP {
	client: ldap.Client
	constructor(opts: LDAPOpts) {
		this.client = ldap.createClient({
			url: opts.address,
		})
		this.client.on('error', (err) => console.log('ldap error', err))
	}

	connect(dn: string, password: string) {
		return new Promise<void>((resolve, reject) => {
			this.client.bind(dn, password, (err, result) => {
				if (err) {
					reject(err)
				}
				resolve(result)
			})
		})
	}
	disconnect() {
		return new Promise<void>((resolve, reject) => {
			this.client.unbind((err) => {
				if (err) {
					reject(err)
				}
				resolve()
			})
		})
	}
	search(base: string, opts: ldap.SearchOptions) {
		return new Promise<ldap.SearchEntry[]>((resolve, reject) => {
			const entries: ldap.SearchEntry[] = []
			this.client.search(base, opts, (err, res) => {
				if (err) {
					reject(err)
					return
				}
				res.on('searchEntry', (entry) => entries.push(entry))
				res.on('error', (err) => reject(err))
				res.on('end', (result) => {
					resolve(entries)
				})
			})
		})
	}
	async getAllAccounts() {
		const entries = await this.search('dc=bm001,dc=com', {
			scope: 'sub',
			attributes: ['dn', 'sn', 'cn', 'mail', 'userPassword'],
		})
		return entries.map((e) => ({
			name: getAttrVal(e.attributes, 'cn')?.vals[0],
			email: getAttrVal(e.attributes, 'mail')?.vals[0],
			password: getAttrVal(e.attributes, 'userPassword')?.vals[0],
		}))
	}
	update(name: string, opts: ldap.Change) {
		return new Promise<void>((resolve, reject) => {
			this.client.modify(name, opts, (err) => {
				if (err) {
					reject(err)
					return
				}
				resolve()
			})
		})
	}
	add(name: string, email: string, paasword: string) {
		return new Promise<void>((resolve, reject) => {
			this.client.add(
				`cn=${name},cn=developer,dc=bm001,dc=com`,
				{
					mail: [email],
					userPassword: paasword,
					objectClass: 'inetOrgPerson',
					givenName: name,
					sn: name,
					cn: name,
					uid: name,
				},
				(err) => {
					if (err) {
						reject(err)
						return
					}
					resolve()
				}
			)
		})
	}
	delete(name: string) {
		return new Promise<void>((resovle, reject) => {
			this.client.del(name, (err) => {
				if (err) {
					reject(err)
					return
				}
				resovle()
			})
		})
	}
}
