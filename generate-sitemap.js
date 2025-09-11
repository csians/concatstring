import generateSitemap from 'vite-plugin-pages-sitemap';

const routes = [
    { path: "/" },
    { path: "/about-us" },
    { path: "/life" },
    { path: "/team" },
    { path: "/project/marketingops" },
    { path: "/project/fx2funding" },
    { path: "/project/eco7ohm" },
    { path: "/project/qpwb" },
    { path: "/services" },
    { path: "/services/web" },
    { path: "/services/mobile-app" },
    { path: "/services/legacy" },
    { path: "/services/api" },
    { path: "/services/staff" },
    { path: "/services/bigcommerce" },
    { path: "/services/shopify" },
    { path: "/services/squarespace" },
    { path: "/services/webflow" },
    { path: "/services/wordpress" },
    { path: "/blog" },
    { path: "/blog/sales-team-needs-cpq-software-2025" },
    { path: "/blog/top-mobile-app-development-trends-2025" },
    { path: "/blog/ecommerce-business-needs-an-ai-powered-website-2025" },
    { path: "/blog/how-an-ai-chatbot-for-a-website-can-boost-engagement-and-conversions" },
    { path: "/author/adarsh-verma" },
    { path: "/author/vishal-sharma" },
    { path: "/author/nirav-mehta" },
    { path: "/author/smit-dudhat" },
    { path: "/contact-us" },
];



// 🔧 Generate sitemap with static + dynamic routes
async function buildSitemap() {
    const allRoutes = routes;

    await generateSitemap({
        routes: allRoutes,
        hostname: 'https://concatstring.com',
        outFile: 'public/sitemap.xml',
    });

    console.log('✅ Sitemap generated with static + dynamic product routes');
}

buildSitemap();