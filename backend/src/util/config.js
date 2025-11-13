
module.exports = {
    config: {
        app_name: "backend",
        app_version: "1.0",
        image_path: "C:/Apache24/htdocs/mycoffee", //local path
        db: {
            HOST: 'localhost',
            USER: 'root',
            PASSWORD: 'root',
            DATABASE: 'saronadb',
            PORT: 5306
        },
        token: {
            access_token_key: "#$*%*(*234898ireiuLJEROI#@)(#)$*@#)*$(@948858839798283838jaflke",
        },
    },
    BAKONG: {
        BASE_URL: process.env.BAKONG_BASE_URL || 'https://api-bakong.nbc.gov.kh/v1',
        ACCESS_TOKEN: process.env.BAKONG_ACCESS_TOKEN || 'eyfgfdgsdfgfd.E3NTczNTYyNzgsImV4cCI6MTc2NTEzMjI3OH0.KqqN9MOdlnkQEcMPOasmvxgMHyNpmVyS3y-u4w9ufr4',
        ACCOUNT_ID: "ranh_keal@aclb",
        ACCOUNT_NAME: "Keal Ranh",
        CITY: "PHNOM PENH",
    }
};
