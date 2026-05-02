/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Pho Tue SoftWare Solutions JSC. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { env } from '../../../base/common/process.js';
import { IDefaultChatAgent, IProductConfiguration } from '../../../base/common/product.js';
import { ISandboxConfiguration } from '../../../base/parts/sandbox/common/sandboxTypes.js';

type DefaultChatProvider = IDefaultChatAgent['provider'];
type PartialDefaultChatProvider = {
	readonly [Key in keyof DefaultChatProvider]?: Partial<DefaultChatProvider[Key]>;
};
type PartialDefaultChatAgent = Omit<Partial<IDefaultChatAgent>, 'provider'> & {
	readonly provider?: PartialDefaultChatProvider;
};

const defaultChatAgentFallback: IDefaultChatAgent = {
	extensionId: 'hitechai.hitechai-chat',
	chatExtensionId: 'hitechai.hitechai-chat',
	chatExtensionOutputId: 'HiTechAi Chat',
	chatExtensionOutputExtensionStateCommand: 'hitechai.chat.showOutputChannel',
	documentationUrl: 'https://github.com/HiTechAi-VN/vscode/blob/main/README.md',
	skusDocumentationUrl: 'https://github.com/HiTechAi-VN/vscode/blob/main/README.md',
	publicCodeMatchesUrl: 'https://github.com/HiTechAi-VN/vscode/blob/main/README.md',
	manageSettingsUrl: 'https://github.com/HiTechAi-VN/vscode',
	managePlanUrl: 'https://github.com/HiTechAi-VN/vscode',
	manageOverageUrl: 'https://github.com/HiTechAi-VN/vscode',
	upgradePlanUrl: 'https://github.com/HiTechAi-VN/vscode',
	signUpUrl: 'https://github.com/HiTechAi-VN/vscode',
	termsStatementUrl: 'https://github.com/HiTechAi-VN/vscode/blob/main/LICENSE.txt',
	privacyStatementUrl: 'https://github.com/HiTechAi-VN/vscode',
	provider: {
		default: {
			id: 'hitechai',
			name: 'HiTechAi',
		},
		enterprise: {
			id: 'hitechai-enterprise',
			name: 'HiTechAi Enterprise',
		},
		google: {
			id: 'hitechai-google',
			name: 'HiTechAi',
		},
		apple: {
			id: 'hitechai-apple',
			name: 'HiTechAi',
		},
	},
	providerExtensionId: '',
	providerUriSetting: 'hitechai.chat.provider.uri',
	providerScopes: [
		['hitechai'],
	],
	entitlementUrl: '',
	entitlementSignupLimitedUrl: '',
	tokenEntitlementUrl: '',
	mcpRegistryDataUrl: '',
	chatQuotaExceededContext: 'hitechai.chat.quotaExceeded',
	completionsQuotaExceededContext: 'hitechai.chat.completions.quotaExceeded',
	walkthroughCommand: 'hitechai.chat.openWalkthrough',
	completionsMenuCommand: 'hitechai.chat.openCompletionsMenu',
	chatRefreshTokenCommand: 'hitechai.chat.refreshToken',
	generateCommitMessageCommand: 'hitechai.chat.generateCommitMessage',
	resolveMergeConflictsCommand: 'hitechai.chat.resolveMergeConflicts',
	completionsAdvancedSetting: 'hitechai.chat.advanced',
	completionsEnablementSetting: 'hitechai.chat.enable',
	nextEditSuggestionsSetting: 'hitechai.chat.nextEditSuggestions.enabled',
};

/**
 * Returns a product string when it is present, otherwise the fallback.
 */
function getStringOrDefault(value: string | undefined, fallback: string): string {
	return typeof value === 'string' && value.trim().length > 0 ? value : fallback;
}

/**
 * Detects placeholder values used by development product.json files.
 */
function isDefaultChatProviderPlaceholder(value: string | undefined): boolean {
	return typeof value === 'string' && value.trim().toLowerCase() === 'dummy';
}

/**
 * Merges a partially specified authentication provider with the default values.
 */
function normalizeDefaultChatProvider(provider: PartialDefaultChatProvider | undefined, providerName: keyof DefaultChatProvider): DefaultChatProvider[keyof DefaultChatProvider] {
	const fallback = defaultChatAgentFallback.provider[providerName];
	const provided = provider?.[providerName];
	if (isDefaultChatProviderPlaceholder(provided?.id) || isDefaultChatProviderPlaceholder(provided?.name)) {
		return fallback;
	}

	return {
		id: getStringOrDefault(provided?.id, fallback.id),
		name: getStringOrDefault(provided?.name, fallback.name),
	};
}

