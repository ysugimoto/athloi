const subject = require('../../src/filter-packages');

describe('src/filter-packages', () => {
	const manifests = [
		{
			name: 'foo',
			private: true
		},
		{
			name: 'bar',
			author: 'Joe Bloggs'
		},
		{
			name: 'baz',
			private: false
		},
		{
			name: 'qux',
			dependencies: {
				lodash: '^1.0.0'
			},
			keywords: [
				'awesome'
			]
		},
		{
			name: '@ft/quux'
		}
	];

	const fixture = manifests.map((manifest) => ({ manifest }));

	it('matches manifests with a matching field and value', () => {
		const result = subject('private:false', fixture);

		expect(result.length).toEqual(1);
		expect(result[0].manifest.name).toEqual('baz');
	});

	it('coerces different types of value', () => {
		const a = subject('private:true', fixture);

		expect(a.length).toEqual(1);
		expect(a[0].manifest.name).toEqual('foo');

		const b = subject('author:"Joe Bloggs"', fixture);

		expect(b.length).toEqual(1);
		expect(b[0].manifest.name).toEqual('bar');
	});

	it('handles object and array matching', () => {
		const a = subject('keywords:"awesome"', fixture);

		expect(a.length).toEqual(1);
		expect(a[0].manifest.name).toEqual('qux');

		const b = subject('dependencies:"lodash"', fixture);

		expect(b.length).toEqual(1);
		expect(b[0].manifest.name).toEqual('qux');
	});

	it('defaults to matching the package name', () => {
		const result = subject('baz', fixture);

		expect(result.length).toEqual(1);
		expect(result[0].manifest.name).toEqual('baz');
	});

	it('ignores the package organisation', () => {
		const result = subject('quux', fixture);

		expect(result.length).toEqual(1);
		expect(result[0].manifest.name).toEqual('@ft/quux');
	});

	it('allows glob values to enable pattern matching', () => {
		const a = subject('ba*', fixture);
		const b = subject('*ux', fixture);

		expect(a.length).toEqual(2);
		expect(a[0].manifest.name).toEqual('bar');
		expect(a[1].manifest.name).toEqual('baz');

		expect(b.length).toEqual(2);
		expect(b[0].manifest.name).toEqual('qux');
		expect(b[1].manifest.name).toEqual('@ft/quux');
	});
});
