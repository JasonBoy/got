import {ClientRequest} from 'http';
import {Transform as TransformStream} from 'stream';
import test from 'ava';
import got from '../source';
import {createServer} from './helpers/server';

let s;

test.before('setup', async () => {
	s = await createServer();
	s.on('/', (request, response) => {
		response.statusCode = 200;
		response.end();
	});
	await s.listen(s.port);
});

test.after('cleanup', async () => {
	await s.close();
});

test('should emit request event as promise', async t => {
	await got(s.url).json().on('request', request => {
		t.true(request instanceof ClientRequest);
	});
});

test('should emit response event as promise', async t => {
	await got(s.url).json().on('response', response => {
		t.true(response instanceof TransformStream);
		t.true(response.readable);
		t.is(response.statusCode, 200);
	});
});
