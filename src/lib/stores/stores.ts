import {supabase} from "$lib/supabase";
import { browser } from "$app/environment";
import { writable , readable} from "svelte/store";

const defaultTheme = 'light';
const initialValue = browser
	? window?.localStorage?.getItem('theme') ?? defaultTheme
	: defaultTheme;
const theme = writable<string>(initialValue);

theme.subscribe((value) => {
	if (browser) {
		window.localStorage.setItem('theme', value);
		document.documentElement.setAttribute('data-theme', value);
	}
});

const defaultSideBarState = false;
const initialSideBarState = browser
	? window?.localStorage?.getItem('sidebar') ?? defaultSideBarState
	: defaultSideBarState;
const sideBarOpen = writable<boolean>(initialSideBarState === 'true');

sideBarOpen.subscribe((value) => {
	if (browser) {
		window.localStorage.setItem('sidebar', `${value}`);
	}
});

const navigationStore = writable({});

const fileStore = writable();

// @ts-ignore
const posts = writable([]);

export const getPosts = async () => {

	let { data, error } = await supabase.from('posts').select('*');
	if (!error) {
		posts.set(data);
	} else {
		console.log("error")
	}

	supabase.channel('posts')
		.on(
			'postgres_changes',
			{event: 'INSERT', schema: 'public', table: 'posts'},
			(payload) => {
				console.log("pushed insert")
				posts.update(val => [...val, payload.new]);
			}
		)
		.subscribe();

	supabase.channel('posts')
		.on(
			'postgres_changes',
			{event: 'UPDATE', schema: 'public', table: 'posts'},
			(payload) => {
				console.log("pushed update")
				const changedPost = payload.new;
				//posts.update(val => val.map(post => post.id === changedPost.id) = changedPost);
				posts.update(val => val.map((post) => (post.id === changedPost.id ? changedPost : post)));

			}
		)
		.subscribe();


	supabase.channel('custom-delete-channel')
		.on(
		  'postgres_changes',
		  { event: 'DELETE', schema: 'public', table: 'posts' },
		  (payload) => {
			console.log('delete received');
			posts.update(val => val.filter((item) => item.id !== payload.old.id));

		  }
		)
		.subscribe()

};


const useMediaQuery = (mediaQueryString)=>{
	//we inizialize the readable as null and get the callback with the set function
	  const matches = readable(null, (set) => {
			  //we match the media query
		  const m=window.matchMedia(mediaQueryString);
		  //we set the value of the reader to the matches property
		  set(m.matches);
		  //we create the event listener that will set the new value on change
		  const el=e => set(e.matches);
		  //we add the new event listener
		  m.addEventListener("change", el);
			  //we return the stop function that will clean the event listener
		  return () => {m.removeEventListener("change", el)};
	  });
	  //then we return the readable
	  return matches;
  }

export { sideBarOpen };
export { navigationStore };
export { theme };
export { fileStore };
export { useMediaQuery };

export { posts }

