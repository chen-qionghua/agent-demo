import { NextRequest, NextResponse } from 'next/server';

// http://localhost:3000/api/user - GET
export async function GET(_request: NextRequest) {

    const authorization = _request.headers.get('authorization');
    console.log('authorization', authorization);

    // TODO: 获取用户信息
    const user = {
        name: 'John Doe',
        email: 'john.doe@example.com'
    };
    
    return NextResponse.json(user);
}

// http://localhost:3000/api/user - POST
export async function POST(_request: NextRequest) {

    const body = await _request.json();
    console.log(body);

    return NextResponse.json({ message: 'Hello World' });
}