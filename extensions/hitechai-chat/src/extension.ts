/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Pho Tue SoftWare Solutions JSC. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';

const chatParticipantId = 'hitechai.chat';
const outputChannelName = 'HiTechAi Chat';

export function activate(context: vscode.ExtensionContext): void {
	const outputChannel = vscode.window.createOutputChannel(outputChannelName, { log: true });
	context.subscriptions.push(outputChannel);

	const participant = vscode.chat.createChatParticipant(chatParticipantId, (request, _context, response, token) => {
		outputChannel.info(vscode.l10n.t('Received chat request.'));

		if (token.isCancellationRequested) {
			return;
		}

		const prompt = request.prompt.trim();
		if (prompt) {
			response.markdown(vscode.l10n.t('HiTechAi Chat received your request:'));
			response.markdown(`\n\n> ${quoteMarkdown(prompt)}`);
			response.markdown('\n\n');
		}

		response.markdown(vscode.l10n.t('HiTechAi Chat is ready as the default built-in chat participant. Connect this extension to your preferred model provider to enable full AI responses.'));
		return { metadata: { command: request.command ?? '', handledBy: chatParticipantId } };
	});
	participant.iconPath = new vscode.ThemeIcon('sparkle');
	participant.followupProvider = {
		provideFollowups: () => [
			{
				label: vscode.l10n.t('Explain this workspace'),
				prompt: vscode.l10n.t('Explain this workspace')
			},
			{
				label: vscode.l10n.t('Help me implement a feature'),
				prompt: vscode.l10n.t('Help me implement a feature')
			}
		]
	};
	participant.additionalWelcomeMessage = vscode.l10n.t('HiTechAi Chat is available as the default chat participant.');
	context.subscriptions.push(participant);

	context.subscriptions.push(
		vscode.commands.registerCommand('hitechai.chat.showOutputChannel', () => outputChannel.show()),
		vscode.commands.registerCommand('hitechai.chat.openWalkthrough', () => openChatWithPrompt(vscode.l10n.t('HiTechAi Chat walkthrough'))),
		vscode.commands.registerCommand('hitechai.chat.openCompletionsMenu', () => openChatWithPrompt(vscode.l10n.t('Show available HiTechAi Chat completions options'))),
		vscode.commands.registerCommand('hitechai.chat.refreshToken', () => outputChannel.info(vscode.l10n.t('HiTechAi Chat token refresh requested.'))),
		vscode.commands.registerCommand('hitechai.chat.generateCommitMessage', () => openChatWithPrompt(vscode.l10n.t('Generate a concise commit message for the current changes'))),
		vscode.commands.registerCommand('hitechai.chat.resolveMergeConflicts', () => openChatWithPrompt(vscode.l10n.t('Help resolve merge conflicts in this workspace')))
	);
}

export function deactivate(): void { }

function quoteMarkdown(value: string): string {
	return value.replace(/\r?\n/g, '\n> ');
}

function openChatWithPrompt(prompt: string): Thenable<unknown> {
	return vscode.commands.executeCommand('workbench.action.chat.open', { query: `@hitechai ${prompt}` });
}
