import {Notice, PluginSettingTab, Setting} from "obsidian";
import LocalQuotes from "./main";
import {BlockMetadata} from "./types/block-metadata";
import {sec_in_day} from "./consts";
import {OneTimeBlock} from "./types/one-time-block";
import {Quote} from "./types/quote";

export interface LocalQuotesSettings {
	quoteTag: string;
	defaultReloadInterval: number;
	minimalQuoteLength: number;
	autoGeneratedIdLength: number;
	inheritListingStyle: boolean;
	quoteScanOnBlockRender: boolean;
	quoteBlockFormat: string;
	blockMetadata: BlockMetadata[];
	oneTimeBlocks: OneTimeBlock[];
	quoteVault: Quote[];
	templateFolder: string;
}

export const DEFAULT_SETTINGS: LocalQuotesSettings = {
	quoteTag: 'quotes',
	defaultReloadInterval: sec_in_day,
	minimalQuoteLength: 5,
	autoGeneratedIdLength: 5,
	inheritListingStyle: false,
	quoteScanOnBlockRender: false,
	quoteBlockFormat: '{{content}}\n— {{author}}',
	blockMetadata: [],
	oneTimeBlocks: [],
	quoteVault: [],
	templateFolder: '',
}

export class LocalQuotesSettingTab extends PluginSettingTab {
	plugin: LocalQuotes;

	constructor(plugin: LocalQuotes) {
		super(plugin.app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h2', {text: 'General'});

		new Setting(containerEl)
			.setName('Quote tag')
			.setDesc('Tag name that will be used for searching notes with quotes')
			.addText(text => text
				.setPlaceholder(DEFAULT_SETTINGS.quoteTag)
				.setValue(this.plugin.settings.quoteTag)
				.onChange(async (value) => {
					this.plugin.settings.quoteTag = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Refresh interval')
			.setDesc('You can set default refresh interval (in seconds) and miss corresponding field in codeblock')
			.addText(text => text
				.setPlaceholder(DEFAULT_SETTINGS.defaultReloadInterval.toString())
				.setValue(this.plugin.settings.defaultReloadInterval.toString())
				.onChange(async (value) => {
					this.plugin.settings.defaultReloadInterval = parseInt(value);
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Template folder')
			.setDesc('Folder that will be ignored by one-time quotes')
			.addText(text => text
				.setPlaceholder(DEFAULT_SETTINGS.templateFolder)
				.setValue(this.plugin.settings.templateFolder)
				.onChange(async (value) => {
					this.plugin.settings.templateFolder = value;
					await this.plugin.saveSettings();
				}));

		containerEl.createEl('h3', {text: 'Style'});

		new Setting(containerEl)
			.setName('Inherit listing author style')
			.setDesc('You can use style in your listings like `:::**Author**:::`, if this setting turns on, your ' +
				'quote blocks will inherit this styling')
			.addToggle(t => t
				.setValue(this.plugin.settings.inheritListingStyle)
				.onChange(async (value) => {
					this.plugin.settings.inheritListingStyle = value;
					await this.plugin.saveSettings();
				})
			);

		new Setting(containerEl)
			.setName('Quote block format')
			.setDesc('Set your own format for quote blocks. Use {{content}} and {{author}} placeholders to place data')
			.addTextArea(text => text
				.setPlaceholder(DEFAULT_SETTINGS.quoteBlockFormat)
				.setValue(this.plugin.settings.quoteBlockFormat)
				.onChange(async (value) => {
					this.plugin.settings.quoteBlockFormat = value;
					await this.plugin.saveSettings();
				}));


		containerEl.createEl('h2', {text: 'Advanced'});

		new Setting(containerEl)
			.setName('Rescan quote\'s listings on block render')
			.setDesc('If you turn on it plugin will scan your vault for new quote when you open note with quote block' +
				'. If you have more than 100 notes it better to be disabled')
			.addToggle(t => t
				.setValue(this.plugin.settings.quoteScanOnBlockRender)
				.onChange(async (value) => {
					this.plugin.settings.quoteScanOnBlockRender = value;
					await this.plugin.saveSettings();
				})
			);

		new Setting(containerEl)
			.setName('Minimal quote length')
			.setDesc('If quote shorten it\'ll be skipped during scan (in characters)')
			.addText(text => text
				.setPlaceholder(DEFAULT_SETTINGS.minimalQuoteLength.toString())
				.setValue(this.plugin.settings.minimalQuoteLength.toString())
				.onChange(async (value) => {
					this.plugin.settings.minimalQuoteLength = parseInt(value);
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Auto generated id length')
			.setDesc('This setting affects on length of id that automatically generated in \'Quote Maker\'')
			.addText(text => text
				.setPlaceholder(DEFAULT_SETTINGS.autoGeneratedIdLength.toString())
				.setValue(this.plugin.settings.autoGeneratedIdLength.toString())
				.onChange(async (value) => {
					this.plugin.settings.autoGeneratedIdLength = parseInt(value);
					await this.plugin.saveSettings();
				}));

		containerEl.createEl('h2', {text: 'Danger Zone'});

		new Setting(containerEl)
			.setName('Clear block metadata')
			.setDesc('Set blockMetadata property to empty array (use if you have problems with old quote occurrence)')
			.addButton(btn => btn
				.setButtonText('Clear')
				.onClick(async () => {
					this.plugin.settings.blockMetadata = [];
					await this.plugin.saveSettings();
					new Notice('Your block metadata successfully cleared!')
				}));

		new Setting(containerEl)
			.setName('Clear one-time blocks')
			.setDesc('Set oneTimeBlocks property to empty array (use if you have problems with ' +
				'mismatched template folder)')
			.addButton(btn => btn
				.setButtonText('Clear')
				.onClick(async () => {
					this.plugin.settings.oneTimeBlocks = [];
					await this.plugin.saveSettings();
					new Notice('Your one-time blocks successfully cleared!')
				}));
	}
}