/**
 * Returns valid authentication scopes, falling back when product data is missing.
 */
function normalizeProviderScopes(providerScopes: string[][] | undefined): string[][] {
	if (Array.isArray(providerScopes)) {
		const normalizedProviderScopes = providerScopes
			.filter(scopes => Array.isArray(scopes) && scopes.length > 0 && scopes.every(scope => typeof scope === 'string' && scope.length > 0))
			.map(scopes => [...scopes]);

		if (normalizedProviderScopes.length > 0) {
			return normalizedProviderScopes;
		}
	}

	return defaultChatAgentFallback.providerScopes.map(scopes => [...scopes]);
}

/**
 * Normalizes runtime product data so direct product imports and the product service see a complete default chat agent.
 */
function normalizeDefaultChatAgent(defaultChatAgent: PartialDefaultChatAgent | undefined): IDefaultChatAgent {
	return {
		extensionId: getStringOrDefault(defaultChatAgent?.extensionId, defaultChatAgentFallback.extensionId),
		chatExtensionId: getStringOrDefault(defaultChatAgent?.chatExtensionId, defaultChatAgentFallback.chatExtensionId),
		chatExtensionOutputId: getStringOrDefault(defaultChatAgent?.chatExtensionOutputId, defaultChatAgentFallback.chatExtensionOutputId),
		chatExtensionOutputExtensionStateCommand: getStringOrDefault(defaultChatAgent?.chatExtensionOutputExtensionStateCommand, defaultChatAgentFallback.chatExtensionOutputExtensionStateCommand),
		documentationUrl: getStringOrDefault(defaultChatAgent?.documentationUrl, defaultChatAgentFallback.documentationUrl),
		skusDocumentationUrl: getStringOrDefault(defaultChatAgent?.skusDocumentationUrl, defaultChatAgentFallback.skusDocumentationUrl),
		publicCodeMatchesUrl: getStringOrDefault(defaultChatAgent?.publicCodeMatchesUrl, defaultChatAgentFallback.publicCodeMatchesUrl),
		manageSettingsUrl: getStringOrDefault(defaultChatAgent?.manageSettingsUrl, defaultChatAgentFallback.manageSettingsUrl),
		managePlanUrl: getStringOrDefault(defaultChatAgent?.managePlanUrl, defaultChatAgentFallback.managePlanUrl),
		manageOverageUrl: getStringOrDefault(defaultChatAgent?.manageOverageUrl, defaultChatAgentFallback.manageOverageUrl),
		upgradePlanUrl: getStringOrDefault(defaultChatAgent?.upgradePlanUrl, defaultChatAgentFallback.upgradePlanUrl),
		signUpUrl: getStringOrDefault(defaultChatAgent?.signUpUrl, defaultChatAgentFallback.signUpUrl),
		termsStatementUrl: getStringOrDefault(defaultChatAgent?.termsStatementUrl, defaultChatAgentFallback.termsStatementUrl),
		privacyStatementUrl: getStringOrDefault(defaultChatAgent?.privacyStatementUrl, defaultChatAgentFallback.privacyStatementUrl),
		provider: {
			default: normalizeDefaultChatProvider(defaultChatAgent?.provider, 'default'),
			enterprise: normalizeDefaultChatProvider(defaultChatAgent?.provider, 'enterprise'),
			google: normalizeDefaultChatProvider(defaultChatAgent?.provider, 'google'),
			apple: normalizeDefaultChatProvider(defaultChatAgent?.provider, 'apple'),
		},
		providerExtensionId: getStringOrDefault(defaultChatAgent?.providerExtensionId, defaultChatAgentFallback.providerExtensionId),
		providerUriSetting: getStringOrDefault(defaultChatAgent?.providerUriSetting, defaultChatAgentFallback.providerUriSetting),
		providerScopes: normalizeProviderScopes(defaultChatAgent?.providerScopes),
		entitlementUrl: getStringOrDefault(defaultChatAgent?.entitlementUrl, defaultChatAgentFallback.entitlementUrl),
		entitlementSignupLimitedUrl: getStringOrDefault(defaultChatAgent?.entitlementSignupLimitedUrl, defaultChatAgentFallback.entitlementSignupLimitedUrl),
		tokenEntitlementUrl: getStringOrDefault(defaultChatAgent?.tokenEntitlementUrl, defaultChatAgentFallback.tokenEntitlementUrl),
		mcpRegistryDataUrl: getStringOrDefault(defaultChatAgent?.mcpRegistryDataUrl, defaultChatAgentFallback.mcpRegistryDataUrl),
		chatQuotaExceededContext: getStringOrDefault(defaultChatAgent?.chatQuotaExceededContext, defaultChatAgentFallback.chatQuotaExceededContext),
		completionsQuotaExceededContext: getStringOrDefault(defaultChatAgent?.completionsQuotaExceededContext, defaultChatAgentFallback.completionsQuotaExceededContext),
		walkthroughCommand: getStringOrDefault(defaultChatAgent?.walkthroughCommand, defaultChatAgentFallback.walkthroughCommand),
		completionsMenuCommand: getStringOrDefault(defaultChatAgent?.completionsMenuCommand, defaultChatAgentFallback.completionsMenuCommand),
		chatRefreshTokenCommand: getStringOrDefault(defaultChatAgent?.chatRefreshTokenCommand, defaultChatAgentFallback.chatRefreshTokenCommand),
		generateCommitMessageCommand: getStringOrDefault(defaultChatAgent?.generateCommitMessageCommand, defaultChatAgentFallback.generateCommitMessageCommand),
		resolveMergeConflictsCommand: getStringOrDefault(defaultChatAgent?.resolveMergeConflictsCommand, defaultChatAgentFallback.resolveMergeConflictsCommand),
		completionsAdvancedSetting: getStringOrDefault(defaultChatAgent?.completionsAdvancedSetting, defaultChatAgentFallback.completionsAdvancedSetting),
		completionsEnablementSetting: getStringOrDefault(defaultChatAgent?.completionsEnablementSetting, defaultChatAgentFallback.completionsEnablementSetting),
		nextEditSuggestionsSetting: getStringOrDefault(defaultChatAgent?.nextEditSuggestionsSetting, defaultChatAgentFallback.nextEditSuggestionsSetting),
	};
}

