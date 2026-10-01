<script>
	import { ITEMS } from '$lib/data/birthday-config';

	// Banner info is edited in src/lib/data/birthday-config.js (BANNERS)
	export let data = {};

	$: featured = (data.featuredIds || [])
		.map((id) => ITEMS.find(({ name }) => name === id))
		.filter(Boolean);
</script>

<div class="bday" style={data.image ? `background-image: url(${data.image})` : ''}>
	<div class="shade">
		<div class="tag">{data.tag}</div>
		<h1>{data.title}</h1>
		{#if data.subtitle}<h2>{data.subtitle}</h2>{/if}
		<div class="desc">
			{#each data.description || [] as line}<p>{line}</p>{/each}
		</div>
		<ul class="featured">
			{#each featured as item (item.name)}
				<li><span class="stars">{'★'.repeat(item.rarity)}</span> {item.label}</li>
			{/each}
		</ul>
	</div>
</div>

<style>
	.bday {
		position: relative;
		width: 100%;
		aspect-ratio: 1080 / 533;
		background: radial-gradient(circle at 70% 30%, #4a4f8f, #1a1f3d 70%);
		background-size: cover;
		background-position: center;
		color: #fff;
		overflow: hidden;
	}
	.shade {
		position: absolute;
		inset: 0;
		padding: 4% 5%;
		background: linear-gradient(90deg, rgba(13, 17, 36, 0.75), rgba(13, 17, 36, 0.05) 75%);
		font-size: calc(1.8 / 100 * var(--content-width, 1000px));
		line-height: 130%;
	}
	.tag {
		display: inline-block;
		padding: 0.1em 0.8em;
		background: #f3d082;
		color: #3b2a0c;
		border-radius: 1em;
		font-size: 90%;
	}
	h1 {
		font-size: 300%;
		line-height: 110%;
		margin: 0.2em 0;
		color: #f3d082;
		text-shadow: 0 0 12px rgba(243, 208, 130, 0.7);
	}
	h2 {
		font-size: 130%;
		margin: 0;
	}
	.desc {
		max-width: 55%;
		margin-top: 0.6em;
	}
	.featured {
		margin-top: 0.8em;
		list-style: none;
		padding: 0;
	}
	.stars {
		color: #f3d082;
	}
</style>
