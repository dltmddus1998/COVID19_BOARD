const SheetApiClientFactory = require('./sheet_api_client_factory.js');
const SheetDownloader = require('./sheet_downloader.js');

async function main() {
    try {
        const sheetApiClient = await SheetApiClientFactory.create();
        const downloader = new SheetDownloader(sheetApiClient);

        // '코로나보드 데이터 예제' 스프레드시트의 실제 ID 값
        const spreadsheetId = '1z2d4gBO8JSI8SEotnHDKdcq8EQ9X4O5fWPxeUCAqW1c';

        // 공지 내려받기
        const notice = await downloader.downloadToJson(
            spreadsheetId,
            'notice',
            'downloaded/notice.json',
        );

        console.log(notice);

        // 국가 정보 내려받기
        const countryInfo = await downloader.downloadToJson(
            spreadsheetId,
            'countryInfo',
            'downloaded/countryInfo.json',
        );

        console.log(countryInfo);
    } catch (e) {
        console.error(e);
    }
}

main();