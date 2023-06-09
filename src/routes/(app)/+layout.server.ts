import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load = (async ({ locals }) => {

    if(!locals.user){
        throw redirect(302, "/account/login")
    }

    return {
        user: structuredClone(locals.user)
    };

}) satisfies LayoutServerLoad;