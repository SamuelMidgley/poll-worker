import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { prettyJSON } from 'hono/pretty-json';
import { isNumeric } from './helpers';

type Bindings = {
	DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use('*', prettyJSON());
app.use('/poll/*', cors());

app.get('/poll/:id', async (c) => {
	const pollId = c.req.param('id');

	if (!isNumeric(pollId)) {
		return c.json({ err: 'Invalid path' }, 404);
	}

	try {
		const result = await c.env.DB.prepare(
			'SELECT p.question, count(p.question) as num_votes FROM poll p LEFT JOIN poll_vote pv ON p.poll_id = pv.poll_id WHERE p.poll_id = ?'
		)
			.bind(pollId)
			.first();
		return c.json(result);
	} catch (e) {
		return c.json({ err: e }, 500);
	}
});

app.get('/poll/:id/options', async (c) => {
	const pollId = c.req.param('id');

	if (!isNumeric(pollId)) {
		return c.json({ err: 'Invalid path' }, 404);
	}

	try {
		const { results } = await c.env.DB.prepare('SELECT * FROM poll_option WHERE poll_id = ?').bind(pollId).all();
		return c.json(results);
	} catch (e) {
		return c.json({ err: e }, 500);
	}
});

app.get('/poll/:id/results', async (c) => {
	const pollId = c.req.param('id');

	if (!isNumeric(pollId)) {
		return c.json({ err: 'Invalid path' }, 404);
	}

	try {
		const { results } = await c.env.DB.prepare(
			'SELECT po.option_id, po.option, count(pv.vote_id) as count FROM poll_vote pv LEFT JOIN poll_option po ON po.option_id = pv.option_id WHERE pv.poll_id = ? GROUP BY po.option'
		)
			.bind(pollId)
			.all();
		return c.json(results);
	} catch (e) {
		console.log(e);
		return c.json({ err: e }, 500);
	}
});

app.post('/poll/:id/vote', async (c) => {
	const pollId = c.req.param('id');
	const post = await c.req.json();

	if (!isNumeric(pollId)) {
		return c.json({ err: 'Invalid path' }, 404);
	}

	try {
		const info = await c.env.DB.prepare('INSERT INTO poll_vote (poll_id, option_id, date) VALUES (?1, ?2, ?3)')
			.bind(pollId, post.option_id, post.date)
			.run();
		return c.json(info);
	} catch (e) {
		return c.json({ err: e }, 500);
	}
});

export default app;
