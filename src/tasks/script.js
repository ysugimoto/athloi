const path = require('path');
const logger = require('../logger');
const runSeries = require('../run-series');
const runPackage = require('../run-package');
const loadPackages = require('../load-packages');
const sortDependencies = require('../sort-dependencies');

async function script (scriptPath) {
	// 1. load all of the manifests for packages in the repo
	const manifests = await loadPackages();

	logger.info(`Loaded ${manifests.length} packages`);

	// 2. sort the packages topologically
	const order = sortDependencies(manifests);

	// 3. solve path to script file
	const fullScriptPath = path.resolve(process.cwd(), scriptPath);

	// 4. create a queue of tasks to run
	const queue = order.map((name) => {
		const manifest = manifests.find((manifest) => manifest.name === name);
		return () => runPackage('node', [fullScriptPath], manifest.packagePath);
	});

	// 5. run each task in series
	return runSeries(queue);
};

module.exports.register = (program) => {
	program
		.command('script <path>')
		.description('Run a given Node script in each package.')
		.action(script); // TODO: handle errors
};
