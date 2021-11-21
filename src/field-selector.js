// global ((\d|[A-Z])+-\d+|1Pondo (\d|_)+|Caribbeancom( |-)(\d|-)+|10Musume (\d|_)+)

// general code : (\d|[A-Z])+-\d+
// pondo : 1Pondo (\d|_)+
// caribean : Caribbeancom( |-)(\d|-)+
// 10Musume : 10Musume (\d|_)+

exports.selector = {
    'ACTRESS': '.row.mb-3:nth-child(4) .info-data a',
    'FAKYUTUB_URL': 'a.dropdown-item[rel="nofollow"][target="_blank"]',
    'TITLE': '.box-video-title h1.vid_hd',
    'CODE_REGEX': /((\d|[A-Z])+-\d+|1Pondo (\d|_)+|Caribbeancom( |-)(\d|-)+|10Musume (\d|_)+|HEYZO-\d+|S-Cute-(\d|-|\w)+)|Heydouga (\d|-|\w)/,
    'DETAIL_KEYS': 'div.box-video-others.mt-3.pr-3.pl-3.shadow-sm .row .mb-3 .info-title',
    'DETAIL_VALUES': 'div.box-video-others.mt-3.pr-3.pl-3.shadow-sm .row .mb-3 .info-data',
}