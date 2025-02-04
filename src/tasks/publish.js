const logger = require('../logger');
const taskify = require('../cli-task');
const runPackage = require('../run-package');

function publish (packages = [], args = []) {
	// filter out any private packages
	const filteredPackages = packages.filter((pkg) => !pkg.private);

	logger.debug(`Found ${filteredPackages.length} packages to publish`);

	// create a queue of tasks to run
	return filteredPackages.map((pkg) => {
		const apply = () => runPackage('npm', ['publish', ...args], pkg.location);
		return { pkg, apply };
	});
};

exports.task = publish;

exports.register = (program) => {
	program
		.command('publish [args...]')
		.description('Runs npm publish in the scope of each public package')
		.action(taskify(publish));
};
