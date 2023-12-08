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
		// best not to ask fella
		const question = await c.env.DB.prepare('SELECT question FROM poll WHERE poll_id = ?').bind(pollId).first();
		const num_votes = await c.env.DB.prepare('SELECT count(vote_id) as num_votes FROM poll_vote WHERE poll_id = ?').bind(pollId).first();

		return c.json({
			question: question?.question,
			num_votes: num_votes?.num_votes,
		});
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
			'SELECT po.option_id, po.option, COUNT(pv.option_id) AS count FROM poll_option po LEFT JOIN poll_vote pv ON po.option_id = pv.option_id WHERE po.poll_id = ? GROUP BY po.option_id, po.poll_id, po.option;'
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
	const ip = c.req.header('X-Forwarded-For') || 'not found';

	const pollId = c.req.param('id');
	const post = await c.req.json();

	if (!isNumeric(pollId)) {
		return c.json({ err: 'Invalid path' }, 404);
	}

	try {
		const info = await c.env.DB.prepare('INSERT INTO poll_vote (poll_id, option_id, date, ip_address) VALUES (?1, ?2, ?3, ?4)')
			.bind(pollId, post.option_id, post.date, ip)
			.run();
		return c.json(info);
	} catch (e) {
		console.log(e);
		return c.json({ err: JSON.stringify(e) }, 500);
	}
});

export default app;
