var config = {
  '.jqcombo-select'           : {},
  '.jqcombo-select-deselect'  : { allow_single_deselect: true },
  '.jqcombo-select-no-single' : { disable_search_threshold: 10 },
  '.jqcombo-select-no-results': { no_results_text: 'Oops, nothing found!' },
  '.jqcombo-select-rtl'       : { rtl: true },
  '.jqcombo-select-width'     : { width: '95%' }
}
for (var selector in config) {
  $(selector).jqCombo(config[selector]);
}
