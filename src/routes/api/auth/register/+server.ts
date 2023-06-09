import { OCrypto } from '$lib/OCrypto';
import { AppDataSource, AppUserSession, User } from '$lib/data-sources';
import { error } from '@sveltejs/kit';
import { genSaltSync, hashSync } from "bcrypt";
import { serialize } from 'cookie';
import type { RequestHandler } from './$types';


export const POST: RequestHandler = async ({ request }) => {
    const body: { username: string, password: string } = await request.json()

    //get user by phone number
    const usersRepos = AppDataSource.getRepository(User)
    const existingUser = await usersRepos.findOneBy({ phoneNumber: body.username })

    if (existingUser) {
        throw error(400, new Error('user already exists'))
    }

    //generate salt & compute password hash
    const salt = genSaltSync(10);
    const computedHash = hashSync(body.password, salt);

    //register the user with the given parameters
    let user = new User()
    user.phoneNumber = body.username
    user.extraSecret = salt
    user.passwordHash = computedHash
    user.registrationDate = Date.now()

    user = await usersRepos.save(user)

    //create session
    const sessionsRepos = AppDataSource.getRepository(AppUserSession)
    let session = new AppUserSession()
    session.user = user
    session.hash = OCrypto.convertToBase64String(Buffer.from(user.phoneNumber))

    session = await sessionsRepos.save(session);
    
    //link user & session
    user.session = session;
    await usersRepos.save(user);
    
    //return headers with auth in
    return new Response("successful registration!", {
        status: 201,
        headers: {
            'Set-Cookie': serialize('Pag20_CTKN', OCrypto.tokenizeObject({ sessionId: session.hash }), {
                path: '/',
                httpOnly: true,
                sameSite: 'strict',
                maxAge: 60 * 60 * 24, // one day
            }),
        },
        statusText: "success",
    })
}