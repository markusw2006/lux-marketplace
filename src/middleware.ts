import createIntlMiddleware from "next-intl/middleware";

const defaultLocaleEnv = (process.env.APP_LOCALE_DEFAULT as "en" | "es") ||
  ("en" as const);

export default createIntlMiddleware({
  locales: ["en", "es"],
  defaultLocale: defaultLocaleEnv,
});

export const config = {
  matcher: ["/((?!api|_next|.*\..*).*)"],
};


