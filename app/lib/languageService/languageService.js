function languageService(){
};

languageService.prototype.getLanguageOptionsFourLetterCodeFromJSON = function(){
	var languageOptionsFourLetter = new Array();
	languageOptionsFourLetter = this.cloneLanguageOptions();
	Ti.API.info("Language options: " + languageOptionsFourLetter.toString());
	return languageOptionsFourLetter;
};

languageService.prototype.cloneLanguageOptions = function(){
	clonedLanguageOptions = new Array();
	languageOptions = Alloy.Globals.museumJSON.data.museum.lang_options;
	if (languageOptions instanceof Array){
		for (index in Alloy.Globals.museumJSON.data.museum.lang_options){
			clonedLanguageOptions[index] = Alloy.Globals.museumJSON.data.museum.lang_options[index];
		}
	}
	else{
		Ti.API.info("Not an array- single language");
		clonedLanguageOptions.push(languageOptions);
	}
	
	return clonedLanguageOptions;
};

languageService.prototype.getLanguageOptionsFullWord = function(languageOptionsFourLetter){
	var languageOptionsFullWord = [];
	for (index in languageOptionsFourLetter){
		languageOptionsFullWord[index] = this.switchFormOfLanguageCode(languageOptionsFourLetter[index], 'fullWord');
	}
	return languageOptionsFullWord;
};

languageService.prototype.switchFormOfLanguageCode = function(fourLetter, desiredForm){
	index = desiredForm == 'twoLetter'? 0 : 2;
	var toReturn = "";
	var length = this.languageLibrary.length;
	for (i = 0; i<length; i++){
		if (this.languageLibrary[i][1] == fourLetter){
			return this.languageLibrary[i][index];
		}
	}
	return ""; //TODO: Accommodate language not found
};

languageService.prototype.getLanguageOptionsTwoLetterCode = function(languageOptionsFourLetter){
	var languageOptionsTwoLetter = [];
	for (index in languageOptionsFourLetter){
		languageOptionsTwoLetter[index] = this.switchFormOfLanguageCode(languageOptionsFourLetter[index], 'twoLetter');
	}
	return languageOptionsTwoLetter;
};

languageService.prototype.configureCancel = function(languageOptionsFourLetter, languageOptionsFullWord){
	languageOptionsFourLetter.push('CANCEL');
	if (OS_IOS){
		languageOptionsFullWord.push('Cancel');
	}
	cancelIndex = OS_IOS? (languageOptionsFullWord.length - 1) : languageOptionsFullWord.length;
	return cancelIndex;
};

languageService.prototype.displayDialog = function(){
	languageOptionsFourLetterCode = this.getLanguageOptionsFourLetterCodeFromJSON();
	languageOptionsFullWord = this.getLanguageOptionsFullWord(languageOptionsFourLetterCode);
	languageOptionsTwoLetterCode = this.getLanguageOptionsTwoLetterCode(languageOptionsFourLetterCode);
	
	cancelIndex = this.configureCancel(languageOptionsFourLetterCode, languageOptionsFullWord);
	selectedIndex = languageOptionsFourLetterCode.indexOf(Alloy.Models.app.get('currentLanguage'));
	if (selectedIndex == -1){
		selectedIndex = languageOptionsTwoLetterCode.indexOf(Alloy.Models.app.get('currentLanguage'));
		//If currentLanguage was pulled from device, it will be in two-letter form. Must check for this to set proper default choice
	}
	
	var languageDialog = Titanium.UI.createOptionDialog({
		options : languageOptionsFullWord,	
		cancel : cancelIndex,
		selectedIndex : selectedIndex
	});
	languageDialog.addEventListener("click", function(e){
		languageService.prototype.languageDialogClickListener(e, languageOptionsFourLetterCode);
	});
	
	languageDialog.show();
};

languageService.prototype.languageDialogClickListener = function(e, languageOptionsFourLetterCode){
	var newLanguage = languageOptionsFourLetterCode[e.index];	
	if (newLanguage != 'CANCEL' && newLanguage.substr(0,1) !=  Alloy.Models.app.get('currentLanguage').substr(0,1)){
		Alloy.Models.app.set('currentLanguage', newLanguage);
	}
	else{
		Alloy.Globals.navController.closeMenuWithoutAnimation();
	}
};		