/**
 * @deprecated It is preferred that you use `IProductService` if you can. This
 * allows web embedders to override our defaults. But for things like `product.quality`,
 * the use is fine because that property is not overridable.
 */
let product: IProductConfiguration;

// Native sandbox environment
const vscodeGlobal = (globalThis as { vscode?: { context?: { configuration(): ISandboxConfiguration | undefined } } }).vscode;
if (typeof vscodeGlobal !== 'undefined' && typeof vscodeGlobal.context !== 'undefined') {
	const configuration: ISandboxConfiguration | undefined = vscodeGlobal.context.configuration();
	if (configuration) {
		product = configuration.product;
	} else {
		throw new Error('Sandbox: unable to resolve product configuration from preload script.');
	}
}
// _VSCODE environment
else if (globalThis._VSCODE_PRODUCT_JSON && globalThis._VSCODE_PACKAGE_JSON) {
	// Obtain values from product.json and package.json-data
	product = globalThis._VSCODE_PRODUCT_JSON as unknown as IProductConfiguration;

	// Running out of sources
	if (env['VSCODE_DEV']) {
		Object.assign(product, {
			nameShort: `${product.nameShort} Dev`,
			nameLong: `${product.nameLong} Dev`,
			dataFolderName: `${product.dataFolderName}-dev`,
			serverDataFolderName: product.serverDataFolderName ? `${product.serverDataFolderName}-dev` : undefined
		});
	}

	// Version is added during built time, but we still
	// want to have it running out of sources so we
	// read it from package.json only when we need it.
	if (!product.version) {
		const pkg = globalThis._VSCODE_PACKAGE_JSON as { version: string };

		Object.assign(product, {
			version: pkg.version
		});
	}
}

// Web environment or unknown
else {

	// Built time configuration (do NOT modify)
	// eslint-disable-next-line local/code-no-dangerous-type-assertions
	product = { /*BUILD->INSERT_PRODUCT_CONFIGURATION*/ } as unknown as IProductConfiguration;

	// Running out of sources
	if (Object.keys(product).length === 0) {
		Object.assign(product, {
			version: '1.104.0-dev',
			nameShort: 'Code - OSS Dev',
			nameLong: 'Code - OSS Dev',
			applicationName: 'code-oss',
			dataFolderName: '.vscode-oss',
			urlProtocol: 'code-oss',
			reportIssueUrl: 'https://github.com/microsoft/vscode/issues/new',
			licenseName: 'MIT',
			licenseUrl: 'https://github.com/microsoft/vscode/blob/main/LICENSE.txt',
			serverLicenseUrl: 'https://github.com/microsoft/vscode/blob/main/LICENSE.txt',
			defaultChatAgent: defaultChatAgentFallback
		});
	}
}

Object.assign(product, {
	defaultChatAgent: normalizeDefaultChatAgent(product.defaultChatAgent)
});

export default product;
