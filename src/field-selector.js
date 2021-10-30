// global ((\d|[A-Z])+-\d+|1Pondo (\d|_)+|Caribbeancom( |-)(\d|-)+|10Musume (\d|_)+)

// general code : (\d|[A-Z])+-\d+
// pondo : 1Pondo (\d|_)+
// caribean : Caribbeancom( |-)(\d|-)+
// 10Musume : 10Musume (\d|_)+

exports.selector = {
    'ACTRESS': '.row.mb-3:nth-child(4) .info-data a',
    'FAKYUTUB_URL': 'a.dropdown-item[rel="nofollow"][target="_blank"]',
    'TITLE': '.box-video-title h1.vid_hd',
}