#!/usr/bin/env node

const inquirer = require('inquirer');
const chalk = require('chalk');
const tasks = require('./tasks');
const getPackages = require('./get-packages');
const minimist = require('minimist');
const PrettyError = require('pretty-error');
const omit = require('lodash.omit');

const pe = new PrettyError();

async function runTask(task, externalOptions) {
	const packages = await getPackages();
	const {choice, run} = tasks[task];

	const options = Object.assign(
		externalOptions || (choice ? await choice() : {}),
		{packages}
	);

	return run(options);
}

async function chooseTask() {
	const {task} = await inquirer.prompt([{
		type: 'list',
		name: 'task',
		message: 'What do you want to do?',
		choices: [
			{value: 'start', short: 'start', name: 'Start the development server'},
			{value: 'build', short: 'build', name: 'Run the production build'},
			{value: 'create', short: 'create', name: 'Create a new package'},
		]
	}]);

	return task;
}

async function main(argv) {
	let task = argv._[0];
	const noTask = argv._.length === 0;
	const nonexistentTask = !(task in tasks);

	if(!noTask && nonexistentTask) {
		console.log(`
There's no ${chalk.cyan(task)} task. Available tasks are:
${Object.keys(tasks).map(t => ` ・ ${chalk.blue(t)}`).join('\n')}

Run this command again with one of the tasks, or without a task to get the interactive prompt.
		`);
	}

	if(noTask || nonexistentTask) {
		task = await chooseTask();
	}

	return runTask(task, omit(argv, '_'));
}

main(
	minimist(process.argv.slice(2))
).catch(
	e => {
		console.error(pe.render(e));
		process.exit(1);
	}
);
