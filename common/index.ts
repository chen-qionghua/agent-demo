export function request<T>(input: RequestInfo, init?: RequestInit | undefined) {
    return fetch(input, init).then<T>(res => {
        return res.json()
    })
}

export interface BaseResponse<T> {
    code: number
    msg: string
    data?: T
}