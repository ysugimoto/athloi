const logger = require('../logger');
const runSeries = require('../run-series');
const runPackage = require('../run-package');
const loadPackages = require('../load-packages');
const sortDependencies = require('../sort-dependencies');

async function run (script) {
	// 1. load all of the manifests for packages in the repo
	const manifests = await loadPackages();

	logger.info(`Loaded ${manifests.length} packages`);

	// 2. filter out packages without the requested command
	const filtered = manifests.filter((manifest) => {
		return manifest.scripts && manifest.scripts[script];
	});

	logger.message(`Found ${filtered.length} packages with a "${script}" script`);

	// 3. sort the packages topologically
	const order = sortDependencies(filtered);

	// 4. create a queue of tasks to run
	const queue = order.map((name) => {
		const manifest = manifests.find((manifest) => manifest.name === name);
		return () => runPackage('npm', ['run', script], manifest.packagePath);
	});

	// 5. run each task in series
	return runSeries(queue);
};

module.exports.register = (program) => {
	program
		.command('run <command>')
		.description('Run an npm script in each package that contains that script.')
		.action(run); // TODO: handle errors
};
