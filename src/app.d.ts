import { SupabaseClient } from "@supabase/supabase-js"

// TODO: SESSION AS TYPE FROM SUPABASE TYPES
declare global {
	namespace App {
		interface Locals {
			supabase: SupabaseClient
			getSession()
		}
		interface PageData {
			session
		}
	}
}

/**
 * Beitrag der erstellt wird
 */
interface Post {

	/**
	 * Titel für diesen Beitrag
	 */
	title: string

}