languageService.prototype.languageLibrary = [
	['af', 'af', 'Afrikaans'],
	['ar', 'ar', 'العربية', 'rtl'],
	['be', 'be_BY', 'Беларуская мова'],
	['bg', 'bg_BG', 'български'],
	['bs', 'bs_BA', 'Bosanski'],
	['ca', 'ca', 'Català'],
	['cs', 'cs_CZ', 'Čeština'],
	['cy', 'cy', 'Cymraeg'],
	['da', 'da_DK', 'Dansk'],
	['de', 'de_DE', 'Deutsch'],
	['el', 'el', 'Ελληνικά'],
	['en', 'en_CA', 'English'],
	['en', 'en_US', 'English'],
	['eo', 'eo', 'Esperanto'],
	['es', 'es_CL', 'Español'],
	['es', 'es_ES', 'Español'],
	['es', 'es_PE', 'Español'],
	['es', 'es_VE', 'Español'],
	['et', 'et', 'Eesti'],
	['fa', 'fa_AF', 'فارسی', 'rtl'],
	['fa', 'fa_IR', 'فارسی', 'rtl'],
	['fi', 'fi', 'Suomi'],
	['fo', 'fo', 'Føroyskt'],
	['fr', 'fr_FR', 'Français'],
	['fy', 'fy', 'Frysk'],
	['gd', 'gd', 'Gàidhlig'],
	['gl', 'gl_ES', 'Galego'],
	['he', 'he_IL', 'עברית', 'rtl'],
	['hi', 'hi_IN', 'हिन्दी'],
	['hr', 'hr', 'Hrvatski'],
	['hu', 'hu_HU', 'Magyar'],
	['id', 'id_ID', 'Bahasa Indonesia'],
	['is', 'is_IS', 'Íslenska'],
	['it', 'it_IT', 'Italiano'],
	['ja', 'ja', '日本語'],
	['jv', 'jv_ID', 'Basa Jawa'],
	['ka', 'ka_GE', 'ქართული'],
	['kk', 'kk', 'Қазақ тілі'],
	['ko', 'ko_KR', '한국어'],
	['ku', 'ckb', 'کوردی', 'rtl'],
	['lo', 'lo', 'ພາສາລາວ'],
	['lt', 'lt_LT', 'Lietuviškai'],
	['lv', 'lv', 'Latviešu valoda'],
	['mk', 'mk_MK', 'македонски јазик'],
	['mn', 'mn', 'Монгол хэл'],
	['ms', 'ms_MY', 'Bahasa Melayu'],
	['my', 'my_MM', 'ဗမာစာ'],
	['nb', 'nb_NO', 'Norsk Bokmål'],
	['ne', 'ne_NP', 'नेपाली'],
	['nl', 'nl_NL', 'Nederlands'],
	['nn', 'nn_NO', 'Norsk Nynorsk'],
	['pl', 'pl_PL', 'Polski'],
	['pt', 'pt_BR', 'Português'],
	['pt', 'pt_PT', 'Português'],
	['ro', 'ro_RO', 'Română'],
	['ru', 'ru_RU', 'Русский'],
	['si', 'si_LK', 'සිංහල'],
	['sk', 'sk_SK', 'Slovenčina'],
	['sl', 'sl_SI', 'Slovenščina'],
	['so', 'so_SO', 'Af-Soomaali'],
	['sq', 'sq', 'Shqip'],
	['sr', 'sr_RS', 'Српски језик'],
	['su', 'su_ID', 'Basa Sunda'],
	['sv', 'sv_SE', 'Svenska'],
	['ta', 'ta_LK', 'தமிழ்'],
	['th', 'th', 'ไทย'],
	['tr', 'tr_TR', 'Türkçe'],
	['ug', 'ug_CN', 'Uyƣurqə'],
	['uk', 'uk', 'Українська'],
	['ur', 'ur', 'اردو', 'rtl'],
	['uz', 'uz_UZ', 'Oʻzbek'],
	['vec', 'vec', 'Vèneto'],
	['vi', 'vi', 'Tiếng Việt'],
	['zh', 'zh_CN', '中文 (中国)'],
	['zh', 'zh_HK', '中文 (香港)'],
	['zh', 'zh_TW', '中文 (台灣)'],
];

module.exports = languageService;