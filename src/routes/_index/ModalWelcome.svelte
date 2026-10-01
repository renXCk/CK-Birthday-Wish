<script>
	import { getContext } from 'svelte';
	import { playSfx } from '$lib/helpers/audio/audio';
	import { WELCOME } from '$lib/data/birthday-config';
	import Modal from '$lib/components/ModalTpl.svelte';

	const startApp = getContext('startApp');

	const handleConfirm = () => {
		playSfx();
		startApp();
	};
</script>

<Modal confirmOnly on:confirm={handleConfirm}>
	<section>
		<!-- TODO(birthday): edit the text in src/lib/data/birthday-config.js (WELCOME). To change the layout or style, edit this file. -->
		<h1 class="big">{WELCOME.heading}</h1>
		<p class="message">{WELCOME.message}</p>
	</section>
</Modal>

<style>
	section {
		width: 100%;
		padding: 2rem 1.5rem;
		text-align: center;
	}
	.big {
		font-size: 4.5rem;
		line-height: 110%;
		margin: 0 0 1rem;
		color: #bd6932;
	}
	.message {
		font-size: 1.4rem;
	}
	:global(.mobile) .big {
		font-size: 2.8rem;
	}
</style>
