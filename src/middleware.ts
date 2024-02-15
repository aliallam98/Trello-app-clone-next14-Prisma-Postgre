import { authMiddleware, redirectToSignIn } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export default authMiddleware({
  publicRoutes: ["/", "/api/webhook"],
  afterAuth(auth, req) {
    //in case already loged in and current url in public route ex.marketing page
    //in case still not create an organization redirect user to create now one or select existing
    //if already selected redirect to organization page with this id
    if (auth.userId && auth.isPublicRoute) {
      let path = "/select-org";

      if (auth.userId && auth.orgId) {
        path = `/organization/${auth.orgId}`;
      }
      const orgSelection = new URL(path, req.url);
      return NextResponse.redirect(orgSelection);
    }

    // in case user not loged in and trying access private route
    // redirect him to signin page and redirect him again to the same url that he was trying to access it
    if (!auth.userId && !auth.isPublicRoute) {
      return redirectToSignIn({ returnBackUrl: req.url });
    }

    if (auth.userId && !auth.orgId && req.nextUrl.pathname !== "/select-org") {
      const orgSelection = new URL("/select-org", req.url);
      return NextResponse.redirect(orgSelection);
    }
  },
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
