import type { RequestHandler } from '@sveltejs/kit';
import { json, redirect } from '@sveltejs/kit';
import {supabase} from "$lib/supabase";

export const GET: RequestHandler = async ({ cookies, request }) => {

	const { error } = await supabase.auth.signOut()
	if(!error){
		throw redirect(303, '/auth/login');
	} else {
		throw redirect(303, '/auth/login');

	}

};