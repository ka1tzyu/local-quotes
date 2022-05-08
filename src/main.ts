import {Notice, Plugin} from 'obsidian';
import {findTaggedFiles} from "./util/scan";
import {Quote, updateQuotesVault} from "./types/quote";
import {processCodeblock} from "./processor/codeblock";
import {DEFAULT_SETTINGS, LocalQuotesSettings, LocalQuotesSettingTab} from "./settings";
import {ErrorModal, QuoteMakerModal} from "./processor/modal";

export default class LocalQuotes extends Plugin {
	settings: LocalQuotesSettings;
	quoteVault: Quote[];

	async onload() {
		console.log('loading Local Quotes...')
		await this.loadSettings();


		this.registerMarkdownCodeBlockProcessor(
			'localquote',
			(src, el, _) => processCodeblock(this, src, el));

		this.addSettingTab(new LocalQuotesSettingTab(this.app, this));

		this.addCommand({
			id: 'rescan-local-quotes',
			name: 'Rescan vault for local quotes',
			callback: async() => {
				await updateQuotesVault(this, findTaggedFiles(this.settings.quoteTag));
				new Notice('Your quote listings successfully updated!');
			}
		});

		this.addCommand({
			id: 'open-local-quote-block-maker',
			name: 'Open Quote Maker',
			callback: async () => {
				await updateQuotesVault(this, findTaggedFiles(this.settings.quoteTag));
				if (this.quoteVault && this.quoteVault.length > 0) {
					new QuoteMakerModal(this).open();
				} else {
					new ErrorModal(
						'Local Quote Error',
						'After scan there is no any quote listings in your vault.'
					).open();
				}
			}
		});
	}

	async onunload() {
		await this.saveSettings();
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
