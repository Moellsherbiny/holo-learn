import Link from "next/link";
import { auth } from "@/auth";
import { getLocale, getTranslations } from "next-intl/server";
import { Circle, LogOut, LayoutDashboard, UserRound } from "lucide-react";
import { signOutAction } from "@/actions/auth/sign-out";
export async function Navbar() {
  const [locale, t, session] = await Promise.all([
    getLocale(),
    getTranslations("LandingPage"),
    auth(),
  ]);

  const isArabic = locale.startsWith("ar");
  const alternateLocale = isArabic ? "en" : "ar";
  const user = session?.user;

  const role = user?.role;

  const dashboardPath =
    role === "TEACHER" || role === "INSTRUCTOR"
      ? `/${locale}/teacher`
      : `/${locale}/student`;

  const displayName =
    user?.name?.trim() ||
    user?.email?.split("@")[0] ||
    (isArabic ? "حسابي" : "My Account");

  const initials = displayName
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/85">
      <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between gap-3 px-4 sm:gap-4 sm:px-8 lg:px-12">
        {/* Brand */}
        <Link
          href={`/${locale}`}
          className="flex min-w-0 shrink-0 items-center gap-2.5"
          aria-label="Optic Learn"
        >
          <span className="relative flex size-8 items-center justify-center rounded-full border border-foreground/30">
            <Circle
              className="size-5 text-primary"
              strokeWidth={2}
              aria-hidden="true"
            />
            <span className="absolute size-1.5 rounded-full bg-foreground" />
          </span>

          <span className="whitespace-nowrap text-base font-semibold tracking-tight sm:text-lg">
            optic
            <span className="font-normal text-muted-foreground">learn</span>
          </span>
        </Link>

        {/* Main navigation */}
        <nav
          aria-label={isArabic ? "التنقل الرئيسي" : "Main navigation"}
          className="hidden items-center gap-6 md:flex lg:gap-8"
        >
          <Link
            href={`/${locale}#about`}
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {t("nav.about")}
          </Link>

          <Link
            href={`/${locale}#features`}
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {t("nav.features")}
          </Link>

          <Link
            href={`/${locale}#journey`}
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {t("nav.journey")}
          </Link>
        </nav>

        {/* Account actions */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <Link
            href={`/${alternateLocale}`}
            hrefLang={alternateLocale}
            aria-label={isArabic ? "Switch to English" : "التبديل إلى العربية"}
            className="inline-flex min-h-9 items-center justify-center rounded-full border border-border px-3 text-xs font-medium transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {isArabic ? "EN" : "عربي"}
          </Link>

          {user ? (
            <>
              {/* Desktop account info */}
              <div className="hidden min-w-0 items-center gap-2 sm:flex">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-secondary-foreground">
                  {initials || <UserRound className="size-4" />}
                </span>

                <div className="hidden min-w-0 lg:block">
                  <p className="max-w-36 truncate text-sm font-medium">
                    {displayName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {isArabic ? "مرحبًا بعودتك" : "Welcome back"}
                  </p>
                </div>
              </div>

              <Link
                href={dashboardPath}
                className="inline-flex min-h-9 items-center justify-center gap-2 rounded-full bg-primary px-3 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:px-4 sm:text-sm"
              >
                <LayoutDashboard className="size-4 shrink-0" />
                <span className="hidden sm:inline">
                  {isArabic ? "لوحة التحكم" : "Dashboard"}
                </span>
                <span className="sm:hidden">
                  {isArabic ? "لوحتي" : "My account"}
                </span>
              </Link>

              <form action={signOutAction.bind(null, locale)}>
                <button
                  type="submit"
                  aria-label={isArabic ? "تسجيل الخروج" : "Sign out"}
                  title={isArabic ? "تسجيل الخروج" : "Sign out"}
                  className="inline-flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <LogOut className="size-4" aria-hidden="true" />
                </button>
              </form>
            </>
          ) : (
            <Link
              href={`/${locale}/auth/login`}
              className="inline-flex min-h-9 items-center justify-center rounded-full bg-primary px-4 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:px-5 sm:text-sm"
            >
              {t("nav.signIn")}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
